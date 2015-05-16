var util = require('util');
var OperationHelper = require('apac').OperationHelper;
if (!process.env.fbClientID) {
var oauth = require('./../oauth.js');
}

var opHelper = new OperationHelper({
    awsId:     process.env.awsId || oauth.ids.amazonProductsApi.awsId,
    awsSecret: process.env.awsSecret || oauth.ids.amazonProductsApi.awsSecret,
    assocId:   process.env.assocId || oauth.ids.amazonProductsApi.assocId,
    version:   process.env.awsVersion || oauth.ids.amazonProductsApi.version
});


  opHelper.search = function(req, res) {
    console.log(req.body)
    opHelper.execute('ItemSearch', {
      'SearchIndex': req.body.category,
      'Keywords': req.body.keyword,
      'ResponseGroup': 'ItemAttributes, Images, EditorialReview',
    }, function(err, results) {   
      res.send(results);
    });
  };

  opHelper.createCart = function(req, res) {
    opHelper.execute('CartCreate', {
      'Item.1.ASIN': req.body.ASIN,
      'CartID': Math.floor(Math.random() * 1000),
      'Item.1.Quantity': 1
    }, function(err, results) {
      if (err) {
        console.log('error: ' + err);
        res.send(err)
      }
      else {
        
        res.send(JSON.stringify(results));
      }
    })
  }





/*

  $scope.createEvent = function() {
    var inv = [];
    var list = $('.selected .compact');
    for (var i = 0; i < list.length; i++){
      inv.push(list[i].children[0].innerText);
    }
    // console.log('inv',inv);
    $scope.invitedUsers = inv;

    $scope.newEvent.invited = $scope.invitedUsers;
    // console.log('Event details', $scope.newEvent);
    return $http({
      method: 'POST',
      url: '/events-create',
      data: $scope.newEvent
    })
    .then(function(resp) {
      $window.location.href = "/";
    });
  };


*/

module.exports = opHelper;
