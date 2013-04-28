(function(document) {
  document.addEventListener('DOMContentLoaded', function() {

    var settings = {
      grabRate : 70,
      canvasWidth : 200,
      canvasHeight : 160,
      socketSrv : 'ws://ec2-54-245-161-226.us-west-2.compute.amazonaws.com:9000'
    };

    var senderEl = document.createElement('canvas');
    senderEl.id = "sender";
    var receiverEl = document.getElementById('receiver');
    var videoEl = document.getElementById('video');

    var senderContext = senderEl.getContext('2d');
    var receiverContext = receiverEl.getContext('2d');
    var receiverDataLength = settings.canvasWidth * settings.canvasHeight * 4;
    var receiverPos = 0;
    var transferRate = Math.round(((1000 / settings.grabRate) * receiverDataLength / 1024), 2);

    var client = new BinaryClient(settings.socketSrv);
    var stream;

    var imageFrame = receiverContext.getImageData(0,0,settings.canvasWidth,settings.canvasHeight);

    senderEl.width = settings.canvasWidth;
    senderEl.height = settings.canvasHeight;

    receiverEl.width = settings.canvasWidth;
    receiverEl.height = settings.canvasHeight;

    videoEl.width = settings.canvasWidth;
    videoEl.height = settings.canvasHeight;

    document.getElementById('message').innerHTML = 'Sending: ' + transferRate + ' KB / Sec<br />';
    document.getElementById('message').innerHTML += 'Receiving: ' + transferRate + ' KB / Sec';

    // the stream is ready
    client.on('open', function(s) {
      stream = client.createStream(s, 'toserver');
    });

    client.on('stream', function(s, meta) {
      if (meta === 'fromServer') {
        s.on('data', function(data) {
            console.log("got it back:", data);
          // data is from the type 'ArrayBuffer'
          // we need to build a Uint8Array out of it
          // to be able to access the actual data
              var img = document.createElement("img");
              // img.src = (window.URL || window.webkitURL).createObjectURL(new Blob(data));
              img.onload = function() {
                console.log("img onload.");
                receiverContext.drawImage(img, 0, 0, settings.canvasWidth, settings.canvasHeight);
              }
              img.src = data;
          // receiverContext.drawImage();
        });
        s.on('end', function(){
          console.log("blob finished coming back");
        });
      }
    });

    var grabLoop = function() {
      if (typeof stream === 'undefined') return;
      senderContext.drawImage(videoEl,0,0,settings.canvasWidth,settings.canvasHeight);
      var sdata = senderEl.toDataURL("image/jpeg", 0.5);
      stream.write(sdata);
      setTimeout(grabLoop, settings.grabRate);
    };

    // gets called as soon we have access to the camera..
    var gUsuccess = function(videostream) {
      videoEl.src = (window.URL || window.webkitURL).createObjectURL(videostream);
      videoEl.play();
      console.log('We have webcam access. yay');
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