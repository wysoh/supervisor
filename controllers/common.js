/**
 * Created with IntelliJ IDEA.
 * User: Percy Zhao
 * Date: 3/28/14
 * Time: 4:20 AM
 * To change this template use File | Settings | File Templates.
 */


var models = require("../models");
var VX = require("../framework/vx");
var JsonResultSuccess = models.JsonResultSuccess;
var JsonResultFailure = models.JsonResultFailure;
var serverNodes = require('../models/serverNodes');
var monitorData = require('../models/monitorData');


exports.pages = {
       home: function(req, res, next){
            res.render_tpl("index", {title: "my home page"});
       }
}

exports.apis = {
    getServerNodes: function(req, res, next){
        res.json_success((new serverNodes()).getAllNodes());

    },

    getHistoryDataByNode: function(req, res, next){
        res.json_success((new monitorData()).getHistoryData(req.body.sg, req.body.si));

    }




}