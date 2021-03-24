import * as arith from "../../util/arithmetic.js";
import {config, toPoly} from "../main.js";
export {codeGenerator};

/*
 * Input: Void (although config.codeSize and config.messageSize have to be defined)
 * Output: An array representing the code generator polynomial
 */
function codeGenerator() {
    let nFactor = config.codeSize - config.messageSize;

    let code = [toPoly[0], 1];
    for (let i = 1; i < nFactor; i++) {
        code = arith.polyMultiply(code, [toPoly[i], 1]);
    };

    return code;
}
