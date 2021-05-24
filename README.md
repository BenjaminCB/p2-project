# p2-project
Collection of code files for 2. semester p2-project, spanding from January to May 2021.

A documentation of the program can be found on AAU's website for published works.

# Useing the program
To use the implementation; running **'./run.sh'** from the p2-project folder will run Reed-solomon on the current tekst in input.txt. Or (preferably) running **'node website/server.js'** from the p2-project folder, and going to [localhost:8080](https://localhost:8080) on (preferably) chrome to have an easier overview of input, incodeing, decodeing, output and config settings.

# Configurations
The program is a local simulation of the use of Reed-solomon code, used for error-detection and -correction.
The program is configurable through the config.JSON file:

    "codeSize": 15,                             // "messageSize" + "symbolSize"     (n)
    "messageSize": 11,                          // The message to be sendt          (k)
    "symbolSize": 4,                            // Size of each symbol              (m = 2t)
    "mode": "encode",                           // Used in \.run.sh to determin the current mode to execute
    "encoding": 8,                              // UTF-8
    "burstErrorAmount": 2,                      // Total amount of errors to insert
    "burstErrorSymbolSpan": 1,                  // Amount of symbols burst errors may spand over
    "burstErrorFlipChance": 3,                  // 1/3 chance to flip a bit
    "bitErrorRate": 1,                          // Alternative (risky) flip of every bit
    "inputFile": "data/input.txt",              |
    "encodedFile": "data/encoded.txt",          |
    "errorFile": "data/error.txt",              // Files to save to, and their location
    "decodedFile": "data/decoded.txt",          |
    "infomationFile": "data/config.txt"         |

# File structure
p2-project
- data/
    - input.txt  
    - encoded.txt
    - error.txt
    - decoded.txt
    - diff.txt
- src/
    - main.js
    - setup.js
    - encoding.js
    - error_injection.js
    - decoding.js
- util/
    - arithmetic.js
    - data_processing.js
- website/
    - index.html
    - marble.jpg
    - script.js
    - server.js
    - style.js
- tests/
- config.json
- run.sh

# Naming
- variables in camelCase
- date structures PascalCase

