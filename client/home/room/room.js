////////////////////////////////////////////////////////////////////////////////////
// Returns room inviter
////////////////////////////////////////////////////////////////////////////////////
Template.room.occupant = function() {
	// Gets room ID from local storage
	var roomID = localStorage.getItem('room');

	// Variable initialization
	var occupants = [];
	var inviter;
	var invitee;
	var inviterID;
	var inviteeID;
	var inviterName;
	var inviteeName;

	// Detects if room isn't set
	if (roomID !== undefined && roomID !== null && roomID !== '') {

		// Gets values from the cursors
		var room = rooms.find({'_id' : roomID}).fetch();

		// Catches simulation error
		if (room.length !== 0) {
			// Gets room users from passed in room
			inviterID = rooms.find({'_id' : roomID}).fetch()[0].inviter;
			inviteeID = rooms.find({'_id' : roomID}).fetch()[0].invitee;

			// Catches simulation error
			if (inviterID !== "" || inviterID !== undefined || inviterID !== null) {
				// Gets room inviter
				inviter = Meteor.users.find({'_id' : inviterID}).fetch();

				// Catches simulation error
				if (inviter.length !== 0) {
					// Gets room inviter's name
					inviterName = Meteor.users.find({'_id' : inviterID}).fetch()[0].username;

					// Detects if inviter left the room
					if (inviterName !== '' || inviterName !== undefined || inviterName !== null) {
						// Adds inviter name to users array
						occupants.push(inviterName);
					}
				}
			}

			// Catches simulation error
			if (inviteeID !== "" || inviteeID !== undefined || inviteeID !== null) {
				// Gets room invitee
				invitee = Meteor.users.find({'_id' : inviteeID}).fetch();

				// Catches simulation error
				if (invitee.length !== 0) {
					// Gets room invitee's name
					inviteeName = Meteor.users.find({'_id' : inviteeID}).fetch()[0].username;

					// Detects if invitee left the room
					if (inviteeName !== '' || inviteeName !== undefined || inviteeName !== null) {
						// Adds invitee name to users array
						occupants.push(inviteeName);
					}
				}
			}

			// Returns occupants array
			return occupants;
		}
	}

};


////////////////////////////////////////////////////////////////////////////////////
// Runs when template is rendered
////////////////////////////////////////////////////////////////////////////////////
Template.room.rendered = function () {

/*	// Catches silly deps flushing error
	//if (Meteor.user() !== undefined) {
		// Removes link from current user name (and adds styling)
		$(("div[data-username*=" + Meteor.user().username + "]")).addClass("currentActiveUser");
	//}

	// Shows the invite acceptance modal if user is being invited
	Meteor.call('prepareInviteAcceptanceModal');

	// Shows the invitee's invite feedback message if the inviter canceled the request
	Meteor.call('showInviteCancellation');

	// Shows the invite response (feedback in modal) if user's invite was refused
	Meteor.call('showInviteRefuse');

	// Shows the invite response (feedback in modal) if user's invite was accepted
	Meteor.call('showInviteAcceptance');*/
};


////////////////////////////////////////////////////////////////////////////////////
// Manages room functionality
////////////////////////////////////////////////////////////////////////////////////
Template.room.events({
/*	// Detects if a user was clicked
	'click .activeUser' : function(event) {
		// Gets invitee info
		var inviteeID = this._id;
		var inviteeUserName = this.username;

		// Detects if user selected themselves
		if (inviteeID == Meteor.userId()) {
			// Do nothing
		} else {
			// Sets invitee ID & userName (via session)
			Session.set('inviteeID', inviteeID);
			Session.set('inviteeUserName', inviteeUserName);

			// Flags user as inviting another user
			Meteor.call('lockInviter', Meteor.userId(), inviteeID, function (error, result) {
				// Prepares the invite confirmation modal
				Meteor.call('prepareInviteConfirmationModal');
			});
		}
	}*/

});