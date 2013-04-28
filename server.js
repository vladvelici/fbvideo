var fs = require('fs');

var staticFilesPort = process.env.PORT || 8000;
var socketioPort = 9000;

var io = require('socket.io').listen(socketioPort);

var rooms = [];

// socket.io code

io.sockets.on('connection', function (socket) {
	socket.emit("hi", {hello: "world"})
  socket.broadcast.emit('newUser');
  socket.on('videoIn', function (data) {
    socket.broadcast.volatile.emit('videoOut', data);
  });
  socket.on("disconnect", function() {
  	socket.broadcast.emit("userDisconnected");
  });
});



// var pairStream = function(stream, partner) {
// 	var responseStream = partner.createStream("fromServer");
// 	stream.on("data", function(data) {
// 		responseStream.write(data);
// 	});
// }


// binaryServer.on('connection', function(client) {

// 	// pair it with someone
// 	var pairId = pairs.length;
// 	if (pairs.length === 0) {
// 		pairs.push({user1: client, user2: null});
// 	} else {
// 		if (pairs[pairs.length-1].user1 === null) {
// 			pairId = pairs.length-1;
// 			pairs[pairId].user1 = client;
// 		} else if (pairs[pairs.length-1].user2 === null) {
// 			pairId = pairs.length-1;
// 			pairs[pairId].user2 = client;
// 		} else {
// 			pairs.push({user1: client, user2: null});
// 		}
// 	}

// 	var myPair = pairs[pairId];

// 	client.on('stream', function(stream) {
// 			console.log("stream happened");
// 			if (myPair.user1 !== null && myPair.user2 !== null) {
// 				if (typeof myPair.later === "function") {
// 					myPair.later(client); // this should call pairStream with user1's stream
// 					myPair.later = undefined;
// 				}
// 				pairStream(stream, myPair.user1);
// 			} else {
// 				myPair.later = function(partner) {
// 					pairStream(stream, partner)
// 				}
// 			}
// 	});

// 	console.log("Somone connected in pair #"+pairId);

// 	// if (myPair.user1 !== null && myPair.user2 !== null) {
// 	// 	doPair(myPair.user1, myPair.user2);
// 	// 	console.log("Linked the two users from pair #"+pairId);
// 	// }
// });


// Static file server:

var connect = require('connect'),
    http = require('http');

connect()
    .use(connect.static('public'))
    .listen(staticFilesPort);



// Nice greeting so you know it works:
console.log("Server started at http://localhost:" + staticFilesPort);
console.log("Binary sockets are on port " + socketioPort);


