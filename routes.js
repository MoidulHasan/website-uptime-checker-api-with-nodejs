/**
 * Title : Routes
 * Descriptions : Applications Route
 * Author : Moidul Hasan Khan
 * Date : 05/02/2022
 */

// Dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandlers');

const routes = {
    sample: sampleHandler,
}


module.exports = routes;