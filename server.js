var fs = require('fs');

var staticFilesPort = process.env.PORT || 8000;
var socketioPort = 9000;

var io = require('socket.io').listen(socketioPort);

var RoomManager = function() {
	var lastRoomNo = 0;
	this.newId = function() {
		return "roomNo" + lastRoomNo++;
	}
}

var rooms = new RoomManager();
var fbidSocket = {};

io.sockets.on('connection', function (socket) {
	
	socket.on("addFbAuth", function(fbid) {
		socket.set('fbid', fbid, function () {
			socket.emit('welcome');
			fbidSocket[fbid] = {
				me: socket,
				partner: null,
			};
    	});
	});

	socket.on("incomingCall", function(calledFbid) {
		socket.get("fbid", function (error, fbid) {
			if (!error && fbidSocket[calledFbid]) {
				var partner = fbidSocket[calledFbid].me;
				partner.emit("beingCalled", {by: fbid});
				socket.emit("calling");
			} else {
				socket.emit("error_calling");
			}
		});
	});

	socket.on("iAnswered", function(data) {
		// var rId = rooms.newId();
		// socket.join(rId);
		var partner = fbidSocket[data.partnerUid].me;
		// partner.join(rId);
		if (data.answer == "yes") {
			socket.get("fbid", function(err, fbid) {
				if (err) return;
				fbidSocket[fbid].partner = fbidSocket[data.partnerUid].me;
			});
			fbidSocket[data.partnerUid].partner = socket;
			partner.emit("partnerAnswered", "yes");
		} else {
			partner.emit("partnerAnswered", "no");
		}
	});


	// console.log(io.sockets);

	socket.on('videoIn', function (data) {
		socket.get("fbid", function(err, fbid) {
			if (err || !fbid) return;
			var partner = fbidSocket[fbid].partner;
			if (partner !== null)
				partner.volatile.emit('videoOut', data);
		});
	});

	socket.on("disconnect", function() {
		socket.get("fbid", function(err, fbid) {
			if (fbidSocket[fbid] && fbidSocket[fbid].partner !== null) {
				fbidSocket[fbid].partner.get("fbid", function(err, fbidf) {
					if (err) return;
					fbidSocket[fbidf].partner = null;
					fbidSocket[fbidf].me.emit("partnerDisconnected");
					fbidSocket[fbid] = undefined;
				});
			} else {
				fbidSocket[fbid] = undefined;
			}
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
console.log("Socket.io is on port " + socketioPort);
