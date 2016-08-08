angular.module('kosmoramaApp').controller('LanguageController', function($scope) {
    $scope.text = {};
    $scope.lang = 'da';
    $scope.langs = [];


    //Loads the language text from the language.json.
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

    //Used in various views, to get the text for a given variable. Example: {{getText('trainingPlan')}}
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
