// This is a service which can get the locally stored media files related to a users training (pictures, audio & video) & delete them 'all-at-once' when not needed anymore.

angular.module('kosmoramaApp').service('mediaService', function(loadingService, popupService, $cordovaFile, storageService) {

	/**
	 * Get currently stored and relevant training picture.
	 */
	this.getPicture = function(exerciseId) {
		console.log('pic: ' + exerciseId);
		return cordova.file.externalApplicationStorageDirectory + 'media/' + exerciseId + '/picture/picture.png';
	};

	/**
	 * Get currently stored and relevant training audio.
	 */
	this.getAudio = function(exerciseId) {
		console.log('aud: ' + exerciseId);
		switch (exerciseId) {
			case 'startTraining':
			return 'fx/start_training.mp3';
			case 'stopTraining':
			return 'fx/stop_training.mp3';
			case 'prompt':
			return 'fx/media_audio.mp3';
				default:
				return cordova.file.externalApplicationStorageDirectory + 'media/' + exerciseId + '/audio/' + storageService.getCorrectedLanguageString() + '/speak.mp3';
		}
	};

	/**
	 * Get currently stored and relevant training video.
	 */
	this.getVideo = function(exerciseId) {
		console.log('vid: ' + exerciseId);
		return cordova.file.externalApplicationStorageDirectory + 'media/' + exerciseId + '/video/speak.mp4';
	};

	/**
	 * Remove all currently stored media files.
	 */
	this.removeMedia = function() {
		if ($cordovaFile.checkDir(cordova.file.externalApplicationStorageDirectory, 'media')) {
			loadingService.loaderShow();
			$cordovaFile.removeRecursively(cordova.file.externalApplicationStorageDirectory, 'media');
			loadingService.loaderHide();
			popupService.checkPopup(true);
		}
	};
});
