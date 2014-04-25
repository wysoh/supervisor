/**
 * Created with IntelliJ IDEA.
 * User: Percy Zhao
 * Date: 4/21/14
 * Time: 6:39 PM
 * To change this template use File | Settings | File Templates.
 */


/*
data  = {
    server:
    {server1:
    {qps: [{ts: 123, value: 345}], timeout: []},
        server2:
        {qps: [], timeout: []} },

    dispatcher:
    {dispatcher1:
    {qps: [{ts: 345, value: 456}] } },

    dspclient:
    {winmax:
    {qps:[],
        errors:{"2027":[]}
    }
    }

};

*/

var data = {
    server:{},
    dispatcher: {},
    dspclient: {}

};

var _ = require('underscore');



module.exports = (function(){

    var monitorData = function(){};

    monitorData.prototype.addData = function(tick){
        //data is in raw format after being deserialized
        var ts = new Date(tick.timestamp * 1000);
        //round down to the minute
        ts = ts.getTime() - ts.getSeconds() * 1000;

        var sg = tick.serverGroup,
            si = tick.serverId.split('-')[0];

        var entry;
        if (sg == 'dspclient'){
            _.each(tick.dspMessage, function(v, i){
                entry = initEmptyServerEntry(sg, v.dspId);

                if (_.isEmpty(entry.errors)){
                    entry.errors = {};
                }

                //for dsp client, there's only qps number on the top level, no timeout
                updateValueByTimestamp(entry, "qps", ts, tick.qps);

                //now update the individual error codes
                _.each(v.errorMessage, function(v, i){
                    if(_.isEmpty(entry.errors[v.errorCode.toString()])){
                        entry.errors[v.errorCode.toString()] = [];
                    }

                    updateValueByTimestamp(entry.errors, v.errorCode, ts, v.num);

                });
            });

            var ret = [];
            _.each(tick.dspMessage, function(v, i){
                var dsp = data.dspclient[v.dspId];
                var t = {sg:sg, si: v.dspId, QPS: convertToFEData([dsp.qps[dsp.qps.length-1]])[0]};
                _.each(Object.keys(dsp.errors), function(v, i){
                    t[v] =  convertToFEData([dsp.errors[v][dsp.errors[v].length-1]])[0];
                });
                ret.push(t);
            });

            return ret;

        }else{
            var entry = initEmptyServerEntry(sg, si);

            updateValueByTimestamp(entry, "qps", ts, tick.qps);
            updateValueByTimestamp(entry, "timeout", ts, tick.timeout);

            //for server and dispatcher, always return the last entry for update. it could be new or modified, FE will figure it out
            return [{sg: sg, si:si, QPS: convertToFEData([entry.qps[entry.qps.length-1]])[0],
                Timeout: convertToFEData([entry.timeout[entry.timeout.length-1]])[0]}];
        }

    };

    monitorData.prototype.getHistoryData = function(sg, si){
        //return data in this format so that the frontend can show it in the chart
        //[{key:"APPL", values: [{x:1396948011,y:5}, {x:1396948012, y:5.1}, {x:1396948013, y:5.3}]}]

        var ret = [];
        var raw = data[sg][si];
        if (sg == "dspclient"){
            ret.push({key:"QPS", values: convertToFEData(raw.qps)});
            _.each(Object.keys(raw.errors), function(v, i){
                ret.push({key:v, values: convertToFEData(raw.errors[v])});
            })

        }else{
            ret.push({key:"QPS", values: convertToFEData(raw.qps)});
            ret.push({key:"Timeout", values: convertToFEData(raw.timeout)});
        }

        return ret;

    }


    initEmptyServerEntry = function(sg, server){

        var entry = data[sg][server];

        if (_.isEmpty(entry)){
            entry = {qps:[], timeout:[]}
            data[sg][server] = entry;
        }

        return entry;
    }

    updateValueByTimestamp = function(entry, key, ts, val){
        var item = _.find(entry[key], function(v, i){
            return v.ts == ts;
        });

        if (_.isEmpty(item)){
            entry[key].push({ts: ts, value: val});

            //only keep 200 entries (about 3 hours worth of data). we might consider to persist the historical data into something like mongoDB
            if (entry[key].length > 10){
                entry[key].shift();
            }
        }else{
            item.value += val;
        }



    }

    convertToFEData = function(rawCol){
        //rawCol is in the following format: [{ts:123, value:456}]
        //return to this format: [{x:123, y:456}]

        var ret = [];
        _.each(rawCol, function(v, i){
           ret.push({x: v.ts/1000, y: v.value});
        });

        return ret;

    }

    return monitorData;


})()