var util = require('util');
var OperationHelper = require('apac').OperationHelper;
var oauth = require('./../oauth.js');

var opHelper = new OperationHelper({
    awsId:     oauth.ids.amazonProductsApi.awsId, //process.env.awsId, 
    awsSecret: oauth.ids.amazonProductsApi.awsSecret, //process.env.awsSecret, 
    assocId:   oauth.ids.amazonProductsApi.assocId, //process.env.assocId,
    version:   oauth.ids.amazonProductsApi.version //process.env.awsVersion 
});


  opHelper.search = function(req, res) {
    opHelper.execute('ItemSearch', {
      'SearchIndex': 'Books',
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
        console.log('results: ' + JSON.stringify(results));
        console.log(results.PurchaseURL);
        res.send(JSON.stringify(results));
      }
    })
  }


module.exports = opHelper;