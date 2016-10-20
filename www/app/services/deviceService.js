angular.module('virtualTrainingApp').service('deviceService', function() {
	this.mock = false;
	this.device = true;

	this.isAndroid = function() {
		return device.platform === 'Android';
	};

	this.getDeviceApplicationPath = function() {
		return this.isAndroid() ? cordova.file.externalDataDirectory : cordova.file.documentsDirectory;
	};
});
