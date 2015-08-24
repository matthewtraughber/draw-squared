////////////////////////////////////////////////////////////////////////////////////
// Manages user invite acceptance functionality
////////////////////////////////////////////////////////////////////////////////////
Template.inviteAcceptance.events({
	// Detects when someone signs in
	"click #acceptInvite" : function (event, template) {
		// Prevents the default action the browser would normally take regarding the event	
		event.preventDefault();

		// Gets invitee ID
		var inviteeID = Meteor.userId();

		// Gets inviter ID
		var inviterID = Meteor.users.find({'_id' : inviteeID}).fetch()[0].profile.pvt.inviter;

		// Sets feedback variables
		Session.set('feedback', "Creating room!");
		Session.set('feedbackClass', "alert-success alert feedback");

		// Disables modal buttons
		$('#refuseInvite').attr('disabled', 'disabled');
		$('#acceptInvite').attr('disabled', 'disabled');

		// Creates room
		Meteor.call('createRoom', inviterID, inviteeID, function (error, result) {
			// Grabs the new room ID
			var roomID = result;

			// Stores room ID in local storage
			localStorage.setItem('room', roomID);

			// Hides invite acceptance modal
			$('#inviteAcceptanceModal').modal('hide');

			// Detects when modal has been hidden
			$('#inviteAcceptanceModal').on('hidden', function () {
				// Redirects user to new room page
				Meteor.Router.to('/rooms/' + roomID + '/');
			});
		});
	},

	// Detects when an invite should be canceled (by clicking nevermind)
	"click #refuseInvite" : function (event, template) {
		// Prevents the default action the browser would normally take regarding the event	
		event.preventDefault();

		// Gets invitee ID
		var inviteeID = Meteor.userId();

		// Gets inviter ID
		var inviterID = Meteor.users.find({'_id' : inviteeID}).fetch()[0].profile.pvt.inviter;

		// Sets feedback variables
		sessionVariables = {
			'feedback' : 'Refusing invite...',
			'feedbackClass' : 'alert-warning alert feedback'
		};

		// Updates session variables
		Meteor.call('setSession', sessionVariables);

		// Cancels the user's invite
		Meteor.call('cancelUserInvite', inviterID, inviteeID, function (error, result) {
			// Flags user as not inviting another user
			Meteor.call('unlockInviter', inviterID, inviteeID, false, function (error, result) {
				// Hides invite acceptance modal
				$('#inviteAcceptanceModal').modal('hide');
			});
		});
	}


});