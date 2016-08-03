angular.module('kosmoramaApp')

.controller('HelpController', function($scope, $state) {
    $scope.getState = function() {
        return $state.current.name;
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