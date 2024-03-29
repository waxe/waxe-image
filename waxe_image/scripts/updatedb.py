from datetime import datetime
import hashlib
import os
import pwd
import re
import sys
import transaction

from functools import reduce
from paste.util.import_string import eval_import


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
    return hashlib.md5(open(filename, 'rb').read()).hexdigest()


def usage(argv):
    cmd = os.path.basename(argv[0])
    print('usage: %s <config_uri> [var=value]\n'
          '(example: "%s development.ini")' % (cmd, cmd))
    sys.exit(1)


def _noop_filter(path):
    return True


def get_files(path, settings):
    file_filter_function = settings.get('file_filter_function')
    folder_filter_function = settings.get('folder_filter_function')
    file_filter = (eval_import(file_filter_function)
                   if file_filter_function else _noop_filter)
    folder_filter = (eval_import(folder_filter_function)
                     if folder_filter_function else _noop_filter)
    fs = set()
    for (dirpath, dirnames, filenames) in os.walk(path):
        basename = os.path.basename(dirpath)
        if basename.startswith('.') or not folder_filter(dirpath):
            del dirnames[:]
            continue
        fs |= set(os.path.join(dirpath, f)
                  for f in filenames
                  if file_filter(os.path.join(dirpath, f)))
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


def doit(dbsession, group, fs_files, all_db_files, all_fs_files, settings):

    # Need to create a copy. Since we can remove file from group we don't want
    # to change the iteration.
    db_files = group.files

    done = []
    for f in db_files:
        done.append(f.abs_path)
        if f.abs_path not in all_fs_files:
            dbsession.delete(f)
            continue

        if f.abs_path not in fs_files:
            f.groups.remove(group)
            dbsession.add(f)
            continue

        md5s = md5sum(f.abs_path)
        if md5s != f.md5sum:
            mdata = get_modification_data(f.abs_path)
            f.modification_date = mdata['date']
            f.modification_author = mdata['author']
            f.md5sum = md5s
            dbsession.add(f)

    file_creation_data_function = settings.get('file_creation_data_function')
    file_modification_data_function = settings.get(
        'file_modification_data_function')

    get_creation_data_func = (
        eval_import(file_creation_data_function)
        if file_creation_data_function else get_creation_data)
    get_modification_data_func = (
        eval_import(file_modification_data_function)
        if file_modification_data_function else get_modification_data)

    for filename in fs_files:
        if filename in done:
            continue

        if filename in all_db_files:
            f = all_db_files[filename]
            f.groups.append(group)
        else:
            cdata = get_creation_data_func(filename)
            mdata = get_modification_data_func(filename)
            rel_path = re.sub('^%s/' % re.escape(group.abs_path), '', filename)
            wp = group.web_path + '/' + rel_path
            tp = group.thumbnail_path + '/' + rel_path
            f = File(
                abs_path=filename,
                rel_path=rel_path,
                web_path=wp,
                thumbnail_path=tp,
                creation_date=cdata['date'],
                creation_author=cdata['author'],
                modification_date=mdata['date'],
                modification_author=mdata['author'],
                md5sum=md5sum(filename)
            )
            f.groups = [group]
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

    with transaction.manager:
        dbsession = get_tm_session(session_factory, transaction.manager)
        groups = dbsession.query(Group).all()
        all_db_files = dict([(f.abs_path, f)
                             for f in dbsession.query(File).all()])

        files_by_group = {}
        for group in groups:
            fs_files = get_files(group.abs_path, settings)
            files_by_group[group] = fs_files

        all_fs_files = reduce(lambda a, b: a | b, files_by_group.values())

        for group in groups:
            fs_files = files_by_group[group]
            doit(dbsession, group, fs_files, all_db_files, all_fs_files,
                 settings)
