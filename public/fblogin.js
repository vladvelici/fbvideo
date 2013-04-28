var facebook = {
  status: "",
  friends: [],

  loggedIn: function() {
    if (facebook.status === "connected")
      return true;
    return false;
  }

  login: function(callback, errorCallback) {
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
  },

  getFriendList: function() {
    FB.api({
      method: "fql.query",
      query: "SELECT uid, name FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me())"
    }, function(response) {
      if (response) {
        facebook.friends = response;
      } else {
        throw "Can't get friends list";
      }
    });
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


// set the function before the sdk starts to be loaded
window.fbAsyncInit = function() {
  // init the FB JS SDK
  FB.init({
    appId      : '322262481197419', // App ID from the App Dashboard
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