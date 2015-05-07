angular.module('shortly.shorten', [])

.controller('AccountsController', function ($scope, $location, Links) {
  // Your code here

  $scope.link = {};
  

  $scope.hasStripeConnectAccount = function() {

    var currentUser = sessionStorage.getItem('user');
    console.log('user',currentUser);

  };


  // $scope.addLink = function () {
  //   $scope.loading = true;
  //   Links.addLink($scope.link)
  //     .then(function () {
  //       $scope.loading = false;
  //       $location.path('/');
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // };
});
