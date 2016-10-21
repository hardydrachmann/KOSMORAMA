// This is a service which can download media files related to a users training (audio, video & pictures).

angular.module('virtualTrainingApp').service('downloadService', function($cordovaFileTransfer, $cordovaFile, dataService, $interval, loadingService, storageService, languageService, deviceService) {

	var self = this;
	var fileTransfer;
	var baseURL = 'https://welfaredenmark.blob.core.windows.net/exercises/Exercises/';
	var deviceApplicationPath;
	var toDownload;

	document.addEventListener('deviceready', onDeviceReady, false);

	function onDeviceReady() {
		fileTransfer = deviceService.device ? new FileTransfer() : 'not on device';
		deviceApplicationPath = deviceService.getDeviceApplicationPath();
		console.log('downloadService -> onDeviceReady -> application path -> ', deviceApplicationPath);
	}

	/**
	 * Setup all folders on the device for media files.
	 */
	self.createMediaFolders = function(trainings, callback) {
		var appDir = deviceApplicationPath;
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
					});
				});
			}
			callback();
		});
	};

	/**
	 * Setup a single folder on the device and return the folder in a callback if needed.
	 * When the downloads are all finished, fire the callback to inform the invoking block to continue it's procedure.
	 */
	self.createFolder = function(root, folder, callback) {
		$cordovaFile.createDir(root, folder, false)
			.then(function(success) {
				if (callback) {
					callback(folder);
				}
			}, function(error) {
				console.log('error: ', JSON.stringify(error));
			});
	};

	/**
	 * Setup media path variables for device storage, and fire the download functions.
	 */
	self.downloadMedia = function(exerciseId, callback) {
		if (deviceService.device) {
			try {
				// Count downloading elements and prepare decrementer for
				toDownload = languageService.langs.length + 2;
				var downloadDone = function() {
					toDownload--;
				};

				// Download audio files.
				for (var i = 0; i < languageService.langs.length; i++) {
					var audioPath = deviceApplicationPath + 'media/' + exerciseId + '/audio/' + storageService.getCorrectLanguageStringFromInput(languageService.langs[i].tag) + '/speak.mp3';
					var audioUrl = baseURL + exerciseId + '/speak/' + storageService.getCorrectLanguageStringFromInput(languageService.langs[i].tag) + '/speak.mp3';
					self.downloadAudio(audioPath, audioUrl, downloadDone);
				}

				// Download video files.
				var videoPath = deviceApplicationPath + 'media/' + exerciseId + '/video/speak.mp4';
				var videoUrl = baseURL + exerciseId + '/video/speak.mp4';
				self.downloadVideo(videoPath, videoUrl, downloadDone);

				// Download picture files.
				var picturePath = deviceApplicationPath + 'media/' + exerciseId + '/picture/picture.png';
				var pictureUrl = baseURL + exerciseId + '/picture/picture.png';
				self.downloadPicture(picturePath, pictureUrl, downloadDone);

				// When done downloading everything, callback and cancel the interval.
				console.log('downloading ' + toDownload + ' elements from mediaService.');
				var downloadInterval = $interval(function() {
					console.log('download individual media...', toDownload);
					if (toDownload <= 0) {
						$interval.cancel(downloadInterval);
						callback();
					}
				}, 1000);
			} catch (error) {
				console.log('Download error', error);
			}
		}
	};

	/**
	 * Download audio for a training.
	 * If audio file is not found, decrement toDownload counter, ignore download and continue (since not all exercises contain all languages for that specific training).
	 */
	self.downloadAudio = function(audioPath, audioUrl, callback) {
		dataService.checkAudioUrlExist(audioUrl, function(existCall) {
			// console.log('url exist:', existCall, 'url audio:', audioUrl);
			if (existCall) {
				fileTransfer.download(
					encodeURI(audioUrl),
					audioPath,
					callback,
					self.downloadError
				);
			} else {
				toDownload--;
			}
		});
	};

	/**
	 * Download video for a training.
	 */
	self.downloadVideo = function(videoPath, videoUrl, callback) {
		fileTransfer.download(
			encodeURI(videoUrl),
			videoPath,
			callback,
			self.downloadError
		);
	};

	/**
	 * Download picture for a training.
	 */
	self.downloadPicture = function(picturePath, pictureUrl, callback) {
		fileTransfer.download(
			encodeURI(pictureUrl),
			picturePath,
			callback,
			self.downloadError
		);
	};

	/**
	 * Print out download errors.
	 */
	self.downloadError = function(error) {
		console.log('media file not found on blob server', error);
	};
});
