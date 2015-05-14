var express = require('express');
var router = express.Router();
var User  = require('./../app/models/user');

router.post('/accountinfo', function(req, res, done) {
  var currentUser = req.body.username;
  new User({username: currentUser})
    .fetch()
    .then(function(user){
      res.json(user);
    });
});

router.post('/accountupdate', function(req, res, done) {
  console.log('updating account');
  var currentUser = req.body.username;
  var data = req.body;
  new User({username: currentUser})
    .fetch()
    .then(function(user) {
      user.save(data)
        .then(function() {
          res.end('updated');
        });
    });
});


router.post('/checkUser', function(req, res, done) {
  // console.log(req.body,'req..body');
  var currentUser = req.body.username;
  // check DB to see if current user has stripe information


  new User({username: currentUser})
    .fetch({
      withRelated: ['invites']
    })
    .then(function(user){
      if (user) {

      // console.log('current invites', user.related('invites').models);
        var inviteModels = user.related('invites').models;

        var currentInvites = [];
        for (var i = 0; i < inviteModels.length; i++) {

          if (inviteModels[i].attributes.joined || inviteModels[i].attributes.declined) {
            currentInvites.push(inviteModels[i].attributes.event_id)
          }
        }

      // console.log(currentInvites);

       if (user.attributes.venmoAccessToken && user.attributes.venmoUserId) {
         res.json({
           hasVenmoInfo: true,
           userID: user.attributes.id,
           relatedEventIds: currentInvites
         });

       } else {

         res.json({
           hasVenmoInfo: false,
           userID: user.attributes.id,
           relatedEventIds: currentInvites
         });
       }

     } else {
        res.end();
     }


    });

});

module.exports = router;
