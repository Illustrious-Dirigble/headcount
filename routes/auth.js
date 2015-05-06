var express = require('express');
var router = express.Router();
var User  = require('./../app/models/user');
var oauth = require('../oauth.js');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Facebook OAuth Initiation
router.get('/facebook', passport.authenticate('facebook'), function(req, res){
});

// Facebook OAuth Callback
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '#/signup' }), function(req, res) {
  res.redirect('#/signin');
});

// Google OAuth Initiation
router.get('/google', passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }), function(req, res){
});

// Google OAuth Callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '#/signup' }), function(req, res) {
 res.redirect('#/signin');
});

// Local Auth
router.post('/local', passport.authenticate('local', { failureRedirect: '#/signup' }), function(req, res) {
	console.log('success signin!!!!!!');
 	res.redirect('..#/events');
});
// local Auth signup
router.post('/local-signup', function(req, res, next) {
 console.log('signup');
 var username  = req.body.username;
 var password  = req.body.password;
 
 new User({username:username})
     .fetch()
     .then(function(model){
       if(model) {
         next(new Error('User already exists'));
       } else {
         new User({username:username,password:password},{isNew:true}).save()
	         .then(function(model){
	           res.end('/events');
	         });
       }
     })
     .catch(function(error){
       console.log('hi',error);
     });
});

module.exports = router;
