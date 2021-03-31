import test from 'ava';
import * as decode from "../src/decode.js";
import {isRS} from "./arithmetic_test.js";

test("Syndrome calculation", t => {
    if (isRS(15, 11, 4, 19)) {
        let rec = [12, 12, 1, 3, 11, 10, 9, 8, 7, 11, 5, 4, 3, 2, 1];
        t.deepEqual([15, 3, 4, 12], decode.calcSyndromes(rec));
    } else if (isRS(15, 11, 4, 25)) {
        let rec = [3, 1, 11, 12, 11, 10, 9, 8, 7, 6, 5, 14, 3, 2, 1],
            actual = decode.calcSyndromes(rec),
            expected = [15, 5, 9, 5];
        t.deepEqual(expected, actual);
    } else {
        t.pass();
    }
});

test("Berlekamp algorithm", t => {
    if (isRS(8, 6, 4, 25)) {
        let expected = [1, 9];
        let actual   = decode.berlekamp([1, 13]);
        t.deepEqual(expected, actual);
    } else if (isRS(15, 11, 4, 19)) {
        let expected = [1, 14, 14];
        let actual   = decode.berlekamp([15, 3, 4, 12]);
        t.deepEqual(expected, actual);
    } else if (isRS(15, 11, 4, 25)) {
        let expected = [1, 15, 3];
        let actual   = decode.berlekamp([15, 5, 9, 5]);
        t.deepEqual(expected, actual);
    } else {
        t.pass();
    }
});

test("Chien search", t => {
    if (isRS(15, 11, 4, 19)) {
        let expected = [6, 13];
        let actual = decode.chien([1, 14, 14]);
        t.deepEqual(expected, actual);
    } else if (isRS(15, 11, 4, 25)) {
        let expected = [4, 14];
        let actual = decode.chien([1, 15, 3]);
        t.deepEqual(expected, actual);
    } else {
        t.pass();
    }
});

test("Forney", t => {
    if (isRS(15, 11, 4, 19)) {
        let expected = [13, 2];
        let actual = decode.forney([1, 14, 14], [15, 3, 4, 12], [6, 13]);
        t.deepEqual(expected, actual);
    } else if (isRS(15, 11, 4, 25)) {
        let expected = [10, 5];
        let actual = decode.forney([1, 15, 3], [15, 5, 9, 5], [4, 14]);
        t.deepEqual(expected, actual);
    } else {
        t.pass();
    }
});
