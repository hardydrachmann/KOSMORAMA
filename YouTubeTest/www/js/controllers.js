var app = angular.module('starter.controllers', []);

app.controller('YouTubeController', function($scope) {
    $scope.player = '';
    $scope.dp = function() {
        console.log('Destroy');
    }
});

app.directive('youtubePlayer', function() {
    return {
        templateUrl: 'youtube-player.html'
    };
});
