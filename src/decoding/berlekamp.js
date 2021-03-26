import {config, toPoly, toIndex} from "../main.js";
import * as arith from "../../util/arithmetic.js";

function berlekamp(syndromes) {
    let t = config.codeSize - config.messageSize,   // number of errors we can correct
        k = 1,                                      // step tracker
        l = 0,                                      // order tracker
        lambda = new Array(t).fill(0),              // error locator
        c = new Array(t).fill(0);                   // correction polynomial
        lambda[0] = 1;
        c[1] = 1;

    while (k <= 2 * t) {
        let e = syndromes[k - 1] + ((syndromes, lambda) => {
            let res = 0;
            for (let i = 1; i <= l; i++) {
                res += lambda[i] + syndromes[k - 1 - i];
            }
            return res;
        });
        let lamdaApprox = arith.polyAdd(lambda, c.map(coe => arith.galoisMultiply(coe, e)));
        if (2 * l < k && e !== 0) {
            l = k - l;
            c = lamda.map(coe => arith.galoisMultiply(coe, arith.invElement(e)));
        }
    };
}
