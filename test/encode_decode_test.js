import test from 'ava';
import * as encode from "../src/encode.js";
import * as decode from "../src/decode.js";
import { isRS } from "./arithmetic_test.js";

test("Block correction", t => {
    if (isRS(15, 11, 4, 19) || isRS(15, 11, 4, 25)) {
        let msg = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        let encoded = encode.encodeBlock(msg);
        encoded[3] = 10;
        encoded[10] = 3;
        let decoded = decode.decodeBlock(encoded);
        t.deepEqual(msg, decoded);
    } else {
        t.pass();
    }
});
