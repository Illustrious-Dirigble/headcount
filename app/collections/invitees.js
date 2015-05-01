var db = require('../config');
var Invitee = require('../models/invitee');

var Invitees = new db.Collection();

Invitees.model = Invitee;

module.exports = Invitees;
