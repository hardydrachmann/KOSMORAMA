angular.module('kosmoramaApp').controller('LanguageController', function($scope, $state, $ionicHistory, dataService) {
  $scope.text = {};
  $scope.lang = '';
  $scope.langs = [];

  $(document).ready(function() {
    var lang = window.localStorage.getItem('kosmoramaLang');
    if (!lang) {
      $scope.lang = 'da_DK'
      $state.go('language');
    } else {
      $scope.lang = lang;
    }
  });

  $scope.setLanguage = function(language) {
    $scope.lang = language.tag;
    window.localStorage.setItem('kosmoramaLang', $scope.lang);
    var backView = $ionicHistory.backView();
    if (backView) {
      $state.go(backView.stateName);
    } else {
      $state.go('login');
    }
  };

  $scope.langToggle = function() {
    if ($ionicHistory.currentView().stateName != 'language') {
      $state.go('language');
    } else {
      $state.go($ionicHistory.backView().stateName);
    }
  };

  var loadData = function() {
    $.getJSON('app/language/content.json', function(data) {
      $scope.text = data;
    });
    $.getJSON('app/language/langs.json', function(data) {
      $scope.langs = data;
    });
  };
  loadData();

  $scope.getText = function(name) {
    if (!$scope.text) {
      $scope.loadText();
      return '';
    }
    if ($scope.text[name] !== undefined) {
      return $scope.text[name][$scope.lang];
    }
    return ' ';
  };
})

.directive('language', function() {
  return {
    templateUrl: 'app/language/language.html',
  };
});
