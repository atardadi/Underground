'use strict';

/**
 * @ngdoc function
 * @name theundergroundApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the theundergroundApp
 */
angular.module('theundergroundApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
