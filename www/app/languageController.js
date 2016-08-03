angular.module('kosmoramaApp').controller('LanguageController', function($scope) {
  $scope.lang = 'da';
  $scope.text = '';

  $scope.loadText = function() {
    $.getJSON('data/language.json', function(data) {
      $scope.text = data;
    });
  };
  $scope.loadText();

  $scope.toggleLang = function() {
    $scope.lang = $scope.lang == 'da' ? 'eng' : 'da';
  };

  $scope.getText = function(name) {
    if (!$scope.text) {
      $scope.loadText();
      return '';
    }
    return $scope.text[name][$scope.lang];
  };

  $scope.help = function() {
    var helpSection = $('#helpSection');
    var display = helpSection.css('display');
    if (display === 'none') {
      helpSection.css('display', 'block');
    }
    else {
      helpSection.css('display', 'none');
    }
  };

});
