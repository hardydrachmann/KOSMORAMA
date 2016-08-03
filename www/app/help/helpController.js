angular.module('kosmoramaApp')

.controller('HelpController', function($scope) {
    
})

.directive('help', function() {
    return {
        templateUrl: 'app/help/help.html',
        controller: 'HelpController'
    };
});