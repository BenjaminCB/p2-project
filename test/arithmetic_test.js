import test from 'ava';
import {galoisMultiply, generateTables, polyDivision} from "../util/arithmetic.js";

test("Galois multiplication", t => {
    let actual = [
                    galoisMultiply(1, 1),
                    galoisMultiply(1, 11),
                    galoisMultiply(4, 8),
                    galoisMultiply(8, 7),
                    galoisMultiply(12, 3),
                 ];
    let expected = [1, 11, 11, 10, 13];

    t.deepEqual(actual, expected);
});

test("Field generation", t => {
    let [toIndexActual, toPolyActual] = generateTables();
    toIndexActual.shift();

    let toIndexExpected = [0, 1, 12, 2, 9, 13, 7, 3, 4, 10, 5, 14, 11, 8, 6];
    let toPolyExpected = [1, 2, 4, 8, 9, 11, 15, 7, 14, 5, 10, 13, 3, 6, 12, 1];
    t.deepEqual(toIndexExpected, toIndexActual);
    t.deepEqual(toPolyExpected, toPolyActual);
});

test("Poly division", t => {
    let dividend = [0, 0, 9, 7, 5, 6, 8, 4],
        divisor  = [2, 3, 1, 0, 0, 0, 0, 0],
        expected = [7,6,0,0,0,0,0,0],
        actual   = polyDivision(dividend, divisor);
    t.deepEqual(expected, actual);
});
