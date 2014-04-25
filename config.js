/**
 * config
 */

var path = require('path');
var winston=require('winston');

exports.config = {
    env: 'dev',
    port: 3000,


    debug: true
};

exports.config.log_setting = {
    transports: [
        new (winston.transports.Console)({level: 'debug'}),  // log all info on console
        new (winston.transports.File)({
            level: 'error',
            filename: './node_web.log',
            timestamp:'true',
            maxsize: 10485760,
            maxFiles: 10 })
    ]}
