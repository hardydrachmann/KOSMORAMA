angular
	.module('kosmoramaApp')
	.controller('TimerController', function($interval, $window, $timeout, $state, languageService, storageService, mediaService, tabsService) {

		var self = this;
		var counter;
		var video = $('video').get(0);

		self.continue = tabsService.continue;

		self.seconds = 0;
		self.paused = false;
		self.radius = 0;
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
			start();
		})();

		/**
		 * Pause the timer. If paused, resume instead.
		 */
		self.pause = function() {
			if (counter) {
				if (self.paused) {
					self.resume();
					self.paused = false;
				}
				else {
					$interval.cancel(counter);
					$timeout(function() {
						// Let interval cancel before pausing video.
						video.pause();
					}, 100);
					self.paused = true;
				}
			}
		};

		/**
		 * Resume the timer.
		 */
		self.resume = function() {
			video.play();
			counter = $interval(function() {
				incrementTimer();
			}, 1000, self.training.time - self.seconds);
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
			var remainingTime = self.training.time - self.seconds;
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
		function start() {
			if (!counter) {
				video.play();
				incrementTimer();
				counter = $interval(function() {
					incrementTimer();
				}, 1000, self.training.time);
			}
		}

		/**
		 * Increment the timer by a second.
		 */
		function incrementTimer() {
			if (self.seconds < self.training.time) {
				self.seconds++;
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
