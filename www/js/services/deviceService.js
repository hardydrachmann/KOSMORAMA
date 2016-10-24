// This is a service which fakes a device with mock data or not (run local or on device) and it can check to see which device you are on.

var deviceService = function() {
	this.mock = false;
	this.device = true;

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
