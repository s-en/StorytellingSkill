#!/bin/bash

block = ""

while read line
do
   if [ $line = "-cut-" ]; then
   else

   fi
done < momotaro.txt

#aws polly synthesize-speech \
#    --output-format mp3 \
#    --sample-rate 16000 \
#    --voice-id $1 \
#    --text $3 \
#    $2
