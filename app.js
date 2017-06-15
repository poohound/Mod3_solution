(function (){
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', foundItemsDirective);

  function foundItemsDirective(){
    var ddo = {
      templateUrl: 'foundItems.html',
      scope:{
        found: '<',
        onRemove:'&'
      },
      controller:'NarrowItDownController',
      controllerAs: 'list',
      bindToController: true
    };
    return ddo;
  }

  NarrowItDownController.$inject = ['$scope', 'MenuSearchService'];
  function NarrowItDownController($scope, MenuSearchService) {
    var list = this;
    list.found = [];

    $scope.search = '';
    $scope.SearchMenu = function(search){
      list.found = MenuSearchService.getMatchedMenuItems(search);
      console.log (list.found);
    }
    list.removeItem = function(itemIndex){
      MenuSearchService.removeItem(itemIndex);
    }
    list.emptyList = function(){
      if(list.found.length ==0){
        return true;
      }else{
        return false;
      }
    };
  }
  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http){
    var service = this;
    var foundItems = [];

    service.removeItem = function(itemIndex){
      foundItems.splice(itemIndex, 1);
    }

    service.getMatchedMenuItems = function(searchTerm) {
      foundItems = [];

      searchTerm = searchTerm.trim().toLowerCase();

      if (searchTerm ==''){
        foundItems = [];
      }else{
        $http({url: ("https://davids-restaurant.herokuapp.com/menu_items.json")})
        .then(function (response){

            for ( var i = 0; i < response.data.menu_items.length - 1 ; i++){
              if (response.data.menu_items[i].description.toLowerCase().indexOf(searchTerm) !== -1){
                foundItems.push( response.data.menu_items[i]);
              }
            }
        }).catch(function (error) {
          console.log("Error while retrieving the data.");
        });
      }
      return foundItems;
    };
  }
})();
