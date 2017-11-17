#!/usr/bin/env sh


virtualenv env
env/bin/pip install -r https://raw.githubusercontent.com/waxe/waxe-image/develop/requirements.txt
env/bin/pip install git+https://github.com/waxe/waxe-image.git@0.0.1-alpha-1
env/bin/waxe-image_get_ng_build
