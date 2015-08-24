////////////////////////////////////////////////////////////////////////////////////
// Updates the room chat room with messages
////////////////////////////////////////////////////////////////////////////////////
Template.roomChatBoxMessage.roomMessage = function() {
	// Gets room ID from local storage
	var roomID = localStorage.getItem('room');

	// Returns messages sorted by created date
	return messages.find({room : roomID}, {sort: {creationDate: 1}});
};
