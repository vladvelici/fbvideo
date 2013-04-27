var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');

var staticFilesPort = 8000;
var binaryServerPort = 9000;

// var clients = [];

// Start Binary.js server
var binaryServer = BinaryServer({port: binaryServerPort});

// Wait for new user connections
// server.on('connection', function(client){
//   clients.push(client);

// 	client.on('stream', function(stream, meta){
// 		//
// 		var file = fs.createWriteStream(__dirname+ '/public/' + meta.name);
// 		stream.pipe(file);
// 		//
// 		// Send progress back
// 		stream.on('data', function(data){
// 		  stream.write({rx: data.length / meta.size});
// 		});
// 	});
// });

// Handle Binary WebSockets..

binaryServer.on('connection', function(client) {

  client.on('stream', function(stream) {
      console.log("client.on happened");
      var responseStream = client.createStream('fromserver');

      // pipe didnt work :(
      stream.on('data', function(data) {
        console.log("writing data back");
        responseStream.write(data);
        console.log("data wrote back");
      });

  });

});


// Static file server:

var connect = require('connect'),
    http = require('http');

connect()
    .use(connect.static('public'))
    .listen(staticFilesPort);

// Nice greeting so you know it works:

console.log("Server started at http://localhost:" + staticFilesPort);
console.log("Binary sockets are on port " + binaryServerPort);