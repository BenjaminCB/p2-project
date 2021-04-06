import fs from 'fs';
export { config, binaryToPolys, strToBinaryStr, polysToBinaryStr };

const projectRoot = process.cwd();
let config = parseConfig()

function parseConfig() {
    const configFile = fs.readFileSync(projectRoot + "/config.json");
    let config = JSON.parse(configFile);
    return config;
}

/**
 * @param {string} data Binary data string that is converted to message polynomiums
 * @returns {number[]} An array containing all the message polynomiums generated from the data
 */
function binaryToPolys(data, size) {
    let coefficients = [];
    let polynomials = [];

    for (let i = 0; i < data.length; i += config.symbolSize) {
        let symbol = parseInt(data.slice(i, i + config.symbolSize), 2);
        coefficients.push(symbol)
        if (coefficients.length >= size) {
            polynomials.push(coefficients);
            coefficients = [];
        }
    }

    // if (coefficients.length > 0) {
    //     while (coefficients.length < size) {
    //         coefficients.push(0);
    //     }
    //     polynomials.push(coefficients);
    // }

    return [polynomials, coefficients];
}

/*
 * Turn a utf-8 string into a a string of binary data
 * Input: String
 * Outpu: A string with the binary data
 */
function strToBinaryStr(str) {
    let charCodes = [];

    for (let i = 0; i < str.length; i++) {
        charCodes[i] = str.charCodeAt(i);
    };

    let binaryStrings = charCodes.map(charCode => charCode.toString(2));
    binaryStrings = binaryStrings.map(charCode => {
        while(charCode.length < 8) {
            charCode = "0" + charCode;
        }
        return charCode;
    });

    return binaryStrings.reduce((acc, val) => acc += val);
}

function polysToBinaryStr(polys) {
    for (let i = 0; i < polys.length; i++) {
        polys[i] = polys[i].map(coe => {
            let str = coe.toString(2);
            while (str.length < config.symbolSize) {
                str = "0" + str;
            }
            return str;
        });
        polys[i] = polys[i].join("");
    };
    return polys.join("");
}
