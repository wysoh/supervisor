/**
 * Created with IntelliJ IDEA.
 * User: Percy Zhao
 * Date: 5/1/14
 * Time: 12:28 PM
 * To change this template use File | Settings | File Templates.
 */


var trafficControlModel = require('../models/trafficControl');
var _ = require('underscore');
var publisherController = require('./publisher');
var trafficControlData = new trafficControlModel();
var publisher = new publisherController();


module.exports = (function() {
    var trafficControl = function(){};


    trafficControl.prototype.run = function(){

        //consume the update event from the monitor
        eventEmitter.on('update', function(update){
            throttle(update);
        });

        publisher.init('traffic_control_ex', 'topic');


        //consume the control event and publish message to rabbit
        eventEmitter.on('control', function(control){
            //{ sg: 'dsp', si: 'mediav', ratio: 23, qps: 3232 }

            //we only send throttling to server and dispatcher, while for dispatcher the data is for the DSPs. Dispatcher itself will not be
            //controlled by the throttling.

            var routingKey, message;
            switch (control.sg){
                case 'server':
                    routingKey = 'server.' + control.si;
                    message = {serverId: 'all', threshold: control.ratio};
                    break;
                case 'dsp':
                    routingKey = 'dispatcher.all';
                    message = {serverId: control.si, threshold: control.ratio};
                    break;
            }

            if (message){
                publisher.publish(routingKey, trafficControlData.toProto({serverTrafficControlData:[message]}));
            }


        });

    };

    var throttle = function(update){
        var trafficControlData = new trafficControlModel();

        var currentQps = update.QPS.y;
        var currentTimeout = 0;

        if (update.sg == 'dsp'){
            _.each(Object.keys(update), function(v, i){
                if (!_.isNaN(parseInt(v))){
                    currentTimeout += update[v].y;
                }
            })
        }else{
            currentTimeout = update.Timeout.y;
        }

        var targetQps = trafficControlData.getCurrent(update.sg, update.si).targetQps;
        var currentRatio = trafficControlData.getCurrent(update.sg, update.si).ratio;

        //if there's no QPS limit, then we assume the servers can handle currentQps - currentTimeout
        //otherwise will deduct from the target qps

        targetQps = targetQps == 0 ? currentQps - currentTimeout : targetQps - currentTimeout;

        //the ratio is calculated in the way that, when we're trying to throttle it down, we want to pull it down harder than
        //expected, here "expected" means targetQps/CurrentQps.By doing a power, we ensure to react to overwhelming traffic, normally
        //would keep rising after reaching the limit
        var targetRatio = Math.floor(Math.pow(targetQps / currentQps, 2) * 100);


        //the next case is that after previous throttling, the QPS drops quickly and servers are back to normal
        //in this case the current targetRatio could be much higher than previous, an extreme case would be:
        //the last ratio is 80, now is 100. in this case we don't want to jump up and down frequently. Instead,
        //we'd like to approach the target slowly if we are throttling up.
        //we use a heuristic setting that it will take 5 steps to reach the calculated target ratio

        targetRatio = targetRatio > currentRatio ?
            currentRatio + Math.floor((targetRatio - currentRatio) / 5) :
            targetRatio;

        trafficControlData.setRatio(update.sg, update.si, targetRatio, currentQps);

        eventEmitter.emit('control', {sg: update.sg, si: update.si, ts: Math.floor(Date.now()/1000), ratio: targetRatio, qps: currentQps, timeout:currentTimeout});

    }

    return trafficControl;

})();