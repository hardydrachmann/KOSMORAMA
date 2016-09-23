angular
	.module('kosmoramaApp')
	.controller('TrainingController',
		function($rootScope, $state, $timeout, $ionicHistory, tabsService, languageService, popupService, dataService, loadingService, storageService, mediaService, blobService, debugService) {

			var self = this;
			self.getAudio = debugService.device ? mediaService.getAudio : blobService.getAudio;
			self.getVideo = debugService.device ? mediaService.getVideo : blobService.getVideo;
			self.getPicture = debugService.device ? mediaService.getPicture : blobService.getPicture;
			self.TrainingItems = [];
			self.currentTrainingId = -1;

			(function init() {
				stateAction();
				if (storageService.proceduralUserData.currentTraining) {
					self.currentTrainingId = storageService.proceduralUserData.currentTraining.ExerciseId;
				}
				$rootScope.$on('continueEvent', function() {
					$('video').remove();
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
				// console.log(item);
				if (item) {
					return item.LangDesc[languageService.lang];
				}
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
				}
			}
		});
