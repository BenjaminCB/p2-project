import fs from 'fs';
import readline from 'readline';
import { start } from 'repl';
import * as data from "../util/data_processing.js";

const projectRoot = process.cwd();
let config = data.config;
const bitsPerBlock = config.symbolSize * config.codeSize;
let safeKeep = "";

// read and write streams
const wl = fs.createWriteStream(projectRoot + "/" + config.errorFile, {encoding: "utf8"});
const rl = readline.createInterface({
    input: fs.createReadStream(projectRoot + "/" + config.encodedFile)
});

// Log what we are going to do
console.log(`Reading lines from: ${config.encodedFile}\nWriting error injected lines to file: ${config.errorFile}`);


/**
 * *possible* to create multible burst errors across @maxSymbolSpand symbols === config.symbolSize
 * From random starting point to end of current symbol, or up to and with maxSymbolSpand
 */
/*
rl.on('line', line => {
    let buffer = "";

    /**
     * makes lines of @bitPerBlock size no matter the latout of the file
     * if the string gets a sutable lenth inject error
     *   else go to next line
    * ////////////
        line = safeKeep + line.slice(0, line.length);
        safeKeep = line.slice(Math.floor(line.length / bitsPerBlock) * bitsPerBlock, line.length);
        line = line.slice(0, Math.floor(line.length / bitsPerBlock) * bitsPerBlock);
        if ( (line.length + safeKeep.length) < bitsPerBlock ) {
            return;
        }

    debugger;
    // split the line into strings of length symbolsize width, if possible
    for (let i = 0; i < line.length; i += bitsPerBlock) {
        let block = line.slice(i, i + bitsPerBlock);


        const maxSymbolSpand = 2;       // Kunne gøres så bruger skal skrive et input
        const chance = 3;               // Used to gereate number from 0 to <---
        let indexMax = (maxSymbolSpand * config.symbolSize);           // Maximum reach of the burst error
        
        // if the errorChance is an un-even number:
        // Insure that we don't create more errors, than can be handled, by makeing 1 burst that is only 1 config.symbolSize
        if ( (config.errorChance % maxSymbolSpand) === 1){
            indexMax = config.symbolSize;
        };

        // Finds errorChance amount of index'es (total)
        for (let k = 0; k < config.errorChance; k++) {
            let index = randomNumber(0, bitsPerBlock); 
            console.log(i + " " + index);
            
            let doubleSymbol = 0;                             // Used to count the mount of spaces that have been looked at with possible change
            const startIndex = ( index % config.symbolSize );   // Starting point
            
            // Flips a bit if allowed to
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
                    doubleSymbol++;
                }
                // Insure that the skipped Index is counted
                else {
                    doubleSymbol++;
                }
                
                // insure we revert back, so the bust error can stretch maxSymbolSpand Symbols
                indexMax = (maxSymbolSpand * config.symbolSize);
                index++;

                console.log(index + "    " + doubleSymbol + "   " + k);
                
            }while (doubleSymbol + startIndex !== indexMax && index !== bitsPerBlock && k < config.errorChance);
            
            if ( (doubleSymbol + startIndex) >= config.symbolSize ) {
                k++;
            }
        };

        buffer += block;
    };

    wl.write(buffer + "\n");
});


// on close print summary
rl.on('close', () => {
    // Add the last bit of read line we couldn't process
    wl.write(safeKeep);
    console.log("Error injection finished\n");
});
*/



// 1 continius, singular burst error, 
rl.on('line', line => {
    let buffer = "";
    /**
     * makes lines of @bitPerBlock size no matter the latout of the file
     * if the string gets a sutable lenth inject error
     *   else go to next line
    */
    line = safeKeep + line.slice(0, line.length);
    safeKeep = line.slice(Math.floor(line.length / bitsPerBlock) * bitsPerBlock, line.length);
    line = line.slice(0, Math.floor(line.length / bitsPerBlock) * bitsPerBlock);
    if ( (line.length + safeKeep.length) < bitsPerBlock ) {
        return;
    }

    console.log("Error are being made on a line:");

    // split the line into strings of length symbolsize whin if possible
    for (let i = 0; i < line.length; i += bitsPerBlock) {
        let block = line.slice(i, i + bitsPerBlock);

        const maxSymbolSpand = config.errorChance;                      // Maximum stand of the burst error
        let k = 0;
        let flips = 0;
        
        let indexMax = (maxSymbolSpand * config.symbolSize);            // Maximum reach of the burst error
        let index = randomNumber(0,bitsPerBlock);                       // Starting point
        const startIndex = ( index % config.symbolSize );               // Starting point relative to symbols
        
        
        const chance = 3;  // Used to gereate number from 0 to <---
        do{
            if (1 === ( randomNumber(0, chance) ) ) {    // !!!!!!!!! Er ikke 100% tilfældigt da det største tal skal gå op i chance !!!!!!!!!!
                try {
                    block = block.substr(0, index) +
                    flip(block[index]) +
                    block.substr(index + 1);
                } catch (err) {
                    console.log("error occured");
                    break;
                }
                flips++;
            }
            else {          // Insure that the skipped Index is counted
                flips++;
            }
            index++;
            
            if ( ( (flips + startIndex) % config.symbolSize ) === 0) {
                k++;
            }
            console.log(startIndex + "  " + i + "+" + index + "    " + flips + "   " + k);
        }while ( (flips + startIndex) !== indexMax && index !== bitsPerBlock && k < maxSymbolSpand);
        
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

/**
 * Returns the string with a bit flipped
 * @param {string, number} a bit string and an index to be flipped
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

function randomNumber(min, max) {
    return (Math.trunc(Math.random() * (max - min) + min));
}


function randomSymbol() {
    let num = Math.trunc( (2 ** config.symbolSize - 1) * Math.random() ),
        numStr = num.toString(2);

    while(numStr.length < config.symbolSize) numStr = "0" + numStr;

    return numStr;
}
