////////////////////////////////////////////////////////////////////////////////////
// Function that runs when the server starts
////////////////////////////////////////////////////////////////////////////////////
Meteor.startup(function() {

	// Clears collections when the server spools up
	messages.remove({});
	/*rooms.remove({});*/
	drawings.remove({});

	////////////////////////////////////////////////////////////////////////////////////
	// Observes lobby message count - will clear if over 100 messages
	////////////////////////////////////////////////////////////////////////////////////
	var messageCount = 0;

	var removeMessages = messages.find({}).observe({
		added: function() {
			// Increments message count when message is added
			messageCount++;

			// Detects if message count is over 100
			if (messageCount > 100) {
				// Flushes any pending reactions
				Meteor.flush();

				// Removes all messages in the collection
				messages.remove({});

				// Resets message count counter
				messageCount = 0;
			}
		}
	});


	////////////////////////////////////////////////////////////////////////////////////
	// Observes private rooms - will remove unoccupied rooms from the collection
	////////////////////////////////////////////////////////////////////////////////////
	var removeRooms = rooms.find({}).observe({
		changed: function(id, fields) {
			// Detects if room is no longer occupied
			if (id.inviter === "" && id.invitee === "") {
				// Removes unoccupied room
				rooms.remove(id);

				// Remove messages associated with the room
				messages.remove({room : id._id});

				// Remove drawings (points) associated with the room
				drawings.remove({room : id._id});
			}
		}
	});

});