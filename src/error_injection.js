import fs from 'fs';
import readline from 'readline';
import { start } from 'repl';
import * as data from "../util/data_processing.js";

const projectRoot = process.cwd();
let config = data.config;
const bitsPerBlock = config.symbolSize * config.codeSize;

// read and write streams
const wl = fs.createWriteStream(projectRoot + "/" + config.errorFile, { encoding: "utf8" });
const rl = readline.createInterface({
    input: fs.createReadStream(projectRoot + "/" + config.encodedFile)
});

// Log what we are going to do
console.log(`Injecting errors in lines from: ${config.encodedFile}\nWriting error injected lines to file: ${config.errorFile}`);


/**
 * *possible* to create multible burst errors across @config.burstErrorSymbolSpan symbols === config.symbolSize
 * From random starting point to end of current symbol, or up to and with config.burstErrorSymbolSpan
 */
rl.on('line', line => {
    line = bitErrorInjection(line);
    let buffer = "";
    let indexMax = (config.burstErrorSymbolSpan * config.symbolSize);        // Maximum reach of the burst error
    
    for (let i = 0; i < line.length; i += bitsPerBlock) {
        let block = line.slice(i, i + bitsPerBlock);

        // *possible* to create multible burst errors
        for (let k = 0; k < config.burstErrorAmount;) {
            let index = randomNumber(0, bitsPerBlock - 1);

            let multiSymbol = 0;                                   // Used to count the amount of index'es that have been looked, and are possible to have changed
            const startIndex = (index % config.symbolSize);        // Starting point

            // Roll if the current index-bit shall be fliped
            do {
                if (1 === (randomNumber(1, config.burstErrorFlipChance))) {
                    try {
                        block = block.substr(0, index) +
                            flip(block[index]) +
                            block.substr(index + 1);
                    } catch (err) {
                        console.log("error occured");
                        break;
                    }
                }
                multiSymbol++;
                index++;

                // At the last index of a symbol increment the amount of errors inserted
                if (((multiSymbol + startIndex) % config.symbolSize) === 0) {
                    k++;
                }
            } while (multiSymbol + startIndex !== indexMax && index !== bitsPerBlock - 1 && k < config.burstErrorAmount);
        };

        buffer += block;
    };

    wl.write(buffer + "\n");
});

// on close print summary
rl.on('close', () => {
    console.log("Error injection finished\n");
});

/**
 * Returns string bit flipped
 * @param {string} a bit to be flipped
 * @return {string}
 */
function flip(str) {
    if (str === "1") {
        str = "0";
    } else if (str === "0") {
        str = "1";
    } else {
        throw new Error("Not a bit");
    }

    return str;
}

// Getting a random integer between two values, inclusive
// if max = 2 and min = 0 
// possible numbers: 0,1,2
function randomNumber(min, max) {
    return (Math.floor(Math.random() * (max - min + 1) + min));
}

/**
 * Injects random bit errors into binaryStr based on the set Bit-Error-Rate(BER) in config.json
 * @param {string} binaryStr to inject and simulate random bit errors on
 * @returns {string} binaryStr after simulation and injection of random bit errors
 */
function bitErrorInjection(binaryStr) {
    for (let i = 0; i < binaryStr.length; i++) {
        if (Math.random() < config.bitErrorRate / 100) {
            binaryStr = binaryStr.slice(0, i) + flip(binaryStr[i]) + binaryStr.slice(i + 1);
        }
    }
    return binaryStr;
}
