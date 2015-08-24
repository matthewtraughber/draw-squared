////////////////////////////////////////////////////////////////////////////////////
// Runs when template is rendered
////////////////////////////////////////////////////////////////////////////////////
Template.roomSettings.rendered = function () {


};


////////////////////////////////////////////////////////////////////////////////////
// Manages room settings functionality
////////////////////////////////////////////////////////////////////////////////////
Template.roomSettings.events({
	// Detects when settings change should be cancelled
	"click #cancelRoomSettings" : function (event, template) {
		// Prevents the default action the browser would normally take regarding the event	
		event.preventDefault();

		// Sets feedback variables
		sessionVariables = {
			'feedback' : 'Cancelling changes...',
			'feedbackClass' : 'alert-warning alert feedback'
		};

		// Updates session variables
		Meteor.call('setSession', sessionVariables);

		// Delayed room settings modal hide
		setTimeout(function() {
			// Hides the room settings modal
			$('#roomSettingsModal').modal('hide');
		}, 1000);
	},

	// Detects when settings change should be saved
	"click #saveRoomSettings" : function (event, template) {
		// Prevents the default action the browser would normally take regarding the event	
		event.preventDefault();

		// Gets room ID from local storage
		var roomID = localStorage.getItem('room');

		// Sets feedback variables
		sessionVariables = {
			'feedback' : 'Changes saved!',
			'feedbackClass' : 'alert-success alert feedback'
		};

		// Updates session variables
		Meteor.call('setSession', sessionVariables);

		// Gets currently selected values
		var interpolationSetting = $("#interpolation").find(':selected').val();
		var strokeColorSetting = $("#strokeColor").find(':selected').val();
		var fillColorSetting = $("#fillColor").find(':selected').val();
		var pointSizeSetting = $("#pointSize").find(':selected').val();
		var strokeWidthSetting = $("#strokeWidth").find(':selected').val();

		// Call to update the room's settings
		Meteor.call('updateRoomSettings', roomID, interpolationSetting, strokeColorSetting, fillColorSetting, pointSizeSetting, strokeWidthSetting, function (error, result) {
			// Delayed room settings modal hide
			setTimeout(function() {
				// Hides the room settings modal
				$('#roomSettingsModal').modal('hide');
			}, 1000);
		});
	}

});