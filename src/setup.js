import fs from 'fs';
import * as arith from "../util/arithmetic.js";
import {config, toPoly} from "./main.js";
export {codeGenerator, parseConfig, parseArgs, generateTables};

function parseConfig() {
    const projectRoot = process.cwd();
    const configFile = fs.readFileSync(projectRoot + "/config.json");
    let config = JSON.parse(configFile);
    config = parseArgs(config);

    return config;
}

/*
 * Makes a new config object with values from the command line
 * Input: config object
 * Output: new config object with added/updated values
 */
function parseArgs(cfg) {
    let config = JSON.parse(JSON.stringify(cfg));
    // loop through all the arguments
    for (let arg of process.argv) {
        // if the - prefix is not present we assumme it is not our argument
        if (arg[0] !== '-') continue;

        // remove the prefix
        arg = arg.substring(1);

        // find the argument in our list of supported arguments or discard invalid arguments
        switch (arg) {
            case 'e': config.mode = "encode"; break;
            case 'd': config.mode = "decode"; break;
            case 'h': help(); break;
            default : console.log(arg + " is not a valid argument try -h"); break;
        };
    };

    // display help information about each argument
    function help() {
        console.log("Some argements like e and d are mutually exclusive speciying both",
                    "will result in the latter overwriting the first.\n");
        console.log("If they are not mutually exclusive it will result in the arguments",
                    "being run twice -h -h for instance\n");
        console.log("e: sets the program to encoding mode\n");
        console.log("d: sets the program in decoding mode\n");
    }

    return config;
}

/*
 * Input: void (though the global config struct needs to be defined)
 *
 * Output:
 * two tables first toIndex which takes a polinomial form as a number of an element
 * and gives the index the polynomial form 0 has no defined value index in this table
 * so toIndex[0] is undefined
 * second is toPoly which given an element index gives the polynomial form as a number
 */
function generateTables() {
    let size = 2 ** config.symbolSize;
    let generator = config.fieldGenerator;
    // we do not generate tables less than 2
    if (size < 2) {
        throw new Error("Cannot generate tables with a symbol size less than 2");
    }

    let toIndex = [],
        toPoly = [];

    // we skip index 00 because it creates weird indexing and is not needed
    // this means we need an extra case for 00 when we multiply and divide
    toIndex[1] = 0;
    toPoly[0] = 1;

    // current polynomial which we are calculating
    // highestBit in our generator 25 would be 16 because 25 = 0b11001
    let current = 1,
        highestBit = arith.findHighestBit(generator);

    for (let i = 1; i < size; i++) {
        // multiply by alpha
        current <<= 1;

        // check to see if we are out of the field and corret it if we are
        if (arith.hasBit(current, highestBit)) {
            current ^= generator;
        }

        toIndex[current] = i % (size - 1);
        toPoly[i] = current;
    };

    return [toIndex, toPoly];
}

/*
 * Input: Void (although config.codeSize and config.messageSize have to be defined)
 * Output: An array representing the code generator polynomial
 */
function codeGenerator() {
    let nFactor = config.codeSize - config.messageSize;

    let code = [toPoly[0], 1];
    for (let i = 1; i < nFactor; i++) {
        code = arith.polyMultiply(code, [toPoly[i], 1]);
    };

    return code;
}
