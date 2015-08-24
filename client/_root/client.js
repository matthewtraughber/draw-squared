////////////////////////////////////////////////////////////////////////////////////
// Function that runs when the client starts
////////////////////////////////////////////////////////////////////////////////////
Meteor.startup(function() {

	// Detects what browser is being used (catches unsupported browsers)
	if ($.browser.msie || $.browser.mozilla) {
		// Call to show the unsupported browser modal
		Meteor.call('prepareUnsupportedBrowserModal');
	}

	// Call to get the server date
	Meteor.call('getServerDate', function(error, result) {
		// Detects if an error is thrown (and console.logs it)
		if (error) {
			// Silent fail
		} else {
			// Calculates the difference between the client and server dates
			clientServerDateDifference = new Date(result) - new Date();
		}
	});
	
});