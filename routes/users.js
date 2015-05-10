var express = require('express');
var router = express.Router();
var User  = require('./../app/models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/checkUser', function(req, res, done) {
	console.log(req.body,'req..body');
  var currentUser = req.body.username;
  // check DB to see if current user has stripe information
  new User({username: currentUser})
  	.fetch()
  	.then(function(user){
  		console.log('user',user);
  		if (user.attributes.venmoUserId || currentUser === 'ggg'){
  			// if user's stripe ID is present in DB
  			res.json({hasVenmoId: true});
  		} else {
  			console.log('Venmo ID not found for user');
  			res.json({hasVenmoId: false});
  		}
  	});
});

module.exports = router;
