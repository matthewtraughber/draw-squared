////////////////////////////////////////////////////////////////////////////////////
// Manages lobby chatroom functionality
////////////////////////////////////////////////////////////////////////////////////
Template.lobbyChatRoom.events({
	// Detects if key was pressed from input box
	'keydown #userMessage' : function(event) {

		// Removes warning popover if present
		$('#userMessage').popover('destroy');

		// Detects if enter key was pressed
		if (event.keyCode == 13) {
			// Posts user's message
			postLobbyMessage();
		}
	},

	// Detects if focus lost from input box
	'focusout #userMessage' : function() {
		// Removes warning popover if present
		$('#userMessage').popover('destroy');
	},

	// Detects if send button was pressed
	'click #sendUserMessage' : function() {
		// Posts user's message
		postLobbyMessage();
	}
});


////////////////////////////////////////////////////////////////////////////////////
// Auto-scrolls lobby chat room down to latest message
// Source: https://github.com/deemkeen/primabylon/pull/5 (7fe4662)
////////////////////////////////////////////////////////////////////////////////////
Template.lobbyChatRoom.rendered = function() {
	// Finds chatbox
	var chatBox = this.find("#chatBox");

	if (chatBox.clientHeight === chatBox.scrollHeight) {
		this.scrolledFlush = true;

	} else if (this.scrolledFlush) {
		chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight;

	} else if (typeof this.scrolledFlush == "undefined") {
		chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight;
	}
};


////////////////////////////////////////////////////////////////////////////////////
// Helper function that posts lobby messages
////////////////////////////////////////////////////////////////////////////////////
function postLobbyMessage() {
	// Gets the message from the input
	var message = $('#userMessage').val();

	// Detects blank input
	if (message === "" || message.match(/^\s*$/) || message === null) {
		// Initializes a popover to alert the user
		$('#userMessage').popover({
			title: '<strong>Hey now...</strong>',
			content: "<p class='inputAlertMessage'>You don't have anything to say!</p>",
			placement: "top",
			html: true
		});

		// Displays the popover
		$('#userMessage').popover('show');
	} else {
		// Gets the current date, then the time + client/server date difference
		currentDate = new Date();
		currentDate = new Date(currentDate.getTime() + clientServerDateDifference);

		// Gets the current user's name and language
		currentUserName = Meteor.users.find({_id : Meteor.userId()}, {fields : {'username' : 1}}).fetch()[0].username;

		// Call to format the time for chat display
		Meteor.call('formatTime', currentDate, function(error, currentTime) {

			// Inserts the message into the messages collection
			messages.insert({
				timePosted : currentTime,
				creationDate : currentDate,
				room : 'lobby',
				userName : currentUserName,
				messageContents : message
			});

			// Flushes the toilet (actually - process all reactive updates immediately and ensure that all invalidated computations are rerun.) 
			Deps.flush();

			// Resets user message input field
			$('#userMessage').val('');
		});
	}
}