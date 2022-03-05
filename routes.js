/**
 * Title : Routes
 * Descriptions : Applications Route
 * Author : Moidul Hasan Khan
 * Date : 05/02/2022
 */

// Dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandlers');
const { userHandler } = require('./handlers/routeHandlers/userHandler');
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');
const { checkHandler } = require('./handlers/routeHandlers/checkshandler');


const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
    checks: checkHandler,
}


module.exports = routes;