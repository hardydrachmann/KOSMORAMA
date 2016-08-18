var app = angular.module('kosmoramaApp');
app.controller('TrainingController', function($scope, $state, $sce, $timeout, $rootScope, $ionicHistory, dataService, loadingService) {

  $scope.TrainingItems = [];

  $(document).ready(function() {
    getTraining(79);
    $timeout(function() {
      // createPlayer();
    }, 250);
    $rootScope.$on('continueEvent', function() {
      destroyPlayer();
    });
  });

// Getting training items from service and sorting them
// to be shown correct on screen.
  var getTraining = function(userId) {
    loadingService.loaderShow();
    dataService.getTraining(userId, function(data) {
      // Sorting and adding a pass Item for each set of training.
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
      loadingService.loaderHide();
      createPlayer();
      if ($ionicHistory.currentView().stateName !== 'training') {
        // $scope.trainingViewTimer(30);
      }
    });

  };

  $scope.trainingViewTimer = function(time) {
    $timeout(function() {
      $scope.continue();
    }, time * 1000);
  };

  $scope.getNextTrainingItem = function() {
    if ($scope.TrainingItems.length > 0) {
      if (!$scope.TrainingItems[0].hasOwnProperty('ExerciseId')) {
        return $scope.TrainingItems[1];
      }
    }
    return $scope.TrainingItems[0];
  };

  $scope.getTrainingName = function(trainingItem) {
    // Returns the appropriate language name for the selected item.
    return trainingItem.LangName[$scope.lang];
  };

  $scope.trainingDescription = function() {
    // Returns the appropriate language description for the next exercise.
    var item = $scope.getNextTrainingItem();
    if (item !== undefined) {
      return item.LangDesc[$scope.lang];
    }
  };

  var getVideo = function() {
    // Returns the videoId from the current exerciseUrl.
    var item = $scope.getNextTrainingItem();
    if (item) {
      var url = item.ExeciseUrl;
      if (url) {
        var exerciseUrl;
        if (url.startsWith("https")) {
          exerciseUrl = url.substring(26, 37);
        } else if (url.startsWith("http")) {
          exerciseUrl = url.substring(25, 36);
        }
        return exerciseUrl;
      }
    }
  };

  var url = 'https://welfaredenmark.blob.core.windows.net/exercises/Exercises/';
  var urn = '/picture/picture.png';
  $scope.getPicture = function(exerciseId) {
    return url + exerciseId + urn;
  };
});
