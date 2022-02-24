/**
 * Title: Utilities
 * Descriptions: Necesary utitlities that will help on diffrent work
 * Author: Moidul Hasan Khan
 * Date: 25 February 2022
 */

// Dependencies 

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


// Export module
module.exports = Utilities;