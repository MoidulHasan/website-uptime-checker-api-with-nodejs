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

// Create random string by length 
Utilities.createRandomString = (stringLength) => {
    // validate string length
    const length = typeof(stringLength) === "number" && stringLength > 0 ? stringLength : false;
    const string = "abcdefghijklmnopqrstuvxyz1234456789";
    let randomString = "";

    for (let i = 1; i <= length; i++) {
        const randomIndex = Math.floor(Math.random() * string.length);
        randomString += string.charAt(randomIndex);
    }

    return randomString;
};

// Export module
module.exports = Utilities;