angular.module('kosmoramaApp').controller('IndexController', function($scope) {
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

});
