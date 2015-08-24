////////////////////////////////////////////////////////////////////////////////////
// Helper functions (methods, whatever)
////////////////////////////////////////////////////////////////////////////////////
Meteor.methods({

	////////////////////////////////////////////////////////////////////////////////////
	// Function that sets session variables
	////////////////////////////////////////////////////////////////////////////////////
	setSession : function(sessionArray) {
		// Cycles through object to set session variables
		for (var sessionName in sessionArray) {
			Session.set(sessionName, sessionArray[sessionName]);
		}
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that prepares the register user modal
	////////////////////////////////////////////////////////////////////////////////////
	prepareRegisterModal : function() {
		// Clears out previous input for modal
		$('#newAccountUserName').val('');
		$('#newAccountEmail').val('');
		$('#newAccountPassword').val('');
		$('#newAccountPassword2').val('');

		// Sets registration message and class to blank string (via session) (to clear previous messages)
		Session.set('feedback', "");
		Session.set('feedbackClass', "");

		// Shows the registration modal
		$('#registrationModal').modal('show');

		// Detects when modal has loaded
		$('#registrationModal').on('shown', function () {
			// Sets focus on first form element
			$("#newAccountUserName").focus();
		});
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that prepares the login user modal
	////////////////////////////////////////////////////////////////////////////////////
	prepareLoginModal : function() {
		// Clears out previous input for modal
		$('#accountEmailOrUsername').val('');
		$('#accountPassword').val('');

		// Sets feedback message and class to blank string (via session) (to clear previous messages)
		Session.set('feedback', "");
		Session.set('feedbackClass', "");

		// Shows the log in modal
		$('#loginModal').modal('show');

		// Detects when modal has loaded
		$('#loginModal').on('shown', function () {
			// Sets focus on first form element
			$("#accountEmailOrUsername").focus();
		});
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that prepares the room's settings modal
	////////////////////////////////////////////////////////////////////////////////////
	prepareRoomSettingsModal : function() {
		// Sets feedback message and class to blank string (via session) (to clear previous messages)
		Session.set('feedback', "");
		Session.set('feedbackClass', "");

		// Gets room ID from local storage
		var roomID = localStorage.getItem('room');

		// Detects if roomID is populated
		if (roomID !== null || roomID !== undefined || roomID !== "") {
			// Gets values from the cursors
			var roomInfo = rooms.find({_id : roomID}).fetch();

			// Catches simulation error
			if (roomInfo.length !== 0) {
				// Gets room drawing settings
				var interpolationSetting = rooms.find({_id : roomID}).fetch()[0].interpolation;
				var strokeColorSetting = rooms.find({_id : roomID}).fetch()[0].strokeColor;
				var fillColorSetting = rooms.find({_id : roomID}).fetch()[0].fillColor;
				var pointSizeSetting = rooms.find({_id : roomID}).fetch()[0].pointSize;
				var strokeWidthSetting = rooms.find({_id : roomID}).fetch()[0].strokeWidth;

				// Sets current room settings in modal
				$("#interpolation").val(interpolationSetting);
				$("#strokeColor").val(strokeColorSetting);
				$("#fillColor").val(fillColorSetting);
				$("#pointSize").val(pointSizeSetting);
				$("#strokeWidth").val(strokeWidthSetting);
			}
		}

		// Shows the log in modal
		$('#roomSettingsModal').modal('show');
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that prepares the invite confirmation modal
	////////////////////////////////////////////////////////////////////////////////////
	prepareInviteConfirmationModal : function() {
		// Sets modal to only be closeable via button
		$('#inviteConfirmationModal').modal({
			backdrop: 'static',
			keyboard: false
		});

		// Enables modal buttons
		$("#cancelInvite").removeAttr("disabled");
		$("#inviteUser").removeAttr("disabled");

		// Sets feedback message and class to blank string (via session) (to clear previous messages)
		Session.set('feedback', "");
		Session.set('feedbackClass', "");

		// Shows the invite confirmation modal
		$('#inviteConfirmationModal').modal('show');
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that prepares the invite acceptance modal
	////////////////////////////////////////////////////////////////////////////////////
	prepareInviteAcceptanceModal : function() {
		// Gets values from the cursors
		var userInvitedVal = Meteor.users.find({'_id' : Meteor.userId()}).fetch()[0].profile.pvt.invited;
		var roomID = Meteor.users.find({'_id' : Meteor.userId()}).fetch()[0].profile.pvt.room;
		var userInviterVal = Meteor.users.find({'_id' : Meteor.userId()}).fetch()[0].profile.pvt.inviter;

		// Detects if current user is being invited
		if (userInvitedVal === true && roomID === 'lobby') {
			// Gets values from the cursor
			var inviterUserNameVal = Meteor.users.find({'_id' : userInviterVal}).fetch()[0].username;

			// Sets inviter userName (via session)
			Session.set('inviterUserName', inviterUserNameVal);

			// Sets modal to only be closeable via button
			$('#inviteAcceptanceModal').modal({
				backdrop: 'static',
				keyboard: false
			});

			// Enables modal buttons
			$("#refuseInvite").removeAttr("disabled");
			$("#acceptInvite").removeAttr("disabled");

			// Sets feedback message and class to blank string (via session) (to clear previous messages)
			Session.set('feedback', "");
			Session.set('feedbackClass', "");

			// Shows the invite confirmation modal
			$('#inviteAcceptanceModal').modal('show');
		}
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that prepares the invite acceptance modal
	////////////////////////////////////////////////////////////////////////////////////
	prepareLockedRoomModal : function() {
		// Gets room ID from local storage
		var roomID = localStorage.getItem('room');

		// Gets values from the cursors
		var roomInfo = rooms.find({'_id' : roomID}).fetch();

		// Catches simulation error
		if (roomInfo.length !== 0) {
			// Gets values from collection
			var lockedRoom = rooms.find({'_id' : roomID}).fetch()[0].locked;
			var currentUser = rooms.find({'_id' : roomID}).fetch()[0].currentUser;

			// Gets values from the cursors
			var userInfo = Meteor.users.find({'_id' : currentUser}).fetch();

			// Catches simulation error
			if (userInfo.length !== 0) {
				// Gets value from collection
				var currentUserName = Meteor.users.find({'_id' : currentUser}).fetch()[0].username;

				// Sets feedback message and class
				Session.set('feedback', currentUserName + " has locked the room.");
				Session.set('feedbackClass', "alert-error alert feedback");

				// Shows the invite confirmation modal
				$('#lockedRoomModal').modal('show');
			}
		}
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that prepares the unsupported browser modal
	////////////////////////////////////////////////////////////////////////////////////
	prepareUnsupportedBrowserModal : function() {
		// Sets modal to only be closeable via button
		$('#unsupportedBrowserModal').modal({
			backdrop: 'static',
			keyboard: false
		});

		// Shows the unsupported browser modal
		$('#unsupportedBrowserModal').modal('show');
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that returns the invitee's invite refuse
	////////////////////////////////////////////////////////////////////////////////////
	showInviteRefuse : function() {
		// Gets inviter ID
		var inviterID = Meteor.userId();

		// Detects the user being invited (cursor)
		var inviteeID = Meteor.users.find({'_id' : inviterID}).fetch()[0].profile.pvt.invitee;

		// Gets values from the cursors
		var inviteeInfo = Meteor.users.find({'_id' : inviteeID}).fetch();

		// Catches simulation error
		if (inviteeInfo.length !== 0) {
			// Gets values from the cursors
			var currentInvite = Meteor.users.find({'_id' : inviteeID}).fetch()[0].profile.pvt.invited;
			var roomID = Meteor.users.find({'_id' : inviteeID}).fetch()[0].profile.pvt.room;
			var currentInviter = Meteor.users.find({'_id' : inviteeID}).fetch()[0].profile.pvt.inviter;
			var currentInvitee = Meteor.users.find({'_id' : inviterID}).fetch()[0].profile.pvt.invitee;

			// Detects if invitee is still being invited
			if (currentInvite === false && inviterID === currentInviter && roomID === 'lobby') {

				// Sets feedback variables
				sessionVariables = {
					'feedback' : 'User declined invitation.',
					'feedbackClass' : 'alert-warning alert feedback'
				};

				// Updates session variables
				Meteor.call('setSession', sessionVariables);

				// Disables modal buttons
				$('#cancelInvite').attr('disabled', 'disabled');
				$('#inviteUser').attr('disabled', 'disabled');

				// Delayed invite confirmation modal hide
				setTimeout(function() {
					// Hides the invite confirmation modal
					$('#inviteConfirmationModal').modal('hide');
				}, 1000);

				// Detects when modal has been hidden
				$('#inviteConfirmationModal').on('hidden', function () {
					// Cancels the user's invite
					Meteor.call('cancelUserInvite', inviterID, inviteeID, function (error, result) {
						// Flags user as not inviting another user
						Meteor.call('unlockInviter', inviterID, inviteeID, true);
					});
				});
			}
		}
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that returns the invitee's invite acceptance
	////////////////////////////////////////////////////////////////////////////////////
	showInviteAcceptance : function() {
		// Gets inviter ID
		var inviterID = Meteor.userId();

		// Detects the user being invited (cursor)
		var inviteeID = Meteor.users.find({'_id' : inviterID}).fetch()[0].profile.pvt.invitee;

		// Gets values from the cursors
		var inviteeInfo = Meteor.users.find({'_id' : inviteeID}).fetch();

		// Catches simulation error
		if (inviteeInfo.length !== 0) {
			// Gets values from the cursors
			var currentInvite = Meteor.users.find({'_id' : inviteeID}).fetch()[0].profile.pvt.invited;
			var roomID = Meteor.users.find({'_id' : inviteeID}).fetch()[0].profile.pvt.room;
			var currentInviter = Meteor.users.find({'_id' : inviteeID}).fetch()[0].profile.pvt.inviter;
			var currentInvitee = Meteor.users.find({'_id' : inviterID}).fetch()[0].profile.pvt.invitee;

			// Detects if invitee is still being invited
			if (currentInvite === true && inviterID === currentInviter && roomID !== 'lobby') {
				// Sets feedback variables
				sessionVariables = {
					'feedback' : 'User accepted invite!',
					'feedbackClass' : 'alert-success alert feedback'
				};

				// Updates session variables
				Meteor.call('setSession', sessionVariables);

				// Disables modal buttons
				$('#cancelInvite').attr('disabled', 'disabled');
				$('#inviteUser').attr('disabled', 'disabled');

				// Delayed invite confirmation modal hide
				setTimeout(function() {
					// Hides the invite confirmation modal
					$('#inviteConfirmationModal').modal('hide');
				}, 1000);

				// Detects when modal has been hidden
				$('#inviteConfirmationModal').on('hidden', function () {
					// Stores room ID in local storage
					localStorage.setItem('room', roomID);

					// Redirects user to new room page
					window.location.replace('http://draw-squared.meteor.com/rooms/' + roomID + '/');
				});
			}
		}
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that returns the inviter's invite cancellation
	////////////////////////////////////////////////////////////////////////////////////
	showInviteCancellation : function() {
		// Gets invitee ID
		var inviteeID = Meteor.userId();

		// Detects the user inviting (cursor)
		var inviterID = Meteor.users.find({'_id' : inviteeID}).fetch()[0].profile.pvt.inviter;

		// Gets values from the cursors
		var inviterInfo = Meteor.users.find({'_id' : inviterID}).fetch();

		// Catches simulation error
		if (inviterInfo.length !== 0) {
			// Gets values from the cursors
			var currentInvite = Meteor.users.find({'_id' : inviteeID}).fetch()[0].profile.pvt.invited;
			var roomID = Meteor.users.find({'_id' : inviteeID}).fetch()[0].profile.pvt.room;
			var currentInviter = Meteor.users.find({'_id' : inviteeID}).fetch()[0].profile.pvt.inviter;
			var currentInvitee = Meteor.users.find({'_id' : inviterID}).fetch()[0].profile.pvt.invitee;

			// Detects if invitee is still being invited
			if (currentInvite === false && inviterID === currentInviter && roomID === 'lobby') {

				// Sets feedback variables
				sessionVariables = {
					'feedback' : 'User canceled invitation.',
					'feedbackClass' : 'alert-warning alert feedback'
				};

				// Updates session variables
				Meteor.call('setSession', sessionVariables);

				// Disables modal buttons
				$('#refuseInvite').attr('disabled', 'disabled');
				$('#acceptInvite').attr('disabled', 'disabled');

				// Delayed invite acceptance modal hide
				setTimeout(function() {
					// Hides the invite acceptance modal
					$('#inviteAcceptanceModal').modal('hide');
				}, 1000);
			}
		}
	}



});