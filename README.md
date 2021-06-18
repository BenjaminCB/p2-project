# p2-project
Collection of source code files for 2. semester p2-project, spanding from January to May 2021.

A documentation of the program can be found on AAU's website for published works.

The repository contains source code for a Reed-Solomon encoder/decoder as written in JavaScript as well as a error injection module written in JavaScript as well. This is mostly set up to use for educational purposes or testing, and is not set up properly to be used as a library.

There are also other files such as python file where we use a similar library for testing purposes and a website with flowcharts.

# Using the program
Every command should be run from the root directory of the repository.

Preferably start your own instance of our website to test the program. You can do this by running the following in the command line.

`node website/server.js`

This will start the server on `localhest:8080`.

To use the program directly from the command line, write your input in the file `data/input.txt` then run the shell script `run.sh` and the different stages should be found in the `data` directory.

Individual modules can also be run.

- **Encoding:** `node src/main.js -e`
- **Decoding:** `node src/main.js -d`
- **Error injection:** `node src/error_injection.js`

# Configurations
The implementation aims to be very flexible, thus a multitude of configurations can be made in the file `config.json`.

```
    "codeSize": 15,
    "messageSize": 11,
    "symbolSize": 4,
    "mode": "encode",
    "encoding": 8,
    "burstErrorAmount": 2,
    "burstErrorSymbolSpan": 1,
    "burstErrorFlipChance": 3,
    "bitErrorRate": 1,
    "inputFile": "data/input.txt",
    "encodedFile": "data/encoded.txt",
    "errorFile": "data/error.txt",
    "decodedFile": "data/decoded.txt",
    "infomationFile": "data/config.txt"
```

- **codeSize:** The code block size, which can be almost any positive integer but a common one is 255.
- **messageSize:** Size of the message in the code block. It has to be less then the `codeSize` and `codeSize - messageSize` has to be a multiple of two.
- **symbolSize:** The size of each symbol (bit string) in the code block. Possible values are 2, 4 and 8.
- **mode:** Program path the `main.js` should take. Possible values are `encode` and `decode`.
- **encoding:** How many bits are in the charcarter encoding that you are using.
- **burstErrorAmount:** Amount of burst errors to be injected. We can correct `(codeSize - messageSize) / 2`, injected errors.
- **burstErrorSymbolSpan:** The amount of symbols a burst error can span when we are injecting errors.
- **burstErrorFlipChance:** Chance that every bit in the burst error has to be flipped. In this case it is 3 which should be interpreted as a 1 in 3 chance to be flipped.
- **bitErrorRate:** Independent error injection where every bit has an equal chance to be flipped. In this case 1 means that every bit has a 1% chance to be flipped.
- **inputFile:** Path to the input file.
- **encodedFile:** Path to the encoded file.
- **errorFile:** Path to the file with injected errors.
- **decodedFile:** Path to the decoded file.
