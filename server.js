var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');

var staticFilesPort = 8000;
var binaryServerPort = 9000;

var clients = [];

// Start Binary.js server
var server = BinaryServer({port: binaryServerPort});

// Wait for new user connections
server.on('connection', function(client){
  // Stream a flower as a hello!
  clients.push(client);
});

var connect = require('connect'),
    http = require('http');

connect()
    .use(connect.static('public'))
    .listen(staticFilesPort);

console.log("thing started");