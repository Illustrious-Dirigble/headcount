var express = require('express');
var router = express.Router();
var oauth = require('../oauth.js');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google').Strategy;

// Facebook OAuth Initiation
app.get('/facebook', passport.authenticate('facebook'), function(req, res){
});

// Facebook OAuth Callback
app.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: 'FAILURE REDIRECT' }), function(req, res) {
  res.redirect('SUCCESSFUL REDIRECT');
});

// Google OAuth Initiation
app.get('/google', passport.authenticate('google'), function(req, res){
});

// Google OAuth Callback
app.get('/google/callback', passport.authenticate('google', { failureRedirect: 'FAILURE REDIRECT' }), function(req, res) {
 res.redirect('SUCCESSFUL REDIRECT');
});
