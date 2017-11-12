import json
import os
import sys
import transaction
from datetime import datetime

from pyramid.paster import (
    get_appsettings,
    setup_logging,
    )

from pyramid.scripts.common import parse_vars

from ..models.meta import Base
from ..models import (
    get_engine,
    get_session_factory,
    get_tm_session,
    )
from ..models import File, Group


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


def main(argv=sys.argv):
    if len(argv) < 2:
        usage(argv)
    config_uri = argv[1]
    options = parse_vars(argv[2:])
    setup_logging(config_uri)
    settings = get_appsettings(config_uri, options=options)

    engine = get_engine(settings)
    Base.metadata.create_all(engine)

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
            filenames = get_files(path)
            for filename in filenames:
                # TODO: use regex to make sure we replace the starts of the
                # filename
                rel_path = filename.replace(path, '')
                wp = web_path + rel_path
                tp = thumbnail_path + rel_path
                f = File(
                    abs_path=filename,
                    rel_path=rel_path,
                    web_path=wp,
                    thumbnail_path=tp,
                    creation_date=datetime.fromtimestamp(
                        os.path.getctime(filename)),
                    modification_date=datetime.fromtimestamp(
                        os.path.getmtime(filename)),
                )
                f.group = group

                dbsession.add(f)
