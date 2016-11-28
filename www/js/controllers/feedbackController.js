var feedbackCtrl = function ($state, tabsService, dataService, loadingService, storageService) {
	var ctrl = this;

	/**
	 * Sets the selected smiley value and saves the training as done in the database.
	 */
	ctrl.setSmileyValue = function (value) {
		var stats = value * 20;
		var training = storageService.getCurrentTraining();
		var trainingReport = [{
			"PlanExerciseId": training.PlanExerciseId,
			"Id": training.TrainingId,
			"Exercise": training.ExerciseId,
			"Score": stats,
			"Time": training.TimeSet,
			"Repetitions": [],
			"IsMobile": true,
			"Questions": null
        }];
		storageService.complete(trainingReport);
		tabsService.continue();
	};

	/**
	 * Used to calculate the total time of an exercise.
	 */
	function calculateTime(trainingItem) {
		var setTime = (trainingItem.TimeSet * 60) * trainingItem.Sets;
		var totalPauseTime = (60 * trainingItem.Pause * (trainingItem.Sets - 1));
		return setTime + totalPauseTime;
	}
};

angular.module('virtualTrainingApp').controller('FeedbackController', feedbackCtrl);