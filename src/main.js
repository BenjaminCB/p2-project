import fs from 'fs';
export {config};

const projectRoot = process.cwd();
const configFile = fs.readFileSync(projectRoot + "/config.json");
const config = JSON.parse(configFile);
