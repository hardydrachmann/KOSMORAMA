// This is a service which can play and stop playback of audio files (DOES NOT WORK IN BROWSER, TEST ON DEVICE ONLY!).

angular.module('kosmoramaApp').service('audioService', function($cordovaMedia, loadingService) {

	var audioPlaying = null;

	/**
	 * Stops the current audio and releases the audioplayer.
	 */
	this.stopAudio = function() {
		audioPlaying.stop();
		audioPlaying.release();
	};

	/**
	 * Plays selected audio.
	 */
	this.playAudio = function(source, callback) {
		if (audioPlaying !== null) {
			this.stopAudio();
		}
		var audio = new Media(source, function() {
			if (callback) {
				callback();
			}
			this.stopAudio();
		}, null, mediaStatusCallback);
		audioPlaying = audio;
		audio.play();
	};

	/**
	 * Shows loader depending on the status.
	 */
	var mediaStatusCallback = function(status) {
		if (status == 1) {
			loadingService.loaderShow();
		}
		else {
			loadingService.loaderHide();
		}
	};

});
