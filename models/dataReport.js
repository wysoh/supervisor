/**
 * Created with IntelliJ IDEA.
 * User: Percy Zhao
 * Date: 4/7/14
 * Time: 3:15 AM
 * To change this template use File | Settings | File Templates.
 */

var fs = require('fs');
var path = require('path');

var Schema = require('protobuf').Schema;
var schema = new Schema(fs.readFileSync(path.join(__dirname, '../proto/data_report.desc')));
var serializer = schema['report_t'];

module.exports = (function(){


    var dataReport = function(){
    };

    dataReport.prototype.fromProto = function(proto){
        return serializer.parse(proto);

    };

    dataReport.prototype.toProto = function(data){
        return serializer.serialize(data);
    };

    dataReport.prototype.getSample = function(){
        var serverGroups = ['server', 'dispatcher', 'dspclient'];
        var dsps = ['winmax', 'mediav', 'hdt', 'wisemedia'];

        var sg = serverGroups[Math.floor(Math.random() * 100) % 3];
        var si = sg + Math.floor(Math.random() * 5) + "-" + Math.floor(Math.random() * 5);
        var dsp = dsps[Math.floor(Math.random() * 100) % 4];

        var sample =
        {
            timestamp: Math.floor(Date.now()/1000),
            serverGroup: sg,
            serverId: si,
            qps: Math.floor(3000 + Math.random()* 2000),
            timeout: Math.floor(1000 + Math.random() * 1000),
            dspMessage: [
                {dspId: dsp,
                    qps: Math.floor(Math.random()* 5000),
                    errorMessage:[
                        {errorCode: 2027, num:234},
                        {errorCode: 2021, num: 456}
                    ]
                },
                {dspId: dsps[Math.floor(Math.random() * 100) % 4],
                    qps: Math.floor(Math.random()* 5000),
                    errorMessage:[
                        {errorCode: 2027, num:234},
                        {errorCode: 2021, num: 456}
                    ]
                }
            ]
        }

        return sample;
    };

    return dataReport;

})();
