angular
	.module('kosmoramaApp')
	.controller('TrainingController',
		function($rootScope, $state, $timeout, $ionicHistory, tabsService, languageService, popupService, dataService, loadingService, storageService, mediaService) {

			var self = this;
			self.getAudio = mediaService.getAudio;
			self.getVideo = mediaService.getVideo;
			self.getPicture = mediaService.getPicture;
			self.TrainingItems = [];
			self.currentTrainingId = -1;

			/**
			 * Perform appropriate state action and register event for the training controller.
			 */
			(function init() {
				stateAction();
				if (storageService.proceduralUserData.currentTraining) {
					self.currentTrainingId = storageService.proceduralUserData.currentTraining.ExerciseId;
				}
				$rootScope.$on('continueEvent', function() {
					cancelViewTimer();
					$('video').remove();
				});
			})();

			/**
			 * Returns the appropriate language name for the selected item.
			 */
			self.getTrainingName = function(trainingItem) {
				return trainingItem.LangName[languageService.lang];
			};

			self.trainingDescription = function() {
				// Returns the appropriate language description for the next exercise.
				var item = storageService.proceduralUserData.currentTraining;
				if (item) {
					return item.LangDesc[languageService.lang];
				}
			};

			// Move to timer controller
			self.formatTime = function(time) {
				// Takes the time as seconds in the parameter and returns it in a formatted string with min/sec.
				var min = Math.floor(time / 60);
				var sec = time - min * 60;
				return min + " " + languageService.getText('min') + " " + sec + " " + languageService.getText('sec');
			};

			var trainingPromise;
			/**
			 * Cancel the view timer.
			 */
			function cancelViewTimer() {
				if (trainingPromise) {
					$timeout.cancel(trainingPromise);
					trainingPromise = undefined;
				}
			}

			/**
			 * Start the training view timer to automatically move on to the next view by calling continue().
			 */
			function startViewTimer(time) {
				cancelViewTimer();
				trainingPromise = $timeout(function() {
					tabsService.continue();
				}, time * 1000);
			}

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
							tabsService.setTabs();
						}
					}
					if (currentState !== 'training') {
						startViewTimer(20);
					}
				}
			}
		});
