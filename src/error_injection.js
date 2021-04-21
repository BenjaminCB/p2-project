import fs from 'fs';
import readline from 'readline';
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
console.log(`Reading lines from: ${config.errorFile}\nWriting error injected lines to file: ${config.errorFile}`);

// on line inject it with errors
rl.on('line', line => {
    let buffer = "";

    debugger;
    // split the line into strings of length symbolsize whin possible
    for (let i = 0; i < line.length; i += bitsPerBlock) {
        let block = line.slice(i, i + bitsPerBlock);

        // inject errors
        for (let j = 0; j < config.errorChance; j++) {
            let blockNum = Math.trunc(config.codeSize * Math.random()),
                index = config.symbolSize * blockNum;
            block = block.substr(0, index) +
                randomSymbol() +
                block.substr(index + config.symbolSize);
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
 * Returns the string with a bit flipped
 * @param {string, number} a bit string and an index to be flipped
 * @return {string}
 */
function flip(str, bit) {
    let flipped;
    if (str[bit] === "1") {
        flipped = "0";
    } else if (str[bit] === "0") {
        flipped = "1";
    } else {
        throw Error("Not a bit");
    }

    return str.substr(0, bit) + flipped + str.substr(bit + 1);
}

function randomSymbol() {
    let num = Math.trunc((2 ** config.symbolSize - 1) * Math.random()),
        numStr = num.toString(2);

    while (numStr.length < config.symbolSize) numStr = "0" + numStr;

    return numStr;
}

/**
 * Injects random bit errors into binaryStr based on the set Bit-Error-Rate(BER) in config.json
 * @param {string} binaryStr to inject and simulate random bit errors on
 * @returns {string} binaryStr after simulation and injection of random bit errors
 */
function bitErrorInjection(binaryStr) {
    for (let i = 0; i < binaryStr.length; i++) {
        if (Math.random() * 100 < config.bitErrorRate) {
            binaryStr = flip(binaryStr, i);
        }
    }
    return binaryStr;
}
