polyDivision([0, 0, 9, 7, 5, 6, 8, 4], [2, 3, 1, 0, 0, 0, 0, 0])
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
    let factor = new Array(divisor.length).fill(0);
    factor[offset] = value;

    // multiply by factor
    let upScaled = polyMultiply(divisor, factor);

    // polynomial add
    let sum = polyAdd(dividend, upScaled);

    return polyDivision(sum, divisor);
}
