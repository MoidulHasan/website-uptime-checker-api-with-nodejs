/**
 * Title : User Handler
 * Descriptions : Handler to route user related routes
 * Autuor : Moidul Hasan Khan
 * Date : 22/02/2022
 */

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
    callback(requestProperty);
}

handler._users.get = (requestProperty, callback) => {
    callback(200, { message: requestProperty });
};

handler._users.put = (requestProperty, callback) => {

}

handler._users.delete = (requestProperty, callback) => {

}
module.exports = handler;