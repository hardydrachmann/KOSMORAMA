angular
	.module('kosmoramaApp')
	.controller('TimerController', function($scope, $timeout, $rootScope, $window, languageService, storageService) {

		/**
		 * $scope.sets: the amount of sets for the current exercise.
		 * $scope.setsRemaining: the remaining amount of sets for the current exercise.
		 * $scope.progress: progress variable for the progress bar.
		 * $scope.timeProgress: max progress variable for the progress bar.
		 * $scope.counter: variable for the timer.
		 * $scope.currentSet: current set for the exercise.
		 * mytimeout: timer variable.
		 * timeSet: time per set.
		 * timePause: time per pause.
		 * pauseProgressDecay: decayrate for the pause progress, compared to the set progress.
		 * pauseNext: variable to handle if next timer is pause or set.
		 * timerStarted: variable to handle if the timer has started for the first time.
		 */
		$scope.sets, $scope.setsRemaining, $scope.progress, $scope.timeProgress, $scope.counter;
		$scope.currentSet = 0;
		var mytimeout, timeSet, timePause, pauseProgressDecay;
		var pauseNext = false;
		var timerStarted = false;
		var trainingPromise;
		var mediaPlayer = $('video');
		var timerData = {
			currentSet: 0,
			setsRemaining: 0,
			isPauseNext: true,
			counter: 0,
			progress: 0
		};

		$(document).ready(function() {
			mediaPlayer.on('loadeddata', function() {
				getInfoForTimer();
				if (storageService.getTemporaryTimerData()) {
					resumeTimeout();
				}
				else {
					startExerciseTimer();
				}
			});
			$rootScope.$on('continueEvent', function() {
				$timeout.cancel(mytimeout);
				$timeout.cancel(trainingPromise);
			});
			$rootScope.$on('helpEvent', function() {
				$timeout.cancel(mytimeout);
				$timeout.cancel(trainingPromise);
				pauseTimeout();
			});
		});

		/**
		 * Gets and sets the information required for the timer and progressbar.
		 */
		var getInfoForTimer = function() {
			var training = storageService.proceduralUserData.currentTraining;
			$scope.sets = training.Sets;
			$scope.setsRemaining = $scope.sets;
			timeSet = training.TimeSet * 60;
			timePause = training.Pause * 60;
			$scope.counter = timeSet;
			pauseProgressDecay = timeSet / timePause;
			$scope.timeProgress = timeSet;
		};

		/**
		 * Handles what happens on timeout - increase timer variable, progress to the progress bar, handles next set/pause.
		 */
		$scope.onTimeout = function() {
			if ($scope.counter === 0) {
				$timeout.cancel(mytimeout);
				if ($scope.setsRemaining > 0) {
					if (!pauseNext) {
						startExerciseTimer();
					}
					else {
						startPauseTimer();
					}
				}
				else {
					trainingPromise = $scope.trainingViewTimer(5);
					return;
				}
			}
			$scope.counter--;
			if (pauseNext) {
				$scope.progress++;
			}
			else {
				$scope.progress -= pauseProgressDecay;
			}
			mytimeout = $timeout($scope.onTimeout, 1000);
		};

		/**
		 * Pauses the timeout and saves the current state of the timer in localstorage
		 */
		var pauseTimeout = function() {
			console.log('pause!');
			timerData.currentSet = $scope.currentSet;
			timerData.setsRemaining = $scope.setsRemaining;
			timerData.isPauseNext = pauseNext;
			timerData.counter = $scope.counter;
			timerData.progress = $scope.progress

			if (pauseNext) {
				timerData.isPauseNext = false;
				timerData.setsRemaining += 1;
			}
			else {
				timerData.isPauseNext = true;
			}

			storageService.setTemporaryTimerData(timerData);
		}

		/**
		 * Starts a new timeout, with the data stored in localstorage
		 */
		var resumeTimeout = function() {
			console.log('resume!');
			timerData = storageService.getTemporaryTimerData();

			$scope.currentSet = timerData.currentSet;
			$scope.setsRemaining = timerData.setsRemaining;
			$scope.counter = timerData.counter;
			$scope.progress = timerData.progress;
			pauseNext = timerData.isPauseNext;

			if (pauseNext) {
				pauseNext = false;
			}
			else {
				pauseNext = true;
				$scope.setsRemaining -= 1;
			}
			if (!timerStarted) {
				mytimeout = $timeout($scope.onTimeout);
				timerStarted = true;
			}

			storageService.removeTemporaryTimerData();
		}

		/**
		 * start the pause timer, set up the timer and pause the video
		 */
		var startPauseTimer = function() {
			mediaPlayer.get(0).pause();
			$scope.counter = timePause;
			$scope.progress -= pauseProgressDecay;
			// $scope.progress -= 1;
			pauseNext = false;
		};

		/**
		 * start the timer for the current set, set up the timers and play the video
		 */
		var startExerciseTimer = function() {
			mediaPlayer.get(0).play();
			$scope.currentSet++;
			$scope.setsRemaining--;
			$scope.counter = timeSet;
			$scope.progress = 1;
			pauseNext = true;
			if (!timerStarted) {
				mytimeout = $timeout($scope.onTimeout);
				timerStarted = true;
			}
		};

		/**
		 * returns the string for the timer, for the current state (pause or set of set)
		 */
		$scope.timerText = function() {
			if (!pauseNext) {
				return languageService.getText('pause');
			}
			else {
				return languageService.getText('set') + " " + $scope.currentSet + " " + languageService.getText('of') + " " + $scope.sets;
			}
		};
	});
