var timerCtrl = function ($interval, $window, $timeout, $state, $ionicHistory, $ionicPlatform, $cordovaProgress, languageService, storageService, mediaService, tabsService, deviceService) {
	var ctrl = this;

	var pauseLock = false;
	var counter;
	var audioStopTraining = mediaService.getAudio('stopTraining');
	var resumeLock = true;

	ctrl.isAndroid = deviceService.isAndroid();
	ctrl.isDevice = deviceService.device;

	ctrl.seconds = 0;
	ctrl.capacity = 0;
	ctrl.paused = false;
	ctrl.radius = 0;
	ctrl.intermission = false;

	ctrl.training = {
		sets: 0,
		time: 0,
		pause: 0
	};

	(function init() {
		var currentTraining = storageService.getCurrentTraining();
		ctrl.training = {
			sets: currentTraining.Sets,
			time: ((currentTraining.TimeSet * 60) / currentTraining.Sets) + 1,
			pause: (currentTraining.Pause * 60) + 1
		};
		$window.onresize = refreshRadius;
		refreshRadius();
		start(ctrl.training.time);
		// When minimizing the application during training, return to the plan view.
		$ionicPlatform.on('pause', function () {
			if ($ionicHistory.currentView().stateName === 'training') {
				ctrl.reset();
				$state.go('trainingPlan');
			}
		});
	})();

	/**
	 * Pause the timer if not in intermission. If paused, resume instead.
	 */
	ctrl.pause = function () {
		var seconds = ctrl.training.time - ctrl.seconds;
		if (ctrl.paused) {
			ctrl.paused = false;
			console.log('Resuming', seconds);
			// Start incrementing.
			incrementTimer();
			counter = $interval(function () {
				incrementTimer();
			}, 1000, seconds);
			playMedia();
		} else if (!pauseLock && seconds > 2) {
			ctrl.paused = true;
			// Get remaining seconds before starting incrementing again.
			console.log('Paused', seconds);
			$interval.cancel(counter);
			counter = null;
			// Let interval cancel before pausing video.
			$timeout(function () {
				pauseMedia();
			}, 100);
			pauseLock = true;
			$timeout(function () {
				pauseLock = false;
			}, 2000);
		}
	}

	/**
	 * Reset the timer.
	 */
	ctrl.reset = function () {
		console.log('Resetting...')
		$interval.cancel(counter);
		counter = null;
		ctrl.seconds = 0;
		ctrl.paused = false;
	};

	/**
	 * Returns an object containing remaining minutes and seconds.
	 */
	ctrl.formattedTime = function () {
		var remainingTime = ctrl.intermission ? ctrl.seconds : ctrl.training.time - ctrl.seconds;
		var minutes = Math.floor(remainingTime / 60);
		var seconds = remainingTime - (minutes * 60);
		return {
			min: minutes,
			sec: seconds
		};
	};

	/**
	 * Get the appropriate play/pause icon.
	 */
	ctrl.getIcon = function () {
		return ctrl.paused ? 'ion-play icon-position' : 'ion-pause';
	};

	/**
	 * Start the timer if not already started.
	 */
	function start(time) {
		ctrl.capacity = time;
		ctrl.seconds = ctrl.intermission ? time : 0;
		incrementTimer();
		counter = $interval(function () {
			incrementTimer();
		}, 1000, time);
		$('video').get(0).play();
	}

	function playMedia() {
		$('video').get(0).play();
		if (deviceService.isAndroid()) {
			$('audio').get(0).play();
		} else if (deviceService.device) {
			mediaService.resumeIosAudio();
		}
	}

	function pauseMedia() {
		$('video').get(0).pause();
		if (deviceService.isAndroid()) {
			$('audio').get(0).pause();
		} else if (deviceService.device) {
			mediaService.pauseIosAudio();
		}
	}

	/**
	 * Increments the training timer or decrements the intermission timer. Also toggles between the two states.
	 * If training in progress, increment the timer it by a second until the specified time is reached.
	 * If pause in progress, decrement the timer by a second until 0 is reached.
	 * When the limit is reached, switch between active and pause. Decrement set count, if pause is over.
	 */
	function incrementTimer() {
		// If there is an intermission.
		if (ctrl.intermission) {
			// If there's still time left.
			if (ctrl.seconds > 0) {
				ctrl.seconds--;
			}
			// If the intermission has just ended.
			else {
				ctrl.intermission = false;
				start(ctrl.training.time);
				$('video').get(0).play();
				// If there are any more sets left.
				if (ctrl.training.sets > 0) {
					ctrl.training.sets--;
				}
			}
		}
		// If training is in progress.
		else {
			// If there is time left.
			if (ctrl.seconds < ctrl.training.time) {
				ctrl.seconds++;
			}
			// If the set just ended, and there are any sets left.
			else if (ctrl.training.sets > 1) {
				console.log('Intermission');
				ctrl.intermission = true;
				start(ctrl.training.pause);
				$('video').get(0).pause();
				if (deviceService.device && !deviceService.isAndroid()) {
					var pauseTime = (ctrl.training.pause - 1) * 10000;
					$cordovaProgress.showDeterminateWithLabel(true, pauseTime, languageService.getText('trainingPausedIndicator'));
				}
			}
			// If training is done.
			else {
				ctrl.reset();
				// Remove video element so it does not continue or pause during 'stop training audio' playback (also remove other html elements to give a good ux).
				$('video').get(0).pause();
				try {
					$('.progress-wrapper').get(0).remove();
					$('#progress-button').get(0).remove();
				} catch (error) {
					console.warn('Trying to remove non-existing progress bar element. This is probably happening due to incorrect browser navigation.');
				}
				// Play training stop sound (iOS only).
				mediaService.playIosAudio('stopTraining');
				// Play training stop sound (Android only).
				var audioPlayer = $('#trainingAudio').attr('src', audioStopTraining);
				try {
					audioPlayer[0].play();
				} catch (error) {
					console.warn('Trying to invoke "play()" on non-existing player. This is probably happening due to incorrect browser navigation.');
				}
				// Timeout before changing view, so audio can finish playback, removing audio before progressing to eliminate bugs.
				$timeout(function () {
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
			ctrl.radius = $window.outerHeight / 7;
		} else {
			ctrl.radius = $window.outerHeight / 6;
		}
	}
};

angular.module('virtualTrainingApp').controller('TimerController', timerCtrl);