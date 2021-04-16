import fs from 'fs';
export { config, binaryToPolys, strToBinaryStr, polysToBinaryStr, binaryToStr, strToPolys, polysToStr };

//Table of numerical values of field generator values, first index is for galois field GF(2^2)
const fieldGenerator = [7, 11, 19, 37, 67, 131, 333];
const projectRoot = process.cwd();
let config = parseConfig()

function parseConfig() {
    const configFile = fs.readFileSync(projectRoot + "/config.json");
    let config = JSON.parse(configFile);

    //Automatic field generator setup based on symbol size
    if (config.symbolSize < 2 || config.symbolSize > 8) {
        console.log(`Symbol size ${config.symbolSize} not supported, reverting to default symbol size 4`);
        config.symbolSize = 4;
    }
    config.fieldGenerator = fieldGenerator[config.symbolSize - 2];

    return config;
}

/**
 * @param {string} data Binary data string that gets converted to message polynomiums
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

    //padding of leftover message
    if (coefficients.length > 0) {
        while (coefficients.length < size) {
            coefficients.push(0);
        }
        polynomials.push(coefficients);
    }

    return polynomials;
}

/**
 * Converts an array of polynomial messages into a single binary string
 * @param {number[]} polys Array containin polynomial messages
 * @returns A binary string representation of the polynomials
 */
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

/**
 * Turn a text-string into a a string of binary data
 * @param {string} string to be converted to binary data
 * @returns {string} A binary string representation of the parameter string
 */
function strToBinaryStr(str) {
    let charCodes = [];

    for (let i = 0; i < str.length; i++) {
        charCodes[i] = str.charCodeAt(i);
    };

    let binaryStrings = charCodes.map(charCode => charCode.toString(2));
    binaryStrings = binaryStrings.map(charCode => {
        while (charCode.length < config.encoding) {
            charCode = "0" + charCode;
        }
        return charCode;
    });

    return binaryStrings.reduce((acc, val) => acc += val);
}

/**
 * Encodes a binary string into a text-string
 * @param {string} binary to be converted to text-encoded string
 * @returns {string} A text-string encoded from the parameter binary string
 */
function binaryToStr(binary) {
    let str = "";

    for (let i = 0; i < binary.length; i += config.encoding) {
        let charCode = parseInt(binary.slice(i, i + config.encoding), 2);
        //console.log(`code: ${charCode} \t char: ${String.fromCharCode(charCode)}`);
        if (charCode != 0) {
            str += String.fromCharCode(charCode);
        }
    }

    return str;
}

/**
 * Converts a text string into array of polynomials
 * @param {string} str 
 * @returns Array of polynomials
 */
function strToPolys(str) {
    let binary = strToBinaryStr(str);
    return binaryToPolys(binary, config.messageSize);
}

/**
 * Converts array of polynomials into text string
 * @param {number[]} polys 
 * @returns Text string from polynomials
 */
function polysToStr(polys) {
    let binary = polysToBinaryStr(polys);
    return binaryToStr(binary);
}