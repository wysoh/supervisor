/**
 * Created with IntelliJ IDEA.
 * User: Percy Zhao
 * Date: 4/7/14
 * Time: 3:15 AM
 * To change this template use File | Settings | File Templates.
 */


/*
 data  = {
 server:
    {server1: [{ts: 123, value: 345}]},
 },

 dispatcher: {}

 };
 */

var _ = require('underscore');

var fs = require('fs');
var path = require('path');

var Schema = require('protobuf').Schema;
var schema = new Schema(fs.readFileSync(path.join(__dirname, '../proto/traffic_control.desc')));
var serializer = schema['traffic_control_data_t'];

var data = {
    server:{}, //{ts, ratio, type(auto/manual), current qps}
    dispatcher: {},
    dsp: {}
};

module.exports = (function(){
    var trafficControl = function(){};

    trafficControl.prototype.setRatio = function(sg, si, ratio, currentQps){
        var entry = this.initServerInstance(sg, si);

        entry.current.ts = Math.floor(Date.now()/1000);
        entry.current.ratio = ratio;
        entry.current.qps = currentQps;

        data[sg][si].history.push(entry.current);
        if (data[sg][si].length > 300){
            data[sg][si].shift();
        }
    };

    trafficControl.prototype.setTargetQps = function(sg, si, targetQps){
        this.initServerInstance(sg, si).current.targetQps = targetQps;
    };

    trafficControl.prototype.getCurrent = function(sg, si){
        return this.initServerInstance(sg, si).current;
    };

    trafficControl.prototype.getHistory = function (sg, si){
        return _.isEmpty(data[sg][si]) ? [] : data[sg][si].history;
    };

    trafficControl.prototype.initServerInstance = function (sg, si){
        if (_.isEmpty(data[sg][si])){
            data[sg][si]= {current:{targetQps: 0, ratio: 100}, history:[]};
        }

        return data[sg][si];
    };


    trafficControl.prototype.fromProto = function(proto){
        return serializer.parse(proto);

    };

    trafficControl.prototype.toProto = function(data){
        return serializer.serialize(data);
    };


    return trafficControl;

})();


