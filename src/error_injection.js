import fs from 'fs';
import readline from 'readline';
import * as data from "../util/data_processing.js";

const projectRoot = process.cwd();
let config = data.config;

// read and write streams
const wl = fs.createWriteStream(projectRoot + "/" + config.errorFile, {encoding: "utf8"});
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
    for (let i = 0; i < line.length; i += config.symbolSize) {
        let partialLine = line.slice(i, i + config.symbolSize);

        // inject errors
        for (let j = 0; j < config.errorChance; j++) {
            let index = Math.trunc( partialLine.length * Math.random() );
            partialLine = flip(partialLine, index);
        };

        buffer += partialLine;
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
