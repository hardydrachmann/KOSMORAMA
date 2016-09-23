// This is a service which can get the locally stored media files related to a users training (pictures, audio & video) & delete them 'all-at-once' when not needed anymore.

angular.module('kosmoramaApp').service('mediaService', function($timeout, loadingService, popupService, $cordovaFile, storageService, debugService) {

	var self = this;
	var deviceApplicationPath, devicePlatform;
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
	 * Get currently stored and relevant training audio.
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
			} else {
				switch (exerciseId) {
					case 'startTraining':
						self.playAudio(audioStartTraining);
						break;
					case 'stopTraining':
						self.playAudio(audioStopTraining);
						break;
					case 'prompt':
						self.playAudio(audioPrompt);
						break;
					default:
						return deviceApplicationPath + 'media/' + exerciseId + '/audio/' + storageService.getCorrectedLanguageString() + '/speak.mp3';
				}
			}
		}
	};

	/**
	 * Play an audio file once on an ios devices.
	 */
	self.playAudio = function(audioFile) {
		console.log('iOS PLAY AUDIO CALLED');
		var iosAudio = new Media(audioFile);
		iosAudio.play({
			numberOfLoops: 0
		});
		$timeout(function() {
			iosAudio.release();
		}, 2000);
		// var iosAudio = new Media(audioFile,
		// 	function() {
		// 		iosAudio.play({
		// 			numberOfLoops: 1
		// 		});
		// 		// iosAudio.stop();
		// 		// iosAudio.release();
		// 	},
		// 	function(err) {
		// 		console.log('iosAudio playback error: ', err);
		// 	}
		// );
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
	self.removeMedia = function() {
		if (debugService.device) {
			if ($cordovaFile.checkDir(deviceApplicationPath, 'media')) {
				$cordovaFile.removeRecursively(deviceApplicationPath, 'media');
			}
		}
	};
});
