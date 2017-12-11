import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(here, 'README.md')) as f:
    README = f.read()
with open(os.path.join(here, 'CHANGES.txt')) as f:
    CHANGES = f.read()

requires = [
    'pyramid',
    # 'pyramid_debugtoolbar',
    'pyramid_tm',
    'SQLAlchemy',
    'transaction',
    'zope.sqlalchemy',
    'waitress',
    'paste',
    'colander',
    ]

tests_require = [
    'WebTest >= 1.3.1',  # py3 compat
    'pytest',  # includes virtualenv
    'pytest-cov',
    ]

dev_require = [
    'requests',
    'github3.py',
    'pastedeploy',
    'alembic',
]

setup(name='waxe-image',
      version='0.0',
      description='waxe-image',
      long_description=README + '\n\n' + CHANGES,
      classifiers=[
          "Programming Language :: Python",
          "Framework :: Pyramid",
          "Topic :: Internet :: WWW/HTTP",
          "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
      ],
      author='',
      author_email='',
      url='',
      keywords='web wsgi bfg pylons pyramid',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      extras_require={
          'testing': tests_require,
          'dev': dev_require,
      },
      install_requires=requires,
      entry_points="""\
      [paste.app_factory]
      main = waxe_image:main
      [console_scripts]
      initialize_waxe-image_db = waxe_image.scripts.initializedb:main
      update_waxe-image_db = waxe_image.scripts.updatedb:main
      waxe-image_get_ng_build = waxe_image.scripts.get_ng_build:main
      """,
      )
