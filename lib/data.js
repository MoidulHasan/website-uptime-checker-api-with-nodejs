/**
 * Title: Environments
 * Descriptions: hanle all environment related things
 * Author: Moidul Hasan Khan
 * Date: 22 February 2022
 */

// Dependancies
const fs = require('fs');
const path = require('path');

// App scafolding 
const lib = {};

// base directory of data folder
lib.basedir = path.join(__dirname, '/../.data/');

// write data to file 
lib.create = function(dir, file, data, callback) {
    fs.open(lib.basedir + dir + "/" + file + ".json", "wx", function(openErr, fileDescriptor) {
        if (!openErr && fileDescriptor) {
            // convert data to string 
            const stringData = JSON.stringify(data);

            // Write data to file and close it
            fs.writeFile(fileDescriptor, stringData, function(writeErr) {
                if (!writeErr) {
                    fs.close(fileDescriptor, function(closingErr) {
                        if (!closingErr) {
                            callback("File Written Successfully!", false);
                        } else {
                            callback("Error Closing File", closingErr);
                        }
                    })
                } else {
                    callback("Could Not Write File", writeErr);
                }

            })
        } else {
            callback("Could not create file, it may already exist!", openErr);
        }
    })
}
module.exports = lib;