import { config } from "./data_processing.js";
import { toIndex, toPoly } from "../src/main.js";
export { galoisMultiply, polyDivision, polyDerive, polyAdd, arrayShift, polyMultiply,
         invElement, polyEval, findHighestBit, hasBit, multiplyX };

/**
 * TODO: this could probably be done more efficiently especially adding and removing padding
 * @param {number[]} dividend array of integers representing a polynomial
 * @param {number[]} divisor array of integers representing a polynomial
 * @returns {number[]} remainder of the division as an array represented polynomial
 */
function polyDivision(dividend, divisor) {
    let newDivisor = [...divisor],
        [dividendDegree, divisorDegree, offset] = degreeAndOffset(dividend, divisor);


    // if the dividend has a lower degree we can just return it since division will do nothing
    // if the dividend has a higher degree we pad on zeroes such that the arrays have the same length
    // this is done for practical reasons and not mathematical
    if (dividendDegree < divisorDegree) {
        return dividend;
    } else if (dividendDegree > divisorDegree) {
        for (let i = 0; i < offset; i++) {
            newDivisor[newDivisor.length] = 0;
        };
    }

    // remove trailing zeroes
    let res = division(dividend, newDivisor);
    while (res[res.length - 1] === 0) {
        res.pop();
    };

    return res;

    // this is the actual division
    function division(dividend, divisor) {
        let [dividendDegree, divisorDegree, offset] = degreeAndOffset(dividend, divisor);
        let lastRound = false;

        // if the divident has a degree less than the divisor we can stop
        if (offset === 0) {
            lastRound = true;
        }

        // find factor
        let value = dividend[dividendDegree] / divisor[divisorDegree];
        let factor = multiplyX(divisor, offset);
        factor = factor.map(element => galoisMultiply(element, value));

        // polynomial add
        let sum = polyAdd(dividend, factor);

        return lastRound ? sum : division(sum, divisor);
    }

    // calculate degree for the parameters and the offset between them
    function degreeAndOffset(polyA, polyB) {
        let polyADegree = polyDegree(polyA);
        let polyBDegree = polyDegree(polyB);
        let offset = polyADegree - polyBDegree;
        return [polyADegree, polyBDegree, offset];
    }
}

/**
 * @param {number[]} poly array representing a polynomial
 * @returns {number} the degree of the parameter polynomial
 */
function polyDegree(poly) {
    let i = poly.length - 1;
    while (poly[i] === 0) {
        i--;
    };
    return i;
}

/**
 * @param {number[]} arr The array to be shifted
 * @param {number} num The amount of times it should be shifted to the right (>=0)
 * @returns {number[]} A copy of the parameter array now shifted num times to the right
 */
function arrayShift(arr, num) {
    let copy = [...arr];
    for (let i = 0; i < num; i++) {
        let val = copy.pop();
        copy.unshift(val);
    };
    return copy;
}

/**
 * Multiplies a polynomial with x
 * @param {number[]} poly Array representing a polynomial
 * @param {number} num The number of times to multiply by x
 * @returns {number[]} A new array representing the resulting polynomial
 */
function multiplyX(poly, num) {
    let copy = [...poly];
    for (let i = 0; i < num; i++) {
        copy.unshift(0);
    };
    return copy;
}

/**
 * @param {number} num The 10-base number to find the highest bit in
 * @returns {number} The value of the highest bit in num
 */
function findHighestBit(num) {
    let bit = 1;
    while (num > bit) bit <<= 1;
    bit >>= 1;
    return bit;
}

/**
 * Checks if num contains bit in binary
 * @param {number} num The 10-base number to be checked
 * @param {number} bit The value of the bit position to be checked
 * @returns {boolean} True if num contains the bit otherwise false
 */
function hasBit(num, bit) {
    return (num > (num ^ bit));
}

/**
 * @param {number[]} a Array representing a polynomial, must be the same length as b
 * @param {number[]} b Array representing a polynomial, must be the same length as a
 * @returns {number[]} A new array which is the sum of the two inputs
 */
function polyAdd(a, b) {
    let res = [],
        longest = a.length > b.length ? a : b,
        shortest = a.length > b.length ? b : a,
        i = 0;

    // add terms where both polynomials are defined
    while (i < shortest.length) {
        res[i] = shortest[i] ^ longest[i];
        i++;
    };

    // fill in the rest of the terms with the remaining terms from the longest polynomial
    while (i < longest.length) {
        res[i] = longest[i];
        i++;
    };

    return res;
}

/**
 * @param {number[]} a A field element in polynomial form
 * @param {number[]} b A field element in polynomial form
 * @returns The product of the two field elements in polynomial form
 */
function galoisMultiply(a, b) {
    let res = 0;
    if (a !== 0 && b !== 0) {
        res = toPoly[(toIndex[a] + toIndex[b]) % (2 ** config.symbolSize - 1)];
    }
    return res;
}


/**
 * Returns the derivative of a polynomial
 * @param {number[]} poly Array representation of a polynomial
 * @returns {number[]} Array representation of the derived polynomial
 */
function polyDerive(poly) {
    let derivedPoly = [];
    for (let i = 1; i < poly.length; i++) {
        if (i % 2 == 0) {
            // we do not want to add zero in the last round since that does nothing
            if (i !== poly.length - 1) {
                derivedPoly[i - 1] = 0;
            }
        } else {
            derivedPoly[i - 1] = poly[i];
        }
    }
    return derivedPoly;
}

/**
 * @param {number[]} a An array representing a polynomial
 * @param {number[]} b An array representing a polynomial
 * @returns A new array representing the product of the two parameter polynomials
 */
function polyMultiply(a, b) {
    let prod = new Array(a.length + b.length - 1).fill(0);
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            prod[i + j] ^= galoisMultiply(a[i], b[j]);
        };
    };
    return prod;
}

/**
 * Returns the inverse of an element in the galois field
 * @param {number} element An element in decimal form
 * @returns {number} The inverse element in decimal form
 */
function invElement(element) {
    let nElements = 2 ** config.symbolSize - 1;
    if (element > nElements) {
        throw new Error(element + " is not an element in the galois field");
    }
    // mathematically subtracting from the nElements should be the same as subtracting from zero
    // node is a little wonky with negative numbers and modulo though
    return toPoly[nElements - toIndex[element]];
}

/**
 * Evaluate a polynomial at a given val using horners method for evaluation
 * @param {number[]} poly An Array representing a polynomial
 * @param {number} val Decimual number for which poly should be evaluated
 * @returns Tje result of the evaluation
 */
function polyEval(poly, val) {
    return evaluate(0);
    function evaluate(pos) {
        if (pos === poly.length - 1) {
            return poly[pos]
        } else {
            return galoisMultiply(evaluate(pos + 1), val) ^ poly[pos];
        }
    }
}
