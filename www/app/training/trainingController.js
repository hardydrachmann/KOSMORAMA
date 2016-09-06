angular
	.module('kosmoramaApp')
	.controller('TrainingController',
		function($rootScope, $state, $timeout, $ionicHistory, tabsService, languageService, popupService, dataService, loadingService, blobService, storageService, downloadService, mediaService) {

			var self = this;

			self.TrainingItems = [];

			$rootScope.videoFile = 'fx/testVideo/testVideo.mp4';
			$rootScope.startAudio = 'fx/start_training.mp3';
			$rootScope.stopAudio = 'fx/stop_training.mp3';
			$rootScope.mediaAudio1 = 'fx/media_audio1.mp3';
			$rootScope.mediaAudio2 = 'fx/media_audio2.mp3';

			$scope.audio = mediaService.getAudio();

			/**
			 * Perform appropriate state action and register event for the training controller.
			 */
			(function init() {
				stateAction();
				$rootScope.$on('continueEvent', function() {
					cancelViewTimer();
					$('video').remove();
				});
			})();

			/**
			 * Download all media files needed for offline training for a given period.
			 */
			$scope.downloadMedia = function(uri, fileName) {
				downloadService.downloadMedia(uri, fileName);
				$timeout(function() {
					$scope.audio = $scope.audio === $rootScope.mediaAudio2 ? $rootScope.mediaAudio1 : $rootScope.mediaAudio2;
				}, 1000);
			};

			/**
			 * Get relevant downloaded picture file.
			 */
			$scope.getPicture = function() {
				return mediaService.getPicture();
			};

			/**
			 * Get relevant downloaded audio file.
			 */
			$scope.getAudio = function() {
				return mediaService.getAudio();
			};

			/**
			 * Get relevant downloaded video file.
			 */
			$scope.getVideo = function() {
				return mediaService.getVideo();
			};

			/**
			 * Remove all downloaded media files.
			 */
			$scope.removeMedia = function() {
				mediaService.removeMedia();
				$scope.audio = $scope.audio === $rootScope.mediaAudio2 ? $rootScope.mediaAudio1 : $rootScope.mediaAudio2;
			};

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

			// self.getAudio = function() {
			// 	return blobService.getExerciseAudio(storageService.proceduralUserData.currentTraining.ExerciseId);
			// };
			//
			// self.getPicture = function(exerciseId) {
			// 	return blobService.getExercisePicture(exerciseId);
			// };

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
					}
					if (currentState !== 'training') {
						startViewTimer(20);
					}
				}
			}
		});
