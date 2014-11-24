calculatorApp = angular.module('calculatorApp', []);

calculatorApp.controller('CalculationController', ['$scope', function($scope) {
  $scope.displayValue = 0;
  $scope.operator = null;
  $scope.firstOperand = '';
  $scope.secondOperand = '';
  $scope.allowedOperators = ['+','-','/','*'];

  // Performs a calculation using the first and second operands and the operator.
  $scope.calculate = function () {
    var result = eval($scope.firstOperand + $scope.operator + $scope.secondOperand);
    $scope.firstOperand = result;
    $scope.secondOperand = '';
    $scope.displayValue = result;
    return result;
  };

  // Clears operands, operator, and resets display value
  $scope.clear = function () {
    $scope.displayValue = 0;
    $scope.operator = null;
    $scope.firstOperand = '';
    $scope.secondOperand = '';
  }

  // Determines whether a character is an operator
  $scope.isOperator = function (input) {
    var isop = $scope.allowedOperators.indexOf(input) !== -1;
    console.log(isop);
    return isop;
  }

  // Handles input values and either stores them for calculation,
  // performs, the calculation, or clears the display.
  $scope.processInput = function (input) {
    if (input === 'c') {
      $scope.clear();
      return;
    }

    if (input === '=') {
      $scope.calculate();
      return;
    }

    if (isNaN(input)) {
      if ($scope.firstOperand && $scope.isOperator(input)) {
        if ($scope.isOperator(input)) {
          if ($scope.secondOperand) {
            $scope.calculate();
          }
          $scope.operator = input;
          $scope.displayValue = input;
        }
      }
      return;
    }

    if ($scope.operator) {
      $scope.secondOperand += input;
      $scope.displayValue = $scope.secondOperand;
    } else {
      $scope.firstOperand += input;
      $scope.displayValue = $scope.firstOperand;
    }
  };

  $scope.$on('keypress', function (event, args) {
    $scope.processInput(args[0]);
  });
}]);

calculatorApp.controller('KeyPressController', ['$scope', function ($scope) {
  $scope.HandleKeyPress = function ($event) {
    var character = String.fromCharCode($event.keyCode);
    $scope.$broadcast('keypress', [character]);
  }
}]);
