/**
 * Title : User Handler
 * Descriptions : Handler to route user related routes
 * Autuor : Moidul Hasan Khan
 * Date : 22/02/2022
 */

// Dependencies
const { hash, parseJSON, createRandomString } = require("../../helpers/utilities");
const data = require("../../lib/data")
const tokenHandler = require('./tokenHandler');
// Module Scafolding
const handler = {};

handler.userHandler = (requestProperty, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperty.method) > -1) {
        handler._users[requestProperty.method](requestProperty, callback);
    } else {
        callback(405, {
            message: `Bad Request type, Request denied.`
        })
    }
};

handler._users = {};

handler._users.post = (requestProperty, callback) => {
    // validate posted data from the users

    // validete first name
    const firstName = typeof(requestProperty.body.firstName) === "string" && requestProperty.body.firstName.trim().length > 0 ? requestProperty.body.firstName : false;

    // validete lastName name
    const lastName = typeof(requestProperty.body.lastName) === "string" && requestProperty.body.lastName.trim().length > 0 ? requestProperty.body.lastName : false;

    // validete phone name
    const phone = typeof(requestProperty.body.phone) === "string" && requestProperty.body.phone.trim().length === 11 ? requestProperty.body.phone : false;

    // validete password
    const password = typeof(requestProperty.body.password) === "string" && requestProperty.body.password.trim().length > 0 ? requestProperty.body.password : false;

    // validete tosAgreement
    const tosAgreement = typeof(requestProperty.body.tosAgreement) === "boolean" ? requestProperty.body.tosAgreement : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure that the user dosn't already exist
        data.read("users", phone, (err, user) => {
            if (err) {
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };

                // store the user to db
                data.create("users", phone, userObject, (message, err) => {
                    if (!err) {
                        callback(200, {
                            message: "User created successfully."
                        })
                    } else {
                        callback(500, {
                            message: "Could Not create user."
                        })
                    }
                })
            } else {
                callback(500, {
                    message: "Phone number already exist, Please try with another phone number.",
                })
            }
        })
    } else {
        callback(400, {
            message: "You have problem with your input.",
        })
    }
}

handler._users.get = (requestProperty, callback) => {
    // validete phone
    const phone = typeof(requestProperty.queryObject.phone) === "string" && requestProperty.queryObject.phone.trim().length === 11 ? requestProperty.queryObject.phone : false;

    if (phone) {
        // verify token
        const token = typeof(requestProperty.headerObj.token) === 'string' ? requestProperty.headerObj.token : false;

        tokenHandler._token.verify(token, phone, (tokenErr) => {
            if (tokenErr) {
                data.read("users", phone, (err, data) => {
                    if (!err && data) {
                        const user = parseJSON(data);
                        delete user.password;
                        callback(200, user);
                    } else {
                        callback(404, {
                            error: "User not found."
                        })
                    }
                });
            } else {
                callback(403, {
                    error: "Authentication Failure!"
                });
            }
        });
    } else {
        callback(404, {
            error: "Request user not found."
        })
    }
};

handler._users.put = (requestProperty, callback) => {

    // validete first name
    const firstName = typeof(requestProperty.body.firstName) === "string" && requestProperty.body.firstName.trim().length > 0 ? requestProperty.body.firstName : false;

    // validete lastName name
    const lastName = typeof(requestProperty.body.lastName) === "string" && requestProperty.body.lastName.trim().length > 0 ? requestProperty.body.lastName : false;

    // validete phone
    const phone = typeof(requestProperty.body.phone) === "string" && requestProperty.body.phone.trim().length === 11 ? requestProperty.body.phone : false;

    // validete password
    const currentPassword = typeof(requestProperty.body.currentPassword) === "string" && requestProperty.body.currentPassword.trim().length > 0 ? requestProperty.body.currentPassword : false;

    // validete password
    const newPassword = typeof(requestProperty.body.newPassword) === "string" && requestProperty.body.newPassword.trim().length > 0 ? requestProperty.body.newPassword : false;

    if (phone && (firstName || lastName || (newPassword && currentPassword))) {

        // verify token
        const token = typeof(requestProperty.headerObj.token) === 'string' ? requestProperty.headerObj.token : false;

        tokenHandler._token.verify(token, phone, (tokenErr) => {
            if (tokenErr) {
                data.read("users", phone, (err, userData) => {
                    if (!err) {
                        const user = parseJSON(userData);
                        // update data to user object if requested to update
                        if (firstName) {
                            user.firstName = firstName;
                        }

                        if (lastName) {
                            user.lastName = lastName;
                        }

                        if (newPassword) {
                            user.password = hash(newPassword);
                        }

                        data.update("users", phone, user, (Message, err) => {
                            if (!err) {
                                callback(200, {
                                    message: Message
                                })
                            } else {
                                callback(400, {
                                    error: Message
                                });
                            }
                        })
                    } else {
                        callback(404, {
                            error: "User not found."
                        })
                    }
                });
            } else {
                callback(403, {
                    error: "Authentication Failure!"
                });
            }
        });
    } else {
        callback(404, {
            error: "Could not update data, please provide valid data."
        })
    }
}

handler._users.delete = (requestProperty, callback) => {
    // validete phone
    const phone = typeof(requestProperty.body.phone) === "string" && requestProperty.body.phone.trim().length === 11 ? requestProperty.body.phone : false;

    if (phone) {
        // verify token
        const token = typeof(requestProperty.headerObj.token) === 'string' ? requestProperty.headerObj.token : false;

        tokenHandler._token.verify(token, phone, (tokenErr) => {
            if (tokenErr) {
                data.read("users", phone, (err, userData) => {
                    if (!err) {
                        const user = parseJSON(userData);

                        data.delete("users", phone, (err) => {
                            if (!err) {
                                callback(200, {
                                    message: "User Deleted Successfully"
                                });
                            } else {
                                callback(400, {
                                    message: "User could not deleted."
                                });
                            }
                        });
                    } else {
                        callback(404, {
                            error: "User dosen't exist."
                        });
                    }
                });
            } else {
                callback(403, {
                    error: "Authentication Failure!"
                });
            }
        });
    } else {
        callback(404, {
            error: "Could not update data, please provide valid phone number."
        });
    }
}

module.exports = handler;