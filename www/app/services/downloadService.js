// This is a service which can download media files related to a users training (audio, video & pictures).

angular.module('kosmoramaApp').service('downloadService', function($cordovaFileTransfer, loadingService, popupService) {

	var fileTransfer;

	document.addEventListener('deviceready', onDeviceReady, false);

	function onDeviceReady() {
		fileTransfer = new FileTransfer();
	}

	/**
	 * Download all currently needed and relevant media files.
	 */
	this.downloadMedia = function(uri, fileName) {
		var fileExtension = uri.substring(uri.length - 4);
		var fileType;
		switch (fileExtension) {
			case '.mp3':
				fileType = 'audio';
				break;
			case '.mp4':
				fileType = 'videos';
				break;
			case '.png':
				fileType = 'pictures';
				break;
		}
		devicePath = cordova.file.externalApplicationStorageDirectory + 'media/' + fileType + '/' + fileName;
		loadingService.loaderShow();
		fileTransfer.download(
			encodeURI(uri),
			devicePath,
			function(entry) {
				loadingService.loaderHide();
				popupService.checkPopup(true);
			},
			function(error) {
				loadingService.loaderHide();
				popupService.checkPopup(false);
			}
		);
	};
});
