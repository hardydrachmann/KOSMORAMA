var app = angular.module('kosmoramaApp');
app.controller('TimerController', function($scope, $timeout, $rootScope, $window) {

    $scope.sets, $scope.setsRemaining, $scope.progress, $scope.timeProgress, $scope.counter, $scope.radius, $scope.stroke;
    $scope.currentSet = 0;
    var mytimeout, timeSet, timePause, pauseProgressDecay;
    var pauseNext = false;
    var timerStarted = false;

    $(document).ready(function() {
        setPlayerReadyHandler(function() {
            getInfoForTimer();
            setProgressSize();
            startExerciseTimer();
        });
    });

    var setProgressSize = function() {
        if($window.innerHeight > 900) {
            $scope.radius = 150;
            $scope.stroke = 30;
        } else if($window.innerHeight < 900 && $window.innerHeight >= 640) {
            $scope.radius = 100;
            $scope.stroke = 20;
        } else if($window.innerHeight < 640) {
            $scope.radius = 75;
            $scope.stroke = 15;
        }
    }

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
                $scope.trainingViewTimer(5);
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