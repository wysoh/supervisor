
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var routes = require("./routes");


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

/*
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
*/

var winston = require('winston');
winston.level = 'info';


var server = http.createServer(app),
    io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
   console.log('Express server listening on port ' + app.get('port'));
});

var events = require('events');
rabbitEventEmitter = new events.EventEmitter();


io.sockets.on('connection', function(socket){
    rabbitEventEmitter.on('update', function(data){
       socket.emit("update", data);
    });
    //socket.emit('report', {hello: 'world'});
    /*
    socket.on('my other event', function(data){
        console.log(data);
    });
    */
});

var simulator = require('./controllers/simulator');
var s =  new simulator();
s.run();


var monitor = require('./controllers/monitor');
new monitor().run();

