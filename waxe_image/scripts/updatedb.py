from datetime import datetime
import hashlib
import json
import os
import pwd
import re
import sys
import transaction

from pyramid.paster import (
    get_appsettings,
    setup_logging,
    )

from pyramid.scripts.common import parse_vars

from ..models import (
    get_engine,
    get_session_factory,
    get_tm_session,
    )
from ..models import File, Group


def md5sum(filename):
    return hashlib.md5(open(filename, 'r').read()).hexdigest()


def usage(argv):
    cmd = os.path.basename(argv[0])
    print('usage: %s <config_uri> [var=value]\n'
          '(example: "%s development.ini")' % (cmd, cmd))
    sys.exit(1)


def get_files(path):
    fs = []
    for (dirpath, dirnames, filenames) in os.walk(path):
        if dirpath.startswith('.'):
            # Never get svn folder nor git but in general no hidden folders
            continue
        fs.extend([os.path.join(dirpath, f.decode('utf-8'))
                   for f in filenames])
    return fs


def get_creation_data(filename):
    return {
        'author': pwd.getpwuid(os.stat(filename).st_uid).pw_name,
        'date': datetime.fromtimestamp(os.path.getctime(filename)),
    }


def get_modification_data(filename):
    return {
        'author': pwd.getpwuid(os.stat(filename).st_uid).pw_name,
        'date': datetime.fromtimestamp(os.path.getmtime(filename)),
    }


def doit(dbsession, group, path, web_path, thumbnail_path):

    db_files = group.files
    fs_files = get_files(path)

    done = []

    for f in db_files:
        done.append(f.abs_path)
        if f.abs_path not in fs_files:
            dbsession.delete(f)
            continue

        md5s = md5sum(f.abs_path)
        if md5s != f.md5sum:
            mdata = get_modification_data(f.abs_path)
            f.modification_date = mdata['date']
            f.modification_author = mdata['author']
            f.md5sum = md5s
            dbsession.add(f)

    for filename in fs_files:
        if filename in done:
            continue

        cdata = get_creation_data(filename)
        mdata = get_modification_data(filename)
        rel_path = re.sub('^%s' % re.escape(path), '', filename)
        wp = web_path + rel_path
        tp = thumbnail_path + rel_path
        f = File(
            abs_path=filename,
            rel_path=rel_path,
            web_path=wp,
            thumbnail_path=tp,
            creation_date=cdata['date'],
            creation_author=cdata['author'],
            modification_date=mdata['date'],
            modification_author=mdata['author'],
            md5sum=hashlib.md5(filename).hexdigest()
        )
        f.group = group
        dbsession.add(f)


def main(argv=sys.argv):
    if len(argv) < 2:
        usage(argv)
    config_uri = argv[1]
    options = parse_vars(argv[2:])
    setup_logging(config_uri)
    settings = get_appsettings(config_uri, options=options)

    engine = get_engine(settings)
    session_factory = get_session_factory(engine)

    folders = json.loads(settings['folders'])

    with transaction.manager:
        dbsession = get_tm_session(session_factory, transaction.manager)

        for folder in folders:
            group_name = folder['name']
            group = dbsession.query(Group).filter_by(
                name=group_name).one_or_none()
            if not group:
                group = Group(name=folder['name'])

            path = folder['path']
            web_path = folder['web_path']
            thumbnail_path = folder['thumbnail_path']
            doit(dbsession, group, path, web_path, thumbnail_path)
