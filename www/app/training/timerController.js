var app = angular.module('kosmoramaApp');
app.controller('TimerController', function($scope, $timeout) {

    $scope.sets, $scope.setsRemaining, $scope.progress, $scope.timeProgress, $scope.counter;
    var mytimeout, timeSet, timePause, pauseProgressDecay;
    var pauseNext = false;
    var timerStarted = false;

    $(document).ready(function() {
        setPlayerReadyHandler(function() {
            getInfoForTimer();
            startExerciseTimer();
        });
    });

    var getInfoForTimer = function() {
        // $scope.sets = $scope.TrainingItems[1].Sets;
        $scope.sets = 4;
        $scope.setsRemaining = $scope.sets;
        // timeSet = $scope.TrainingItems[1].TimeSet * 60;
        // timePause = $scope.TrainingItems[1].Pause * 60;
        timeSet = 15;
        timePause = 10;
        $scope.counter = timeSet;
        pauseProgressDecay = timeSet / timePause;
    };

    $scope.onTimeout = function() {
        if ($scope.counter === 0) {
            $timeout.cancel(mytimeout);
            if ($scope.setsRemaining > 0) {
                if (!pauseNext) {
                    startExerciseTimer();
                }
                else {
                    startPauseTimer();
                }
            }
            else {
                $scope.trainingViewTimer(5);
            }
        }
        $scope.counter--;
        if (pauseNext) {
            $scope.progress++;
        }
        else {
            console.log('decayrate: ' + pauseProgressDecay + " progress: " + $scope.progress);
            $scope.progress -= pauseProgressDecay;
        }
        mytimeout = $timeout($scope.onTimeout, 1000);
    };

    var startExerciseTimer = function() {
        $scope.timeProgress = timeSet;
        $scope.counter = timeSet;
        $scope.progress = 1;
        playVideo();
        pauseNext = true;
        $scope.setsRemaining--;
        if (!timerStarted) {
            mytimeout = $timeout($scope.onTimeout);
            timerStarted = true;
        }
    };

    var startPauseTimer = function() {
        $scope.counter = timePause;
        // $scope.progress -= pauseProgressDecay;
        $scope.progress -= 1;
        pauseVideo();
        pauseNext = false;
    };

    $scope.timerText = function() {
        if (!pauseNext) {
            return $scope.getText('pause');
        }
        else {
            return $scope.getText('set') + " " + $scope.setsRemaining + " " + $scope.getText('of') + " " + $scope.sets;
        }
    };
});