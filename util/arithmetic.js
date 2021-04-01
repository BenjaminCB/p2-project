import { config, toIndex, toPoly } from "../src/main.js";
export { galoisMultiply, polyDivision, polyDerive, polyAdd, arrayShift, polyMultiply,
         invElement, polyEval, findHighestBit, hasBit, multiplyX };


/*
 * TODO: this could probably be done more efficiently especially adding and removing padding
 *
 * Input: dividend and divisor both arrays of integers representing polynomials
 * Output: remainder again as an array representing a polynomial
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
    for (let i = 0; i < num; i++) {
        let val = copy.pop();
        copy.unshift(val);
    };
    return copy;
}

/*
 * Multiplies a polynomial with x
 * Input: An array representing the polynomial and the number of times to multiply by x
 * Outpu: A new array representing the resulting polynomial
 */
function multiplyX(poly, num) {
    let copy = [...poly];
    for (let i = 0; i < num; i++) {
        copy.unshift(0);
    };
    return copy;
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
polyAdd([2, 3, 4], [3, 5, 2, 0, 1]);
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
    while  (i < longest.length) {
        res[i] = longest[i];
        i++;
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
        if (i % 2 == 0) {
            // we do not want to add zero in the last round since that does nothing
            if (i !== poly.length - 1) {
                derivedPoly[i - 1] = 0;
            }
        } else {
            derivedPoly[i - 1] = galoisMultiply(poly[i], i);
        }
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

/*
 * Returns the inverse of an element in the galois field
 * Input: An element in decimal form
 * Output: The inverse in decimal form
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

/*
 * Evaluate a polynomial at a given val using horners method for evaluation
 * Input: Array representing a polynomial and a number for which the polynomilal should be evaluated
 * Outpu: The result of the evaluation
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
