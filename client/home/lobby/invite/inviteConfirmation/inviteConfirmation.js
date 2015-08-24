////////////////////////////////////////////////////////////////////////////////////
// Manages user invite confirmation functionality
////////////////////////////////////////////////////////////////////////////////////
Template.inviteConfirmation.events({
	// Detects when someone signs in
	"click #inviteUser" : function (event, template) {
		// Prevents the default action the browser would normally take regarding the event	
		event.preventDefault();

		// Gets inviter ID
		var inviterID = Meteor.userId();

		// Gets invitee ID (via session)
		var inviteeID = Session.get('inviteeID');

		// Detect if the user being invited is busy
		Meteor.call('getUserStatus',  inviteeID, function (error, result) {
			// Catches any error
			if (error) {
				sessionVariables = {
					'feedback' : 'Error inviting user!',
					'feedbackClass' : 'alert-error alert feedback'
				};
			// Informs the user invitee is busy	
			} else if (result === false) {
				sessionVariables = {
					'feedback' : 'User is currently busy.',
					'feedbackClass' : 'alert-error alert feedback'
				};
			// Informs the user invite started
			} else if (result) {
				sessionVariables = {
					'feedback' : 'Inviting user...',
					'feedbackClass' : 'alert-info alert feedback'
				};

				// Invites the user
				Meteor.call('startUserInvite', inviterID, inviteeID);
			}

			// Updates session variables
			Meteor.call('setSession', sessionVariables);
		});

	},

	// Detects when an invite should be canceled (by clicking nevermind)
	"click #cancelInvite" : function (event, template) {
		// Prevents the default action the browser would normally take regarding the event	
		event.preventDefault();

		// Gets inviter ID
		var inviterID = Meteor.userId();

		// Gets invitee ID (via session)
		var inviteeID = Session.get('inviteeID');

		// Sets feedback variables
		sessionVariables = {
			'feedback' : 'Cancelling invite...',
			'feedbackClass' : 'alert-warning alert feedback'
		};

		// Updates session variables
		Meteor.call('setSession', sessionVariables);

		// Sets session to not update modal
		Session.set('cancelInvite', true);

		// Cancels the user's invite
		Meteor.call('cancelUserInvite', inviterID, inviteeID, function (error, result) {
			// Flags user as not inviting another user
			Meteor.call('unlockInviter', inviterID, inviteeID, false, function (error, result) {
				// Delayed invite confirmation modal hide
				setTimeout(function() {
					// Hides the invite confirmation modal
					$('#inviteConfirmationModal').modal('hide');
				}, 1000);
			});
		});
	}

});