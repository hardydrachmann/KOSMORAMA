var app = angular.module('kosmoramaApp');
app.controller('TrainingController', function($scope, $timeout, $rootScope, $ionicHistory, dataService, loadingService, audioService) {

  $scope.TrainingItems = [];
  $scope.userId = "";

  $(document).ready(function() {
    getUserTraining();
    setPlayerReadyHandler(function() {
      // This runs the first time the player is ready.
    });
    $rootScope.$on('continueEvent', function() {
      destroyPlayer();
      cancelViewTimer();
    });
  });

  /**
   * Getting the user from service
   */
  var getUserTraining = function() {
    dataService.getUser($scope.userScreenNumber, function(result) {
      console.log("id", result.Id);
      getTraining(result.Id, function() {
        var currentState = $ionicHistory.currentView().stateName;
        if (currentState !== 'trainingPlan') {
          play(currentState === 'trainingDemo', false);
        }
        if (currentState !== 'training') {
          $scope.trainingViewTimer(10);
        }
      });
    });
  }

  /**
   * Getting training items from service
   */
  function getTraining(userId, callback) {
    loadingService.loaderShow();
    dataService.getTraining(userId, function(data) {
      sortTraining(data);
      loadingService.loaderHide();
      callback();
    });
  }

  /**
   * Sorting and adding a pass Item for each set of training.
   */
  function sortTraining(data) {
    if (data.TrainingItems.length > 0) {
      var trainingData = data.TrainingItems;
      var setCount = data.TrainingItems[0].SessionOrderNumber,
        pass = 1,
        firstTrainingId = data.TrainingItems[0].TrainingId;
      for (var i = 0; i < trainingData.length; i++) {
        var exercise = trainingData[i];
        if (exercise.SessionOrderNumber === setCount || exercise.TrainingId > firstTrainingId) {
          $scope.TrainingItems.push({
            passTitle: $scope.getText('passText') + pass++
          });
          setCount++;
          firstTrainingId = exercise.TrainingId;
        }
        $scope.TrainingItems.push(exercise);
      }
    }
  }

  /**
   * Plays video, and sound if it's wanted.
   */
  function play(isTrainingDemo, playSound) {
    var source = isTrainingDemo ? 'https://welfaredenmark.blob.core.windows.net/exercises/Exercises/05_left/speak/en-GB/speak.mp3' : 'https://welfaredenmark.blob.core.windows.net/exercises/Exercises/start_stop/start.mp3';
    if (playSound) {
      audioService.playAudio(source, function() {
        createPlayer(getVideo());
      });
    } else {
      createPlayer(getVideo());
    }
  }

  var trainingPromise;
  /**
   * Cancel the view timer.
   */
  function cancelViewTimer() {
    if (trainingPromise) {
      $timeout.cancel(trainingPromise);
    }
  }

  /**
   * Start the training view timer to automatically move on to the next view by calling continue().
   */
  $scope.trainingViewTimer = function(time) {
    cancelViewTimer();
    trainingPromise = $timeout(function() {
      $scope.continue();
    }, time * 1000);
  }

  /**
   * Return the video id for the video of the next training item on the list.
   */
  function getVideo() {
    // Returns the videoId from the current exerciseUrl.
    var item = $scope.getNextTrainingItem();
    if (item) {
      var url = item.ExeciseUrl;
      if (url) {
        var videoId;
        if (url.startsWith("https")) {
          videoId = url.substring(26, 37);
        } else if (url.startsWith("http")) {
          videoId = url.substring(25, 36);
        }
        return videoId;
      }
    }
  }

  $scope.getNextTrainingItem = function() {
    if ($scope.TrainingItems.length > 0) {
      if (!$scope.TrainingItems[0].hasOwnProperty('ExerciseId')) {
        return $scope.TrainingItems[1];
      }
      return $scope.TrainingItems[0];
    }
  };

  $scope.getTrainingName = function(trainingItem) {
    // Returns the appropriate language name for the selected item.
    return trainingItem.LangName[$scope.lang];
  };

  $scope.trainingDescription = function() {
    // Returns the appropriate language description for the next exercise.
    var item = $scope.getNextTrainingItem();
    if (item) {
      return item.LangDesc[$scope.lang];
    }
  };

  $scope.formatTime = function(time) {
    // Takes the time as seconds in the parameter and returns it in a formatted string with min/sec.
    var min = Math.floor(time / 60);
    var sec = time - min * 60;
    return min + " " + $scope.getText('min') + " " + sec + " " + $scope.getText('sec');
  };

  var url = 'https://welfaredenmark.blob.core.windows.net/exercises/Exercises/';
  var urn = '/picture/picture.png';
  $scope.getPicture = function(exerciseId) {
    return url + exerciseId + urn;
  };

});
