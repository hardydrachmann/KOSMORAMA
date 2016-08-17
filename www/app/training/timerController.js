var app = angular.module('kosmoramaApp');
app.controller('TimerController', function($scope) {

    $scope.rep;
    $scope.counter = null;
    var player;
    var mytimeout = null;
    var pause = false;

    // var loadPlayer = function() {
    //     // Instantiates the YouTube Player.
    //     player = new YT.Player('player', {
    //         videoId: getVideo(),
    //         events: {
    //             'onReady': onPlayerReady
    //         }
    //     });
    // };

    // var destroyPlayer = function() {
    //     try {
    //         player.destroy();
    //     }
    //     catch (error) {
    //         console.log('Player destruction error: ' + error);
    //     }
    // };

    // var getYouTubePlayer = function() {
    //     // Destroy the YouTube Player for the previous view, and loads the new one.
    //     loadPlayer();
    //     destroyPlayer();
    //     loadPlayer();
    // };

    // var onPlayerReady = function(event) {
    //     // Handles logic when the 'onReady' event is triggered.
    //     event.target.loadPlaylist(getVideo());

    //     event.target.setLoop(true);
    //     startExcerciseTimer();
    //     if ($ionicHistory.currentView().stateName === 'trainingDemo') {
    //         timeOut(trainingLength * 4);
    //     }
    // }

    // var timeOut = function(time) {
    //     $timeout(function() {
    //         $scope.continue();

    //     }, time * 1000);
    // }

    // $scope.formatTime = function(time) {
    //     // Takes the time as seconds in the parameter and returns it in a formatted string with min/sec.
    //     var min = Math.floor(time / 60);
    //     var sec = time - min * 60;
    //     return min + " " + $scope.getText('minutes') + " " + +sec + " " + $scope.getText('seconds');
    // };

    // var getTrainingSetInfo = function() {
    //     // Gets the number of repetitions, duration for repetitions and pauses for the current excercise, and sets the initial value for the timer.
    //     $scope.rep = $scope.TrainingItems[0].Repetitions;
    //     $scope.counter = $scope.TrainingItems[0].TimeSet * 60;
    // };

    // $scope.onTimeout = function() {
    //     // Handles what happens next, everytime the timer times out.
    //     if ($scope.counter === 0) {
    //         $timeout.cancel(mytimeout);
    //         if ($scope.rep > 0)
    //             if (!pause)
    //                 startExcerciseTimer();
    //             else
    //                 startPauseTimer();
    //         else {
    //             player.stopVideo();
    //             if ($ionicHistory.currentView().stateName === 'training') {
    //                 timeOut(5);
    //             }
    //         }
    //         return;
    //     }
    //     $scope.counter--;
    //     mytimeout = $timeout($scope.onTimeout, 1000);
    // };

    // var startExcerciseTimer = function() {
    //     // Starts the timer and handles relevant logic.
    //     $scope.counter = $scope.TrainingItems[0].TimeSet * 60;
    //     player.playVideo();
    //     pause = true;
    //     $scope.rep--;
    //     mytimeout = $timeout($scope.onTimeout);

    // };

    // var startPauseTimer = function() {
    //     // Pauses the timer and handles relevant logic.
    //     $scope.counter = $scope.TrainingItems[0].Pause * 60;
    //     player.pauseVideo();
    //     pause = false;
    //     mytimeout = $timeout($scope.onTimeout);
    // };
});