////////////////////////////////////////////////////////////////////////////////////
// Updates the logged in username field
////////////////////////////////////////////////////////////////////////////////////
Template.userNav.activeUser  = function () {
	// Gets the active user
	var user = Meteor.user();

	// Detects if no active user
	if (!user) {
		return '';
	}

	// Detects for a variant of the username
	if (user.profile && user.profile.name) {
		return user.profile.name;
	}

	// Detects for a variant of the username
	if (user.userame) {
		return user.username;
	}

	// Detects for a variant of the username
	if (user.emails && user.emails[0] && user.emails[0].address) {
		return user.emails[0].address;
	}

	// Default return case
	return '';
};


////////////////////////////////////////////////////////////////////////////////////
// Runs when template is rendered
////////////////////////////////////////////////////////////////////////////////////
Template.userNav.rendered = function () {
	// Gets room ID from local storage
	var roomID = localStorage.getItem('room');

	// Detects if room isn't set
	if (roomID !== undefined && roomID !== null && roomID !== '') {
		// Detects if navigation already exists
		if ($("#leaveRoom").length === 0) {
			// Adds room navigation
			$("#createPrivateRoom").remove();
			$("#userDropdownNav ul").append('<li id="lockRoom"><a href="#">Lock room</a></li>');
			$("#userDropdownNav ul").append('<li id="clearRoom"><a href="#">Clear room</a></li>');
			$("#userDropdownNav ul").append('<li id="leaveRoom"><a href="#">Leave room</a></li>');
			$("#userDropdownNav ul").append('<li id="roomSettings"><a href="#">Room settings</a></li>');
		}

		// Gets values from the cursors
		var roomInfo = rooms.find({'_id' : roomID}).fetch();

		// Catches simulation error
		if (roomInfo.length !== 0) {
			// Gets values from the cursors
			var lockedRoom = rooms.find({'_id' : roomID}).fetch()[0].locked;
			var currentUser = rooms.find({'_id' : roomID}).fetch()[0].currentUser;

			// Detects if room isn't locked
			if (lockedRoom === true) {
				// Clears the lock room user nav
				$("#lockRoom").empty();

				// Changes user nav to unlock room
				$("#lockRoom").append('<a href="#">Unlock room</a>');
			}
		}
	}

};


////////////////////////////////////////////////////////////////////////////////////
// Manages user navigation functionality
////////////////////////////////////////////////////////////////////////////////////
Template.userNav.events({
	// Detects when someone signs out
	"click #userLogout" : function(event) {
		// Prevents the default action the browser would normally take regarding the event	
		event.preventDefault();

		// Resets user's profile stats
		Meteor.call('resetUser', function (error, result) {
			// Updates user's logged in status to false
			Meteor.call('updateUserLoginStatus', false, Meteor.userId(), function (error, result) {
				// Logs out current user
				Meteor.logout(function (error, result) {
					// Clears room local storage
					localStorage.removeItem('room');

					// Redirects browser to correct room URL (if a user was in a private room)
					window.location.replace('http://slipstream.thruhere.net:3000/');
				});
			});
		});
	},

	// Detects when someone wants to create a private room
	"click #createPrivateRoom" : function(event) {
		// Prevents the default action the browser would normally take regarding the event	
		event.preventDefault();

		// Creates room
		Meteor.call('createRoom', Meteor.userId(), "", function (error, result) {
			// Grabs the new room ID
			var roomID = result;

			// Stores room ID in local storage
			localStorage.setItem('room', roomID);

			// Navigates to the new room
			Meteor.Router.to('/rooms/' + roomID + '/');
		});
	},

	// Detects when the rooms is being locked
	"click #lockRoom" : function(event) {
		// Prevents the default action the browser would normally take regarding the event	
		event.preventDefault();

		// Gets room ID from local storage
		var roomID = localStorage.getItem('room');

		// Gets values from the cursors
		var roomInfo = rooms.find({'_id' : roomID}).fetch();

		// Catches simulation error
		if (roomInfo.length !== 0) {
			// Gets values from the cursors
			var lockedRoom = rooms.find({'_id' : roomID}).fetch()[0].locked;
			var currentUser = rooms.find({'_id' : roomID}).fetch()[0].currentUser;

			// Detects if room isn't locked
			if (lockedRoom === false) {
				// Clears the lock room user nav
				$("#lockRoom").empty();

				// Changes user nav to unlock room
				$("#lockRoom").append('<a href="#">Unlock room</a>');

				// Locks the room to the specified user
				Meteor.call('lockRoom', roomID, Meteor.userId());
			}
			// Detects if the room is locked
			else {
				// Detects if the current user is the user who locked the room
				if (currentUser === Meteor.userId()) {
					// Clears the lock room user nav
					$("#lockRoom").empty();

					// Changes user nav to lock room
					$("#lockRoom").append('<a href="#">Lock room</a>');

					// Unlocks the room
					Meteor.call('unlockRoom', roomID);
				}
				// Detects if user isn't allowed to lock the room
				else {
					// Alerts the user the room is locked
					Meteor.call('prepareLockedRoomModal');
				}
			}
		}
	},

	// Detects when the rooms is being cleared
	"click #clearRoom" : function(event) {
		// Prevents the default action the browser would normally take regarding the event	
		event.preventDefault();

		// Gets room ID from local storage
		var roomID = localStorage.getItem('room');

		// Gets values from the cursors
		var roomInfo = rooms.find({'_id' : roomID}).fetch();

		// Catches simulation error
		if (roomInfo.length !== 0) {
			// Gets values from the cursors
			var lockedRoom = rooms.find({'_id' : roomID}).fetch()[0].locked;
			var currentUser = rooms.find({'_id' : roomID}).fetch()[0].currentUser;

			// Detects if room isn't locked
			if (lockedRoom === true) {
				// Detects if user has locked access
				if (currentUser === Meteor.userId()) {
					// Clears room's whiteboard
					Meteor.call('clearRoomWhiteboard', roomID);
				} else {
					// Alerts the user the room is locked
					Meteor.call('prepareLockedRoomModal');
				}
			} else {
				// Clears room's whiteboard
				Meteor.call('clearRoomWhiteboard', roomID);
			}
		}
	},

	// Detects when someone leaves the room
	"click #leaveRoom" : function(event) {
		// Prevents the default action the browser would normally take regarding the event	
		event.preventDefault();

		// Resets user's profile stats
		Meteor.call('resetUser', function (error, result) {
			localStorage.removeItem('room');

			// Redirects browser to correct room URL (if a user was in a private room)
			window.location.replace('http://slipstream.thruhere.net:3000/');
		});
	},

	// Detects when someone opens the room's settings
	"click #roomSettings" : function(event) {
		// Prevents the default action the browser would normally take regarding the event	
		event.preventDefault();



		// Gets room ID from local storage
		var roomID = localStorage.getItem('room');

		// Gets values from the cursors
		var roomInfo = rooms.find({'_id' : roomID}).fetch();

		// Catches simulation error
		if (roomInfo.length !== 0) {
			// Gets values from the cursors
			var lockedRoom = rooms.find({'_id' : roomID}).fetch()[0].locked;
			var currentUser = rooms.find({'_id' : roomID}).fetch()[0].currentUser;

			// Detects if room isn't locked
			if (lockedRoom === true) {
				// Detects if user has locked access
				if (currentUser === Meteor.userId()) {
					// Prepares the room settings modal
					Meteor.call("prepareRoomSettingsModal");
				} else {
					// Alerts the user the room is locked
					Meteor.call('prepareLockedRoomModal');
				}
			} else {
				// Prepares the room settings modal
				Meteor.call("prepareRoomSettingsModal");
			}
		}	
	},

	// Detects when someone clicks the log in link
	"click #showLoginModal" : function(event) {
		// Prevents the default action the browser would normally take regarding the event	
		event.preventDefault();

		// Prepares the login modal
		Meteor.call("prepareLoginModal");
	},

	// Detects when someone clicks the register link
	"click #showRegistrationModal" : function(event) {
		// Prevents the default action the browser would normally take regarding the event	
		event.preventDefault();

		// Prepares the register modal
		Meteor.call("prepareRegisterModal");
	}

});