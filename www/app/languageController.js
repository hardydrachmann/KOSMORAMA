angular.module('kosmoramaApp').controller('LanguageController', function($scope) {
    $scope.text = {};
    $scope.lang = 'da';
    $scope.langs = [];

    $scope.setLanguage = function(language) {
        $scope.lang = language.tag;
    };

    $scope.loadText = function() {
        $.getJSON('app/language/content.json', function(data) {
            $scope.text = data;
        });
        $.getJSON('app/language/langs.json', function(data) {
            $scope.langs = data;
        });
    };
    $scope.loadText();

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
});
