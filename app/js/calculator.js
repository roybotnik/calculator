calculatorApp = angular.module('calculatorApp', []);

calculatorApp.controller('CalculationController', ['$scope', function($scope) {
  $scope.displayValue = 0;
  $scope.operator = null;
  $scope.repeatOperator = null;
  $scope.repeatOperand = null;
  $scope.firstOperand = '';
  $scope.secondOperand = '';
  $scope.allowedOperators = ['+','-','/','*'];

  // Performs a calculation using the first and second operands and the operator.
  $scope.calculate = function () {
    var operator = $scope.operator || $scope.repeatOperator;
    var secondOperand = $scope.secondOperand || $scope.repeatOperand;
    var result = eval($scope.firstOperand + operator + secondOperand);
    $scope.firstOperand = result;
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
    return $scope.allowedOperators.indexOf(input) !== -1;
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
      if ($scope.operator) {
        $scope.repeatOperator = $scope.operator;
        $scope.repeatOperand = $scope.secondOperand;
        $scope.operator = null;
        $scope.secondOperand = '';
      }
      return;
    }

    if ((input !== '.') && isNaN(input)) {
      if ($scope.firstOperand && $scope.isOperator(input)) {
        if ($scope.secondOperand && $scope.operator) {
          $scope.calculate();
          $scope.secondOperand = '';
        }
        $scope.operator = input;
        $scope.displayValue = $scope.firstOperand + " " + input;
      }
      return;
    }

    if ($scope.operator) {
      $scope.secondOperand = $scope.newValueForOperand($scope.secondOperand, input);
      $scope.displayValue = $scope.firstOperand + " " + $scope.operator + " " + $scope.secondOperand;
    } else {
      $scope.firstOperand = $scope.newValueForOperand($scope.firstOperand, input);
      $scope.displayValue = $scope.firstOperand;
    }
  };

  $scope.newValueForOperand = function (currentValue, input) {
    var result = currentValue;
    if (input === '.') {
      if (currentValue.indexOf('.') === -1) {
        result += input;
      }
    } else {
      result += input;
    }
    return result;
  };

  $scope.$on('keypress', function (event, args) {
    $scope.processInput(args[0]);
  });
}]);

calculatorApp.controller('InputController', ['$scope', function ($scope) {
  $scope.HandleKeyPress = function ($event) {
    var character = String.fromCharCode($event.keyCode);
    $scope.$broadcast('keypress', [character]);
  }
}]);
