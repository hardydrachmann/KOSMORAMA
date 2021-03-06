// This is a service which can get media files from the blob.

var blobService = function(storageService) {
	var baseURL = 'https://welfaredenmark.blob.core.windows.net/exercises/Exercises/';

	/**
	 * Gets exercise audio, based on exerciseId.
	 */
	this.getAudio = function(exerciseId) {
		if (exerciseId) {
			switch (exerciseId) {
				case 'startTraining':
					return 'audio/start_training.mp3';
				case 'stopTraining':
					return 'audio/stop_training.mp3';
				case 'prompt':
					return 'audio/prompt.mp3';
				default:
					break;
			}
			var language = storageService.getCorrectedLanguageString();
			return baseURL + exerciseId + '/speak/' + language + '/speak.mp3';
		}
	};

	/**
	 * Gets exercise picture, based on exerciseId.
	 */
	this.getPicture = function(exerciseId) {
		return baseURL + exerciseId + '/picture/' + 'picture.png';
	};

	/**
	 * Gets exercise video, based on exerciseId.
	 */
	this.getVideo = function(exerciseId) {
		return baseURL + exerciseId + '/video/' + 'speak.mp4';
	};
};

angular.module('virtualTrainingApp').service('blobService', blobService);
