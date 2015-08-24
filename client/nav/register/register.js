// Initializes variables
var sessionVariables;
var updatedSessionVar = false;
var continueRegistration = true;
var userName;

// Sets registration message and class to blank string (via session)
Session.set('feedback', "");
Session.set('feedbackClass', "");

////////////////////////////////////////////////////////////////////////////////////
// Updates the registration span with the session variable's content
////////////////////////////////////////////////////////////////////////////////////
Template.registrationFeedback.feedback = function () {
	return Session.get('feedback');
};


////////////////////////////////////////////////////////////////////////////////////
// Updates the registration span with the session variable's style
////////////////////////////////////////////////////////////////////////////////////
Template.registrationFeedback.feedbackClass = function () {
	return Session.get('feedbackClass');
};


////////////////////////////////////////////////////////////////////////////////////
// Manages user registration functionality
////////////////////////////////////////////////////////////////////////////////////
Template.registration.events({
	'click #createAccount' : function(event, template) {
		// Prevents the default action the browser would normally take regarding the event
		event.preventDefault();

		// Detects if the registration process should continue (if user is spamming login button)
		if (continueRegistration) {
			// Flags registration process to continue
			continueRegistration = false;

			// Gets the values of the uesrname, email, and password form for registration
			var userNameInput = template.find('#newAccountUserName').value;
			var emailInput = template.find('#newAccountEmail').value;
			var passwordInput = template.find('#newAccountPassword').value;
			var passwordInput2 = template.find('#newAccountPassword2').value;

			// Sets login message and class to blank string (via session)
			Session.set('feedback', "");
			Session.set('feedbackClass', "");

			// Detects if content is passed to create an account
			if (userNameInput === "" || userNameInput === null || emailInput === "" || emailInput === null || passwordInput === "" || passwordInput === null || passwordInput2 === "" || passwordInput2 === null) {
				// Informs the user account creation failed
				sessionVariables = {
					'feedback' : 'Please complete all fields.',
					'feedbackClass' : 'alert-error alert feedback'
				};

				// Flags session variable to update
				updatedSessionVar = true;
			} else {
				if (passwordInput == passwordInput2) {
					// Function call to remove whitespace from the username input
					Meteor.call('removeWS', userNameInput, function(error, result){
						// Sets callback result to username (necessary since Meteor.call doesn't return the correct value)
						userNameInput = result;
					});

					// Function call to remove whitespace from the email input
					Meteor.call('removeWS', emailInput, function(error, result){
						// Sets callback result to email (necessary since Meteor.call doesn't return the correct value)
						emailInput = result;
					});

					// Function call to enforce minimum password length (for registration)
					Meteor.call('enforcePWLength', passwordInput, function(error, result){
						// Detects if password meets minimum length requirement
						if (result) {
							// Function call to validate email format (for registration)
							Meteor.call('validateEmail', emailInput, function(error, result){
								// Detects if email is correctly formatted
								if (result) {
									// Stores new user info
									var newUserInfo = {
										username : userNameInput,
										email : emailInput,
										password : passwordInput,
										profile : {
											loggedIn : true,
											pvt : {
												invited : false,
												inviter : '',
												inviting : false,
												invitee : '',
												room : 'lobby'
											}
										}
									};

									// Creates user account
									Accounts.createUser(newUserInfo, function(err){
										// If user creation errors (generally due to account existing already)
										if (err) {
											// Informs the user account creation failed
											sessionVariables = {
												'feedback' : err.reason,
												'feedbackClass' : 'alert-error alert feedback'
											};

											// Flags session variable to update
											updatedSessionVar = true;
										} else {
											// Informs the user account creation passed
											sessionVariables = {
												'feedback' : 'Account created!',
												'feedbackClass' : 'alert-success alert feedback'
											};

											// Flags session variable to update
											updatedSessionVar = true;

											// Updates user's logged in status to true
											Meteor.call('updateUserLoginStatus', true, Meteor.userId());

											// Delayed registration modal hide
											setTimeout(function() {
												// Close registration modal
												$('#registrationModal').modal('hide');
											}, 1000);

											// Creates token (not currently utilized)
											Meteor.call('createToken', Meteor.userId());
										}

										// Detects if session variable should be updated
										if (updatedSessionVar) {
											// Updates session variables
											Meteor.call('setSession', sessionVariables);

											// Flags registration process to continue
											continueRegistration = true;

											// Flags session variable to not update
											updatedSessionVar = false;
										} else {
											// Do nothing
										}
									});
								} else {
									// Informs the user email is incorrectly formatted
									sessionVariables = {
										'feedback' : 'Please input a valid email.',
										'feedbackClass' : 'alert-error alert feedback'
									};

									// Flags session variable to update
									updatedSessionVar = true;
								}

								// Detects if session variable should be updated
								if (updatedSessionVar) {
									// Updates session variables
									Meteor.call('setSession', sessionVariables);

									// Flags registration process to continue
									continueRegistration = true;

									// Flags session variable to not update
									updatedSessionVar = false;
								} else {
									// Do nothing
								}
							});
						} else {
							// Informs the user password must be longer
							sessionVariables = {
								'feedback' : 'Password must be a minimum of six characters.',
								'feedbackClass' : 'alert-error alert feedback'
							};

							// Flags session variable to update
							updatedSessionVar = true;
						}

						// Detects if session variable should be updated
						if (updatedSessionVar) {
							// Updates session variables
							Meteor.call('setSession', sessionVariables);

							// Flags registration process to continue
							continueRegistration = true;

							// Flags session variable to not update
							updatedSessionVar = false;
						} else {
							// Do nothing
						}
					});
				} else {
					// Informs the user passwords do not match
					sessionVariables = {
						'feedback' : 'Passwords do not match.',
						'feedbackClass' : 'alert-error alert feedback'
					};

					// Flags session variable to update
					updatedSessionVar = true;
				}
			}

			// Detects if session variable should be updated
			if (updatedSessionVar) {
				// Updates session variables
				Meteor.call('setSession', sessionVariables);

				// Flags registration process to continue
				continueRegistration = true;

				// Flags session variable to not update
				updatedSessionVar = false;
			} else {
				// Do nothing
			}
		}
	}
});