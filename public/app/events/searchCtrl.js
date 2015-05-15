angular.module('headcount.events')


.controller('SearchController', function ($scope, $http, $q) {

$scope.imageURL = '';
$scope.cartItem;
$scope.checkoutURL = '';

$scope.search = {
      search: ''
    };

    $scope.showSearch = true;
    $scope.showCart = false;

$scope.addToCart = function(ASIN, imageURL, description) {
  $http({
    method: 'POST',
    url: '/addToCart',
    data: {
      'ASIN': ASIN
    }
  })
  .then(function(response) {
    console.dir(response);
      console.log($scope.showSearch);
    // var purchaseEvent = {
      var cart = response.data.CartCreateResponse.Cart[0];
      var cartItem = cart.CartItems[0].CartItem[0];
      cartItem.description = description;
      cartItem.imageURL = imageURL;
      cartItem.checkoutURL = cart.PurchaseURL[0];
      cartItem.Title = cartItem.Title[0];
      $scope.cartItem = cartItem;
      console.log(cartItem.checkoutURL);
      $scope.checkoutURL = cart.PurchaseURL[0];
      $scope.showSearch = false;
      $scope.showCart = true;
    // }
    // $http({
    //   method: 'POST',
    //   url: '/events-create',
    //   data: $scope.newEvent
    // })
    // .then(function(resp) {
    //   $window.location.href = "/";
    // });
  })
};


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
          console.log(results[i].ASIN[0]);
          var item = results[i].ItemAttributes[0];
          var itemPrice = item.ListPrice ? item.ListPrice[0].FormattedPrice[0] : "N/A";
          $scope.imageURL = results[i].ImageSets[0].ImageSet[0].MediumImage[0].URL[0]
          $scope.searchResults.push({
            'title': item.Title[0],
            'price': itemPrice,
            'img': results[i].ImageSets[0].ImageSet[0].MediumImage[0].URL[0],
            'description': results[i].EditorialReviews[0].EditorialReview[0].Content[0],
            'asin': results[i].ASIN[0]
          });
        }
    });
  };

//   $scope.allContacts = 

// <md-contact-chips
//       ng-model="ctrl.contacts"
//       md-contacts="ctrl.querySearch($query)"
//       md-contact-name="name"
//       md-contact-image="image"
//       md-require-match
//       filter-selected="ctrl.filterSelected"
//       placeholder="To">
//     </md-contact-chips>
//     <md-list class="fixedRows">
//     <md-subheader class="md-no-sticky">Contacts</md-subheader>
//     <md-list-item ng-hide="true" class="md-2-line contact-item invitees" data-id="{{contact.id}}" ng-repeat="(index, contact) in ctrl.allContacts" ng-if="ctrl.contacts.indexOf(contact) < 0" layout="column">
//     <img ng-src="{{contact.image}}" class="md-avatar" alt="{{contact.name}}" />
//     <div class="md-list-item-text compact">
//       <h3>{{contact.name}}</h3>
//     </div>
//     </md-list-item>
//     <md-list-item ng-hide="true" class="md-2-line contact-item selected" ng-repeat="(index, contact) in ctrl.contacts">
//     <img ng-hide="true" ng-src="{{contact.image}}" class="md-avatar" alt="{{contact.name}}" />
//     <div ng-hide="true" class="md-list-item-text compact">
//       <h3 ng-hide="true">{{ contact.id }}</h3>
//     </div>
//     </md-list-item>
//     </md-list>
//     </md-content>


});

