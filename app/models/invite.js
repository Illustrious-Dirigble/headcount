var db = require('../config');
var User = require('./user.js')
var Event = require('./event.js')

var Invite = db.Model.extend({
  tableName: 'invites',
  hasTimestamps: true,
  user: function() {
    return this.hasOne(User, 'user_id');
  },
  event: function() {
    return this.hasOne(Event, 'event_id');
  }
});

module.exports = Invite;
