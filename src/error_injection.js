import fs from 'fs';
import readline from 'readline';
import { start } from 'repl';
import * as data from "../util/data_processing.js";

const projectRoot = process.cwd();
let config = data.config;
const bitsPerBlock = config.symbolSize * config.codeSize;

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
    for (let i = 0; i < line.length; i += bitsPerBlock) {
        let block = line.slice(i, i + bitsPerBlock);
        let min = 0;
        let max = 9999;
        const maxSpand = 2;
        const chance = 100/50;
        
        let indexMax = (maxSpand * config.symbolSize);           // Maximum reach of the burst error
        
        // if the errorChance is an un-even number:
        // Insure that we don't create more errors, than can be handled
        if ( (config.errorChance % maxSpand) === 1){
            indexMax = config.symbolSize;
        };
        
        let k = 0;
        // Finds errorChance amount of index'es (total)
        for (; k < config.errorChance; k++) {
            let index = Math.trunc(Math.random() * (max - min) + min) % bitsPerBlock;     // Tal mellem 0 og bitsPerBlock
            console.log(i + " " + index);
            
            let doubleSyndrome = 0;                             // Used to count the mount of spaces that have been looked at with possible change
            const startIndex = ( index % config.symbolSize );   // Starting point

            // loop from some point in a symbol to the end of the following syndrome
            // TODO: Kunne ændre på hvad chancen for at hver bit flipper, dynamisk/config
            // This vil 'centralize' errors into clumps of up to maxSpand symbols
            do{
                if (1 === ( (Math.trunc(Math.random() * (max - min) + min) % chance) ) ) {
                    if (block[index] === "1") {
                        block = block.substr(0, index) +
                        "0" +
                        block.substr(index + 1);

                        console.log(`chaged ${index} from 0 to 1`);
                        doubleSyndrome++;

                    } else if (block[index] === "0") {
                        block = block.substr(0, index) +
                        "1" +
                        block.substr(index + 1);

                        console.log(`chaged ${index} from 1 to 0`);
                        doubleSyndrome++;
    
                    } else {
                        throw Error("Not a bit");
                    }
                }
                // Insure that the skipped Index is counted
                else {
                    doubleSyndrome++;
                }
                
                // insure we revert back, so the bust error can stretch maxSpand syndromes
                indexMax = (maxSpand * config.symbolSize);
                index++;

                if ( ((doubleSyndrome + startIndex) % config.symbolSize) === 0) {
                    k++;
                }
                console.log(index + "    " + doubleSyndrome + "   " + k);

            }while (doubleSyndrome + startIndex !== indexMax && index !== bitsPerBlock && k < config.errorChance);
        };

        /*
        // inject errors
        for (let j = 0; j < config.errorChance; j++) {
            let blockNum = Math.trunc( config.codeSize * Math.random() ),
                index = config.symbolSize * blockNum;
            block = block.substr(0, index) +
                    randomSymbol() +
                    block.substr(index + config.symbolSize);
        };
        */

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
    let num = Math.trunc( (2 ** config.symbolSize - 1) * Math.random() ),
        numStr = num.toString(2);

    while(numStr.length < config.symbolSize) numStr = "0" + numStr;

    return numStr;
}
