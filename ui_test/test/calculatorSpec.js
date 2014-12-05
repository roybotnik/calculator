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

    describe("handleClearInput", function () {
      it("clear the appropriate values", function () {
        $scope.displayValue = 123123;
        $scope.operator = '+';
        $scope.firstOperand = '123122';
        $scope.secondOperand = '1';

        $scope.handleClearInput();

        expect($scope.displayValue).toBe(0);
        expect($scope.operator).toBe(null);
        expect($scope.firstOperand).toBe('');
        expect($scope.secondOperand).toBe('');
      });
    });

    describe("handleEqualsInput", function () {
      it("kickoff calculation", function () {
        spyOn($scope, 'calculate');
        $scope.handleEqualsInput();
        expect($scope.calculate).toHaveBeenCalled();
      });
    });

    describe("handleOperatorInput", function () {
      it("should set the operator if one is no set then update the display value", function () {
        $scope.firstOperand = '123';
        $scope.handleOperatorInput('+');
        expect($scope.operator).toBe('+');
        expect($scope.displayValue).toBe('123 +');
      });

      it("should calculate if the user already supplied a full expression", function () {
        $scope.firstOperand = '123';
        $scope.operator = '+';
        $scope.secondOperand = '1';
        spyOn($scope, 'calculate').and.returnValue({then:function(){}});
        $scope.handleOperatorInput('+');
        expect($scope.calculate).toHaveBeenCalled();
        expect($scope.secondOperand).toBe('');
      });
    });

    describe("handleDigitInput", function () {
      it("should update the first operand if no operator has been provided", function () {
        $scope.handleDigitInput('1');
        expect($scope.firstOperand).toBe('1');
        expect($scope.displayValue).toBe('1');
      });

      it("should update the second operand if the operator has been provided", function () {
        $scope.firstOperand = '1';
        $scope.operator = '+';
        $scope.handleDigitInput('1');
        expect($scope.secondOperand).toBe('1');
        expect($scope.displayValue).toBe('1 + 1');
      });
    });

    describe("newValueForOperand", function () {
      it("should only allow one decimal to be inserted", function () {
        var result = $scope.newValueForOperand('1', '.');
        expect(result).toBe('1.');

        var result = $scope.newValueForOperand('1.1', '.');
        expect(result).toBe('1.1');
      });
    });
  });
});
