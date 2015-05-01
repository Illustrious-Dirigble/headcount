var db = require('../config');
var Invite = require('./invite');
var User = require('./user');

var Event = db.Model.extend({
  tableName: 'events',
  hasTimestamps: true,
  defaults: {
  },
  initialize: function(){
  }
});

module.exports = Event;
