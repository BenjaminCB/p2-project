import { config } from "../util/data_processing.js";
import { code } from "../src/main.js";
import * as arith from "../util/arithmetic.js";
export { encodeBlock };

/**
 * Encodes a message of size k into a block of size n
 * @param {number[]} msg Array representing the message polynomial with size of k (config.messageSize)
 * @returns Array representing the encoded block i.e T(x)
 */
function encodeBlock(msg) {
    let twoT = config.codeSize - config.messageSize,
        msgShifted = arith.multiplyX(msg, twoT),
        remainder = arith.polyDivision(msgShifted, code),
        block = arith.polyAdd(msgShifted, remainder);
    return block;
}

