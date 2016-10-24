var deviceService = function() {
	this.mock = false;
	this.device = false;

	this.isAndroid = function() {
		if (this.device) {
			return device.platform === 'Android';
		}
		return false;
	};

	this.getDeviceApplicationPath = function() {
		return this.isAndroid() ? cordova.file.externalDataDirectory : cordova.file.documentsDirectory;
	};
};

angular.module('virtualTrainingApp').service('deviceService', deviceService);