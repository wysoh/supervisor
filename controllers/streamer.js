/**
 * Created with IntelliJ IDEA.
 * User: Percy Zhao
 * Date: 5/1/14
 * Time: 3:23 PM
 * To change this template use File | Settings | File Templates.
 */

var _ = require('underscore');

module.exports = (function(){
    var streamer = function(){};

    streamer.prototype.run = function(io){
        io.sockets.on('connection', function(socket){
            eventEmitter.on('update', function(data){
                socket.emit("update", data);
            });

            eventEmitter.on('control', function(data){
                socket.emit('control', data);
            })
            //socket.emit('report', {hello: 'world'});
            /*
             socket.on('my other event', function(data){
             console.log(data);
             });
             */
        });
    };



    return streamer;

})();