import test from 'ava';
import {codeGenerator} from "../src/setup/code_generator.js";
import {config} from "../src/main.js";

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
