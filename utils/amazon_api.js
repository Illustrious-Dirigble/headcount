var util = require('util');
var OperationHelper = require('apac').OperationHelper;
var oauth = require('./../oauth.js');



var opHelper = new OperationHelper({
    awsId:     process.env.awsId, 
    awsSecret: process.env.awsSecret, 
    assocId:   process.env.assocId,
    version:   process.env.awsVersion
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

module.exports = opHelper;