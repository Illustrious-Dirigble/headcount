var db = require('../config');
var Invite = require('../models/invite');

var Invites = new db.Collection();

Invites.model = Invite;

module.exports = Invites;
