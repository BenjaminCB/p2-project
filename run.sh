#!/bin/sh
node src/main.js -e
node src/error_injection.js
node src/main.js -d
diff data/input.txt data/decoded.txt > data/diff.txt
echo "(\_/)"
echo "(o.o)"
echo "(___)0"
read