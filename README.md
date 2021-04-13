# p2-project
Collection of code files for 2. semester p2-project, spanding from January to May 2021

# Program
The program is a local simulation of the use of Reed-solomon code, used for error-detection and -correction.
The program is configurable through the config.JSON file:

1. From tekst to binary: 

      @@

2. Input is a .txt file written in UTF-8. (Lige nu er det binært-data og ikke 'karakter-tekst')

3. Encodeing-run:
       
      Creates "encoded.txt" which is the Reed-solomon incoded file, based on the "config.JSON" and the "input.txt"

4. Error-injection:

      Creates "error.txt", this is "encoded.txt" but with random bitflips, to a specified amount of bits pr. RS(x,y)

5. Decodeing-run:

      Creates "decoded.txt" with is "encoded.txt" decodes. 
      This file would be identical to "input.txt", if the limits of the program have been complied with.
      Also creates "diff.txt", that compares the diffrences between "decoded.txt" and "input.txt".

6. To text from binary: @@

# Info
Polynomials are represented with arrays, probably of a fixed length and typed

[13, 4, 5, 2]

Would be 13 + 4x + 5x^2 + 2x^3

Things from the config file are global constants

# File structure
p2-project
- data/
    - input.txt  
    - encoded.txt
    - error.txt
    - decoded.txt
    - diff.txt
    - output.txt
- src/
    - main.js
    - setup/
    - encoding/
    - error_injection.js
    - decoding/
- util/
    - arithmetic.js
    - data_processing.js
- tests/
- config.json

# Naming
- variables in camelCase
- date structures PascalCase

