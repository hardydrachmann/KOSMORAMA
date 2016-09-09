// This is a service which can get the locally stored media files related to a users training (pictures, audio & video) & delete them 'all-at-once' when not needed anymore.

angular.module('kosmoramaApp').service('mediaService', function(loadingService, popupService, $cordovaFile, debugService) {

	/**
	 * Get currently stored and relevant training picture.
	 */
	this.getPicture = function() {
		if (debugService.device) {
			return cordova.file.externalApplicationStorageDirectory + 'media/pictures/test.png';
		}
	};

	/**
	 * Get currently stored and relevant training audio.
	 */
	this.getAudio = function() {
		if (debugService.device) {
			return cordova.file.externalApplicationStorageDirectory + 'media/audio/test.mp3';
		}
	};

	/**
	 * Get currently stored and relevant training video.
	 */
	this.getVideo = function() {
		if (debugService.device) {
			return cordova.file.externalApplicationStorageDirectory + 'media/videos/test.mp4';
		}
	};

	/**
	 * Remove all currently stored media files.
	 */
	this.removeMedia = function() {
		if (debugService.device) {
			if ($cordovaFile.checkDir(cordova.file.externalApplicationStorageDirectory, 'media')) {
				loadingService.loaderShow();
				$cordovaFile.removeRecursively(cordova.file.externalApplicationStorageDirectory, 'media');
				loadingService.loaderHide();
				popupService.checkPopup(true);
			}
		}
	};
});
