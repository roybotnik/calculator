calculatorApp = angular.module('calculatorApp', []);


calculatorApp.directive('broadcastKeypress', [
  '$document',
  '$rootScope',
  '$timeout',
  function ($document, $rootScope, $timeout) {
    return {
      restrict: 'A',
      link: function () {
        $document.bind('keypress', function (e) {
          var character = String.fromCharCode(e.keyCode);
          $timeout(function () {
            $rootScope.$broadcast('keypress', character);
          });
        });
      }
    };
  }
]);

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

  // Determines whether a character is an operator
  $scope.isOperator = function (input) {
    return $scope.allowedOperators.indexOf(input) !== -1;
  }

  // Processes input values.
  // Routes the various character types to the appropriate action.
  $scope.processInput = function (input) {
    if (input === 'c') {
      $scope.handleClearInput();
      return;
    }

    if (input === '=') {
      $scope.handleEqualsInput(input);
      return;
    }

    if ((input !== '.') && isNaN(input)) {
      if ($scope.firstOperand && $scope.isOperator(input)) {
        $scope.handleOperatorInput(input);
      }
      return;
    }

    $scope.handleDigitInput(input);
  };

  // Clears operands, operator, and resets display value
  $scope.handleClearInput = function () {
    $scope.displayValue = 0;
    $scope.operator = null;
    $scope.firstOperand = '';
    $scope.secondOperand = '';
  }

  // Performs calculation and stores values for repeat usage.
  // To be executed when = is pressed.
  $scope.handleEqualsInput = function (input) {
    $scope.calculate();
    if ($scope.operator) {
      $scope.repeatOperator = $scope.operator;
      $scope.repeatOperand = $scope.secondOperand;
      $scope.operator = null;
      $scope.secondOperand = '';
    }
  };

  // Sets the current operator and performs calculation if this
  // operator is entered after an operator and second operand have
  // already been set.
  $scope.handleOperatorInput = function (input) {
    if ($scope.secondOperand && $scope.operator) {
      $scope.calculate();
      $scope.secondOperand = '';
    }
    $scope.operator = input;
    $scope.displayValue = $scope.firstOperand + " " + input;
  };

  // Handles the input of digits. Either updates the value of the first
  // or second operand depending on the current status of the values.
  $scope.handleDigitInput = function (input) {
    if ($scope.operator) {
      $scope.secondOperand = $scope.newValueForOperand($scope.secondOperand, input);
      $scope.displayValue = $scope.firstOperand + " " + $scope.operator + " " + $scope.secondOperand;
    } else {
      $scope.firstOperand = $scope.newValueForOperand($scope.firstOperand, input);
      $scope.displayValue = $scope.firstOperand;
    }
  };

  // Detemines the new value for an operand given the current value
  // and an input digit. Accounts for the decimal point.
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

  // Routes input to processInput.
  $scope.$on('inputReceived', function (event, args) {
    $scope.processInput(args[0]);
  });
}]);

// Handles input from either keypress or buttons, broadcasts the data on the scope.
calculatorApp.controller('InputController', ['$scope', function ($scope) {
  $scope.$on('keypress', function (event, args) {
    $scope.$broadcast('inputReceived', args[0]);
  });
  $scope.handleButtonClick = function(input) {
    if (typeof(input) === 'string') {
      input = input.toLowerCase();
    }
    console.log(input);
    $scope.$broadcast('inputReceived', [input]);
  };
}]);

// Kind of gross, but I really didn't want it to do it.
calculatorApp.directive('stopBackspaceFromGoingBack', [
  '$document',
  function ($document) {
    return {
      restrict: 'A',
      link: function () {
        $document.bind('keydown', function(e) {
          if (e.keyCode === 8) {
            e.preventDefault();
          }
        });
      }
    }
  }
]);
