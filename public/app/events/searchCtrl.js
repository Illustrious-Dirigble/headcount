angular.module('headcount.events', [])

.controller('SearchController', function ($scope, $http, $q) {

$scope.search = {
      search: ''
    };

$scope.searchResults = [];

  $scope.searchAmazon = function() {
   $http({
      method: 'POST',
      url: '/search',
    data: {keyword: $scope.search.search}
    })
    .then(function(response) {
      var results = response.data.ItemSearchResponse.Items[0].Item;
      console.dir(results);
        for (var i = 0; i < results.length; i++) {
          var item = results[i].ItemAttributes[0];
          $scope.searchResults.push({
            'title': item.Title[0], 
            'price': item.ListPrice[0].FormattedPrice[0], 
            'img': results[i].ImageSets[0].ImageSet[0].MediumImage[0].URL[0],
            'description': results[i].EditorialReviews[0].EditorialReview[0].Content[0]
          });
        }
    });
  };
});
