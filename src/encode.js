import { config, code } from "../src/main.js";
import * as arith from "../util/arithmetic.js";
export { encodeBlock };

/**
 * @param {string} data Binary data string that is converted to message polynomiums
 * @returns {number[]} An array containing all the message polynomiums generated from the data
 */
function messagePoly(data) {
    let message = [];
    let messages = [];

    for (let i = 0; i < data.length; i += config.symbolSize) {
        let symbol = parseInt(data.slice(i, i + config.symbolSize), 2);
        message.push(symbol)
        if (message.length >= config.messageSize) {
            messages.push(message);
            message = [];
        }
    }

    if (message.length > 0) {
        while (message.length < config.messageSize) {
            message.push(0);
        }
        messages.push(message);
    }

    return messages;
}

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
