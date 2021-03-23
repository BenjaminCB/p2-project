import {config, toIndex, toPoly} from "../src/main.js";
export {generateTables, galoisMultiply};

// polyDivision([0, 0, 9, 7, 5, 6, 8, 4], [2, 3, 1, 0, 0, 0, 0, 0])
/*
 * Input: dividend and divisor both arrays of integers representing polynomials
 * Output: remainder again as an array representing a polynomial
 */
function polyDivision(dividend, divisor) {
    let dividendDegree = polyDegree(dividend);
    let divisorDegree = polyDegree(divisor);

    // if the divident has a degree less than the divisor we can stop
    if (dividendDegree < divisorDegree) {
        return dividend
    }

    // find factor
    let offset = dividendDegree - divisorDegree;
    let value = dividend[dividendDegree] / divisor[divisorDegree];
    // let factor = new Array(divisor.length).fill(0);
    // factor[offset] = value;

    divisor = arrayShift(divisor, offset);
    divisor = map(element => galoisMultiply(element, value));

    // multiply by factor
    // let upScaled = polyMultiply(divisor, factor);

    // polynomial add
    let sum = polyAdd(dividend, upScaled);

    return polyDivision(sum, divisor);
}

/*
 * Input: void
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
        toPoly  = [];

    // we skip index 00 because it creates weird indexing and is not needed
    // this means we need an extra case for 00 when we multiply and divide
    toIndex[1] = 0;
    toPoly[0] = 1;

    // current polynomial which we are calculating
    // highestBit in our generator 25 would be 16 because 25 = 0b11001
    let current    = 1,
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

function polyAdd(a, b) {
    let res = [];
    for (let i = 0; i < a.length; i++) {
        res[i] = a[i] ^ b[i];
    };
    return res;
}

function galoisMultiply(a, b) {
    return toPoly[(toIndex[a] + toIndex[b]) % (2 ** config.symbolSize - 1)];
}
