var deviceService = function() {
	this.mock = false;
	this.device = false;

	/**
     * Return whether the current device is an Android.
     */
	this.isAndroid = function() {
		if (this.device) {
			return device.platform === 'Android';
		}
		return false;
	};

	/**
     * Get the path for the applications local folder on the device.
     */
	this.getDeviceApplicationPath = function() {
		return this.isAndroid() ? cordova.file.externalDataDirectory : cordova.file.documentsDirectory;
	};
};

angular.module('virtualTrainingApp').service('deviceService', deviceService);