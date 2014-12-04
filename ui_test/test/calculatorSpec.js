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

    describe("processInput", function () {
      it("should do nothing if calculating is true", function () {
        spyOn($scope, 'handleClearInput').and.callThrough();
        $scope.calculating = true;
        $scope.processInput('c');
        expect($scope.handleClearInput.calls.count()).toBe(0);
      });
      it("should handle c as clear", function () {
        spyOn($scope, 'handleClearInput').and.callThrough();
        $scope.processInput('c');
        expect($scope.handleClearInput).toHaveBeenCalled();
      });

      it("should handle equals as equals", function () {
        spyOn($scope, 'handleEqualsInput').and.callThrough();
        $scope.processInput('=');
        expect($scope.handleEqualsInput).toHaveBeenCalled();
      });

      it("should handle an operator as an operator if the first operand is present", function () {
        $scope.firstOperand = '1';
        spyOn($scope, 'handleOperatorInput').and.callThrough();
        $scope.processInput('+');
        expect($scope.handleOperatorInput).toHaveBeenCalled();
      });

      it("should handle digits", function () {
        spyOn($scope, 'handleDigitInput');
        $scope.processInput('1');
        expect($scope.handleDigitInput).toHaveBeenCalled();
      });

      it("should handle . as a digit", function () {
        spyOn($scope, 'handleDigitInput');
        $scope.processInput('.');
        expect($scope.handleDigitInput).toHaveBeenCalled();
      });

      it("should ignore an operator if the first operand is not present", function () {
        spyOn($scope, 'handleOperatorInput');
        $scope.processInput('+');
        expect($scope.handleOperatorInput.calls.count()).toBe(0);
      });

      it("should ignore an operator if the first operand is not present", function () {
        spyOn($scope, 'handleOperatorInput');
        $scope.processInput('+');
        expect($scope.handleOperatorInput.calls.count()).toBe(0);
      });
    });
  });
});
