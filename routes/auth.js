var express = require('express');
var router = express.Router();
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
router.get('/google', passport.authenticate('google'), function(req, res){
});

// Google OAuth Callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '#/signup' }), function(req, res) {
 res.redirect('#/signin');
});

module.exports = router;
