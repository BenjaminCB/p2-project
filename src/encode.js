import { config, code } from "../src/main.js";
import * as arith from "../util/arithmetic.js";
export { encodeBlock };

/*
 * Encodes a message of size k into a block of size n
 * Input: An array representing the message polynomial with a size of k (config.messageSize)
 * Output: An array representing the block i.e an array representing T(x)
 */
function encodeBlock(msg) {
    let twoT = config.codeSize - config.messageSize,
        msgShifted = arith.multiplyX(msg, twoT),
        remainder = arith.polyDivision(msgShifted, code),
        block = arith.polyAdd(msgShifted, remainder);
    return block;
}

