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
    
    //Changes current language to the language selected in the menu.
    $scope.selectLanguage = function(language){
        $scope.lang = language.tag;
    };
    
    //Loads the language text from the language.json.
    $scope.loadText = function() {
        $.getJSON('data/language.json', function(data) {
            $scope.text = data;
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
