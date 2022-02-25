/**
 * Title: Utilities
 * Descriptions: Necesary utitlities that will help on diffrent work
 * Author: Moidul Hasan Khan
 * Date: 25 February 2022
 */

// Dependencies 
const cripto = require("crypto");
const envireonemets = require("./environment");

// Module scafolding
const Utilities = {};

// Parse json string to object
Utilities.parseJSON = (jsonString) => {
    let output;

    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }

    return output;
};


// Hassh string 
Utilities.hash = (string) => {
    if (typeof(string) === "string" && string.length > 0) {
        const hash = cripto.createHmac('sha256', envireonemets.secrateKey).update(string).digest("hex");
        return hash;
    }
    return false;
}

// Export module
module.exports = Utilities;