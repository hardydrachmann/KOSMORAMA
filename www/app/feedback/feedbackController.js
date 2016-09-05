angular.module('kosmoramaApp').controller('FeedbackController', function($scope, $state, $rootScope, dataService, loadingService, storageService) {

    $scope.userId = storageService.persistentUserData.userScreenNumber;

    /**
     * Used to calculate the total time of an exercise.
     */
    var calculateTime = function(trainingItem) {
        var setTime = (trainingItem.TimeSet * 60) * trainingItem.Sets;
        var totalPauseTime = (60 * trainingItem.Pause * (trainingItem.Sets - 1));
        return setTime + totalPauseTime;
    };

    /**
     * Sets the selected smiley value and saves the training as done in the database.
     */
    $scope.setSmileyValue = function(value) {
        var stats = value * 20;
        var training = storageService.proceduralUserData.currentTraining;
        var trainingReport = [{
            "PlanExerciseId": training.PlanExerciseId,
            "Id": training.TrainingId,
            "Exercise": training.ExerciseId,
            "Score": stats,
            "Time": calculateTime(training),
            "Repetitions": [],
            "Questions": null
        }];
        storageService.complete(trainingReport);
        $scope.continue();
    };

});
