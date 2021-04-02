#!/bin/sh
node src/main.js -e
node src/main.js -d
diff data/input.txt data/output.txt > data/diff.txt
