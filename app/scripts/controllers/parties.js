'use strict';
/**
 * @ngdoc function
 * @name muck2App.controller:PartiesCtrl
 * @description
 * # PartiesCtrl
 */
app.controller('PartiesCtrl',['$scope' ,function ($scope) {
    $scope.parties = [
      {
        name: 'My Party',
        id: 1
      },
      {
        name: 'My Other Party',
        id: 2
      }
    ];

    
}]);
