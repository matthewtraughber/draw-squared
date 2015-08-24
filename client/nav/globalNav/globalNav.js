////////////////////////////////////////////////////////////////////////////////////
// Runs when template is rendered
////////////////////////////////////////////////////////////////////////////////////
Template.globalNav.rendered = function () {
	// Gets room ID from local storage
	var roomID = localStorage.getItem('room');

	// Initializes room name variable
	var roomName;

	// Detects if room isn't set
	if (roomID !== undefined && roomID !== null && roomID !== '') {
		// Returns current room users
		Meteor.call('getRoomUsers', roomID, function (error, result) {
			// Catches error
			if (error) {
				// Silently fail
			} else {
				// Detects if inviter left the room
				if (result.inviter === undefined) {
					roomName = result.invitee + "'s room";
				}
				// Detects if invitee left the room
				else if (result.invitee === undefined) {
					roomName = result.inviter + "'s room";
				}
				// YAY, no one left the room!
				else {
					// Creates room name based off occupants
					roomName = result.inviter + " and " + result.invitee + "'s room";
				}

				// Detects if current room name exists
				if ($("#currentRoom").length === 0) {
					// Sets room name in global nav
					$("#mainNav").append('<li id="currentRoom" class="active"><a href="#">' + roomName + '</a></li>');
				}
			}
		});
	}

};


////////////////////////////////////////////////////////////////////////////////////
// Manages user navigation functionality
////////////////////////////////////////////////////////////////////////////////////
Template.globalNav.events({
/*	// Detects when someone signs out
	"click #userLogout" : function(event) {
		// Prevents the default action the browser would normally take regarding the event	
		event.preventDefault();

	}
*/
});