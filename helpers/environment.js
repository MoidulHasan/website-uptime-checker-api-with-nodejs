/**
 * Title: Environments
 * Descriptions: hanle all environment related things
 * Author: Moidul Hasan Khan
 * Date: 22 February 2022
 */

// Dependencies 

// Module scafolding
const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secrateKey: "ujsdfhuihsdfsdf",
    maxChecks: 5,
};

environments.production = {
    port: 5000,
    envName: 'production',
    secrateKey: "hyguyshdfgfuysdfaf",
    maxChecks: 5,
};

// Determine which environment was passed
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';


// Export coresponding environment object
const environmentToExport = typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.staging;

// Export module
module.exports = environmentToExport;