/**
 * Created with IntelliJ IDEA.
 * User: Percy Zhao
 * Date: 4/7/14
 * Time: 3:14 AM
 * To change this template use File | Settings | File Templates.
 */

var publisher = require('./publisher');
var dataReport = require('../models/dataReport');

module.exports = (function(){
    var simulator = function(){

    };

    simulator.prototype.run = function(){
        var report = new dataReport();

        var pub = new publisher();
        pub.init('monitor_ex');

        doRun(pub, report);

    };


    doRun = function(pub, report){
        setTimeout(function(){
                pub.publish("", report.toProto(report.getSample()));
                doRun(pub, report);
            },
            2000);
    }

    return simulator;

})()