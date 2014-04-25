/**
 * Created with IntelliJ IDEA.
 * User: Percy Zhao
 * Date: 4/1/14
 * Time: 11:33 PM
 * To change this template use File | Settings | File Templates.
 */


var amqp = require('amqp');
var events = require('events');


module.exports = (function(){
    var connection;
    var exchange;
    var isExchangeReady = false;
    var eventEmitter = new events.EventEmitter();


    var publisher = function(){
    };

    publisher.prototype.init = function(exchange_name, type){
        connection = amqp.createConnection({host: 'localhost'});
        connection.on('ready', function(){
            connection.exchange(exchange_name, {type:type?type:'direct'}, function(ex){
                if (isExchangeReady) return;
                isExchangeReady = true;
                exchange = ex;
                console.log('Exchange: ' + exchange.name + ' is open');
                eventEmitter.emit('exchangeReady');
            });

        });
    }

    publisher.prototype.publish = function(routingKey, data){
        if(isExchangeReady)
        {
            //console.log('publish after ready');
            _doPublish(routingKey, data);
        }
        else
        {
            eventEmitter.on('exchangeReady', function(){
                    _doPublish(routingKey, data);
                }
            );
        }
    }

    _doPublish =  function(routingKey, data){
        exchange.publish(routingKey, data);
    }


    return publisher;
})();



