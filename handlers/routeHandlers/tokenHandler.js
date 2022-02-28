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

// read token data by get request
handler._token.get = (requestProperty, callback) => {
    // validate token id
    const tokenId = typeof(requestProperty.queryObject.id) === "string" && requestProperty.queryObject.id.trim().length === 20 ? requestProperty.queryObject.id : false;

    if (tokenId) {
        // lookup the token
        data.read("tokens", tokenId, (err, tokenData) => {
            const token = parseJSON(tokenData);
            if (!err && token) {
                callback(200, token);
            } else {
                callback(404, {
                    error: "Requested user not found.",
                });
            }
        });
    } else {
        callback(404, {
            error: "Requested user not found."
        });
    }
};

// update token data by put request
handler._token.put = (requestProperty, callback) => {
    // validate token id
    const tokenId = typeof(requestProperty.body.id) === "string" && requestProperty.body.id.trim().length === 20 ? requestProperty.body.id : false;

    // validate extand request
    const extand = typeof(requestProperty.body.extand) === "boolean" && requestProperty.body.extand == true ? true : false;

    if (tokenId && extand) {
        // lookup token data
        data.read("tokens", tokenId, (err, tokenData) => {
            if (!err) {
                const tokenObject = parseJSON(tokenData);
                if (tokenObject.expires > Date.now()) {
                    tokenObject.expires = Date.now() + 60 * 60 * 1000;
                    data.update("tokens", tokenId, tokenObject, (errMessage, err) => {
                        if (!err) {
                            callback(200, {
                                message: "Token extandate successfully."
                            })
                        } else {
                            callback(500, {
                                error: "Could not update token, there is a problem in server side.",
                            })
                        }
                    });
                } else {
                    callback(400, {
                        error: "Token already expires.",
                    });
                }
            } else {
                callback(400, {
                    error: "There was a problem with your request."
                });
            }
        });
    } else {
        callback(400, {
            error: "There was a problem with your request."
        });
    }
};

// delete token handler
handler._token.delete = (requestProperty, callback) => {
    // validate token id
    const id = typeof(requestProperty.queryObject.id) === "string" && requestProperty.queryObject.id.trim().length === 20 ? requestProperty.queryObject.id : false;

    // lookup token data
    data.read("tokens", id, (err) => {
        if (!err) {
            data.delete("tokens", id, (err) => {
                if (!err) {
                    callback(200, {
                        message: "Token deleted succesfully."
                    });
                } else {
                    callback(500, {
                        error: "There was a server site error."
                    });
                }
            })
        } else {
            callback(400, {
                error: "You have problem with your request."
            });
        }
    });

};

handler._token.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, tokenData) => {
        if (!err) {
            const tokenObj = parseJSON(tokenData);
            if (tokenObj.phone === phone && tokenObj.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

module.exports = handler;