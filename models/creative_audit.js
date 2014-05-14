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
var schema = new Schema(fs.readFileSync(path.join(__dirname, '../proto/creative_audit.desc')));
var serializer = schema['ui_audit_t'];

module.exports = (function(){


    var creative_audit = function(){
    };

    creative_audit.prototype.fromProto = function(proto){
        try{
            return serializer.parse(proto);
        }catch(ex){
            logs.error('Parse creative audit PB failed: ' + JSON.stringify(ex));
            throw(ex);
        }

    };

    creative_audit.prototype.toProto = function(data){
        return serializer.serialize(data);
    };


    return creative_audit;

})();
