/**
 * Title : User Handler
 * Descriptions : Handler to route user related routes
 * Autuor : Moidul Hasan Khan
 * Date : 22/02/2022
 */

// Dependencies
const { hash } = require("../../helpers/utilities");
const data = require("../../lib/data")

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

    // validete second name
    const lastName = typeof(requestProperty.body.lastName) === "string" && requestProperty.body.lastName.trim().length > 0 ? requestProperty.body.lastName : false;

    // validete second name
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
        // console.log(requestProperty.body);
        callback(400, {
            message: "You have problem with your input.",
        })
    }
}

handler._users.get = (requestProperty, callback) => {
    callback(200, { message: requestProperty });
};

handler._users.put = (requestProperty, callback) => {

}

handler._users.delete = (requestProperty, callback) => {

}
module.exports = handler;