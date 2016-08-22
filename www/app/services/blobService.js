// This is a BLOB service that holds functions that creates the appropiate URL-string to get pictures & audio files from the BLOB.

angular.module('kosmoramaApp').service('blobService', function() {

	var baseURL = 'https://welfaredenmark.blob.core.windows.net/exercises/Exercises/';

	this.getExerciseAudio = function(exerciseId) {
		var language = getLanguageString();
		return baseURL + exerciseId + '/speak/' + language + '/speak.mp3';
	};

	this.getExercisePicture = function(exerciseId) {
		var language = getLanguageString();
		return baseURL + exerciseId + '/picture/' + 'picture.png';
	};

	var getLanguageString = function() {
		var storageLanguage = window.localStorage.getItem('kosmoramaLang');
		if (storageLanguage === 'en_US') {
			storageLanguage = 'en_GB';
		}
		return storageLanguage.replace('_', '-');
	};

});
