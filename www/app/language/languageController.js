angular.module('kosmoramaApp').controller('LanguageController', function($scope, $state, $ionicHistory) {
    $scope.text = {};
    $scope.lang = 'da';
    $scope.langs = [];

    $scope.setLanguage = function(language) {
        $scope.lang = language.tag;
        $state.go($ionicHistory.backView().stateName);
    };

    $scope.langToggle = function() {
        if ($ionicHistory.currentView().stateName != 'language') {
            $state.go('language');
        }
        else {
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
        if ($scope.text[name] != undefined) {
            return $scope.text[name][$scope.lang];
        }
        return 'If you see this text, the language toggle needs fixing or the help text is missing!!!';
    };
})

.directive('language', function() {
    return {
        templateUrl: 'app/language/language.html',
    };
});
