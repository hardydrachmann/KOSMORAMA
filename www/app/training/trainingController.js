var app = angular.module('kosmoramaApp');
app.controller('TrainingController', function($scope, $state, $sce, $timeout, dataService, loadingService) {

  $scope.TrainingItems = [];

  var getTraining = function(userId) {
    loadingService.loaderShow();
    dataService.getTraining(userId, function(data) {
      if (data.length > 0) {
        $scope.TrainingItems = data[0].TrainingItems;
      }
      loadingService.loaderHide();
    });
  };
  getTraining(79);

  $scope.getTrainingName = function(trainingItem) {
    // Returns the appropriate language name for the selected item.
    return trainingItem.LangName[$scope.lang];
  };

  $scope.trainingDescription = function() {
    // Returns the appropriate language description for the next exercise.
    var item = $scope.TrainingItems[0];
    if (item != undefined) {
      return item.LangDesc[$scope.lang];
    }
  };

  var getVideo = function() {
    var item = $scope.TrainingItems[0];
    if (item != undefined) {
      var url = item.ExeciseUrl;
      if (url) {
        var exerciseUrl;
        if (url.startsWith("https")) {
          exerciseUrl = url.substring(26, 37);
        } else if (url.startsWith("http")) {
          exerciseUrl = url.substring(25, 36);
        }
        return exerciseUrl;
        //return $sce.trustAsResourceUrl(url + '/embed/xx2cxo8WQoM?rel=0&showinfo=0');
      }
    }
  };

  var url = 'https://welfaredenmark.blob.core.windows.net/exercises/Exercises/';
  var urn = '/picture/picture.png';
  $scope.getPicture = function(exerciseId) {
    return url + exerciseId + urn;
  };

  // Timer stuff for video playback.
  var player;

  function loadPlayer() {
    player = new YT.Player('player', {
      videoId: getVideo()
    });
  }

  var mytimeout = null;
  var rep = 1;
  var timerep;
  var timepause;
  var pause = false;
  $scope.counter = null;

  $scope.formatTime = function(time) {
    var min = Math.floor(time / 60);
    var sec = time - min * 60;
    return min + " minutes " + sec + " seconds";
  };

  $scope.timer = function() {
    rep = $scope.TrainingItems[0].Repetitions;
    timerep = $scope.TrainingItems[0].TimeSet * 60;
    timepause = $scope.TrainingItems[0].Pause * 60;
    $scope.counter = timerep;

  };

  $scope.onTimeout = function() {
    if ($scope.counter === 0) {
      $timeout.cancel(mytimeout);
      if (rep > 0)
        if (!pause) {
          $scope.startExcerciseTimer();
        } else {
          $scope.startPauseTimer();
        }
      else
        player.stopVideo();
      return;
    }
    $scope.counter--;
    mytimeout = $timeout($scope.onTimeout, 1000);
  };

  $scope.startExcerciseTimer = function() {
    console.log('click');
    player.loadPlaylist(getVideo());
    player.setLoop(true);
    $scope.counter = timerep;
    player.playVideo();
    pause = true;
    rep--;
    mytimeout = $timeout($scope.onTimeout);
  };

  $scope.startPauseTimer = function() {
    $scope.counter = timepause;
    player.pauseVideo();
    pause = false;
    mytimeout = $timeout($scope.onTimeout);
  };

});
