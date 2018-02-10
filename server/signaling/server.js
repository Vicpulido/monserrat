'use strict';

var os = require('os');
var nodeStatic = require('node-static');

var http = require('http');
var https = require('https');
var fs = require('fs');

var socketIO = require('socket.io');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];

var port = config.signalingPort;

var fileServer = new(nodeStatic.Server)();

/*var app = http.createServer(function(req, res) {
  fileServer.serve(req, res);
}).listen(port);*/

var options = {
  key: fs.readFileSync('../config/vpkey.pem'),
  cert: fs.readFileSync('../config/vpcert.pem'),
  passphrase: 'ArrozConLeche1!'
};

// Create an HTTP service.
/*var app = http.createServer(function(req, res) {
  fileServer.serve(req, res);
}).listen(port);*/

// Create an HTTPS service identical to the HTTP service.
/*var app = https.createServer(function(req, res) {
  fileServer.serve(req, res);
}).listen(port);*/

var app = https.createServer(options, function(req, res) {
  fileServer.serve(req, res);
}).listen(port);


var io = socketIO.listen(app);

console.log('Signaling server listening now on port ' + port);

io.sockets.on('connection', function(socket) {

  // convenience function to log server messages on the client
  function log() {
    console.log(arguments);
    var array = ['Message from server:'];
    array.push.apply(array, arguments);
    socket.emit('log', array);
  }

  socket.on('message', function(message) {
    log('Client said: ', message);
    // for a real app, would be room-only (not broadcast)
    socket.broadcast.emit('message', message);
  });

  socket.on('create or join', function(room) {
    log('Received request to create or join room ' + room);

    //var numClients = io.sockets.sockets.length;
    var numClients = Object.keys(io.sockets.sockets).length;

    log('Room ' + room + ' now has ' + numClients + ' client(s)');

    if (numClients === 1) {
      socket.join(room);
      log('Client ID ' + socket.id + ' created room ' + room);
      socket.emit('created', room, socket.id);
    } else if (numClients === 2) {
      log('Client ID ' + socket.id + ' joined room ' + room);
      // io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room, socket.id);
      
      socket.broadcast.emit('joined', room, socket.id);
      
      io.sockets.in(room).emit('ready', room);
      socket.broadcast.emit('ready', room);
    } else { // max two clients
      socket.emit('full', room);
    }
  });

  socket.on('ipaddr', function() {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);
        }
      });
    }
  });

  socket.on('bye', function(){
    console.log('received bye');
  });

});
