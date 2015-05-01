var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var bcrypt = require('bcrypt-nodejs');

////////////////////////////////////////////////////////
// Basic version of the User model
////////////////////////////////////////////////////////
/*
var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true
});
*/

////////////////////////////////////////////////////////
// Advanced version of the User model
////////////////////////////////////////////////////////
// Keeping logic that pertains to the user model in
// the express route handler forces us to use the
// controller to instantiate User models. By moving
// key model logic (such as comparing and encrypting
// passwords) into the model, we cleanly seperate
// those two concerns.
////////////////////////////////////////////////////////

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  initialize: function(){
    this.on('creating', this.hashPassword);
  },
  comparePassword: function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
      callback(isMatch);
    });
  },
  hashPassword: function(){
    var cipher = Promise.promisify(bcrypt.hash);
    // return a promise - bookshelf will wait for the promise
    // to resolve before completing the create action
    return cipher(this.get('password'), null, null)
      .bind(this)
      .then(function(hash) {
        this.set('password', hash);
      });
  }
});

module.exports = User;
