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
	this.confirmPopup = function(title, subTitle, toConfirm, callback) {
		var confirm = $ionicPopup.confirm({
			title: title,
			cssClass: 'popup-box',
			subTitle: subTitle,
			template: toConfirm,
			okText: ' ',
			okType: 'button icon-center ion-ios-checkmark-empty ok-button popup-confirm-button',
			cancelText: ' ',
			cancelType: 'button icon-center ion-ios-close-empty cancel-button popup-confirm-button'
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
			title: message,
			cssClass: 'popup-box',
			buttons: [{
				type: 'button icon-center ion-ios-checkmark-empty ok-button popup-alert-button'
			}]
		});
	};

	/**
	 * Initiates a popup with a green checkmark or a red cross when called (controlled by a boolean value).
	 */
	this.checkPopup = function(success) {
		var color = success ? '#19DC19' : '#ff0000';
		var icon = success ? 'ion-ios-checkmark-empty' : 'ion-ios-close-empty';
		var popup = $ionicPopup.show({
			cssClass: 'popup-box',
			template: '<style>.popup-head {display:none;} .popup-body {padding:0;}</style><i class="icon-center ' + icon + '" style="font-size:8em; color:' + color + '; position: absolute; left: 50%; transform: translateX(-50%);"></i>'
		});
		$timeout(function() {
			popup.close();
		}, 2000);
	};
});
