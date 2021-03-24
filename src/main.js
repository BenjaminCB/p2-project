import fs from 'fs';
import {generateTables} from "../util/arithmetic.js";
import {codeGenerator} from "./setup/code_generator.js";
export {config, toIndex, toPoly};

const projectRoot = process.cwd();
const configFile = fs.readFileSync(projectRoot + "/config.json");
let config = JSON.parse(configFile);

const [toIndex, toPoly] = generateTables();

parseArgs(process.argv);

let code = codeGenerator();
console.log(code);

/*
 * Input: process.argv is these are the user inputs when starting the program
 * Output: changes the config object arrocdingly are does nothing if no valid arguments are given
 */
function parseArgs(args) {
    // loop through all the arguments
    for (let arg of args) {
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
}
