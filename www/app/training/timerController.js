var app = angular.module('kosmoramaApp');
app.controller('TimerController', function($scope, $timeout) {

    $scope.sets, $scope.setsRemaining, $scope.progress, $scope.timeProgress, $scope.counter;
    var player, mytimeout, timeSet, timePause;
    var pauseNext = false;

    var getInfoForTimer = function() {
        $scope.sets = $scope.TrainingItems[0].Sets;
        $scope.setsRemaining = $scope.sets;
        timeSet = $scope.TrainingItems[0].TimeSet * 60;
        timePause = $scope.TrainingItems[0].Pause * 60;
        $scope.counter = timeSet;
    };

    $scope.onTimeout = function() {
        if ($scope.counter === 0) {
            $timeout.cancel(mytimeout);
            if ($scope.sets > 0) {
                if (!pauseNext) {
                    startExcerciseTimer();
                }
                else {
                    startPauseTimer();
                }
            }
        }
        $scope.counter--;
        $scope.progress++;
        mytimeout = $timeout($scope.onTimeout, 1000);
    };
    
    var startExcerciseTimer = function() {
    $scope.reverseCounter =  1;
    $scope.timeProgress = timeSet;
    $scope.counter = $scope.timeProgress;
    playVideo();
    pauseNext = true;
    $scope.setsRemaining--;
    mytimeout = $timeout($scope.onTimeout);
  };
  
  var startPauseTimer = function() {
    $scope.reverseCounter =  1;
    $scope.timeProgress = timePause;
    $scope.counter = $scope.timeProgress;
    pauseVideo();
    pauseNext = false;
    mytimeout = $timeout($scope.onTimeout);
  };
  
  $scope.timerText = function() {
    if(!pauseNext) {
      return getText('pause');
    } else {
      return getText('set') + " " + $scope.setsRemaining + " " + getText('of') + " " + $scope.sets;
    }
  };
});