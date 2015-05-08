angular.module('headcount.events', [])

.controller('EventsController', function ($scope, Links, $http) {
  // Your code here


  //  populating data array with dummy event objects
  $scope.events = [{
    title: 'Khoa\'s House Party',
    description: 'House party. Beer. Etc.',
    expiration: '12/01/2016',
    thresholdPeople: 5,
    image: 'http://www.explara.com/magazine/wp-content/uploads/2013/07/lets-party.jpg'
  },{
    title: 'Pranav\'s Graduation',
    description: 'Finishing Hack Reactor. Beer. Etc.',
    expiration: '12/03/2016',
    thresholdPeople: 8,
    image: 'http://i.huffpost.com/gen/1153834/images/o-HIGH-SCHOOL-GRADS-facebook.jpg'
  },{
    title: 'Ansel\'s Bachelor Parade',
    description: 'Getting married. Beer. Etc.',
    expiration: '02/01/2016',
    thresholdPeople: 12,
    image: 'http://fiestaparadefloats.com/wp-content/uploads/2014/11/Screen-Shot-2014-11-10-at-4.04.52-PM.png'
  },{
    title: 'Birthday Party for Matt',
    description: 'Turning 21. Beer. Etc.',
    expiration: '12/07/2016',
    thresholdPeople: 7,
    image: 'http://www.icelandlouisville.com/styled-5/files/birthday2-2.jpg'
  }];




  $scope.clickedEvent = {};
  $scope.display = false;
  $scope.hasStripe = false;
  $scope.needInfo = false;
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
      if (resp.data.hasStripeId === true){
        $scope.hasStripe = true;
      } else {
        $scope.needInfo = true;
      }
    });
  };

  $scope.showDetails = function(){
    if ($scope.showCreate === true){
      $scope.showCreate = false;
    } else {
      $scope.showCreate = true;
    }
  };

});
