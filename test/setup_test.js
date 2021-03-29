import test from 'ava';
import {config} from "../src/main.js";
import {codeGenerator} from "../src/setup.js";

test("Code generator", t => {
    if (config.codeSize != 15 ||
        config.messageSize != 11 ||
        config.symbolSize != 4 ||
        config.fieldGenerator != 25) {
        t.pass();
    } else {
        let actual = codeGenerator();
        let expected = [15, 5, 4, 15, 1];
        t.deepEqual(expected, actual);
    }
});
