/**
 * config
 */

var path = require('path');
var winston=require('winston');

exports.config = {
    env: 'prod',
    port: 3000,
    debug: true,
    rabbit: {host: '10.27.5.61'}
    //rabbit: {host: 'localhost'}
};

exports.config.log_setting = {
    transports: [
        new (winston.transports.Console)({level: 'info'}),  // log all info on console
        new (winston.transports.File)({
            level: 'error',
            filename: './node_web.log',
            timestamp:'true',
            maxsize: 10485760,
            maxFiles: 10 })
    ]}
