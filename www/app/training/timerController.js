angular
	.module('virtualTrainingApp')
	.controller('TimerController', function($interval, $window, $timeout, $state, $ionicHistory, $cordovaProgress, languageService, storageService, mediaService, tabsService, debugService) {

		var self = this;

		var pauseLock = false;
		var counter;
		var video = $('video').get(0);
		var audioStopTraining = mediaService.getAudio('stopTraining');

		self.isIos = false;

		self.seconds = 0;
		self.capacity = 0;
		self.paused = false;
		self.radius = 0;
		self.intermission = false;

		self.training = {
			sets: 0,
			time: 0,
			pause: 0
		};

		(function init() {
			var currentTraining = storageService.proceduralUserData.currentTraining;
			self.training = {
				sets: currentTraining.Sets,
				time: (currentTraining.TimeSet * 60) + 1,
				pause: (currentTraining.Pause * 60) + 1
			};
			$window.onresize = refreshRadius;
			refreshRadius();
			start(self.training.time);
			if (debugService.device) {
				self.isIos = device.platform === 'iOS';
			}
		})();

		/**
		 * Pause the timer if not in intermission. If paused, resume instead.
		 */
		self.pause = function() {
			if (self.paused) {
				// Get remaining seconds before starting incrementing again.
				var seconds = self.training.time - self.seconds;
				// Start incrementing.
				incrementTimer();
				counter = $interval(function() {
					incrementTimer();
				}, 1000, seconds);
				self.paused = false;
				video.play();
			}
			else if (!pauseLock) {
				$interval.cancel(counter);
				counter = null;
				self.paused = true;
				// Let interval cancel before pausing video.
				$timeout(function() {
					video.pause();
				}, 100);
				pauseLock = true;
				$timeout(function() {
					pauseLock = false;
				}, 2000);
			}
		};

		/**
		 * Reset the timer.
		 */
		self.reset = function() {
			$interval.cancel(counter);
			counter = null;
			self.seconds = 0;
			self.paused = false;
		};

		/**
		 * Returns an object containing remaining minutes and seconds.
		 */
		self.formattedTime = function() {
			var remainingTime = self.intermission ? self.seconds : self.training.time - self.seconds;
			var minutes = Math.floor(remainingTime / 60);
			var seconds = remainingTime - (minutes * 60);
			return {
				min: minutes,
				sec: seconds
			};
		};

		self.getIcon = function() {
			return self.paused ? 'ion-play icon-position' : 'ion-pause';
		};

		/**
		 * Start the timer if not already started.
		 */
		function start(time) {
			self.capacity = time;
			self.seconds = self.intermission ? time : 0;
			incrementTimer();
			counter = $interval(function() {
				incrementTimer();
			}, 1000, time);
			video.play();
		}

		/**
		 * Increments the training timer or decrements the intermission timer. Also toggles between the two states.
		 * If training in progress, increment the timer it by a second until the specified time is reached.
		 * If pause in progress, decrement the timer by a second until 0 is reached.
		 * When the limit is reached, switch between active and pause. Decrement set count, if pause is over.
		 */
		function incrementTimer() {
			// If there is an intermission.
			if (self.intermission) {
				// If there's still time left.
				if (self.seconds > 0) {
					self.seconds--;
				}
				// If the intermission has just ended.
				else {
					self.intermission = false;
					start(self.training.time);
					video.play();
					// If there are any more sets left.
					if (self.training.sets > 0) {
						self.training.sets--;
					}
				}
			}
			// If training is in progress.
			else {
				// If there is time left.
				if (self.seconds < self.training.time) {
					self.seconds++;
				}
				// If the set just ended, and there are any sets left.
				else if (self.training.sets > 1) {
					self.intermission = true;
					start(self.training.pause);
					video.pause();
					if (device.platform === 'iOS') {
						var pauseTime = (self.training.pause - 1) * 10000;
						$cordovaProgress.showDeterminateWithLabel(true, pauseTime, languageService.getText('trainingPausedIndicator'));
					}
				}
				// If training is done.
				else {
					self.reset();
					// Remove video element so it does not continue or pause during 'stop training audio' playback (also remove other html elements to give a good ux).
					video.remove();
					$('.progress-wrapper').get(0).remove();
					$('#progress-button').get(0).remove();
					// Play training stop sound (iOS only).
					mediaService.playIosAudio('stopTraining');
					// Play training stop sound (Android only).
					var audioPlayer = $('#trainingAudio').attr('src', audioStopTraining);
					audioPlayer[0].play();
					// Timeout before changing view, so audio can finish playback, removing audio before progressing to eliminate bugs.
					$timeout(function() {
						audioPlayer[0].remove();
						tabsService.continue();
					}, 1200);
				}
			}
		}

		/**
		 * Update the radius of the progress bar.
		 * Used when the screen changes size while developing in a browser.
		 * Also take into account the ratio of the screen, to make sure the progress bar fits on wider devices.
		 */
		function refreshRadius() {
			if ($window.outerWidth / $window.innerHeight == 0.75) {
				self.radius = $window.outerHeight / 7;
			}
			else {
				self.radius = $window.outerHeight / 6;
			}
		}
	});
