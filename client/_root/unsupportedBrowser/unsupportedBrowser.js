////////////////////////////////////////////////////////////////////////////////////
// Manages user unsupported browser functionality
////////////////////////////////////////////////////////////////////////////////////
Template.unsupportedBrowser.events({
	// Detects when someone needs a new browser
	"click #newBrowser" : function (event, template) {
		// Prevents the default action the browser would normally take regarding the event	
		event.preventDefault();

		// Redirect user to get new browser
		window.location.replace('http://whatbrowser.org/');
	}

});