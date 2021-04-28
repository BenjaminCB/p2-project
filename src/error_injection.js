import fs from 'fs';
import readline from 'readline';
import { start } from 'repl';
import * as data from "../util/data_processing.js";

const projectRoot = process.cwd();
let config = data.config;
let errorStyle = process.argv[2];       //trailing argument when script is called
const bitsPerBlock = config.symbolSize * config.codeSize;
let safeKeep = "";

// read and write streams
const wl = fs.createWriteStream(projectRoot + "/" + config.errorFile, { encoding: "utf8" });
const rl = readline.createInterface({
    input: fs.createReadStream(projectRoot + "/" + config.encodedFile)
});

// Log what we are going to do
console.log(`Reading lines from: ${config.encodedFile}\nWriting error injected lines to file: ${config.errorFile}`);


/**
 * *possible* to create multible burst errors across @maxSymbolSpand symbols === config.symbolSize
 * From random starting point to end of current symbol, or up to and with maxSymbolSpand
 */
if (errorStyle === "multi") {
    console.log("\nInserting multible burst errors");
    rl.on('line', line => {
        let buffer = "";

        /**
         * makes lines of @bitPerBlock size no matter the latout of the file
         * if the string gets a sutable lenth inject error
         *   else go to next line
        *////////////
        line = safeKeep + line.slice(0, line.length);
        safeKeep = line.slice(Math.floor(line.length / bitsPerBlock) * bitsPerBlock, line.length);
        line = line.slice(0, Math.floor(line.length / bitsPerBlock) * bitsPerBlock);
        if ( (line.length + safeKeep.length) < bitsPerBlock ) {
            return;
        }

        console.log("Error for current line starts here");

        debugger;
        // splits the read line into strings of symbolsize length
        for (let i = 0; i < line.length; i += bitsPerBlock) {
            let block = line.slice(i, i + bitsPerBlock);


            const maxSymbolSpand = 1;                                   // Maximum amount of symbols allowed to traverse 
            const chance = 3;                                           // Used to gereate number from 0 to and with <---
            let indexMax = (maxSymbolSpand * config.symbolSize);        // Maximum reach of the burst error
            
            // if the errorChance is an un-even number:
            // Insure that we don't create more errors, than can be handled, by makeing 1 burst that is only 1 config.symbolSize size
            if ( (config.errorChance % 2) === 1){
                indexMax = config.symbolSize;
            };

            // *possible* to create multible burst errors
            for (let k = 0; k < config.errorChance;) {
                let index = randomNumber(0, bitsPerBlock-1); 
                console.log(i + " " + index);
                
                let doubleSymbol = 0;                                   // Used to count the amount of index'es that have been looked, and are possible to have changed
                const startIndex = ( index % config.symbolSize );       // Starting point
                
                // Roll if the current index-bit shall be fliped
                do{
                    if (1 === ( randomNumber(0, chance) ))  {
                        try {
                        block = block.substr(0, index) +
                        flip(block[index]) +
                        block.substr(index + 1);
                        } catch (err) {
                            console.log("error occured");
                            break;
                        }
                    }
                    doubleSymbol++;
                    index++;
                    // insure we revert back, so the bust error can stretch maxSymbolSpand Symbols
                    
                    // every config.symbolSize will increment k
                    if ( ( (doubleSymbol + startIndex) % config.symbolSize ) === 0) {
                        k++;
                    }
                    // insure 'end of line' increments k
                    else if (index === bitsPerBlock-1) {
                        k++
                    }

                    // Logs the current state of everything
                    console.log(index + "    " + startIndex + "+" + doubleSymbol + "   " + k);
                }while (doubleSymbol + startIndex !== indexMax && index !== bitsPerBlock-1 && k < config.errorChance);
                
                indexMax = (maxSymbolSpand * config.symbolSize);
                
            };

            buffer += block;
        };
        console.log("Error for current line ends here");
        wl.write(buffer + "\n");
    });


    // on close print summary
    rl.on('close', () => {
        // Add the last bit of read line we couldn't process
        wl.write(safeKeep);
        console.log("Error injection finished\n");
    });
}



// 1 continuous, singular burst error, 
if (errorStyle === "single") {
    console.log("\nInserting a singular burst error");
    rl.on('line', line => {
        let buffer = "";
        /**
         * make lines with @bitPerBlock size, no matter the latout of the file
         * if the string gets a sutable lenth, injects errors
         *   else go to next line
        */
        line = safeKeep + line.slice(0, line.length);
        safeKeep = line.slice(Math.floor(line.length / bitsPerBlock) * bitsPerBlock, line.length);
        line = line.slice(0, Math.floor(line.length / bitsPerBlock) * bitsPerBlock);
        // skip a line if it is too short
        if ( (line.length + safeKeep.length) < bitsPerBlock ) {
            return;
        }

        console.log("Error for current line starts here");

        // splits the read line into strings of symbolsize length
        for (let i = 0; i < line.length; i += bitsPerBlock) {
            let block = line.slice(i, i + bitsPerBlock);

            const maxSymbolSpand = config.errorChance;                      // Maximum spand of the burst error
            let k = 0;                                                      // Tracks amount of symbols tampered
            let flips = 0;                                                  // Amount of bits looked at
            
            let indexMax = (maxSymbolSpand * config.symbolSize);            // Maximum reach of the burst error
            let index = randomNumber(0,bitsPerBlock-1);                       // Starting point
            const startIndex = ( index % config.symbolSize );               // Starting point relative to symbols
            
            
            const chance = 3;  // Used to gereate number from 0 to and with <---
            
            // Roll if the current index-bit shall be fliped
            do{
                if (1 === ( randomNumber(0, chance) ) ) {
                    try {
                        block = block.substr(0, index) +
                        flip(block[index]) +
                        block.substr(index + 1);
                    } catch (err) {
                        console.log(`error occured at index ${index}`);
                        break;
                    }
                }
                flips++;
                index++;
                
                // Tracks amount of symbols effected 
                if ( ( (flips + startIndex) % config.symbolSize ) === 0) {
                    k++;
                }

                // Logs the current state of everything
                console.log(index + "    " + startIndex + "+" + flips + "    " + k);
            }while ( (flips + startIndex) !== indexMax && index !== bitsPerBlock && k < maxSymbolSpand);
            
            // Save the affected block
            buffer += block;
        };
        console.log("Error for current line ends here");
        wl.write(buffer + "\n");
    });


    // on close print summary
    rl.on('close', () => {
        // Add the last bit of read line that couldn't be processed
        wl.write(safeKeep);
        console.log("Error injection finished\n");
    });
}
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
