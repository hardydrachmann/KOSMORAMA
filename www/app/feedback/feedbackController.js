angular.module('kosmoramaApp').controller('FeedbackController', function($scope, $state, $rootScope, dataService, loadingService) {

	$scope.userId = 0;

	/**
	 * Gets current user.
	 */
	var getUser = function() {
		dataService.getUser($scope.userScreenNumber, function(result) {
			$scope.userId = result.Id;
		});
	};

	getUser();
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
		loadingService.loaderShow();
		var stats = value * 20;
		var training = $rootScope.currentTraining;
		var trainingReport = [{
			"PlanExerciseId": training.PlanExerciseId,
			"Id": training.TrainingId,
			"Exercise": training.ExerciseId,
			"Score": stats,
			"Time": calculateTime(training),
			"Repetitions": [],
			"Questions": null
		}];
		dataService.postData(trainingReport, function(result) {
			loadingService.loaderHide();
			$scope.continue();
		});
	};

});
