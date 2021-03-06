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

calculatorApp.controller('CalculationController', ['$scope', '$http', function($scope, $http) {
  $scope.displayValue = 0;
  $scope.operator = null;
  $scope.repeatOperator = null;
  $scope.repeatOperand = null;
  $scope.firstOperand = '';
  $scope.secondOperand = '';
  $scope.allowedOperators = ['+','-','/','*'];
  $scope.calculating = false;
  $scope.calculationResult = null;
  $scope.lastCalculationError = null;

  // Performs a calculation using the first and second operands and the operator.
  $scope.calculate = function () {
    var operator = $scope.operator || $scope.repeatOperator;
    var secondOperand = $scope.secondOperand || $scope.repeatOperand;
    var result;
    if ($scope.firstOperand && operator && secondOperand) {
      var expression = $scope.firstOperand + operator + secondOperand;
      var expression = encodeURIComponent(expression);
      $scope.$broadcast('calculationStarted');
      return $http.get("/api/v1/calculation/result?expression=" + expression)
        .success(function(data, status, headers, config) {
          $scope.$broadcast('calculationFinished', data.result);
        }).error(function(data, status) {
          $scope.$broadcast('calculationFailed', data);
        });
    }
  };

  // Determines whether a character is an operator
  $scope.isOperator = function (input) {
    return $scope.allowedOperators.indexOf(input) !== -1;
  }

  // Processes input values.
  // Routes the various character types to the appropriate action.
  $scope.processInput = function (input) {
    if ($scope.calculating) {
      return;
    }

    if (input === 'c') {
      $scope.handleClearInput();
      return;
    }

    if (input === '=') {
      $scope.handleEqualsInput();
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
  $scope.handleEqualsInput = function () {
    $scope.calculate();
  };

  // Sets the current operator and performs calculation if this
  // operator is entered after an operator and second operand have
  // already been set.
  $scope.handleOperatorInput = function (input) {
    if ($scope.secondOperand && $scope.operator) {
      // Override default success
      $scope.calculate().then(function () {
        $scope.operator = input;
        $scope.displayValue = $scope.firstOperand + " " + input;
      });
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

  $scope.$on('calculationStarted', function (event, args) {
    $scope.calculating = true;
  });

  $scope.$on('calculationFinished', function (event, args) {
    var result = args;

    $scope.calculating = false;
    if (result) {
      $scope.result = result;
      $scope.firstOperand = result;
      $scope.displayValue = result;
    }

    // Cache old operator and second operand if operator exists.
    // Only used for repeated presses of =
    if ($scope.operator) {
      $scope.repeatOperator = $scope.operator;
      $scope.repeatOperand = $scope.secondOperand;
      $scope.operator = null;
      $scope.secondOperand = '';
    }
  });

  $scope.$on('calculationFailed', function (event, args) {
    $scope.calculating = false;
    $scope.lastCalculationError = args[0];
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
