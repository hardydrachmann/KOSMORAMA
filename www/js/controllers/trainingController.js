var trainingCtrl = function($rootScope, $state, $timeout, $ionicHistory, $ionicPlatform, $interval, tabsService, languageService, popupService, dataService, loadingService, storageService, mediaService, blobService, deviceService) {
	var ctrl = this;

	ctrl.getAudio = deviceService.device ? mediaService.getAudio : blobService.getAudio;
	ctrl.getVideo = deviceService.device ? mediaService.getVideo : blobService.getVideo;
	ctrl.getPicture = deviceService.device ? mediaService.getPicture : blobService.getPicture;
	ctrl.TrainingItems = [];
	ctrl.currentTraining = {};

	/**
	 * Compare the exercise date with current date, and return true if date is the same.
	 */
	ctrl.isToday = function(date) {
		var dateToday = new Date();
		if (date.setHours(0, 0, 0, 0) == dateToday.setHours(0, 0, 0, 0)) {
			return true;
		}
		return false;
	};

	(function init() {
		ctrl.currentTraining = storageService.getCurrentTraining();
		stateAction();
		$rootScope.$on('continueEvent', function() {
			$('video').remove();
		});
		$ionicPlatform.on('pause', function() {
			$('video').get(0).pause();
			if (deviceService.isAndroid()) {
				$('audio').get(0).pause();
			} else {
				mediaService.pauseIosAudio();
			}
		});
		$ionicPlatform.on('resume', function() {
			$('video').get(0).play();
			if (deviceService.isAndroid()) {
				$('audio').get(0).play();
			} else {
				mediaService.resumeIosAudio();
			}
		});
	})();

	/**
	 * Returns the appropriate language name for the selected item.
	 */
	ctrl.getTrainingName = function(trainingItem) {
		return trainingItem.LangName[languageService.lang];
	};

	/**
	 * Returns the appropriate language description for the next exercise.
	 */
	ctrl.trainingDescription = function() {
		return ctrl.currentTraining.LangDesc[languageService.lang];
	};

	/**
	 * Returns an object containing remaining minutes and seconds.
	 */
	ctrl.formatTime = function(time) {
		var seconds = time * 60;
		var minutes = seconds >= 60 ? seconds / 60 : 0;
		seconds = seconds % 60;
		return minutes + ' ' + languageService.getText('min') + ' ' + seconds + ' ' + languageService.getText('sec');
	};

	/**
	 * Execute the appropriate action for the current training view variation.
	 */
	function stateAction() {
		var currentState = $ionicHistory.currentView().stateName;
		if (currentState.startsWith('training')) {
			if (currentState === 'trainingPlan') {
				ctrl.TrainingItems = storageService.nextTraining();
				if (ctrl.TrainingItems.length < 2 || !ctrl.isToday(ctrl.TrainingItems[1].date)) {
					$state.go('home');
					popupService.alertPopup(languageService.getText('noTrainingText'));
				}
			} else if (currentState === 'trainingDemo') {
				$('video').get(0).play();
				// When audio playback stops, wait 5 sec. more, then auto-continue to training view (Android only).
				var promise;
				if (deviceService.isAndroid()) {
					var audioPlaying = $('audio').get(0);
					promise = $interval(function() {
						if (audioPlaying.ended) {
							$interval.cancel(promise);
							$timeout(function() {
								tabsService.continue();
							}, 5000);
						}
					}, 1000);
				} else {
					// When audio playback stops, wait 5 sec. more, then auto-continue to training view (iOS only).
					mediaService.playIosAudio(ctrl.currentTraining.ExerciseId);
				}
				$rootScope.$on('continueEvent', function() {
					if (promise)
						$interval.cancel(promise);
				});
			} else if (currentState === 'training') {
				$('video').get(0).play();
				mediaService.playIosAudio('startTraining');
			}
		}
	}
};

angular.module('virtualTrainingApp').controller('TrainingController', trainingCtrl);
