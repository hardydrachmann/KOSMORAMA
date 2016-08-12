angular.module('kosmoramaApp').controller('notesController',
  function($scope, $state) {

    $scope.clearContent = function(event) {
      var element = $(event.target);
      element.attr('placeholder', '');
    };

    $scope.revertContent = function(event) {
      var element = $(event.target);
      element.attr('placeholder', $scope.getText('notesTitle'));
    };

    $scope.maxChars = 500;
    $scope.messageText = '';
    $scope.remainingChars = function() {
      var textLength = $scope.messageText.length;
      var remainingChars = $scope.maxChars - textLength;
      $('#showCharsCount').html($scope.getText('remainingChars').concat(remainingChars));
    };

  });
