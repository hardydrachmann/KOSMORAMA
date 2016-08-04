angular.module('kosmoramaApp').controller('LanguageController', function($scope) {
    $scope.text = '';
    //$scope.langs = ['da', 'eng', 'de'];
    $scope.lang = 'da';

    $scope.langs = [{
        language: 'Dansk',
        tag: 'da',
        url: 'img/flags/DK.png'
    }, {
        language: 'Deutsch',
        tag: 'de',
        url: 'img/flags/GER.png'
    }, {
        language: 'English',
        tag: 'eng',
        url: 'img/flags/UK.png'
    }, {
        language: 'Norsk',
        tag: 'no',
        url: 'img/flags/NO.png'
    }, {
        language: 'Svenska',
        tag: 'se',
        url: 'img/flags/SWE.png'
    }, {
        language: 'Suomi',
        tag: 'fi',
        url: 'img/flags/FI.png'
    }];
    
    $scope.selectLanguage = function(language){
        console.log(language.tag);
        $scope.lang = language.tag;
        console.log($scope.lang);
    };
    
    $scope.loadText = function() {
        $.getJSON('data/language.json', function(data) {
            $scope.text = data;
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
