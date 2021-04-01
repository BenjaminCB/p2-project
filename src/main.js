import * as setup from "./setup.js";
import { encodeBlock } from "./encode.js";
import { decodeBlock } from "./decode.js";
import * as arith from "../util/arithmetic.js";
export { config, toIndex, toPoly, code };

let config = setup.parseConfig();
config = setup.parseArgs(config);

const [toIndex, toPoly] = setup.generateTables();

let code = setup.codeGenerator();
