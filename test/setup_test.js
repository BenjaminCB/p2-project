import test from 'ava';
import {isRS} from "./arithmetic_test.js";
import {config} from "../src/main.js";
import {codeGenerator, generateTables} from "../src/setup.js";

test("Field generation", t => {
    if (!isRS(15, 11, 4, 25)) {
        t.pass();
    } else {
        let [toIndexActual, toPolyActual] = generateTables();
        toIndexActual.shift();

        let toIndexExpected = [0, 1, 12, 2, 9, 13, 7, 3, 4, 10, 5, 14, 11, 8, 6];
        let toPolyExpected = [1, 2, 4, 8, 9, 11, 15, 7, 14, 5, 10, 13, 3, 6, 12, 1];
        t.deepEqual(toIndexExpected, toIndexActual);
        t.deepEqual(toPolyExpected, toPolyActual);
    }
});

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
