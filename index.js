/**
 * Title: Web site uptime checker api using nodejs
 * Descriptions: A RESTfull API for checking user defined URL is up or down
 * Author: Moidul Hasan Khan
 * Date: 02 February 2022
 */

// Dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handlereqres");
const environment = require("./helpers/environment");
const data = require("./lib/data")
    // App object - module scafolding
const app = {};

// write test data
data.create('test', 'newFile', { "Name": "Moidul Hasan Khan" }, (errMessage, err) => {
    console.log(errMessage, err);
})


// Create Server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`Listening on ${environment.port}`);
    });
};

// Handle request response
app.handleReqRes = handleReqRes;
// Start the server
app.createServer();