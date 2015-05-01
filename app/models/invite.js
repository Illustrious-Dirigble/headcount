var db = require('../config');
var Link = require('./link.js')

var Click = db.Model.extend({
  tableName: 'clicks',
  hasTimestamps: true,
  link: function() {
    return this.belongsTo(Link, 'link_id');
  }
});

module.exports = Click;
