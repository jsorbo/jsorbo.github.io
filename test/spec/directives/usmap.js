'use strict';

describe('Directive: usMap', function () {

  // load the directive's module
  beforeEach(module('laborDataVisApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<us-map></us-map>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the usMap directive');
  }));
});
