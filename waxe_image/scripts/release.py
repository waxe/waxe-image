import getpass

from waxe_image import __version__


def main():
    from github3 import login
    pwd = getpass.getpass('Github password for lereskp: ')
    gh = login('lereskp', password=pwd)
    repo = gh.repository('waxe', 'waxe-image')
    release = None
    for rel in repo.iter_releases():
        if rel.tag_name == __version__:
            release = rel
            break

    if not release:
        release = repo.create_release(
            tag_name=__version__,
            target_commitish='develop',
            name=__version__,
            body='Description',
            draft=True,
            prerelease=True
        )

    release.upload_asset(
        content_type='application/zip',
        name='waxe-image-ng.zip',
        asset=open('./angular/dist/waxe-image-ng.zip', 'rb').read()
    )


if __name__ == '__main__':
    main()
