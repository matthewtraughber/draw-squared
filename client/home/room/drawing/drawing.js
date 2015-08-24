////////////////////////////////////////////////////////////////////////////////////
// Runs when template is rendered
////////////////////////////////////////////////////////////////////////////////////
Template.drawing.rendered = function () {
	// Gets room ID from local storage
	var roomID = localStorage.getItem('room');

	// Variable initialization for the whiteboard
	var whiteboard = new blockDrawing();

	// When the drawing is rendered, automatically draw the stored drawing
	Deps.autorun(function() {
		// Grabs the points related to the room's drawing
		var points = drawings.find({'room' : roomID}).fetch();

		// Catches if whiteboard exists
		if (whiteboard) {
			// Draws the points
			whiteboard.draw(points);
		}
	});
};


////////////////////////////////////////////////////////////////////////////////////
// Manages drawing functionality
////////////////////////////////////////////////////////////////////////////////////
Template.drawing.events({
	'click': function (event) {
		// Prevents the default action the browser would normally take regarding the event	
		event.preventDefault();

		// Gets room ID from local storage
		var roomID = localStorage.getItem('room');

		// Gets values from the cursors
		var roomInfo = rooms.find({'_id' : roomID}).fetch();

		// Catches simulation error
		if (roomInfo.length !== 0) {
			// Gets values from the cursors
			var lockedRoom = rooms.find({'_id' : roomID}).fetch()[0].locked;
			var currentUser = rooms.find({'_id' : roomID}).fetch()[0].currentUser;

			// Detects if room isn't locked
			if (lockedRoom === true) {
				// Detects if user has locked access
				if (currentUser === Meteor.userId()) {
					// Draws the point clicked
					drawPoint();
				} else {
					// Alerts the user the room is locked
					Meteor.call('prepareLockedRoomModal');
				}
			} else {
				// Draws the point clicked
				drawPoint();
			}
		}
	},

	'mousedown': function (event) {
		// Prevents the default action the browser would normally take regarding the event	
		event.preventDefault();

		// Gets room ID from local storage
		var roomID = localStorage.getItem('room');

		// Gets values from the cursors
		var roomInfo = rooms.find({'_id' : roomID}).fetch();

		// Catches simulation error
		if (roomInfo.length !== 0) {
			// Gets values from the cursors
			var lockedRoom = rooms.find({'_id' : roomID}).fetch()[0].locked;
			var currentUser = rooms.find({'_id' : roomID}).fetch()[0].currentUser;

			// Detects if room isn't locked
			if (lockedRoom === true) {
				// Detects if user has locked access
				if (currentUser === Meteor.userId()) {
					// Sets session to start drawing
					Session.set('draw', true);
				} else {
					// Alerts the user the room is locked
					Meteor.call('prepareLockedRoomModal');
				}
			} else {
				// Sets session to start drawing
				Session.set('draw', true);
			}
		}
	},

	'mouseup': function (event) {
		// Prevents the default action the browser would normally take regarding the event	
		event.preventDefault();

		// Sets session to stop drawing
		Session.set('draw', false);
	},

	'mousemove': function (event) {
		// Prevents the default action the browser would normally take regarding the event	
		event.preventDefault();

		// Detects if drawing is set
		if (Session.get('draw')) {
			// Draws the points as the mouse is moved
			drawPoint();
		}
	}
});


////////////////////////////////////////////////////////////////////////////////////
// Draws the block by inserting it into the drawing collection 
// (associates it to the respective room)
////////////////////////////////////////////////////////////////////////////////////
function drawPoint() {
	// Gets room ID from local storage
	var roomID = localStorage.getItem('room');

	// Grabs the offset
	var offset = $('#whiteboard').offset();

	// Inserts the points into the drawings collection (linked to the roomID)
	drawings.insert({
		room : (roomID),
		x : (event.pageX - offset.left),
		y : (event.pageY - offset.top)
	});
}


////////////////////////////////////////////////////////////////////////////////////
// Manages D3 & block drawing settings
////////////////////////////////////////////////////////////////////////////////////
function blockDrawing() {
	// SVG variable initialization
	var svg;

	// Creates the SVG whiteboard (with specified settings)
	var createSVG = function() {
		svg = d3.select('#whiteboard').append('svg')
			.attr('fill', '#000')
			.attr('stroke', '#000')
			.attr('width', '100%')
			.attr('height', '100%');
	};

	// Creates the whiteboard
	createSVG();

	// Clears the SVG whiteboard
	this.clear = function() {
		d3.select('svg').remove();

		// Recreates the whiteboard with a blank slate
		createSVG();
	};

	// Draws those points!
	this.draw = function(points) {
		// Detects if there are no points (will clear the whiteboard)
		if (points.length < 1) {
			this.clear();
			return;
		}

		// Detects if whiteboard exists
		if (svg) {
			// Gets room ID from local storage
			var roomID = localStorage.getItem('room');

			// Draws those points (with specified settings)
			svg.selectAll('circle').data(points, function(data) { return data._id; })
				// Creates the points (circles)
				.enter().append('circle')
				.attr('r', function () { return rooms.find({_id : roomID}).fetch()[0].pointSize; })
				.attr('cx', function (data) { return data.x; })
				.attr('cy', function (data) { return data.y; });

				// Creates a D3 line element via all the collected points
				var line = d3.svg.line()
					.interpolate(rooms.find({_id : roomID}).fetch()[0].interpolation)
					.x(function (data) { return data.x; })
					.y(function (data) { return data.y; });

				// Removes the existing path so we can add the new one
				d3.select("path").remove();

				// Creates a path with defined settings based off the line details above
				svg.append("svg:path")
					.attr("d", line(points))
					.style("stroke-width", function () { return rooms.find({_id : roomID}).fetch()[0].strokeWidth; })
					.style("stroke", function () { return rooms.find({_id : roomID}).fetch()[0].strokeColor; })
					.style("fill", function () { return rooms.find({_id : roomID}).fetch()[0].fillColor; });
		}
	};
}

