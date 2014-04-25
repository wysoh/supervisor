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
var monitorData = require('../models/monitorData');
var _ = require('underscore');

module.exports = (function(){
    var monitor = function(){};


    monitor.prototype.run = function(){
        var c = new consumer();
        var report = new dataReport();
        var nodes = new serverNodes();
        var monitor = new monitorData();


        c.init('monitor_ex');
        c.setupQueue('monitor', '',{autoDelete:false});

        c.consume(function(message){
            var data = report.fromProto(message.data);
            nodes.addNode(data);
            var update = monitor.addData(data);


            _.each(update, function(v, i){
                rabbitEventEmitter.emit('update', v);
            });


            //console.log('received: ' + JSON.stringify(report.fromProto(message.data)));
        });

    }


    return monitor;

})();
