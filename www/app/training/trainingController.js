angular
	.module('virtualTrainingApp')
	.controller('TrainingController',
		function($rootScope, $state, $timeout, $ionicHistory, $ionicPlatform, tabsService, languageService, popupService, dataService, loadingService, storageService, mediaService, blobService, debugService) {

			var self = this;
			self.getAudio = debugService.device ? mediaService.getAudio : blobService.getAudio;
			self.getVideo = debugService.device ? mediaService.getVideo : blobService.getVideo;
			self.getPicture = debugService.device ? mediaService.getPicture : blobService.getPicture;
			self.TrainingItems = [];
			self.currentTraining = {};

			(function init() {
				self.currentTraining = storageService.getCurrentTraining();
				stateAction();
				$rootScope.$on('continueEvent', function() {
					$('video').remove();
				});
				$ionicPlatform.on('pause', function() {
					$('video').get(0).pause();
					if (device.platform === 'Android') {
						$('audio').get(0).pause();
					}
					else {
						mediaService.pauseIosAudio();
					}
				});

				$ionicPlatform.on('resume', function() {
					$('video').get(0).play();
					if (device.platform === 'Android') {
						$('audio').get(0).play();
					}
					else {
						mediaService.resumeIosAudio();
					}
				});
			})();


			/**
			 * Returns the appropriate language name for the selected item.
			 */
			self.getTrainingName = function(trainingItem) {
				return trainingItem.LangName[languageService.lang];
			};

			/**
			 * Returns the appropriate language description for the next exercise.
			 */
			self.trainingDescription = function() {
				return self.currentTraining.LangDesc[languageService.lang];
			};

			/**
			 * Returns an object containing remaining minutes and seconds.
			 */
			self.formatTime = function(time) {
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
				var dateToday = new Date();
				if (currentState.startsWith('training')) {
					if (currentState === 'trainingPlan') {
						self.TrainingItems = storageService.nextTraining();
						// TODO rewrite if-statement
						if (self.TrainingItems.length < 2 || self.TrainingItems[1].date.setHours(0, 0, 0, 0) !== dateToday.setHours(0, 0, 0, 0)) {
							$state.go('home');
							popupService.alertPopup(languageService.getText('noTrainingText'));
						}
					}
					else if (currentState === 'trainingDemo') {
						mediaService.playIosAudio(self.currentTraining.ExerciseId);
						$('video').get(0).play();
					}
					else if (currentState === 'training') {
						mediaService.playIosAudio('startTraining');
					}
				}
			}

			/**
			 * Compare the exercise date with current date, and return true if date is the same.
			 * TODO use method
			 */
			self.isToday = function(item) {
				var dateToday = new Date();
				if (item.date.setHours(0, 0, 0, 0) == dateToday.setHours(0, 0, 0, 0)) {
					return true;
				}
				return false;
			};
		});
