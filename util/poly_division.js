polyDivision([0, 0, 9, 7, 5, 6, 8, 4], [2, 3, 1, 0, 0, 0, 0, 0])
/*
 * Input: dividend and divisor both arrays of integers representing polynomials
 * Output: remainder again as an array representing a polynomial
 */
function polyDivision(dividend, divisor) {
    // if the divident has a degree less than the divisor we can stop
    if (polyDegree(dividend) < polyDegree(divisor)) {
        return dividend
    }

    // find factor
    let factor = findFactor(dividend, divisor);

    // multiply by factor
    let upScaled = polyMultiply(divisor, factor);

    // polynomial add
    let sum = polyAdd(dividend, upScaled);

    return polyDivision(sum, divisor);
}

function findFactor(dividend, divisor) {

}
