/**
 * Title: Handle Request Response
 * Descriptions: Handle Request and Response
 * Author: Moidul Hasan Khan
 * Date: 02 February 2022
 */

// Dependencies
const { json } = require("stream/consumers");
const { StringDecoder } = require("string_decoder");
const url = require("url");
const { notFoundHandler } = require("../handlers/routeHandlers/notFoundHandler");
const routes = require("../routes");
const { parseJSON } = require("../helpers/utilities")

// Object Scafolding
handeler = {};

handeler.handleReqRes = (req, res) => {
    // request handling
    // get the url and parse it
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const queryObject = parsedUrl.query;
    const trimedPath = path.replace(/^\/+|\/+$/g, "");
    const method = req.method.toLowerCase();
    const headerObj = req.headers;

    const requestProperty = {
        parsedUrl,
        path,
        trimedPath,
        method,
        queryObject,
        headerObj,
    }

    const chosenHandler = routes[trimedPath] ? routes[trimedPath] : notFoundHandler;

    const decoder = new StringDecoder("utf-8");
    let realData = "";

    req.on("data", (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on("end", () => {
        realData += decoder.end();
        requestProperty.body = parseJSON(realData);


        chosenHandler(requestProperty, (statusCode, payload) => {
            statusCode = typeof(statusCode) === "number" ? statusCode : 500;
            payload = typeof(payload) === "object" ? payload : {};
            const payloadString = JSON.stringify(payload);

            // return the final response 
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
};

module.exports = handeler;