'use strict';

/**
 * @ngdoc directive
 * @name theundergroundApp.directive:forminput
 * @description
 * # forminput
 */

var watcherFor = function(form,name) {
	return function() {
		if (name && form[name])
		{
			return form[name].$invalid;
		}
	};
};



angular.module('theundergroundApp')
  .directive('forminput', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element = element[0];
        element.classList.add('form-group');

        var input = element.querySelector('input, textarea, select');
        var type = input.getAttribute('type');
        var name = input.getAttribute('name');
        if( type !== 'checkbox' && type !== 'radio') 
        {
        	input.classList.add('form-control');
        }

        var label = element.querySelector('label');
        label.classList.add('control-label');


      }
    };
  });
