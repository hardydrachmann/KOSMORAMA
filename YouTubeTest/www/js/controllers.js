angular.module('starter.controllers', [])

.controller('YouTubeController', function($scope) {
    $scope.player = '';
    
    $scope.dp = function() {
        console.log('Destroy');
        destroyPlayer();
    }
});
