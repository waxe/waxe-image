import StringIO
import os
import requests
import shutil
import sys
import zipfile

from waxe_image import __version__


API_RELEASES_URL = 'https://api.github.com/repos/waxe/waxe-image/releases'
NG_BUILD_FOLDER = 'website'


def main(argv=sys.argv):
    if len(argv) > 2:
        print 'Too many arguments'
        sys.exit(1)
    global NG_BUILD_FOLDER
    if len(argv) == 2:
        NG_BUILD_FOLDER = argv[1]
    if os.path.isdir(NG_BUILD_FOLDER):
        shutil.rmtree(NG_BUILD_FOLDER)
    if os.path.exists(NG_BUILD_FOLDER):
        print 'There is an issue with the folder %s' % NG_BUILD_FOLDER
        sys.exit(1)
    r = requests.get(API_RELEASES_URL)
    if r.status_code != 200:
        raise ValueError('Bad status code %s' % r.status_code)

    releases = r.json()

    release = None
    for rel in releases:
        if rel['tag_name'] == __version__:
            release = rel
            break

    if not release:
        raise Exception('No release found for the current version %s' %
                        __version__)

    ng_asset = None
    for asset in release['assets']:
        if 'waxe-image-ng.zip' in asset['browser_download_url']:
            ng_asset = asset
            break

    assert(ng_asset)
    url = ng_asset['browser_download_url']

    r = requests.get(url, stream=True)
    if r.status_code != 200:
        raise ValueError('Bad status code %s' % r.status_code)

    z = zipfile.ZipFile(StringIO.StringIO(r.content))
    z.extractall(NG_BUILD_FOLDER)
