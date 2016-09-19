'use strict';

describe('Controller: LabordataCtrl', function () {

  // load the controller's module
  beforeEach(module('laborDataVisApp'));

  var LabordataCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LabordataCtrl = $controller('LabordataCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(LabordataCtrl.awesomeThings.length).toBe(3);
  });
});
