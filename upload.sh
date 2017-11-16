#!/bin/bash

zip -r upload.zip index.js node_modules stories

aws lambda \
  update-function-code \
  --function-name FairyTailSkill \
  --zip-file fileb://upload.zip \
  --publish

rm -f upload.zip
