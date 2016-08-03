angular.module('kosmoramaApp').controller('LanguageController', function($scope, $window) {
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
        if ($scope.text[name] != undefined) {
            return $scope.text[name][$scope.lang];
        }
        return 'If you see this text, you need to fix the language toggle!!!';
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
