////////////////////////////////////////////////////////////////////////////////////
// Helper functions (methods, whatever)
////////////////////////////////////////////////////////////////////////////////////
Meteor.methods({

	////////////////////////////////////////////////////////////////////////////////////
	// Function that trims whitespace
	////////////////////////////////////////////////////////////////////////////////////
	removeWS : function(value) {
		return value.replace(/\s/g, "");
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that enforces password minimum length (for registration)
	////////////////////////////////////////////////////////////////////////////////////
	enforcePWLength : function(value) {
		return (value.length >= 6);
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that gets server date
	////////////////////////////////////////////////////////////////////////////////////
	getServerDate : function() {
		return new Date();
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that creates a token (not used)
	////////////////////////////////////////////////////////////////////////////////////
	createToken : function(userID) {
		// Array storing each character of the userID
		var userIDCharacters = userID.split('');

		// Variable initialization for base-converted userID
		var convertedUserID;

		// Gets the current date / time
		var currentTime = Date.now();

		// Loops through each character
		_.each(userIDCharacters, function(character){
			// Converts the character from decimal to hexadecimal
			Meteor.call('decimalToHexadecimal', character.charCodeAt(), function (error, result) {
				// Adds the base converted character to the new userID
				convertedUserID += result;
			});
		});

		// Creates the token data with the base converted userID and the base converted time
		var tokenData = convertedUserID + currentTime.toString(16);

		// Generates the SHA1 checkSum with CryptoJS
		var checkSum = CryptoJS.SHA1(tokenData);

		// Returns the checkSum + tokenData
		return checkSum + tokenData;
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that verifies a token (not used)
	////////////////////////////////////////////////////////////////////////////////////
	verifyToken : function(token) {
		// Splits the token up into the respective parts
		var checkSum = token.substr(0, 40);
		var tokenData = token.substr(40, token.length);

		// Checks if the checkSum matches
		if (checkSum === CryptoJS.SHA1(tokenData)) {
			// It passed
			return true;
		} else {
			// TAMPERING DETECTED!
			return false;
		}
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that gets a user's ID from a token (not used)
	////////////////////////////////////////////////////////////////////////////////////
	getTokenUserID : function(token) {
		// Splits the token up into the respective parts
		var tokenData = token.substr(40, token.length);
		var convertedUserID = tokenData.substr(tokenData.length - 27, 17);

		// Array storing each character of the converted userID
		var convertedUserIDCharacters = convertedUserID.split('');

		// Variable initialization for restored userID
		var userID;

		// Loops through each character
		_.each(convertedUserIDCharacters, function(character){
			// Converts the character from decimal to hexadecimal
			Meteor.call('hexadecimalToDecimal', character.charCodeAt(), function (error, result) {
				// Adds the base converted character to the restored userID
				userID += result;
			});
		});

		// Returns the userID
		return userID;
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that gets time from a token (not used)
	////////////////////////////////////////////////////////////////////////////////////
	getTokenTime : function(token) {
		// Splits the token up into the respective parts
		var tokenData = token.substr(40, token.length);
		var convertedTime = tokenData.substr(tokenData.length - 10, 10);

		// Converts the character from hexadecimal to decimal
		Meteor.call('hexadecimalToDecimal',convertedTime, function (error, result) {
			// Gets the time after the base conversion
			restoredTime = result.toString();
		});

		// Returns the base restored time
		return restoredTime;
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that converts a decimal based string to hexadecimal base (not used)
	////////////////////////////////////////////////////////////////////////////////////
	decimalToHexadecimal : function(decimal) {
		return decimal.toString(16);
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that converts a hexadecimal based string to decimal base (not used)
	////////////////////////////////////////////////////////////////////////////////////
	hexadecimalToDecimal : function(hexadecimal) {
		return parseInt(hexadecimal, 16);
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that validates email format
	////////////////////////////////////////////////////////////////////////////////////
	validateEmail : function(email) {
		// Regex query to test email
		var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

		// Email is not correctly formatted
		if(!emailRegex.test(email)) {
			return false;
		}
		// Email is correctly formatted
		else {
			return true;
		}
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that time for message timestamp
	////////////////////////////////////////////////////////////////////////////////////
	formatTime : function(value) {
		// Gets hours, minutes, seconds from the time
		var currentHours = value.getUTCHours();
		var currentMinutes = value.getUTCMinutes();
		var currentSeconds = value.getUTCSeconds();

		// Formats the time for displaying
		currentHours = (currentHours < 10 ? "0" : "") + currentHours;
		currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;
		currentSeconds = (currentSeconds < 10 ? "0" : "") + currentSeconds;

		time = currentHours + ":" + currentMinutes + ":" + currentSeconds;

		return time;
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that updates a user's logged in status
	////////////////////////////////////////////////////////////////////////////////////
	updateUserLoginStatus : function(status, user) {
		Meteor.users.update(user, {
			$set : {
				'profile.loggedIn' : status
			}
		});
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that gets a user's status, and returns if they are available for pvt
	////////////////////////////////////////////////////////////////////////////////////
	getUserStatus : function(invitee) {
		// Detects if invitee is logged in (cursor)
		var userLoggedIn = Meteor.users.find({'_id' : invitee}, {
			fields : {
				'profile.loggedIn' : 1
			}
		});

		// Detects if invitee is already invited (cursor)
		var userInvited = Meteor.users.find({'_id' : invitee}, {
			fields : {
				'profile.pvt.invited' : 1
			}
		});

		// Detects if invitee is inviting someone (cursor)
		var userInviting = Meteor.users.find({'_id' : invitee}, {
			fields : {
				'profile.pvt.inviting' : 1
			}
		});

		// Detects if invitee is in lobby or other room (cursor)
		var userRoom = Meteor.users.find({'_id' : invitee}, {
			fields : {
				'profile.pvt.room' : 1
			}
		});

		// Gets values from the cursors
		var userLoggedInVal = userLoggedIn.fetch()[0].profile.loggedIn;
		var userInvitedVal = userInvited.fetch()[0].profile.pvt.invited;
		var userInvitingVal = userInviting.fetch()[0].profile.pvt.inviting;
		var userRoomVal = userRoom.fetch()[0].profile.pvt.room;

		// Detects if the user can be invited
		if (userLoggedInVal === false || userInvitedVal === true || userInvitingVal === true || userRoomVal !== 'lobby') {
			return false;
		} else {
			return true;
		}
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that invites a user to a private room
	////////////////////////////////////////////////////////////////////////////////////
	startUserInvite : function(inviter, invitee) {
		// Updates invitee information
		Meteor.users.update(invitee, {
			$set : {
				'profile.pvt.invited' : true,
				'profile.pvt.inviter' : inviter,
				'profile.pvt.inviting' : false
			}
		});

		return true;
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that cancels a user's invite to a private room
	////////////////////////////////////////////////////////////////////////////////////
	cancelUserInvite : function(inviter, invitee) {
		// Gets value from cursor
		var storedInviter = Meteor.users.find({'_id' : invitee}).fetch()[0].profile.pvt.inviter;

		if (inviter === storedInviter) {
			// Updates invitee information
			Meteor.users.update(invitee, {
				$set : {
					'profile.pvt.invited' : false,
					'profile.pvt.inviter' : inviter,
					'profile.pvt.inviting' : false
				}
			});
		}

		return true;
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that flags a user as inviting another user
	////////////////////////////////////////////////////////////////////////////////////
	lockInviter : function(inviter, invitee) {
		// Updates inviter information (inviting someone)
		Meteor.users.update(inviter, {
			$set : {
				'profile.pvt.invited' : false,
				//'profile.pvt.inviter' : '',
				'profile.pvt.inviting' : true,
				'profile.pvt.invitee' : invitee
			}
		});

		return true;
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that unflags a user as inviting another user
	////////////////////////////////////////////////////////////////////////////////////
	unlockInviter : function(inviter, invitee, refusedInvite) {
		// Updates inviter information (not inviting someone)
		Meteor.users.update(inviter, {
			$set : {
				'profile.pvt.invited' : false,
				'profile.pvt.inviting' : false,
				'profile.pvt.invitee' : invitee
			}
		});

		// Detects if invite was refused
		if (refusedInvite) {
			// Updates invitee information
			Meteor.users.update(invitee, {
				$set : {
					'profile.pvt.invited' : false,
					'profile.pvt.inviter' : '',
					'profile.pvt.inviting' : false,
					'profile.pvt.invitee' : ''
				}
			});
		}

		return true;
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that creates a private room
	////////////////////////////////////////////////////////////////////////////////////
	createRoom : function(inviterID, inviteeID) {
		// Creates room and stores the ID
		var roomID = rooms.insert({
			inviter : inviterID,
			invitee : inviteeID,
			locked : false,
			currentUser : '',
			pointSize : 5,
			strokeWidth : 5,
			interpolation : 'Linear',
			strokeColor : 'Red',
			fillColor : 'Blue'
		});

		// Updates inviter information
		Meteor.users.update(inviterID, {
			$set : {
				'profile.pvt.room' : roomID
			}
		});

		// Detects if a private (1 user) room is being created
		if (inviteeID !== "") {
		// Updates invitee information
			Meteor.users.update(inviteeID, {
				$set : {
					'profile.pvt.room' : roomID
				}
			});
		}

		// Returns room ID for page navigation
		return roomID;
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that locks the specified room to the specified user
	////////////////////////////////////////////////////////////////////////////////////
	lockRoom : function(roomID, userID) {
		// Sets specific room's settings
		rooms.update(roomID, {
			$set : {
				locked : true,
				currentUser : userID
			}
		});
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that unlocks the specified room
	////////////////////////////////////////////////////////////////////////////////////
	unlockRoom : function(roomID) {
		// Sets specific room's settings
		rooms.update(roomID, {
			$set : {
				locked : false,
				currentUser : ''
			}
		});
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that updates a specific room's settings
	////////////////////////////////////////////////////////////////////////////////////
	updateRoomSettings : function(roomID, interpolationSetting, strokeColorSetting, fillColorSetting, pointSizeSetting, strokeWidthSetting) {
		// Sets specific room's settings
		rooms.update(roomID, {
			$set : {
				pointSize : pointSizeSetting,
				strokeWidth : strokeWidthSetting,
				interpolation : interpolationSetting,
				strokeColor : strokeColorSetting,
				fillColor : fillColorSetting
			}
		});
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that clears a room's whiteboard
	////////////////////////////////////////////////////////////////////////////////////
	clearRoomWhiteboard : function (roomID) {
		// Remove drawings (points) associated with the room
		drawings.remove({room : roomID});
	},


	////////////////////////////////////////////////////////////////////////////////////
	// Function that resets user's profile stats (and removes them from private rooms)
	////////////////////////////////////////////////////////////////////////////////////
	resetUser : function() {
		// Gets values from the cursors
		var userInfo = Meteor.users.find({'_id' : Meteor.userId()}).fetch();

		// Catches simulation error
		if (userInfo.length !== 0) {
			// Gets user's current room
			var userRoom = Meteor.users.find({'_id' : Meteor.userId()}).fetch()[0].profile.pvt.room;

			// Detects if user was in a private room
			if (userRoom !== null || userRoom !== undefined || userRoom !== '' || userRoom !== 'lobby') {
				// Gets room users from passed in room
				var inviterID = rooms.find({'_id' : userRoom}).fetch()[0].inviter;
				var inviteeID = rooms.find({'_id' : userRoom}).fetch()[0].invitee;

				// Detects if user was inviter
				if (Meteor.userId() === inviterID) {
					// Removes inviter from room
					rooms.update(userRoom, {
						$set : {
							'inviter' : ''
						}
					});
				}
				// Detects if user was invitee
				else if (Meteor.userId() === inviteeID) {
					// Removes invitee from room
					rooms.update(userRoom, {
						$set : {
							'invitee' : ''
						}
					});
				}
			}
		}

		// Resets user's profile
		Meteor.users.update(Meteor.userId(), {
			$set : {
				'profile.pvt.invited' : false,
				'profile.pvt.inviter' : '',
				'profile.pvt.inviting' : false,
				'profile.pvt.invitee' : '',
				'profile.pvt.room' : 'lobby'
			}
		});
	},

	////////////////////////////////////////////////////////////////////////////////////
	// Function that gets room users
	////////////////////////////////////////////////////////////////////////////////////
	getRoomUsers : function(roomID) {
		// Variable initialization
		var inviter;
		var invitee;
		var inviterID;
		var inviteeID;
		var inviterName;
		var inviteeName;

		// Detects if room isn't set
		if (roomID !== undefined && roomID !== null && roomID !== '') {

			// Gets values from the cursors
			var room = rooms.find({'_id' : roomID}).fetch();

			// Catches simulation error
			if (room.length !== 0) {
				// Gets room users from passed in room
				inviterID = rooms.find({'_id' : roomID}).fetch()[0].inviter;
				inviteeID = rooms.find({'_id' : roomID}).fetch()[0].invitee;

				// Catches simulation error
				if (inviterID !== "" || inviterID !== undefined || inviterID !== null) {
					// Gets room inviter
					inviter = Meteor.users.find({'_id' : inviterID}).fetch();

					// Catches simulation error
					if (inviter.length !== 0) {
						// Gets room inviter's name
						inviterName = Meteor.users.find({'_id' : inviterID}).fetch()[0].username;
					}
				}

				// Catches simulation error
				if (inviteeID !== "" || inviteeID !== undefined || inviteeID !== null) {
					// Gets room invitee
					invitee = Meteor.users.find({'_id' : inviteeID}).fetch();

					// Catches simulation error
					if (invitee.length !== 0) {
						// Gets room invitee's name
						inviteeName = Meteor.users.find({'_id' : inviteeID}).fetch()[0].username;
					}
				}

				// Puts names in object to be returned
				var roomUserNames = {'inviter' : inviterName, 'invitee' : inviteeName};

				return roomUserNames;
			}
		}
	}



});