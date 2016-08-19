// This is a BLOB service that holds functions that creates the appropiate URL-string to get pictures & audio files from the BLOB.

angular.module('kosmoramaApp').service('blobService', function() {

	var baseURL = 'https://welfaredenmark.blob.core.windows.net/exercises/Exercises/';
	var language = window.localStorage.getItem('kosmoramaLang');

	this.getExerciseAudio = function(exerciseId, language) {


		console.log('base URL: ' + baseURL);
		console.log('selected language:' + language);
		// return baseURL + ØVELSE + '/speak/' + SPROG + 'speak.mp3'
	};

	this.getExercisePicture = function() {

	};

	var correctLanguage = function(language) {
		if ()
	};

});
