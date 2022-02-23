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
const data = require("./lib/data");
// App object - module scafolding
const app = {};

// write data in file
// data.create('test', 'newFile', { "Name": "Moidul Hasan Khan" }, (errMessage, err) => {
//     console.log(errMessage, err);
// })

// read data from file
// data.read('test', 'newFile', (err, data) => {
//     console.log(err, data);
// })

// update data
// data.update('test', 'newFile', { "Name": "Antu" }, (errMessage, err) => {
//     console.log(errMessage, err);
// })

// read data from file
// data.read('test', 'newFile', (err, data) => {
//     console.log(err, data);
// })

// delete file
// data.delete('test', 'newFile', (message, err) => {
//     console.log(message, err);
// })

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