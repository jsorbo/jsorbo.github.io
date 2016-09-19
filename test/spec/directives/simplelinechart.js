'use strict';

describe('Directive: simpleLineChart', function () {

  // load the directive's module
  beforeEach(module('angularD3App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<simple-line-chart></simple-line-chart>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('');
  }));
});
