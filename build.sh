#!/usr/bin/env bash


cd angular
ng build -prod --aot
cd dist
zip -r waxe-image-ng.zip *
cd ../..
python -m waxe_image.scripts.release
