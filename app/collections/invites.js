var db = require('../config');
var Invite = require('../models/invitee');

var Invites = new db.Collection();

Invites.model = Invite;

module.exports = Invites;
