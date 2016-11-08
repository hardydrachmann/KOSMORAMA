var loginCtrl = function($state, $timeout, $cordovaNetwork, tabsService, deviceService, languageService, popupService, dataService, storageService, mediaService) {
	var ctrl = this;

	var screenNumber;

	/**
	 * If user does not exist, check the DB for a user with the entered login id.
	 * If this user exist, encrypt the login id in local storage using a random key.
	 */
	ctrl.login = function() {
		$timeout(function() {
			if (!deviceService.device || $cordovaNetwork.getNetwork() === 'wifi') {
				if (screenNumber) {
					dataService.getUser(screenNumber, function(result) {
						if (result) {
							storageService.setUserScreenNumber(screenNumber);
							storageService.setAllowMessage(result.AllowMsgFeedback);
							$state.go('home');
							$('#setUserScreenNumber').val('');
						}
						else {
							popupService.alertPopup(languageService.getText('loginFail'));
						}
					});
				}
				else {
					popupService.alertPopup(languageService.getText('loginHelp'));
				}
			}
			else {
				popupService.alertPopup(languageService.getText('loginNoWifi'));
			}

		}, 100);
	};

	/**
	 * On launch, check if a user exist in local storage. If so, decrypt user, then place this user on the scope and login.
	 */
	(function init() {
		screenNumber = storageService.getUserScreenNumber();
		if (screenNumber) {
			if (deviceService.device) {
				var network = $cordovaNetwork.getNetwork();
				if (network === 'wifi' || network === '3g' || network === '4g') {
					ctrl.login();
				}
				else {
					$state.go('home');
				}
			}
			else {
				ctrl.login();
			}
		}
	})();

	/**
	 * Get the input from the input field (on changed) an update the scope with this value.
	 */
	ctrl.setUserScreenNumber = function() {
		var inputValue = $('#setUserScreenNumber').val();
		if (inputValue) {
			screenNumber = inputValue;
		}
	};

	/**
	 * At logout, remove the locally stored users data then logout.
	 */
	ctrl.logout = function() {
		popupService.confirmPopup(languageService.getText('logoutText'), '', function() {
			storageService.clearUserData();
			storageService.clearTrainingData();
			mediaService.removeMedia();
			screenNumber = '';
			$state.go('login');
		});
	};

	function attemptLogin() {

	}
};

angular.module('virtualTrainingApp').controller('LoginController', loginCtrl);