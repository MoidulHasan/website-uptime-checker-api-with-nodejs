/**
 * Title : Token Handler
 * Descriptions : Handler to route token related routes
 * Autuor : Moidul Hasan Khan
 * Date : 26/02/2022
 */

// Dependencies
const { hash, parseJSON, createRandomString } = require("../../helpers/utilities");
const data = require("../../lib/data")

// Module Scafolding
const handler = {};

handler.tokenHandler = (requestProperty, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperty.method) > -1) {
        handler._token[requestProperty.method](requestProperty, callback);
    } else {
        callback(405, {
            message: `Bad Request type, Request denied.`
        })
    }
};


handler._token = {};

// create token on post request
handler._token.post = (requestProperty, callback) => {
    // validete phone name
    const phone = typeof(requestProperty.body.phone) === "string" && requestProperty.body.phone.trim().length === 11 ? requestProperty.body.phone : false;

    // validete password
    const password = typeof(requestProperty.body.password) === "string" && requestProperty.body.password.trim().length > 0 ? requestProperty.body.password : false;

    if (phone && password) {
        data.read("users", phone, (err, userData) => {
            const user = parseJSON(userData);
            if (!err) {
                let hashPassword = hash(password);
                if (hashPassword === user.password) {
                    const tokenId = createRandomString(20);
                    const expires = Date.now() + 60 * 60 * 2000;
                    const tokenObject = {
                        "id": tokenId,
                        expires,
                        phone
                    }

                    // write token to file
                    data.create("tokens", tokenId, tokenObject, (errMessage, err) => {
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {
                                error: "Server error, please try again latter.",
                            })
                        }
                    });

                } else {
                    callback(400, {
                        error: "Password is not valid!",
                    });
                }
            } else {
                callback(400, {
                    error: "You have problem with request."
                })
            }
        });
    } else {
        callback(404, {
            error: "Invalid Input."
        })
    }

};

handler._token.get = () => {

};


handler._token.put = () => {

};


handler._token.delete = () => {

};

module.exports = handler;