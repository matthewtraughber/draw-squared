////////////////////////////////////////////////////////////////////////////////////
// Global variables
////////////////////////////////////////////////////////////////////////////////////
var userRoomID;


////////////////////////////////////////////////////////////////////////////////////
// Calls router filters on specific pages
////////////////////////////////////////////////////////////////////////////////////
Meteor.Router.filter('moveToRoom', {only: 'lobby'});
Meteor.Router.filter('checkRoomAccess', {only: 'room'});


////////////////////////////////////////////////////////////////////////////////////
// Defines router filters
////////////////////////////////////////////////////////////////////////////////////
Meteor.Router.filters({
	'moveToRoom' : function(page) {
		// Gets current user's room
		var roomID = localStorage.getItem('room');

		// Navigates to the private room if necessary
		if (roomID !== 'lobby' && roomID !== undefined && roomID !== null && roomID !== '') {
			// Redirects browser to correct room URL
			window.location.replace('http://draw-squared.meteor.com/rooms/' + roomID + '/');

		// Directs user not in a private room to the lobby
		} else {
			return 'lobby';
		}
	},

	'checkRoomAccess' : function(page) {
		// Gets current user's room
		var roomID = localStorage.getItem('room');

		// Checks if user should be in the room
		if (roomID === userRoomID) {
			// Direct validated user to private room
			return 'room';

		// Directs unvalidated user to the lobby
		} else {
			// Redirects browser to correct room URL
			window.location.replace('http://draw-squared.meteor.com/');
		}
	}
});


////////////////////////////////////////////////////////////////////////////////////
// Configures router routes
////////////////////////////////////////////////////////////////////////////////////
Meteor.Router.add({
	'/rooms/:roomID' : function(roomID) {
		// Detects if user is logged in
		if (Meteor.userId()) {
			// Grabs room ID for filter
			userRoomID = this.params.roomID;

			return 'room';
		}

		// Directs unregistered users to the landing
		else {
			return 'landing';
		}

	},

	'/' : function() {
		// Detects if user is logged in
		if (Meteor.userId()) {
			return 'lobby';
		}

		// Directs unregistered users to the landing
		else {
			return 'landing';
		}

	}
});