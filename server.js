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

// Static file server:

var connect = require('connect'),
    http = require('http');

connect()
    .use(connect.static('public'))
    .listen(staticFilesPort);



// Nice greeting so you know it works:
console.log("Server started at http://localhost:" + staticFilesPort);
console.log("Binary sockets are on port " + socketioPort);


