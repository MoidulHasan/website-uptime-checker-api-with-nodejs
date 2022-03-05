/**
 * Title: Checks
 * Descriptions: Handler to hadle user defined checks
 * Author: Moidul Hasan Khan
 * Date: 28 February 2022
 */

// Dependencies
const { tokenHandler } = require('./tokenHandler');
const data = require('../../lib/data');
const { parseJSON, createRandomString } = require('../../helpers/utilities');
const { maxChecks } = require('../../helpers/environment');

// Module Scafolding
const handler = {};

handler.checkHandler = (requestPropoerty, callback) => {
    const acceptMethods = ['post', 'get', 'put', 'delete'];
    if (acceptMethods.indexOf(requestPropoerty.method) > -1) {
        handler._checks[requestPropoerty.method](requestPropoerty, callback);
    } else {
        callback(405, {
            error: "You have error on your request"
        });
    }
};


handler._checks = {};

handler._checks.post = (requestProperty, callback) => {
    // validate inpute

    // verify protocol
    const protocol = typeof(requestProperty.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperty.body.protocol) > -1 ? requestProperty.body.protocol : false;
    // verify url
    const url = typeof(requestProperty.body.url) === 'string' && requestProperty.body.url.trim().length > 0 ? requestProperty.body.url : false;
    // verify method
    const method = typeof(requestProperty.body.method) === 'string' && ['get', 'post', 'put', 'delete'].indexOf(requestProperty.body.method) > -1 ? requestProperty.body.method : false;
    // verify success codes
    const successCode = typeof(requestProperty.body.successCode) === 'object' && requestProperty.body.successCode instanceof Array ? requestProperty.body.successCode : false;
    // verify waiting time
    const waitingTime = typeof(requestProperty.body.waitingTime) === 'number' && requestProperty.body.waitingTime % 1 === 0 && requestProperty.body.waitingTime >= 1 && requestProperty.body.waitingTime <= 5 ? requestProperty.body.waitingTime : false;
    // verify token
    const token = typeof(requestProperty.headerObj.token) === 'string' ? requestProperty.headerObj.token : false;

    // lookup the token
    data.read('tokens', token, (tokenErr, tokenData) => {
        if (!tokenErr && tokenData) {
            const tokenObj = parseJSON(tokenData);

            // lookup the phone associate to this token
            const phone = tokenObj.phone;
            data.read('users', phone, (userErr, userData) => {
                if (!userErr && userData) {
                    tokenHandler._token.verify(token, phone, (isTokenValid) => {
                        if (isTokenValid) {
                            let userObj = parseJSON(userData);
                            let userChecks = typeof(userObj.checks) === 'object' && userObj.checks instanceof Array ? userObj.checks : [];
                            if (userChecks.length < maxChecks) {
                                const checkId = createRandomString(20);
                                const checkObj = {
                                    id: checkId,
                                    userPhone: phone,
                                    protocol,
                                    url,
                                    method,
                                    successCode,
                                    waitingTime,
                                };
                                data.create('checks', checkId, checkObj, (errorMessage, error) => {
                                    if (!error) {
                                        // Add check id to the users object
                                        userObj.checks = userChecks;
                                        userObj.checks.push(checkId);

                                        // update the user data
                                        data.update('users', phone, userObj, (errMessage, err) => {
                                            if (!err) {
                                                callback(200, checkObj);
                                            } else {
                                                callback(500, {
                                                    errorL: "There is a server side error."
                                                });
                                            }
                                        });
                                    } else {
                                        callback(500, {
                                            error: "There is a server side error."
                                        })
                                    }
                                });
                            } else {
                                callback(401, {
                                    error: "User already reached max checks limit!"
                                })
                            }
                        } else {
                            callback(403, {
                                error: 'Authentication problem!'
                            });
                        }
                    });
                } else {
                    callback(403, {
                        error: "User not found!"
                    })
                }
            });
        } else {
            callback(403, {
                error: 'Authentication problem!'
            });
        }
    });
};

handler._checks.get = (requestProperty, callback) => {
    callback(200, requestProperty);
};

handler._checks.put = (requestProperty, callback) => {
    callback(200, requestProperty);
};

handler._checks.delete = (requestProperty, callback) => {
    callback(200, requestProperty);
};



module.exports = handler;