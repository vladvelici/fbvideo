var facebook = {
  todo: [],
  apiLoaded: false,
  status: "",
  friends: [],
  buffer: [],

  setLoaded: function() {
    facebook.apiLoaded = true;
    for (var i=0;i<facebook.todo.length;i++) {
      facebook.todo[i]();
    }
  },



  login: function(callback, errorCallback) {
    if (!facebook.apiLoaded) {
      facebook.todo[facebook.todo.length] = function() {
        facebook.login(callback, errorCallback);
      };
    } else {
      if (facebook.status === "connected") {
        callback();
      } else if (facebook.status !== "__refused") {
        FB.login(function(response) {
          if (response.authResponse) {
            facebook.status = "connected";
            callback();
          } else {
            facebook.status = "__refused";
            errorCallback();
          }
        });
      }
    }
  },

  getFriendList: function() {
    // SELECT uid, name, sex FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me()) AND NOT (sex IN (SELECT sex FROM user WHERE uid=me()))
    FB.api({
      method: "fql.query",
      query: "SELECT uid, name, sex FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me()) AND NOT (sex IN (SELECT sex FROM user WHERE uid=me()))"
    }, function(response) {
      if (response) {
        facebook.friends = response;
        // increase buffer by 5
        facebook.increaseBuffer(5);
      } else {
        throw "Can't get friends list";
      }
    });
  },

  // adds noOfFriends friends to the buffer
  increaseBuffer: function(noOfFriends) {
    for (var i = 0;i<noOfFriends;i++) {
      var img = new Image();
      var friend = facebook.friends[h.random(0,facebook.friends.length-1)];
      img.onload = function() {
        facebook.buffer[facebook.buffer.length] = {fbid: friend.uid, image: this};
      };
      img.src = "http://graph.facebook.com/" + friend.uid + "/picture?width=100&height=100";
    }
  },

  /* should return an object: 
  * { fbid: 432523, image: new Image() }
  */
  getFriend: function() {
    if (facebook.buffer.length === 0) {
      throw "no friend in the buffer - that's a very bad thing";
    }
    facebook.increaseBuffer(1);
    return facebook.buffer.splice(0,1)[0];
  },

  testAPI: function() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
        console.log('Good to see you, ' + response.name + '.');
    });
  }
};

// set the function before the sdk starts to be loaded
window.fbAsyncInit = function() {
  // init the FB JS SDK
  FB.init({
    appId      : '274238639374156', // App ID from the App Dashboard
    channelUrl : '//channel.html', // Channel File for x-domain communication
    status     : true, // check the login status upon init?
    cookie     : true, // set sessions cookies to allow your server to access the session?
    xfbml      : true,  // parse XFBML tags on this page?
    oauth      : true  
  });

  console.log("facebook initialized.");

  FB.getLoginStatus(function(response) {
      facebook.status = response.status;
      facebook.setLoaded();
  });
};

// Load the SDK's source Asynchronously
// Note that the debug version is being actively developed and might 
// contain some type checks that are overly strict. 
// Please report such bugs using the bugs tool.
(function(d, debug){
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";
   ref.parentNode.insertBefore(js, ref);
 }(document, /*debug*/ true));
