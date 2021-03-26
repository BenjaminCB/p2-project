import { config } from "../src/main.js";

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
