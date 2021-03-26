import test from 'ava';
import {isRS} from "./arithmetic_test.js";

test("Berlekamp algorithm", t => {
    if (isRS(8, 6, 4, 25)) {
        let expected = [1, 9];
        let actual   = berlekamp([1, 13]);
        t.deepEqual(expected, actual);
    } else if (isRS(15, 11, 4, 25)) {
        let expected = [1, 14, 14];
        let actual   = berlekamp([15, 3, 4, 12]);
        t.deepEqual(expected, actual);
    } else {
        t.pass();
    }
});
