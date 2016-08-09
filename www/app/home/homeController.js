angular.module('kosmoramaApp').controller('HomeController', function($scope, $state, dataService) {
    $scope.getMailData = function() {
        var id = dataService.getUser($scope.userScreenNumber);
        console.log($scope.userScreenNumber);
    }
});
