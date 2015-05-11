var Invite = require('./../app/models/invite.js');

/**
 * Takes in an event ID and a user ID to be invited.
 * Returns a callback with the created invite passed in
 */
var createInvite = function(eventId, invitedUserId, callback) {
    new Invite({
      event_id: eventId,
      user_id: invitedUserId
    }).save()
      .then(function(invite){
        callback(invite);
      });
};

/**
 * Takes in an event ID and an array of user IDs to be invited.
 * Calls the callback on the array of invites once they are saved to the database.
 */
exports.createInvites = function(eventId, invitedUserIds, callback) {
  var invites = [];

  var inner = function() {
    if (invitedUserIds[0]) {
      createInvite(eventId, invitedUserIds.shift(), function(invite) {
        invites.push(invite);
        inner();
      });
    } else {
      callback(invites);
    }
  };

  inner();

};

exports.updateInvite = function(userId, eventId, inviteAcceptedBool, callback) {

  new Invite({
    user_id: userId,
    event_id: eventId
  }).fetch().then(function(invite) {

    if (inviteAcceptedBool) {
      console.log('invite accepted');

       invite.save({
        joined: true,
        declined: false
      }).then(function(updatedInvite) {
        console.log('Users invite updated!');
        callback(updatedInvite)
        // console.dir(updatedInvite.toJSON());
      });

    } else {
      console.log('invite declined');

       invite.save({
        joined: false,
        declined: true
      }).then(function(updatedInvite) {
        console.log('Users invite updated!');
        callback(updatedInvite);
        // console.dir(updatedInvite.toJSON());

      });
    }
  });

};

