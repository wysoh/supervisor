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
var monitorModel = require('../models/monitor');
var trafficControlModel = require('../models/trafficControl');


exports.pages = {
       home: function(req, res, next){
            res.render_tpl("index", {title: "mediamax supervisor"});
       }
}

exports.apis = {
    getServerNodes: function(req, res, next){
        res.json_success((new serverNodes()).getAllNodes());

    },

    getHistoryDataByNode: function(req, res, next){
        var monitorHistory =(new monitorModel()).getHistoryData(req.body.sg, req.body.si);
        var currentTrafficControl = (new trafficControlModel()).getCurrent(req.body.sg, req.body.si);
        res.json_success({monitor: monitorHistory, control: currentTrafficControl});

    },

    setTargetQps: function(req, res, next){
        res.json_success((new trafficControlModel().setTargetQps(req.body.sg, req.body.si, parseInt(req.body.qps))));
    }




}