// This is a service which can download media files related to a users training (audio, video & pictures).

angular.module('kosmoramaApp').service('downloadService', function($cordovaFileTransfer, loadingService, popupService, storageService, languageService) {

	var fileTransfer, trainingId;
	var baseURL = 'https://welfaredenmark.blob.core.windows.net/exercises/Exercises/';

	document.addEventListener('deviceready', onDeviceReady, false);

	function onDeviceReady() {
		fileTransfer = new FileTransfer();
	}

	/**
	 * Setup all media path variables for device storage, and fire the download functions.
	 */
	this.downloadMedia = function(exerciseId) {
		trainingId = exerciseId;
		try {
			var deviceAudioPath = cordova.file.externalApplicationStorageDirectory + 'media/' + trainingId + '/audio/' + storageService.getCorrectedLanguageString() + '/speak.mp3';
			this.downloadAudio(deviceAudioPath);
			var deviceVideoPath = cordova.file.externalApplicationStorageDirectory + 'media/' + trainingId + '/video/speak.mp4';
			this.downloadVideo(deviceVideoPath);
			var devicePicturePath = cordova.file.externalApplicationStorageDirectory + 'media/' + trainingId + '/picture/picture.png';
			this.downloadPicture(devicePicturePath);
			return true;
		} catch (error) {
			return false;
		}
	};

	/**
	 * Download relevant audio to the device, based on exerciseId and selected language.
	 */
	this.downloadAudio = function(deviceAudioPath) {
		fileTransfer.download(
			encodeURI(this.getExerciseAudioURL()),
			deviceAudioPath,
			this.downloadSuccess,
			this.downloadError
		);
	};

	/**
	 * Download relevant video to the device, based on exerciseId.
	 */
	this.downloadVideo = function(deviceVideoPath) {
		fileTransfer.download(
			encodeURI(this.getExerciseVideoURL()),
			deviceVideoPath,
			this.downloadSuccess,
			this.downloadError
		);
	};

	/**
	 * Download relevant picture to the device, based on exerciseId.
	 */
	this.downloadPicture = function(devicePicturePath) {
		fileTransfer.download(
			encodeURI(this.getExercisePictureURL()),
			devicePicturePath,
			this.downloadSuccess,
			this.downloadError
		);
	};

	/**
	 * Handle download functions callback when successful.
	 */
	this.downloadSuccess = function(entry) {
		console.log('download successful');
	};

	/**
	 * Handle download functions callback when an error occur.
	 */
	this.downloadError = function(error) {
		console.log('download error');
	};

	/**
	 * Gets the exercise audio, based on exerciseId.
	 */
	this.getExerciseAudioURL = function() {
		return baseURL + trainingId + '/speak/' + storageService.getCorrectedLanguageString() + '/speak.mp3';
	};

	/**
	 * Gets the exercise video, based on exerciseId.
	 */
	this.getExerciseVideoURL = function() {
		return baseURL + trainingId + '/video/speak.mp4';
	};

	/**
	 * Gets the exercise picture, based on exerciseId.
	 */
	this.getExercisePictureURL = function() {
		return baseURL + trainingId + '/picture/picture.png';
	};
});
