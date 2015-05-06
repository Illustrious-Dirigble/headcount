angular.module('shortly.links', [])

.controller('EventsController', function ($scope, Links) {
  // Your code here

  $scope.data = {};
  $scope.getLinks = function () {
    Links.getAll()
      .then(function (links) {
        $scope.data.links = links;
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  // $scope.getLinks();
});
