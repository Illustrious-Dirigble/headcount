angular.module('shortly.links', [])

.controller('EventsController', function ($scope, Links, $http) {
  // Your code here


  //  populating data array with dummy event objects
  $scope.events = [{
    title: 'Party',
    description: 'House party. Beer. Etc.',
    expiration: '12/01/2016',
    thresholdPeople: 5
  },{
    title: 'Graduation',
    description: 'House party. Beer. Etc.',
    expiration: '12/03/2016',
    thresholdPeople: 8
  },{
    title: 'Bachelor Party',
    description: 'House party. Beer. Etc.',
    expiration: '02/01/2016',
    thresholdPeople: 12
  },{
    title: 'Birthday Party',
    description: 'House party. Beer. Etc.',
    expiration: '12/07/2016',
    thresholdPeople: 7
  }];
  $scope.clickedEvent = {};
  $scope.display = false;
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

  $scope.displayEvent = function(obj){
    $scope.clickedEvent = obj;
    $scope.display = true;
  };

  $scope.checkStripe = function(){
    var currentUser = sessionStorage.getItem('user');
    return $http({
      method: 'POST',
      url : '/users/checkUser',
      data : {'username': currentUser}
    })
    .then(function(resp){
      console.log('resp',resp);
    });
  };

});
