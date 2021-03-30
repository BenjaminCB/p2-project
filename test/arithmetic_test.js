import test from 'ava';
import { galoisMultiply, polyDivision, polyDerive, invElement,
         polyEval
       } from "../util/arithmetic.js";
import { config, toPoly } from "../src/main.js";

test("Galois multiplication", t => {
    if (!isRS(15, 11, 4, 25)) {
        t.pass();
    } else {
        let actual = [
            galoisMultiply( 1,  1),
            galoisMultiply( 1, 11),
            galoisMultiply( 4,  8),
            galoisMultiply( 8,  7),
            galoisMultiply(12,  3),
        ];
        let expected = [1, 11, 11, 10, 13];

        t.deepEqual(actual, expected);
    }
});

test("Poly division", t => {
    if (!isRS(15, 11, 4, 25)) {
        t.pass();
    } else {
        let dividend = [0, 0, 9, 7, 5, 6, 8, 4],
            divisor = [2, 3, 1, 0, 0, 0, 0, 0],
            expected = [7, 6, 0, 0, 0, 0, 0, 0],
            actual = polyDivision(dividend, divisor);
        t.deepEqual(expected, actual);
    }
});

// test("Poly derive", t => {
//     let poly1 = [1, 2, 3, 4, 5, 6, 7, 8, 9],
//         expected1 = [2, 6, 12, 20, 30, 42, 56, 72],
//         actual1 = polyDerive(poly1),
//         poly2 = [-2, -1, 4, 11, -3],
//         expected2 = [-1, 8, 33, -12],
//         actual2 = polyDerive(poly2);
//     t.deepEqual(expected1, actual1);
//     t.deepEqual(expected2, actual2);
// })

test("Inverse element", t => {
    if (!isRS(15, 11, 4, 25)) {
        t.pass();
    } else {
        t.is( 1, invElement(1));
        t.is(12, invElement(2));
        t.is( 6, invElement(4));
        t.is( 3, invElement(8));
        t.is(13, invElement(9));
        t.is(10, invElement(11));
        t.is( 5, invElement(15));
        t.is(14, invElement(7));
    }
});

test("Polynomial evaluation", t => {
    if (isRS(15, 11, 4, 19)) {
        let poly = [12, 12, 1, 3, 11, 10, 9, 8, 7, 11, 5, 4, 3, 2, 1];
        t.is(15, polyEval(poly, toPoly[0]));
        t.is( 3, polyEval(poly, toPoly[1]));
        t.is( 4, polyEval(poly, toPoly[2]));
        t.is(12, polyEval(poly, toPoly[3]));
    } else {
        t.pass();
    }
});

export function isRS(n, m, s, p) {
    return (config.codeSize       === n &&
            config.messageSize    === m &&
            config.symbolSize     === s &&
            config.fieldGenerator === p);
}
