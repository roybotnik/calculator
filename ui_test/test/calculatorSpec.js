describe("calculatorApp", function () {
  it("should exist", function () {
    expect(angular.module('calculatorApp')).toBeDefined();
  });

  describe("CalculationController", function () {
    var $scope;

    beforeEach(module('calculatorApp'));

    beforeEach(inject(function($rootScope, $controller) {
      $scope = $rootScope.$new();
      $controller('CalculationController', {$scope: $scope});
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
  });
});
