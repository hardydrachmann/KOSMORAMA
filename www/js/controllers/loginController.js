var loginCtrl = function($rootScope, $state, $timeout, $cordovaNetwork, $window, tabsService, deviceService, languageService, popupService, dataService, storageService, mediaService) {
	var ctrl = this;

	var screenNumber;

	/**
	 * On launch, check if a user exist in local storage. If so, decrypt user, then place this user on the scope and login.
	 */
	document.addEventListener('deviceready', function() {
		$rootScope.$on('initEvent', function() {
			screenNumber = storageService.getUserScreenNumber();
			console.log('SCREENNUMBER', screenNumber);
			if (screenNumber) {
				if (deviceService.device) {
					var network = $cordovaNetwork.getNetwork();
					if (network === 'wifi' || network === '3g' || network === '4g') {
						ctrl.login();
					} else {
						$state.go('home');
					}
				} else {
					ctrl.login();
				}
			}
		});
	});

	/**
	 * If user does not exist, check the DB for a user with the entered login id.
	 * If this user exist, encrypt the login id in local storage using a random key.
	 */
	ctrl.login = function() {
		$timeout(function() {
			if (!deviceService.device) {
				doLogin();
			} else {
				var network = $cordovaNetwork.getNetwork();
				if (network === 'wifi') {
					doLogin();
				} else if (network === '3g' || network === '4g') {
					doLogin();
				}
			}
		}, 100);
	};

	function doLogin() {
		if (screenNumber) {
			dataService.getUser(screenNumber, function(result) {
				if (result) {
					storageService.setUserScreenNumber(screenNumber);
					storageService.setAllowMessage(result.AllowMsgFeedback);
					$state.go('home');
					$('#setUserScreenNumber').val('');
				} else {
					popupService.alertPopup(languageService.getText('loginFail'));
				}
			});
		} else {
			popupService.alertPopup(languageService.getText('loginHelp'));
		}
	}

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
};

angular.module('virtualTrainingApp').controller('LoginController', loginCtrl);
