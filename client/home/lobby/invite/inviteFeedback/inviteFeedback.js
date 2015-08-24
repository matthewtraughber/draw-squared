////////////////////////////////////////////////////////////////////////////////////
// Updates the invite feedback with the session variable's content
////////////////////////////////////////////////////////////////////////////////////
Template.inviteFeedback.feedback = function () {
	return Session.get('feedback');
};


////////////////////////////////////////////////////////////////////////////////////
// Updates the invite feedback with the session variable's style
////////////////////////////////////////////////////////////////////////////////////
Template.inviteFeedback.feedbackClass = function () {
	return Session.get('feedbackClass');
};