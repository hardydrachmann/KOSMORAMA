angular
	.module('kosmoramaApp')
	.controller('TimerController', function($interval, $window, $timeout, $state, $ionicHistory, languageService, storageService, mediaService, tabsService) {

		var self = this;
		var counter;
		var video = $('video').get(0);
		var audioStopTraining = mediaService.getAudio('stopTraining');

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
				time: currentTraining.TimeSet * 60,
				pause: currentTraining.Pause * 60
			};
			$window.onresize = refreshRadius;
			refreshRadius();
			start(self.training.time);
		})();

		/**
		 * Pause the timer if not in intermission. If paused, resume instead.
		 */
		self.pause = function() {
			console.log(video);
			if (!self.intermission) {
				if (self.paused) {
					self.resume();
					self.paused = false;
				} else {
					$interval.cancel(counter);
					counter = null;
					$timeout(function() {
						// Let interval cancel before pausing video.
						video.pause();
					}, 100);
					self.paused = true;
				}
			}
		};

		/**
		 * Resume the timer if training is not in intermission.
		 */
		self.resume = function() {
			video.play();
			// Get remaining seconds point before starting inc/dec again.
			var seconds = self.training.time - self.seconds;
			incrementTimer();
			counter = $interval(function() {
				incrementTimer();
			}, 1000, seconds);

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

		/**
		 * Start the timer if not already started.
		 */
		function start(time) {
			self.capacity = time;
			self.seconds = self.intermission ? time : 0;
			video.play();
			incrementTimer();
			counter = $interval(function() {
				incrementTimer();
			}, 1000, time);
		}

		/**
		 * If training in progress, increment the timer by a second until the specified time is reached.
		 * If pause in progress, decrement the timer by a second until 0 is reached.
		 * When the limit is reached, switch between active and pause. Decrement set count, if pause is over.
		 */
		function incrementTimer() {
			if (self.intermission) {
				if (self.seconds > 0) {
					self.seconds--;
				} else {
					self.intermission = false;
					start(self.training.time);
					video.play();
					if (self.training.sets > 0) {
						self.training.sets--;
					}
				}
			} else {
				if (self.seconds < self.training.time) {
					self.seconds++;
				} else if (self.training.sets > 1) {
					self.intermission = true;
					start(self.training.pause);
					video.pause();
				} else {
					self.reset();
					// Remove video element so it does not continue or pause during 'stop training audio' playback (also remove other html elements to give a good ux).
					video.remove();
					$('#progress-timer').get(0).remove();
					$('.progress-content').get(0).remove();
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
			} else {
				self.radius = $window.outerHeight / 6;
			}
		}
	});
