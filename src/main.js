import * as setup from "./setup.js";
import * as decode from "./decode.js";
export { config, toIndex, toPoly };

let config = setup.parseConfig();
config = setup.parseArgs(config);

const [toIndex, toPoly] = setup.generateTables();

let code = setup.codeGenerator();
