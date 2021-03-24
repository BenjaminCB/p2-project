import fs from 'fs';
import {generateTables} from "../util/arithmetic.js";
export {config, toIndex, toPoly};

const   projectRoot = process.cwd(),
        configFile = fs.readFileSync(projectRoot + "/config.json"),
        config = JSON.parse(configFile),
        [toIndex, toPoly] = generateTables();

