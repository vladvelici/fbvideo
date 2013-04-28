var settings = {
  grabRate : 150,
  canvasWidth : 200,
  canvasHeight : 160,
  socketSrv : 'http://localhost:9000',
  jpegQuality : 0.3
};

(function(document) {
  document.addEventListener('DOMContentLoaded', function() {

    var senderEl = document.createElement('canvas');
    senderEl.id = "sender";
    var receiverEl = document.getElementById('receiver');
    var videoEl = document.getElementById('video');

    var senderContext = senderEl.getContext('2d');
    var receiverContext = receiverEl.getContext('2d');
    var receiverDataLength = settings.canvasWidth * settings.canvasHeight * 4;
    var receiverPos = 0;

    var socket = io.connect(settings.socketSrv);

    senderEl.width = settings.canvasWidth;
    senderEl.height = settings.canvasHeight;

    receiverEl.width = settings.canvasWidth;
    receiverEl.height = settings.canvasHeight;

    videoEl.width = settings.canvasWidth;
    videoEl.height = settings.canvasHeight;


    // the stream is ready
    socket.on('hi', function(data) {
      console.log("connected.", data);
      deleteloader($(".senderwrap"));
    });

    socket.on("newUser", function(data) {
      console.log("someone got in");
      // deleteloader($(".senderwrap"));
    });

    socket.on("userDisconnected", function(data) {
      console.log("life's hard for someone. got out");
      showloader($(".senderwrap"));
    });

    socket.on('videoOut', function(data) {
      var img = document.createElement("img");
      img.onload = function() {
        console.log("img onload.");
        receiverContext.drawImage(img, 0, 0, settings.canvasWidth, settings.canvasHeight);
      }
      img.src = data.base64img;
    });

    var grabLoop = function() {
      if (typeof socket === 'undefined') return;
      senderContext.drawImage(videoEl,0,0,settings.canvasWidth,settings.canvasHeight);
      var webpData = senderEl.toDataURL("image/webp", settings.jpegQuality);

      socket.emit("videoIn", {"base64img": webpData});
      setTimeout(grabLoop, settings.grabRate);
    };

    // gets called as soon we have access to the camera..
    var gUsuccess = function(videostream) {
      videoEl.src = (window.URL || window.webkitURL).createObjectURL(videostream);
      videoEl.play();
      console.log('We have webcam access. yay');
      deleteloader($(".receiverwrap"));

      setTimeout(grabLoop, settings.grabRate);
    };

    // no camera access...
    var gUfail = function() {
      console.log('no webcam access :-(');
    };
    console.log("something");
    navigator.getMedia({video: true}, gUsuccess, gUfail);
  });

})(document);
