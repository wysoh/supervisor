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

        /*
        self.connection = amqp.createConnection({host: conf.rabbit.host}, null, function(){
            self.emit('connectionReady');
        });
        */

        self.connection = amqp.createConnection({host: conf.rabbit.host});

        self.connection.on('error', function(ex){
            console.log(ex);
        });


        self.connection.on('ready', function(){
            //logs.debug('connection ready');
            self.isReady = false;
            self.emit('connectionReady');

        });

        self.on('connectionReady', function(){
            self.isReady = false;

            self.connection.exchange(exchange_name, {type:type?type:'direct', autoDelete:false, noDeclare:true}, function(ex){
                self.emit('exchangeReady', ex);
            })
        });

        self.on('exchangeReady', function(ex){
            if (this.isReady){
                return;
            }
            self.exchange = ex;
            self.isReady = true;
            logs.debug('Publisher for exchange: ' + self.exchange.name + ' is open.');
        });
    }

    publisher.prototype.publish = function(routingKey, data){
        if(this.isReady)
        {
            logs.debug('Publish message to exchange: ' + this.exchange.name);
            this.exchange.publish(routingKey, data);
        }
        else
        {
            this.on('exchangeReady', function(){
                logs.debug('Publish  message to exchange: ' + this.exchange.name);
                this.exchange.publish(routingKey, data);
            })
        }
    }

    return publisher;
})();



