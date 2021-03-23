import {galoisMultiply} from "../util/arithmetic.js";

console.log("Testing galoisMultiply");
result(1, 1);
result(1, 11);
result(4, 8);
result(8, 7);
result(12, 3);

function result(a, b) {
    let res = galoisMultiply(a, b);
    console.log(a + " times " + b + " = " + res);
}
