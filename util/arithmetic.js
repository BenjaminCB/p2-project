import { config, toIndex, toPoly } from "../src/main.js";
export { generateTables, galoisMultiply, polyDivision, polyDerive, polyAdd, arrayShift, polyMultiply };


/*
 * Input: dividend and divisor both arrays of integers representing polynomials
 * Output: remainder again as an array representing a polynomial
 */
function polyDivision(dividend, divisor) {
    let dividendDegree = polyDegree(dividend);
    let divisorDegree = polyDegree(divisor);
    let offset = dividendDegree - divisorDegree;
    let lastRound = false;

    // if the divident has a degree less than the divisor we can stop
    if (offset === 0) {
        lastRound = true;
    }

    // find factor
    let value = dividend[dividendDegree] / divisor[divisorDegree];
    let factor = arrayShift(divisor, offset - 1);
    factor = factor.map(element => galoisMultiply(element, value));

    // polynomial add
    let sum = polyAdd(dividend, factor);

    return lastRound ? sum : polyDivision(sum, divisor);
}

/*
 * Input: an array representing a polynomial
 * Output: the degree of this polynomial
 */
function polyDegree(poly) {
    let i = poly.length - 1;
    while (poly[i] === 0) {
        i--;
    };
    return i;
}

/*
 * Input:
 * An array and the number (>=0) of times it should be shifted to the right,
 * meaning the number of times that we multiply by x.
 *
 * Output:
 * A new array which is the shifted version of the input array.
 * There is no change on the input parameters
 */
function arrayShift(arr, num) {
    let copy = [...arr];
    for (let i = 0; i <= num; i++) {
        let val = copy.pop();
        copy.unshift(val);
    };
    return copy;
}

/*
 * Input: void (though the global config struct needs to be defined)
 *
 * Output:
 * two tables first toIndex which takes a polinomial form as a number of an element
 * and gives the index the polynomial form 0 has no defined value index in this table
 * so toIndex[0] is undefined
 * second is toPoly which given an element index gives the polynomial form as a number
 */
function generateTables() {
    let size = 2 ** config.symbolSize;
    let generator = config.fieldGenerator;
    // we do not generate tables less than 2
    if (size < 2) {
        throw new Error("Cannot generate tables with a symbol size less than 2");
    }

    let toIndex = [],
        toPoly = [];

    // we skip index 00 because it creates weird indexing and is not needed
    // this means we need an extra case for 00 when we multiply and divide
    toIndex[1] = 0;
    toPoly[0] = 1;

    // current polynomial which we are calculating
    // highestBit in our generator 25 would be 16 because 25 = 0b11001
    let current = 1,
        highestBit = findHighestBit(generator);

    for (let i = 1; i < size; i++) {
        // multiply by alpha
        current <<= 1;

        // check to see if we are out of the field and corret it if we are
        if (hasBit(current, highestBit)) {
            current ^= generator;
        }

        toIndex[current] = i % (size - 1);
        toPoly[i] = current;
    };

    return [toIndex, toPoly];
}

/*
 * Input: num which we want to find the highest bit in
 * Output: value of the highest bit
 */
function findHighestBit(num) {
    let bit = 1;
    while (num > bit) bit <<= 1;
    bit >>= 1;
    return bit;
}

/*
 * Input: number that we want to check and the value of the bit position that we want to check
 * Output: True if it contains contains that bit and false otherwise
 */
function hasBit(num, bit) {
    return (num > (num ^ bit));
}

/*
 * Input: Two arrays representing polynomials, they need to be of equal length
 * Output: A new array which is the sum of the two inputs
 */
function polyAdd(a, b) {
    let res = [];

    if (a.length !== b.length) {
        throw new Error("polyAdd expects the length of the arrays to be the same");
    }

    for (let i = 0; i < a.length; i++) {
        res[i] = a[i] ^ b[i];
    };
    return res;
}

/*
 * Input: Two field elements in polynomial form
 * Output: The product in polynomial form
 */
function galoisMultiply(a, b) {
    let res = 0;
    if (a !== 0 && b !== 0) {
        res = toPoly[(toIndex[a] + toIndex[b]) % (2 ** config.symbolSize - 1)];
    }
    return res;
}


/**
 * Returns the derivative of a polynomium
 * @param {number[]} poly Array representation of a polynomium
 * @return {number[]} Array representation of the derived polynomium
 */
function polyDerive(poly) {
    let derivedPoly = [];
    for (let i = 1; i < poly.length; i++) {
        derivedPoly[i - 1] = poly[i] * i;
    }
    return derivedPoly;
}

/*
 * Input: Two arrays representing polynomials
 * Output: An arrays representing the product of the two
 */
function polyMultiply(a, b) {
    let prod = new Array(a.length + b.length - 1).fill(0);
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            prod[i+j] ^= galoisMultiply(a[i], b[j]);
        };
    };
    return prod;
}