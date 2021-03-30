import { config, toPoly, toIndex } from "./main.js";
import * as arith from "../util/arithmetic.js";
export { calcSyndromes, berlekamp, chien };


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
 * Finds the roots of the error locater polynomial
 * Input: An array representing the error locater polynomial
 * Output: An array of the found roots in the found order and in index form
 */
function chien(errorLocator) {
    let roots = [],
        nElements = 2 ** config.symbolSize - 1,
        t = (config.codeSize - config.messageSize) / 2,
        terms = [...errorLocator];

    // is the starting point a root
    if (arith.polyEval(errorLocator, toPoly[0]) === 0) {
        roots[roots.length] = 0;
    }

    // go through the rest of the elements
    for (let i = 1; i < nElements; i++) {
        // if we found enough errors stop
        // TODO add functionality to check for too many errors
        if (roots.length === t) {
            break;
        }

        terms = updateTerms(terms);

        // reduce terms to a value and check if it is 0
        if (terms.reduce((acc, val) => acc ^ val) === 0) {
            roots[roots.length] = i;
        }
    };

    return roots;

    function updateTerms(terms) {
        // make copy and factor for multiplication
        let newTerms = [...terms],
            alpha = toPoly[1];

        // for every value multiply it by the factor (alpha) then update the factor
        for (let i = 1; i < newTerms.length; i++) {
            newTerms[i] = arith.galoisMultiply(newTerms[i], alpha);
            alpha = arith.galoisMultiply(alpha, toPoly[1]);
        };

        return newTerms;
    }
}

let res = forney([1, 14, 14], [15, 3, 4, 12], [6, 13]);
console.log(res);

function forney(errorLocator, syndromes, roots) {
    let errorMag = calcErrorMag(),
        dydx = arith.polyDerive(errorLocator),
        errorVals = [];

    for (let i = 0; i < roots.length; i++) {
        let invRoot    = arith.invElement(roots[i]),                 // Find the inverse element of the root
            dividend   = arith.polyEval(errorMag, invRoot),          // evaluate errorMag at inverse root
            divisor    = arith.polyEval(dydx, invRoot),              // evaluate derivative of error locater at root
            invDivisor = arith.invElement(divisor),                  // find the inverse of the divisor
            product    = arith.galoisMultiply(dividend, invDivisor); // This is equivelent to divident / divisor
        errorVals[i]   = arith.galoisMultiply(roots[i], product);
    };

    return errorVals;

    function calcErrorMag() {
        let product = arith.polyMultiply(errorLocator, syndromes),
            twoT = config.codeSize - config.messageSize,
            divisor = new Array(twoT + 1).fill(0);
        divisor[divisor.length - 1] = 1;

        return arith.polyDivision(product, divisor);
    }
}
