/**
 * Created with IntelliJ IDEA.
 * User: Percy Zhao
 * Date: 4/1/14
 * Time: 11:34 PM
 * To change this template use File | Settings | File Templates.
 */

var amqp = require('amqp');
var events = require('events');


module.exports = (function(){
    var connection;
    var exchange;
    var isExchangeReady = false;
    var eventEmitter = new events.EventEmitter();
    var queue;

    var consumer = function(){

    };

    consumer.prototype.init = function(exchange_name, type){
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


    consumer.prototype.setupQueue = function(queueName, routingKey, options){
        eventEmitter.on('exchangeReady', function(){
            queue = connection.queue(queueName, options);
            queue.bind(exchange.name, routingKey);
            eventEmitter.emit('queueReady');

        })
    };


    consumer.prototype.consume = function(callback){
        if(queue){
            _doConsume(callback);
        }
        else{
            eventEmitter.on('queueReady', function(){
                _doConsume(callback);
            })

        }
    };

    _doConsume = function(callback){
        queue.subscribe(function(message, headers, deliveryInfo, messageObject){
            callback(message);
        })

    };


    return consumer;


})();
