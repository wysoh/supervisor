/**
 * Created with IntelliJ IDEA.
 * User: Percy Zhao
 * Date: 4/25/14
 * Time: 2:47 PM
 * To change this template use File | Settings | File Templates.
 */

var winston=require('winston');
var conf = require('../config').config;

var logger = new (winston.Logger)(conf.log_setting);
exports.logger=logger;

