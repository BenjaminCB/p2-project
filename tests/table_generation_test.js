import {generateTables} from "../util/arithmetic.js";

// test the table from the report
let [toIndex, toPoly] = generateTables(16, 25);
console.log(toIndex);
console.log(toPoly);
