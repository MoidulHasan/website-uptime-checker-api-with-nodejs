/**
 * Title : Samaple Handler
 * Descriptions : Sample Handler
 * Autuor : Moidul Hasan Khan
 * Date : 05/02/2022
 */

// Module Scafolding
const handler = {};

handler.notFoundHandler = (requestProperty, callback) => {
    callback(404, {
        message: "Page Not Found",
    });
}

module.exports = handler;