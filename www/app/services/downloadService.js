// This is a service which can download media files related to a users training (audio, video & pictures).

angular.module('kosmoramaApp').service('downloadService', function($cordovaFileTransfer, $cordovaFile, loadingService, storageService, languageService, debugService) {

	var self = this;
	var fileTransfer, trainingId;
	var baseURL = 'https://welfaredenmark.blob.core.windows.net/exercises/Exercises/';

	document.addEventListener('deviceready', onDeviceReady, false);

	function onDeviceReady() {
		fileTransfer = debugService.device ? new FileTransfer() : 'not on device';
	}

	/**
	 * Setup all folders on the device for media files.
	 */
	self.createMediaFolders = function(trainings, callback) {
		var appDir = cordova.file.externalApplicationStorageDirectory;
		self.createFolder(appDir, 'media/', function(folder) {
			var subDir = appDir + folder;
			for (var i = 0; i < trainings.length; i++) {
				var id = trainings[i].ExerciseId;
				self.createFolder(subDir, id + '/', function(folder) {
					var idDir = subDir + folder;
					// add video folders.
					self.createFolder(idDir, 'video/');
					// add picture folders.
					self.createFolder(idDir, 'picture/');
					// add audio folders.
					self.createFolder(idDir, 'audio/', function(folder) {
						var audioDir = idDir + folder;
						var langs = languageService.langs;
						for (var j = 0; j < langs.length; j++) {
							self.createFolder(audioDir, storageService.getCorrectLanguageStringFromInput(langs[j].tag) + '/');
						}
						callback();
					});
				});
			}
		});
	};

	/**
	 * Setup a single folder on the device and return the folder in a callback if needed.
	 */
	self.createFolder = function(root, folder, callback) {
		$cordovaFile.createDir(root, folder, false)
			.then(function(success) {
				if (callback) {
					callback(folder);
				}
			}, function(error) {
				console.log('error: ', error);
			});
	};

	/**
	 * Setup media path variables for device storage, and fire the download functions.
	 */
	self.downloadMedia = function(exerciseId) {
		if (debugService.device) {
			trainingId = exerciseId;
			var deviceAudioPath, urlAudioPath;
			try {
				// add audio files for all languages (used if language is changed while offline).
				for (var i = 0; i < languageService.langs.length; i++) {
					deviceAudioPath = cordova.file.externalApplicationStorageDirectory + 'media/' + trainingId + '/audio/' + storageService.getCorrectLanguageStringFromInput(languageService.langs[i].tag) + '/speak.mp3';
					urlAudioPath = baseURL + trainingId + '/speak/' + storageService.getCorrectLanguageStringFromInput(languageService.langs[i].tag) + '/speak.mp3';
					self.downloadAudio(deviceAudioPath, urlAudioPath);
				}
				// add video files.
				var deviceVideoPath = cordova.file.externalApplicationStorageDirectory + 'media/' + trainingId + '/video/speak.mp4';
				self.downloadVideo(deviceVideoPath);
				// add picture files.
				var devicePicturePath = cordova.file.externalApplicationStorageDirectory + 'media/' + trainingId + '/picture/picture.png';
				self.downloadPicture(devicePicturePath);
				return true;
			}
			catch (error) {
				return false;
			}
		}
		else {
			return true;
		}
	};

	/**
	 * Download relevant audio to the device, based on exerciseId and selected language.
	 */
	self.downloadAudio = function(deviceAudioPath, urlAudioPath) {
		fileTransfer.download(
			encodeURI(urlAudioPath),
			deviceAudioPath,
			self.downloadSuccess,
			self.downloadError
		);
	};

	/**
	 * Download relevant video to the device, based on exerciseId.
	 */
	self.downloadVideo = function(deviceVideoPath) {
		fileTransfer.download(
			encodeURI(self.getExerciseVideoURL()),
			deviceVideoPath,
			self.downloadSuccess,
			self.downloadError
		);
	};

	/**
	 * Download relevant picture to the device, based on exerciseId.
	 */
	self.downloadPicture = function(devicePicturePath) {
		fileTransfer.download(
			encodeURI(self.getExercisePictureURL()),
			devicePicturePath,
			self.downloadSuccess,
			self.downloadError
		);
	};

	/**
	 * Handle download functions callback when successful.
	 */
	self.downloadSuccess = function(entry) {
		console.log('download successful');
	};

	/**
	 * Handle download functions callback when an error occur.
	 */
	self.downloadError = function(error) {
		console.log('download ERROR: ', error);
	};

	/**
	 * Gets the exercise video, based on exerciseId.
	 */
	self.getExerciseVideoURL = function() {
		return baseURL + trainingId + '/video/speak.mp4';
	};

	/**
	 * Gets the exercise picture, based on exerciseId.
	 */
	self.getExercisePictureURL = function() {
		return baseURL + trainingId + '/picture/picture.png';
	};
});