angular.module('kosmoramaApp').controller('FeedbackController', function($scope, $state, dataService, loadingService) {

  $scope.userId = 0;

  var getUser = function() {
    dataService.getUser($scope.userScreenNumber, function(result) {
      $scope.userId = result.Id;
    });
  };
  getUser();


  var calculateTime = function(trainingItem) {
    var setTime = (trainingItem.TimeSet * 60) * trainingItem.Sets;
    var totalPauseTime = (60 * trainingItem.Pause * (trainingItem.Sets - 1));
    return setTime + totalPauseTime;

  };

  $scope.setSmileyValue = function(value) {
    var stats = value * 20;
    loadingService.loaderShow();
    dataService.getTraining($scope.userId, function(data) {
      console.log('trainingData', data);
      var traningReport = [{
        "PlanExerciseId": data.TrainingItems[0].PlanExerciseId,
        "Id": data.TrainingItems[0].TrainingId,
        "Exercise": data.TrainingItems[0].ExerciseId,
        "Score": stats,
        "Time": calculateTime(data.TrainingItems[0]),
        "Repetitions": [],
        "Questions": null
      }, ];
      dataService.postData(traningReport, function(result) {
        loadingService.loaderHide();
        $state.go('trainingPlan');
      });
    });
  };

});
