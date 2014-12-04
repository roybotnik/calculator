describe("calculatorApp", function () {
  it("should exist", function () {
    expect(angular.module('calculatorApp')).toBeDefined();
  });

  describe("CalculationController", function () {
    var $scope;
    var controller;

    beforeEach(module('calculatorApp'));

    beforeEach(inject(function($rootScope, $controller) {
      $scope = $rootScope.$new();
      controller = $controller('CalculationController', {$scope: $scope});
    }));

    it("should have appropriate default values", function () {
      expect($scope.displayValue).toBe(0);
      expect($scope.operator).toBe(null);
      expect($scope.repeatOperator).toBe(null);
      expect($scope.repeatOperand).toBe(null);
      expect($scope.firstOperand).toBe('');
      expect($scope.secondOperand).toBe('');
      expect($scope.allowedOperators).toEqual(['+','-','/','*']);
    });

    it("should listen to inputReceived events and process them", function () {
      spyOn($scope, 'processInput').and.callThrough();
      $scope.$broadcast('inputReceived', '+');
      expect($scope.processInput).toHaveBeenCalled();
    });
  });
});
