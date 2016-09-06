angular
	.module('kosmoramaApp')
	.controller('TrainingController',
		function($state, $timeout, $rootScope, $ionicHistory, popupService, dataService, loadingService, blobService, storageService, downloadService) {

			var self = this;

			self.TrainingItems = [];

			$rootScope.videoFile = 'media/video/test_training/video.mp4';
			$rootScope.audioFile = 'media/audio/test_training/audio.mp3';
			$rootScope.startAudio = 'media/audio/start-stop/start.mp3';

			/**
			 * Perform appropriate state action and register event for the training controller.
			 */
			(function init() {
				stateAction();
				$rootScope.$on('continueEvent', function() {
					self.cancelViewTimer();
					$('video').remove();
				});
			})();

			/**
			 * Execute the appropriate action for the current training view variation.
			 */
			function stateAction() {
				var currentState = $ionicHistory.currentView().stateName;
				if (currentState.startsWith('training')) {
					if (currentState === 'trainingPlan') {
						self.TrainingItems = storageService.nextTraining();
					}
					if (currentState !== 'training') {
						self.trainingViewTimer(20);
					}
				}
			}

			var trainingPromise;
			/**
			 * Cancel the view timer.
			 */
			self.cancelViewTimer = function() {
				if (trainingPromise) {
					$timeout.cancel(trainingPromise);
					trainingPromise = undefined;
				}
			};

			/**
			 * Start the training view timer to automatically move on to the next view by calling continue().
			 */
			self.trainingViewTimer = function(time) {
				self.cancelViewTimer();
				trainingPromise = $timeout(function() {
					$rootScope.continue();
				}, time * 1000);
			};

			/**
			 * Returns the appropriate language name for the selected item.
			 */
			self.getTrainingName = function(trainingItem) {
				return trainingItem.LangName[$rootScope.lang];
			};

			self.trainingDescription = function() {
				// Returns the appropriate language description for the next exercise.
				var item = storageService.proceduralUserData.currentTraining;
				if (item) {
					return item.LangDesc[$rootScope.lang];
				}
			};

			self.getAudio = function() {
				return blobService.getExerciseAudio(storageService.proceduralUserData.currentTraining.ExerciseId);
			};

			self.getPicture = function(exerciseId) {
				return blobService.getExercisePicture(exerciseId);
			};

			// Move to timer controller
			self.formatTime = function(time) {
				// Takes the time as seconds in the parameter and returns it in a formatted string with min/sec.
				var min = Math.floor(time / 60);
				var sec = time - min * 60;
				return min + " " + $rootScope.getText('min') + " " + sec + " " + $rootScope.getText('sec');
			};
		});
