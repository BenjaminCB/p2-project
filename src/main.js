import fs from 'fs';
import readline from 'readline';
import * as setup from "./setup.js";
import * as encode from "./encode.js";
import * as decode from "./decode.js";
import * as arith from "../util/arithmetic.js";
import * as data from "../util/data_processing.js";
import { performance } from 'perf_hooks'
export { toIndex, toPoly, code, projectRoot };

const projectRoot = process.cwd();
let config = data.config;
config = setup.parseArgs(config);

const [toIndex, toPoly] = setup.generateTables();

let code = setup.codeGenerator();

if (config.mode === "encode") {
    // summary values
    var timeSpendtEncoding = 0;
    let lines = 0;

    // read and write streams
    const wl = fs.createWriteStream(projectRoot + "/" + config.encodedFile, { encoding: "utf8" });
    const rl = readline.createInterface({
        input: fs.createReadStream(projectRoot + "/" + config.inputFile)
    });

    // Log what we are going to do
    console.log(`Encoding lines in file: ${config.inputFile}\nWriting encoded lines to file: ${config.encodedFile}`);

    // on line encode and write to output
    rl.on('line', line => {
        // summary values
        lines++;
        var t0 = performance.now();

        //convert read text-string to polynomials
        const msgs = data.strToPolys(line);

        //actual encoding
        let encodedMsgs = [];
        for (let i = 0; i < msgs.length; i++) {
            encodedMsgs[i] = encode.encodeBlock(msgs[i]);
        }

        // for all the message polynomials encode every coefficient to a binary string
        // Then join coefficients withouth a space then join polynomials with a space
        const binaryStr = data.polysToBinaryStr(encodedMsgs);

        // log the time for encoding
        var t1 = performance.now();
        timeSpendtEncoding = t1-t0;

        // write encoded line
        wl.write(binaryStr + "\n");
    });

    // on close print summary
    rl.on('close', () => {
        console.log("Finished encoding\n",
            "Total time: " + timeSpendtEncoding + " ms \n",
            "Number of lines: " + lines + "\n",
            "Avg time per line: " + timeSpendtEncoding / lines + " ms");
    });
} else if (config.mode === "decode") {
    // summary values
    var timeSpendtDecoding = 0;
    let lines = 0;

    // read and write streams
    const wl = fs.createWriteStream(projectRoot + "/" + config.decodedFile, { encoding: "utf8" });
    const rl = readline.createInterface({
        input: fs.createReadStream(projectRoot + "/" + config.errorFile)
    });

    console.log(`Decoding lines in file: ${config.errorFile}\nWriting decoded lines to file: ${config.decodedFile}`);

    // on line decode and write to output
    rl.on('line', line => {
        // summary values
        lines++;
        var t0 = performance.now();

        //convert read encoded binary string to polynomials
        let received = data.binaryToPolys(line, config.codeSize),
            decoded = [];

        //actual decoding
        for (let i = 0; i < received.length; i++) {
            decoded[i] = decode.decodeBlock(received[i]);
        }

        // convert decoded messages to a text-string
        let str = data.polysToStr(decoded);


        // log the time for decoding
        var t1 = performance.now();
        timeSpendtDecoding = t1-t0;

        // write decode line
        wl.write(str + "\n");
    });

    // on close print summary
    rl.on('close', () => {
        console.log("Finished decoding\n",
            "Total time: " + timeSpendtDecoding + " ms \n",
            "Number of lines: " + lines + "\n",
            "Avg time per line: " + timeSpendtDecoding / lines + " ms");
    });
    
} else {
    throw Error("Invalid mode of operation");
}
