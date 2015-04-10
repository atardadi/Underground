'use strict';

describe('Directive: forminput', function () {

  // load the directive's module
  beforeEach(module('theundergroundApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<forminput></forminput>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the forminput directive');
  }));
});
