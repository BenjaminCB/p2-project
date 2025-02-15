import fs from 'fs';
import readline from 'readline';
import * as setup from "./setup.js";
import * as encode from "./encode.js";
import * as decode from "./decode.js";
import * as arith from "../util/arithmetic.js";
import * as data from "../util/data_processing.js";
import { performance } from "perf_hooks";
export { toIndex, toPoly, code, projectRoot };

const projectRoot = process.cwd();
let config = data.config;
config = setup.parseArgs(config);

const [toIndex, toPoly] = setup.generateTables();

let code = setup.codeGenerator();

if (config.mode === "encode") {
    // summary values
    let timeSpentEncoding = 0;
    let lines = 0;

    // read and write streams
    const wl = fs.createWriteStream(projectRoot + "/" + config.encodedFile, { encoding: "utf8" });
    const rl = readline.createInterface({
        input: fs.createReadStream(projectRoot + "/" + config.inputFile)
    });
    const et = fs.createWriteStream(projectRoot + "/data/encode_time_js.csv", {encoding: "utf8" });

    // Log what we are going to do
    console.log(`Encoding lines in file: ${config.inputFile}\nWriting encoded lines to file: ${config.encodedFile}`);

    // on line encode and write to output
    rl.on('line', line => {
        // summary values
        lines++;

        //convert read text-string to polynomials
        const msgs = data.strToPolys(line);

        //pre encoding time
        let t0 = performance.now();

        //actual encoding
        let encodedMsgs = [];
        for (let i = 0; i < 25; i++) {
            const time = performance.now();
            for (let i = 0; i < msgs.length; i++) {
                encodedMsgs[i] = encode.encodeBlock(msgs[i]);
            }

            et.write(performance.now() - time + "\n");
            // for all the message polynomials encode every coefficient to a binary string
            // Then join coefficients withouth a space then join polynomials with a space

            // log the time for encoding
            totalTime += Date.now() - time;
        }

        //post encoding time
        let t1 = performance.now();

        // log the time for encoding
        timeSpentEncoding += t1 - t0;

        //convert polynomials to encoded binary string
        const binaryStr = data.polysToBinaryStr(encodedMsgs);

        // write encoded line
        wl.write(binaryStr + "\n");
    });

    // on close print summary
    rl.on('close', () => {
        console.log("Finished encoding\n",
            "Total time: " + timeSpentEncoding + " ms \n",
            "Number of lines: " + lines + "\n",
            "Avg time per line: " + timeSpentEncoding / lines + " ms");
    });
} else if (config.mode === "decode") {
    // summary values
    let timeSpentDecoding = 0;
    let lines = 0;

    // read and write streams
    const wl = fs.createWriteStream(projectRoot + "/" + config.decodedFile, { encoding: "utf8" });
    const rl = readline.createInterface({
        input: fs.createReadStream(projectRoot + "/" + config.errorFile)
    });
    const dt = fs.createWriteStream(projectRoot + "/data/decode_time_js.csv", {encoding: "utf8" });

    console.log(`Decoding lines in file: ${config.errorFile}\nWriting decoded lines to file: ${config.decodedFile}`);

    // on line decode and write to output
    rl.on('line', line => {
        // summary values
        lines++;

        //convert read encoded binary string to polynomials
        let received = data.binaryToPolys(line, config.codeSize);
        let decoded = [];

        //pre decoding time
        let t0 = performance.now();

        //actual decoding
        for (let i = 0; i < received.length; i++) {
            decoded[i] = decode.decodeBlock(received[i]);
        }

        //post decoding time
        let t1 = performance.now();

        // log the time for decoding
        timeSpentDecoding += t1 - t0;

        // convert decoded messages to a text-string
        let str = data.polysToStr(decoded);

        // write decode line
        wl.write(str + "\n");

        for (let i = 0; i < 25; i++) {
            let decoded1 = [];
            const time = performance.now();
            for (let i = 0; i < received.length; i++) {
                decoded1[i] = decode.decodeBlock(received[i]);
            }
            dt.write(performance.now() - time + "\n");

            // convert decoded messages to a text-string

            // log the time for encoding
            totalTime += Date.now() - time;
        }
    });

    // on close print summary
    rl.on('close', () => {
        console.log("Finished decoding\n",
            "Total time: " + timeSpentDecoding + " ms \n",
            "Number of lines: " + lines + "\n",
            "Avg time per line: " + timeSpentDecoding / lines + " ms");
    });

} else {
    throw Error("Invalid mode of operation");
}
