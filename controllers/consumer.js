/**
 * Created with IntelliJ IDEA.
 * User: Percy Zhao
 * Date: 4/1/14
 * Time: 11:34 PM
 * To change this template use File | Settings | File Templates.
 */

var amqp = require('amqp');
var util = require('util');
var conf = require('../config').config;
var EventEmitter = require('events').EventEmitter;


module.exports = (function(){

    var consumer = function(){
        EventEmitter.call(this);
        //this.isExchangeReady = false;
    };

    util.inherits(consumer, EventEmitter);

    consumer.prototype.init = function(exchange_name, type){

        var self = this;
        self.connection = amqp.createConnection({host: conf.rabbit.host}, null, function(){
            self.emit('connectionReady');
        });

        self.on('connectionReady', function(){
            self.connection.exchange(exchange_name, {type:type?type:'direct'}, function(ex){
                self.emit('exchangeReady', ex);
            })
        });

        self.on('exchangeReady', function(ex){
            self.exchange = ex;
            //self.isExchangeReady = true;
            logs.debug('Consumer for exchange: ' + self.exchange.name + ' is open.');
        })
    }

    consumer.prototype.setupQueue = function(queueName, routingKey, options){
        this.on('exchangeReady', function(){
            this.queue = this.connection.queue(queueName, options);
            this.queue.bind(this.exchange.name, routingKey);
            this.emit('queueReady');
        })
    };

    consumer.prototype.consume = function(callback){
        this.on('queueReady', function(){
            this.queue.subscribe(function(message, headers, deliveryInfo, messageObject){
                callback(message);
            })
        })

    };

    return consumer;


})();
