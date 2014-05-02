/**
 * Created with IntelliJ IDEA.
 * User: Percy Zhao
 * Date: 4/1/14
 * Time: 11:33 PM
 * To change this template use File | Settings | File Templates.
 */


var amqp = require('amqp');
var util = require('util');
var conf = require('../config').config;
var EventEmitter = require('events').EventEmitter;


module.exports = (function(){
    var publisher = function(){
        EventEmitter.call(this);
        this.isReady = false;
    };

    util.inherits(publisher, EventEmitter);


    publisher.prototype.init = function(exchange_name, type){
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
            this.isReady = true;
            logs.debug('Publisher for exchange: ' + self.exchange.name + ' is open.');
        });
    }

    publisher.prototype.publish = function(routingKey, data){
        if(this.isReady)
        {
            this.exchange.publish(routingKey, data);
        }
        else
        {
            this.on('exchangeReady', function(){
                this.exchange.publish(routingKey, data);
            })
        }
    }

    return publisher;
})();



