// Initializes variables
var sessionVariables;
var updatedSessionVar = false;
var continueLogin = true;

////////////////////////////////////////////////////////////////////////////////////
// Updates the login span with the session variable's content
////////////////////////////////////////////////////////////////////////////////////
Template.loginFeedback.feedback = function () {
	return Session.get('feedback');
};


////////////////////////////////////////////////////////////////////////////////////
// Updates the login span with the session variable's style
////////////////////////////////////////////////////////////////////////////////////
Template.loginFeedback.feedbackClass = function () {
	return Session.get('feedbackClass');
};


////////////////////////////////////////////////////////////////////////////////////
// Manages user login functionality
////////////////////////////////////////////////////////////////////////////////////
Template.login.events({
	// Detects when someone signs in
	"click #userLogin" : function (event, template) {
		// Prevents the default action the browser would normally take regarding the event	
		event.preventDefault();

		// Detects if the login process should continue (if user is spamming login button)
		if (continueLogin) {
			// Flags login process to continue
			continueLogin = false;

			// Gets the values of the email / username and password form for login
			var emailOrUsernameInput = template.find('#accountEmailOrUsername').value;
			var passwordInput = template.find('#accountPassword').value;


			// Sets login message and class to blank string (via session)
			Session.set('feedback', "");
			Session.set('feedbackClass', "");


			// Detects if input is passed to log user in
			if (emailOrUsernameInput === "" || emailOrUsernameInput === null || passwordInput === "" || passwordInput === null) {
				// Informs the user account creation failed
				sessionVariables = {
					'feedback' : 'Please complete all fields.',
					'feedbackClass' : 'alert-error alert feedback'
				};

				// Flags session variable to update
				updatedSessionVar = true;
			} else {
				// Function call to remove whitespace from the email input
				Meteor.call('removeWS', emailOrUsernameInput, function (error, result) {
					// Sets callback result to email (necessary since Meteor.call doesn't return the correct value - bug)
					emailOrUsernameInput = result;
				});

				// Logs in user
				Meteor.loginWithPassword(emailOrUsernameInput, passwordInput, function (error) {
					// Detects if attempt was successful
					if (error) {
						// Informs the user of failed login attempt
						sessionVariables = {
							'feedback' : 'Invalid credentials.',
							'feedbackClass' : 'alert-error alert feedback'
						};

						// Flags session variable to update
						updatedSessionVar = true;
					} else {
						// Sets login message and class to blank string (via session)
						sessionVariables = {
							'feedback' : '',
							'feedbackClass' : ''
						};

						// Close log in modal
						$('#loginModal').modal('hide');

						// Flags session variable to update
						updatedSessionVar = true;

						// Updates user's logged in status to true
						Meteor.call('updateUserLoginStatus', true, Meteor.userId());

						// Creates token (not currently utilized)
						Meteor.call('createToken', Meteor.userId());
					}

					// Detects if session variable should be updated
					if (updatedSessionVar) {
						// Updates session variables
						Meteor.call('setSession', sessionVariables);

						// Flags login process to continue
						continueLogin = true;

						// Flags session variable to not update
						updatedSessionVar = false;
					} else {
						// Do nothing
					}
				});
			}

			// Detects if session variable should be updated
			if (updatedSessionVar) {
				// Updates session variables
				Meteor.call('setSession', sessionVariables);

				// Flags login process to continue
				continueLogin = true;

				// Flags session variable to not update
				updatedSessionVar = false;
			} else {
				// Do nothing
			}
		} else {
			// Do nothing
		}
	}
});
