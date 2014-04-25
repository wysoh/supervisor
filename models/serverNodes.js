/**
 * Created with IntelliJ IDEA.
 * User: Percy Zhao
 * Date: 4/21/14
 * Time: 5:59 AM
 * To change this template use File | Settings | File Templates.
 */


var nodes = {};
var _ = require('underscore');

module.exports= (function(){
    var serverNodes = function (){
    };

    serverNodes.prototype.addNode = function(data){

        var group = data.serverGroup;
        var node = data.serverId;

        if (_.isEmpty(nodes[group])){
            nodes[group] = [];
        }

        if (group == 'dspclient'){
            _.each(data.dspMessage, function(v, i){
                var server = v.dspId;
                if (!_.contains(nodes[group], server)) {
                    nodes[group].push(server);
                }
            });

        }else{
            var server = node.split('-')[0];
            if (!_.contains(nodes[group], server)) {
                nodes[group].push(server);
            }

        }



    };

    serverNodes.prototype.getAllNodes = function(){
        return nodes;


    };



    serverNodes.prototype.getGroups = function() {
        return Object.keys(nodes);

    }

    serverNodes.prototype.getNodesByGroup = function(group){

        return nodes.group;
    };



    return serverNodes;

})()