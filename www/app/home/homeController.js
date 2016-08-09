angular.module('kosmoramaApp').controller('HomeController', function($scope, $state, dataService) {
    $scope.hasMail = true;
    $scope.getMails = function() {
        dataService.getUser($scope.userScreenNumber, function(user) {
            console.log(user);
            dataService.getTraining(user.Id, function(data) {
                console.log(data);
            });
        });
    };
});
