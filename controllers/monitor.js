/**
 * Created with IntelliJ IDEA.
 * User: Percy Zhao
 * Date: 4/20/14
 * Time: 2:51 AM
 * To change this template use File | Settings | File Templates.
 */


var consumer = require('../controllers/consumer');
var dataReport = require('../models/dataReport');
var serverNodes = require('../models/serverNodes');
var monitorModel = require('../models/monitor');
var trafficControlModel = require('../models/trafficControl');
var _ = require('underscore');

module.exports = (function(){
    var monitor = function(){};


    monitor.prototype.run = function(){
        var c = new consumer();
        var report = new dataReport();
        var nodes = new serverNodes();
        var monitorModelData = new monitorModel();

        c.init('monitor_ex');
        c.setupQueue('monitor', '',{autoDelete:false});

        c.consume(function(message){
            var data = report.fromProto(message.data);
            nodes.addNode(data);

            //returns the current data
            var update = monitorModelData.addData(data);

            _.each(update, function(v, i){
                eventEmitter.emit('update', v);
            });
        });
    };



    return monitor;

})();
