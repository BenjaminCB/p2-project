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

// *possible* to create multible burst errors across maxSymbolSpand symbols = config.symbolSize
//  From random starting point to end of current symbol, or up to and with maxSymbolSpand
rl.on('line', line => {
    let buffer = "";

    debugger;
    // split the line into strings of length symbolsize width, if possible
    for (let i = 0; i < line.length; i += bitsPerBlock) {
        let block = line.slice(i, i + bitsPerBlock);

        const maxSymbolSpand = 2;       // Kunne gøres så bruger skal skrive et input
        const chance = 3;               // 1/tal , 1 over <--
        
        let indexMax = (maxSymbolSpand * config.symbolSize);           // Maximum reach of the burst error
        
        // if the errorChance is an un-even number:
        // Insure that we don't create more errors, than can be handled
        if ( (config.errorChance % maxSymbolSpand) === 1){
            indexMax = config.symbolSize;
        };

        // Finds errorChance amount of index'es (total)
        for (let k = 0; k < config.errorChance; k++) {
            let index = randomNumber(0,100) % bitsPerBlock; 
            console.log(i + " " + index);
            
            let doubledoubleSymbol = 0;                             // Used to count the mount of spaces that have been looked at with possible change
            const startIndex = ( index % config.symbolSize );   // Starting point
            
            // Flips a bit if allowed to
            do{
                if (1 === ( randomNumber(0,100) % chance) )  {
                    buffer += flip(block, index);
                    doubleSymbol++;
                }
                // Insure that the skipped Index is counted
                else {
                    doubleSymbol++;
                }
                
                // insure we revert back, so the bust error can only stretch maxSymbolSpand Symbols
                indexMax = (maxSymbolSpand * config.symbolSize);
                index++;

                if ( ((doubledoubleSymbol + startIndex) % config.symbolSize) === 0) {
                    k++;
                }
                console.log(index + "    " + doubledoubleSymbol + "   " + k);

            }while (doubledoubleSymbol + startIndex !== indexMax && index !== bitsPerBlock && k < config.errorChance);
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


// 1 continius, singular burst error
rl.on('line', line => {
    let buffer = "";

    // split the line into strings of length symbolsize whin if possible
    for (let i = 0; i < line.length; i += bitsPerBlock) {
        let block = line.slice(i, i + bitsPerBlock);

        const maxSymbolSpand = config.errorChance;
        let k = 0;
        let flips = 0;
        
        let indexMax = (maxSymbolSpand * config.symbolSize);        // Maximum reach of the burst error
        let index = randomNumber(0,1000) % bitsPerBlock;             // Tal mellem 0 og bitsPerBlock
        const startIndex = ( index % config.symbolSize );           // Starting point
        
        
        const chance = 3;  // 1/tal , 1 over <--
        do{
            if (1 === ( randomNumber(0,1000) % chance) )  {    // !!!!!!!!! Er ikke 100% tilfældigt da det største tal skal gå op i chance !!!!!!!!!!
                buffer += flip(block, index);
                flips++;
            }
            // Insure that the skipped Index is counted
            else {
                flips++
            }
            index++;
            
            // insure we revert back, so the bust error can only stretch maxSymbolSpand Symbols
            if ( ((flips + startIndex) % config.symbolSize) === 0) {
                k++;
            }
            console.log(index + "    " + flips + "   " + k);
        }while (flips + startIndex !== indexMax && index !== bitsPerBlock && k < maxSymbolSpand);

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
function randomNumber(min, max) {
    return (Math.trunc(Math.random() * (max - min) + min));
}


function randomSymbol() {
    let num = Math.trunc( (2 ** config.symbolSize - 1) * Math.random() ),
        numStr = num.toString(2);

    while(numStr.length < config.symbolSize) numStr = "0" + numStr;

    return numStr;
}
