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
lib.create = (dir, file, data, callback) => {
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

// Read data form file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf-8', (err, data) => {
        callback(err, data);
    });
};

lib.update = (dir, file, data, callback) => {
    // Open file
    fs.open(lib.basedir + dir + "/" + file + ".json", "r+", (openErr, fileDescriptor) => {
        if (!openErr && fileDescriptor) {
            fs.ftruncate(fileDescriptor, (truncateErr) => {
                if (!truncateErr) {
                    // Convert the data to string
                    const stringData = JSON.stringify(data);


                    // write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (writeErr) => {
                        if (!writeErr) {
                            // close the file
                            fs.close(fileDescriptor, (closingErr) => {
                                if (!closingErr) {
                                    callback("Successfully Updated!", closingErr)
                                } else {
                                    callback("Error on closing the file", closingErr);
                                }
                            })
                        } else {
                            callback("Error on writing data to file", writeErr);
                        }
                    })
                } else {
                    callback("Error on truncateing file", truncateErr);
                }
            })
        } else {
            callback("Error opening file!", openErr)
        }
    })
};

lib.delete = (dir, file, callback) => {
    fs.unlink(lib.basedir + dir + "/" + file + ".json", (unlinkErr) => {
        if (!unlinkErr) {
            callback(unlinkErr);
        } else {
            callback(unlinkErr);
        }
    })
}
module.exports = lib;