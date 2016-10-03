angular
	.module('kosmoramaApp')
	.controller('TrainingController',
		function($rootScope, $state, $timeout, $ionicHistory, $ionicPlatform, tabsService, languageService, popupService, dataService, loadingService, storageService, mediaService, blobService, debugService) {

			var self = this;
			self.getAudio = debugService.device ? mediaService.getAudio : blobService.getAudio;
			self.getVideo = debugService.device ? mediaService.getVideo : blobService.getVideo;
			self.getPicture = debugService.device ? mediaService.getPicture : blobService.getPicture;
			self.TrainingItems = [];
			self.currentTrainingId = -1;

			(function init() {
				if (storageService.proceduralUserData.currentTraining) {
					self.currentTrainingId = storageService.proceduralUserData.currentTraining.ExerciseId;
				}
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
				var item = storageService.proceduralUserData.currentTraining;
				if (item) {
					return item.LangDesc[languageService.lang];
				}
			};

			/**
			 * Returns an object containing remaining minutes and seconds.
			 */
			self.formatTime = function(time) {
				var minutes = Math.floor(time / 60);
				var seconds = time - (minutes * 60);
				return minutes + ' ' + languageService.getText('min') + ' ' + seconds + ' ' + languageService.getText('sec');
			};

			/**
			 * Execute the appropriate action for the current training view variation.
			 */
			function stateAction() {
				var currentState = $ionicHistory.currentView().stateName;
				if (currentState.startsWith('training')) {
					if (currentState === 'trainingPlan') {
						self.TrainingItems = storageService.nextTraining();
						if (!self.TrainingItems.length) {
							$state.go('home');
							popupService.alertPopup(languageService.getText('noTrainingText'));
						}
					}
					else if (currentState === 'trainingDemo') {
						mediaService.playIosAudio(self.currentTrainingId);
						$('video').get(0).play();
					}
					else if (currentState === 'training') {
						mediaService.playIosAudio('startTraining');
					}
				}
			}
		});
