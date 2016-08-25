var app = angular.module('kosmoramaApp');
app.controller('TimerController', function($scope, $timeout, $rootScope, $window) {

    $scope.sets, $scope.setsRemaining, $scope.progress, $scope.timeProgress, $scope.counter;
    $scope.currentSet = 0;
    var mytimeout, timeSet, timePause, pauseProgressDecay;
    var pauseNext = false;
    var timerStarted = false;

    var trainingPromise;

    $(document).ready(function() {
        setPlayerReadyHandler(function() {
            getInfoForTimer();
            setProgressSize();
            startExerciseTimer();
        });

        $rootScope.$on('continueEvent', function() {
            $timeout.cancel(mytimeout);
            $timeout.cancel(trainingPromise);
        });
    });


    var getInfoForTimer = function() {
        $scope.sets = $rootScope.currentTraining.Sets;
        $scope.setsRemaining = $scope.sets;
        timeSet = $rootScope.currentTraining.TimeSet * 60;
        timePause = $rootScope.currentTraining.Pause * 60;
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
                trainingPromise = $scope.trainingViewTimer(5);
                return;
            }
        }
        $scope.counter--;
        if (pauseNext) {
            $scope.progress++;
        }
        else {
            $scope.progress -= pauseProgressDecay;

        }
        mytimeout = $timeout($scope.onTimeout, 1000);
    };

    var startExerciseTimer = function() {
        $scope.currentSet++;
        $scope.setsRemaining--;
        $scope.timeProgress = timeSet;
        $scope.counter = timeSet;
        $scope.progress = 1;
        playVideo();
        pauseNext = true;
        if (!timerStarted) {
            mytimeout = $timeout($scope.onTimeout);
            timerStarted = true;
        }
    };

    var startPauseTimer = function() {
        $scope.counter = timePause;
        $scope.progress -= pauseProgressDecay;
        // $scope.progress -= 1;
        pauseVideo();
        pauseNext = false;
    };

    $scope.timerText = function() {
        if (!pauseNext) {
            return $scope.getText('pause');
        }
        else {
            return $scope.getText('set') + " " + $scope.currentSet + " " + $scope.getText('of') + " " + $scope.sets;
        }
    };
});