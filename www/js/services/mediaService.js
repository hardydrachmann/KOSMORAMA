// This is a service which can get the locally stored media files related to a users training (pictures, audio & video) & delete them 'all-at-once' when not needed anymore.

var mediaService = function($window, $timeout, $interval, $cordovaFile, $cordovaMedia, loadingService, popupService, storageService, deviceService, tabsService) {
	var self = this;
	var deviceApplicationPath, currentPlayback;
	var audioStartTraining = 'audio/start_training.mp3';
	var audioStopTraining = 'audio/stop_training.mp3';
	var audioPrompt = 'audio/prompt.mp3';

	document.addEventListener('deviceready', onDeviceReady, false);

	function onDeviceReady() {
		deviceApplicationPath = deviceService.getDeviceApplicationPath();
		console.log('mediaService -> onDeviceReady -> application path -> ', deviceApplicationPath);
	}

	/**
	 * Get currently stored and relevant training picture.
	 */
	self.getPicture = function(exerciseId) {
		if (deviceService.device) {
			return deviceApplicationPath + 'media/' + exerciseId + '/picture/picture.png';
		}
	};

	/**
	 * Get currently stored and relevant training audio (Android only).
	 */
	self.getAudio = function(exerciseId) {
		if (deviceService.device && deviceService.isAndroid()) {
			switch (exerciseId) {
				case 'startTraining':
					return audioStartTraining;
				case 'stopTraining':
					return audioStopTraining;
				case 'prompt':
					return audioPrompt;
				default:
					return deviceApplicationPath + 'media/' + exerciseId + '/audio/' + storageService.getCorrectedLanguageString() + '/speak.mp3';
			}
		}
	};

	/**
	 * Get currently stored and relevant training audio (iOS only).
	 */
	self.playIosAudio = function(exerciseId, callback) {
		if (deviceService.device && !deviceService.isAndroid()) {
			switch (exerciseId) {
				case 'startTraining':
					self.getIosAudio(audioStartTraining, callback);
					break;
				case 'stopTraining':
					self.getIosAudio(audioStopTraining, callback);
					break;
				case 'prompt':
					self.getIosAudio(audioPrompt, callback);
					break;
				default:
					var audioDescription = deviceApplicationPath + 'media/' + exerciseId + '/audio/' + storageService.getCorrectedLanguageString() + '/speak.mp3';
					$window.resolveLocalFileSystemURL(audioDescription, function(dir) {
						var basePath = dir.toInternalURL();
						self.getIosAudio(basePath, callback);
					});
					break;
			}
		}
	};

	/**
	 * Start playback of an audio file (iOS only).
	 */
	self.getIosAudio = function(audioFile, callback) {
		var iosAudio = $cordovaMedia.newMedia(audioFile);
		var iosPlayOptions = {
			playAudioWhenScreenIsLocked: false
		};
		currentPlayback = iosAudio;
		iosAudio.play(iosPlayOptions).then(function() {
			iosAudio.stop();
			iosAudio.release();
			if (callback) {
				callback();
			}
		});
	};

	/*
	 * Pause audio playback (iOS only).
	 */
	self.pauseIosAudio = function() {
		currentPlayback.pause();
	};

	/*
	 * Resume audio playback (iOS only).
	 */
	self.resumeIosAudio = function() {
		currentPlayback.play();
	};

	/**
	 * Get currently stored and relevant training video.
	 */
	self.getVideo = function(exerciseId) {
		if (deviceService.device) {
			return deviceApplicationPath + 'media/' + exerciseId + '/video/speak.mp4';
		}
	};

	/**
	 * Remove all currently stored media files.
	 */
	self.removeMedia = function(callback) {
		if (deviceService.device) {
			if ($cordovaFile.checkDir(deviceApplicationPath, 'media')) {
				$cordovaFile.removeRecursively(deviceApplicationPath, 'media');
				var removeInterval = $interval(function() {
					if ($cordovaFile.checkDir(deviceApplicationPath, 'media')) {
						$interval.cancel(removeInterval);
						if (callback) {
							callback();
						}
					}
				}, 1000);
			} else {
				callback();
			}
		}
	};
};

angular.module('virtualTrainingApp').service('mediaService', mediaService);
