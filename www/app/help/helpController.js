angular.module('kosmoramaApp')

.controller('HelpController', function($scope, $state) {
    $scope.getState = function() {
        return $state.current.name;
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
})

.directive('help', function() {
    return {
        templateUrl: 'app/help/help.html',
        controller: 'HelpController'
    };
})

.directive('questionMark', function() {
    return {
        templateUrl: 'app/help/question-mark.html',
        controller: 'HelpController'
    };
});