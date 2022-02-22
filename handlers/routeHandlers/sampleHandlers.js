/**
 * Title : Samaple Handler
 * Descriptions : Sample Handler
 * Autuor : Moidul Hasan Khan
 * Date : 05/02/2022
 */

// Module Scafolding
const handler = {};

handler.sampleHandler = (requestProperty, callback) => {
    callback(200, {
        message: "This is a sample page",
    });
};

module.exports = handler;