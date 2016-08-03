angular.module('kosmoramaApp').controller('LanguageController', function($scope) {
    $scope.lang = 'da';
    $scope.text = '';
    $scope.langs = ['da', 'eng', 'de'];
    $scope.lang = 'da';
    $scope.selectedLang = 'da';

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
        return 'If you see this text, the language toggle needs fixing or the help text is missing!!!';
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
