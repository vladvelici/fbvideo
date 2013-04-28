window.addEventListener("load", function() {
	// fake login
	document.getElementById("fakeLoginForm").addEventListener("submit", function(e) {
		e.preventDefault();
		var fbuid = document.getElementById("fake_fbuid").value;
		sockOperations.addFbAuth(fbuid);
		console.log(fbuid);
		return false;
	});

});