var util = require('util');
var OperationHelper = require('apac').OperationHelper;



var opHelper = new OperationHelper({
    awsId:     AKIAJRFI5ZD6K5DJBYEA//process.env.awsId, 
    awsSecret: HxDq1Ngik0hY4o225J4XzljB5bNWWX0jmHJkHKOm//process.env.awsSecret, 
    assocId:   headcount-20//process.env.assocId,
    version:   2013-08-01//process.env.awsVersion
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
      'Item.ASIN': req.body.ASIN,
      'CartID': Math.floor(Math.random() * 1000),
      'Item.Quantity': 1
    }, function(err, results) {
      if (err) console.log(err);
      else console.log(results);
    })
  }


module.exports = opHelper;