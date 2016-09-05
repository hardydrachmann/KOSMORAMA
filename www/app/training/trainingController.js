var app = angular.module('kosmoramaApp');

app.controller('TrainingController', function($scope, $state, $timeout, $rootScope, $ionicHistory, popupService, dataService, loadingService, blobService, storageService, downloadService) {

	$rootScope.videoFile = 'media/video/test_training/video.mp4';
	$rootScope.audioFile = 'media/audio/test_training/audio.mp3';
	$rootScope.startAudio = 'media/audio/start-stop/start.mp3';

	$scope.TrainingItems = [];

	$(document).ready(main);

	/**
	 * and register event for the training controller.
	 */
	function main() {
		stateAction();
		$rootScope.$on('continueEvent', function() {
			$scope.cancelViewTimer();
			$('video').remove();
		});
	}

	/**
	 * Execute the appropriate action for the current training view variation.
	 */
	var stateAction = function() {
		var currentState = $ionicHistory.currentView().stateName;
		if (currentState.startsWith('training')) {
			if (currentState === 'trainingPlan') {
				$scope.TrainingItems = storageService.nextTraining();
			}
			if (currentState !== 'training') {
				$scope.trainingViewTimer(20);
			}
		}
	};

	/**
	 * Return the video id for the video of the next training item on the list.
	 */
	function getVideo() {
		// Returns the videoId from the current exerciseUrl.
		var item = storageService.proceduralUserData.currentTraining;
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

	var trainingPromise;
	/**
	 * Cancel the view timer.
	 */
	$scope.cancelViewTimer = function() {
		if (trainingPromise) {
			$timeout.cancel(trainingPromise);
			trainingPromise = undefined;
		}
	};

	/**
	 * Start the training view timer to automatically move on to the next view by calling continue().
	 */
	$scope.trainingViewTimer = function(time) {
		$scope.cancelViewTimer();
		trainingPromise = $timeout(function() {
			$scope.continue();
		}, time * 1000);
	};

	$scope.getTrainingName = function(trainingItem) {
		// Returns the appropriate language name for the selected item.
		return trainingItem.LangName[$scope.lang];
	};

	$scope.trainingDescription = function() {
		// Returns the appropriate language description for the next exercise.
		var item = storageService.proceduralUserData.currentTraining;
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

	$scope.getAudio = function() {
		return blobService.getExerciseAudio(storageService.proceduralUserData.currentTraining.ExerciseId);
	};

	$scope.getPicture = function(exerciseId) {
		return blobService.getExercisePicture(exerciseId);
	};
});
