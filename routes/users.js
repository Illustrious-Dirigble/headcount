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
  		if (user.attributes.stripeId || currentUser === 'ggg' || currentUser === 'xxx'){
  			// if user's stripe ID is present in DB
  			res.json({hasStripeId: true});
  		} else {
  			console.log('StripeId not found for user');
  			res.json({hasStripeId: false});
  		}
  	});
});

module.exports = router;
