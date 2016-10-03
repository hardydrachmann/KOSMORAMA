// This is a service which can get the locally stored media files related to a users training (pictures, audio & video) & delete them 'all-at-once' when not needed anymore.

angular.module('kosmoramaApp').service('mediaService', function($interval, $cordovaFile, $cordovaMedia, loadingService, popupService, storageService, debugService, $window) {
	var self = this;
	var deviceApplicationPath, devicePlatform, currentPlayback, currentPlaybackPosition;
	var audioStartTraining = 'fx/start_training.mp3';
	var audioStopTraining = 'fx/stop_training.mp3';
	var audioPrompt = 'fx/prompt.mp3';

	document.addEventListener('deviceready', onDeviceReady, false);

	function onDeviceReady() {
		devicePlatform = device.platform;
		if (devicePlatform === 'Android') {
			deviceApplicationPath = cordova.file.externalDataDirectory;
		} else {
			deviceApplicationPath = cordova.file.documentsDirectory;
		}
		console.log('mediaService -> onDeviceReady -> platform -> ', devicePlatform);
		console.log('mediaService -> onDeviceReady -> application path -> ', deviceApplicationPath);
	}

	/**
	 * Get currently stored and relevant training picture.
	 */
	self.getPicture = function(exerciseId) {
		if (debugService.device) {
			return deviceApplicationPath + 'media/' + exerciseId + '/picture/picture.png';
		}
	};

	/**
	 * Get currently stored and relevant training audio (Android only).
	 */
	self.getAudio = function(exerciseId) {
		if (debugService.device) {
			if (devicePlatform === 'Android') {
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
		}
	};

	/**
	 * Get currently stored and relevant training audio (iOS only).
	 */
	self.playIosAudio = function(exerciseId) {
		if (debugService.device) {
			if (devicePlatform === 'iOS') {
				switch (exerciseId) {
					case 'startTraining':
						self.getIosAudio(audioStartTraining);
						break;
					case 'stopTraining':
						self.getIosAudio(audioStopTraining);
						break;
					case 'prompt':
						self.getIosAudio(audioPrompt);
						break;
					default:
						var audioDescription = deviceApplicationPath + 'media/' + exerciseId + '/audio/' + storageService.getCorrectedLanguageString() + '/speak.mp3';
						$window.resolveLocalFileSystemURL(audioDescription, function(dir) {
							var basePath = dir.toInternalURL();
							self.getIosAudio(basePath);
						});
						break;
				}
			}
		}
	};

	/**
	 * Start playback of an audio file (iOS only).
	 */
	self.getIosAudio = function(audioFile) {
		var iosAudio = $cordovaMedia.newMedia(audioFile);
		var iosPlayOptions = {
			playAudioWhenScreenIsLocked: false
		};
		currentPlayback = iosAudio;
		iosAudio.play(iosPlayOptions).then(function() {
			iosAudio.stop();
			iosAudio.release();
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
		if (debugService.device) {
			return deviceApplicationPath + 'media/' + exerciseId + '/video/speak.mp4';
		}
	};

	/**
	 * Remove all currently stored media files.
	 */
	self.removeMedia = function(callback) {
		if (debugService.device) {
			if ($cordovaFile.checkDir(deviceApplicationPath, 'media')) {
				$cordovaFile.removeRecursively(deviceApplicationPath, 'media');
				var removeInterval = $interval(function() {
					if ($cordovaFile.checkDir(deviceApplicationPath, 'media')) {
						$interval.cancel(removeInterval);
						callback();
					}
				}, 1000);
			} else {
				callback();
			}
		}
	};
});
