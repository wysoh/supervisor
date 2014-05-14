
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var routes = require("./routes");
var logger = require('./framework/logger');
var config = require('./config').config;


expressExt = require('./framework/express.ext/express.extend');
expressExt(express);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'html');
app.engine(".html", require("ejs-locals"));

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes(app);

global.logs = logger.logger;

var server = http.createServer(app),
    io = require('socket.io').listen(server);
io.set('log level', 2); //by default socket.io is too noisy

server.listen(app.get('port'), function(){
   console.log('Express server listening on port ' + app.get('port'));
});

//process.env['NODE_DEBUG_AMQP'] = true;


var events = require('events');
eventEmitter = new events.EventEmitter();


/*
var consumer = require('./controllers/consumer');
var c = new consumer();
c.init('ui_ex', 'direct');
c.setupQueue('ui', 'audit', {autoDelete: true});

var audit = require('./models/creative_audit');
var a = new audit();

var buffer = new Buffer('Ch0KEjM2MC1jcmVhdGl2ZS16Z3cwNTIDMzYwQABSAAodChIzNjEtY3JlYXRpdmUtemd3MDYyAzM2MUAAUgA=', 'base64');
var m = a.fromProto(buffer);
return;


c.consume(function(message){

    var data = a.fromProto(message.data);
    //logs.debug(message.data.toString('base64');
    //new Buffer('Ch0KEjM2MC1jcmVhdGl2ZS16Z3cwNTIDMzYwQABSAAodChIzNjEtY3JlYXRpdmUtemd3MDYyAzM2MUAAUgA=', 'base64')

    logs.debug(JSON.stringify(data));

})

return;
 */


var streamer = require('./controllers/streamer');
new streamer().run(io);

if (config.env == 'dev'){
    var simulator = require('./controllers/simulator');
    new simulator().run();
}


var monitorController = require('./controllers/monitor');
new monitorController().run();

var trafficControl = require('./controllers/trafficControl');
new trafficControl().run();

