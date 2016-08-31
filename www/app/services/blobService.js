// This is a BLOB service that holds functions that creates the appropiate URL-string to get pictures & audio files from the BLOB.

angular.module('kosmoramaApp').service('blobService', function(storageService) {

	var baseURL = 'https://welfaredenmark.blob.core.windows.net/exercises/Exercises/';

	/**
	 * Gets exercise audio, based on exerciseId.
	 */
	this.getExerciseAudio = function(exerciseId) {
		var language = getLanguageString();
		return baseURL + exerciseId + '/speak/' + language + '/speak.mp3';
	};

	/**
	 * Gets exercise picture, based on exerciseId.
	 */
	this.getExercisePicture = function(exerciseId) {
		var language = getLanguageString();
		return baseURL + exerciseId + '/picture/' + 'picture.png';
	};

	/**
	 * Checks the current selected language and if it is en_US, change it to en_GB.
	 */
	var getLanguageString = function() {
		var storageLanguage = storageService.getSelectedLanguage();
		if (storageLanguage === 'en_US') {
			storageLanguage = 'en_GB';
		}
		return storageLanguage.replace('_', '-');
	};

});
