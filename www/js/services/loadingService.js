// This is a service which can show and hide a progress-loader while waiting for data/tasks.

var mediaService = function($ionicLoading, $timeout, languageService) {

	/**
	 * Shows Ionic loader.
	 */
	this.loaderShow = function() {
		$ionicLoading.show({
			template: '<ion-spinner icon="bubbles"></ion-spinner></br>' + languageService.getText('spinnerText'),
			animation: 'fade-in'
		});
	};

	/**
	 * Shows Ionic loader.
	 */
	this.loaderShowLogin = function() {
		$ionicLoading.show({
			template: languageService.getText('spinnerLoginText'),
			animation: 'fade-in'
		});
	};

	/**
	 * Hides Ionic Loader.
	 */
	this.loaderHide = function(time) {
		$timeout(function() {
			$ionicLoading.hide();
		}, time | 0);
	};
};

angular.module('virtualTrainingApp').service('loadingService', mediaService);
