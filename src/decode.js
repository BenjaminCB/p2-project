import { config, toPoly } from "./main.js";
import * as arith from "../util/arithmetic.js";
export { berlekamp, calcSyndromes };

/*
 * Caluculate the error locator and it's coefficients using the berlekamp-massey algerithm
 * Input: An array representing the syndrome polynomial.
 *        Some value in the config should be defined as well.
 * Output: An array representing the error locator polynomial
 */
function berlekamp(syndromes) {
    let twoT = config.codeSize - config.messageSize,   // twice the number of errors we can correct
        k = 1,                                         // step tracker
        l = 0,                                         // order tracker
        lambda = new Array(twoT).fill(0),              // error locator
        c = new Array(twoT).fill(0);                   // correction polynomial
        lambda[0] = 1;
        c[1] = 1;

    while (k <= twoT) {
        let e = calculateE();
        let lambdaApprox = arith.polyAdd(lambda, c.map(coe => arith.galoisMultiply(coe, e)));

        if (2 * l < k && e !== 0) {
            l = k - l;
            c = lambda.map(coe => arith.galoisMultiply(coe, arith.invElement(e)));
        }

        c = arith.arrayShift(c, 1);
        lambda = lambdaApprox;
        k++;
    };

    // TODO: calculate the proper length for the error locater or add space when needed
    // remove traling zeroes from the error locator
    while (lambda[lambda.length - 1] === 0) {
        lambda.pop();
    };

    function calculateE() {
        let e = syndromes[k - 1];
        for (let i = 1; i <= l; i++) {
            e ^= arith.galoisMultiply(lambda[i], syndromes[k - 1 - i]);
        };
        return e;
    }

    return lambda;
}

/*
 * Calculate the syndromes given the received message
 * Input: An array representing the received message as a polynomial
 * Output: An array representing the syndrome polynomial
 */
function calcSyndromes(received) {
    let twoT = config.codeSize - config.messageSize,
        syndromes = [];

    for (let i = 0; i < twoT; i++) {
        syndromes[i] = arith.polyEval(received, toPoly[i]);
    };

    return syndromes;
}
