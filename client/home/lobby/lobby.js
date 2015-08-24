////////////////////////////////////////////////////////////////////////////////////
// Returns all active users
////////////////////////////////////////////////////////////////////////////////////
Template.lobby.activeUsers = function() {
	return returnActiveUsers();
};


////////////////////////////////////////////////////////////////////////////////////
// Runs when template is rendered
////////////////////////////////////////////////////////////////////////////////////
Template.lobby.rendered = function () {

	// Catches silly deps flushing error
	if (Meteor.user()) {
		// Removes link from current user name (and adds styling)
		$(("div[data-username*=" + Meteor.user().username + "]")).addClass("currentActiveUser");

		// Shows the invite acceptance modal if user is being invited
		Meteor.call('prepareInviteAcceptanceModal');

		// Shows the invitee's invite feedback message if the inviter canceled the request
		Meteor.call('showInviteCancellation');

		// Shows the invite response (feedback in modal) if user's invite was refused
		Meteor.call('showInviteRefuse');

		// Shows the invite response (feedback in modal) if user's invite was accepted
		Meteor.call('showInviteAcceptance');
	}
};


////////////////////////////////////////////////////////////////////////////////////
// Manages lobby functionality
////////////////////////////////////////////////////////////////////////////////////
Template.lobby.events({
	// Detects if a user was clicked
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
	}

});