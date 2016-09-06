// This is a service which can show and hide different popup boxes.

angular.module('kosmoramaApp').service('popupService', function($ionicPopup, $timeout) {

	/**
	 * Initiates a default popup when called.
	 */
	this.popup = function(message, time) {
		var popup = $ionicPopup.show({
			template: message
		});
		$timeout(function() {
			popup.close();
		}, time || 2000);
	};

	/**
	 * Initiates a confirm popup when called.
	 */
	this.confirmPopup = function(title, toConfirm, callback) {
		var confirm = $ionicPopup.confirm({
			title: title,
			template: toConfirm,
			okText: ' ',
			okType: 'button icon-center ion-ios-checkmark-outline button-balanced',
			cancelText: ' ',
			cancelType: 'button icon-center ion-ios-close-outline button-assertive'
		});
		confirm.then(function(response) {
			if (response) {
				callback();
			}
		});
	};

	/**
	 * Initiates an alert popup when called.
	 */
	this.alertPopup = function(message) {
		var alert = $ionicPopup.alert({
			template: message,
			buttons: [{
				type: 'button icon-center ion-ios-checkmark-outline button-balanced'
			}]
		});
	};

	this.checkPopup = function(success) {
		var color = success ? '#52ff00' : '#ff0000';
		var icon = success ? 'ion-ios-checkmark-outline' : 'ion-ios-close-outline';
		var popup = $ionicPopup.show({
			template: '<style>.popup-head {display:none;} .popup-body {padding:0;}</style><i class="icon-center ' + icon + '" style="font-size:8em; color:' + color + '; position: absolute; left: 50%; transform: translateX(-50%);"></i>'
		});
		$timeout(function() {
			popup.close();
		}, 2000);
	};

});
