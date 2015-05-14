var util = require('util');
var OperationHelper = require('apac').OperationHelper;
var oauth = require('./../oauth.js');



var opHelper = new OperationHelper({
    awsId:     oauth.ids.amazonProductsApi.awsId, 
    awsSecret: oauth.ids.amazonProductsApi.awsSecret, 
    assocId:   oauth.ids.amazonProductsApi.assocId,
    version:   oauth.ids.amazonProductsApi.version
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