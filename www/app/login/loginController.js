angular.module('kosmoramaApp').controller('LoginController', function($scope, $state, $timeout, popupService, dataService, loadingService) {

	$scope.userScreenNumber = '';

	$(document).ready();

	/**
	 * On launch, check if a user exist in local storage. If so, unencrypt user, then place this user on the scope and login.
	 */
	var main = function() {
		var encryptedId = window.localStorage.getItem('kosmoramaId');
		var key = window.localStorage.getItem('kosmoramaKey');
		if (encryptedId && key) {
			var decryptedId = sjcl.decrypt(key, encryptedId);
			$scope.userScreenNumber = decryptedId;
			$state.go('home');
		}
	};

	/**
	 * Get the input from the input field (on changed) and update the scope with this value.
	 */
	$scope.setUserScreenNumber = function() {
		var inputValue = $('#setUserScreenNumber').val();
		if (inputValue) {
			$scope.userScreenNumber = inputValue;
		}
	};

	/**
	 * If user does not exist, check the DB for a user with the entered login id.
	 * If this user exist, encrypt the login id in local storage using a random key.
	 */
	$scope.login = function() {
		if ($scope.userScreenNumber) {
			loadingService.loaderShow();
			dataService.getUser($scope.userScreenNumber, function(result) {
				if (result) {
					var key = $scope.getRandomKey();
					var id = sjcl.encrypt(key, $scope.userScreenNumber);
					window.localStorage.setItem('kosmoramaId', id);
					window.localStorage.setItem('kosmoramaKey', key);
					$('#setUserScreenNumber').val('');
					$scope.setTabs();
					loadingService.loaderHide(1000);
					$state.go('home');
				} else {
					loadingService.loaderHide(1000);
					$('#setUserScreenNumber').val('');
					popupService.AlertPopup($scope.getText('loginFail'));
				}
			});
		} else {
			popupService.AlertPopup($scope.getText('loginHelp'));
		}
	};

	/**
	 * At logout, remove the locally stored users data, then set the scope to 'empty' and logout.
	 */
	$scope.logout = function() {
		popupService.confirmPopup($scope.getText('logoutText') + '?', '', function() {
			window.localStorage.removeItem('kosmoramaId');
			window.localStorage.removeItem('kosmoramaKey');
			$scope.userScreenNumber = '';
			$state.go('login');
			$scope.setTabs();
		});
	};

	/**
	 * Return a random key generated from a set of ASCII characters, to use with the above encryption-process.
	 */
	var minASCII = 33;
	var maxASCII = 126;
	$scope.getRandomKey = function() {
		var key = "";
		for (var i = 0; i < 10; i++) {
			var random = minASCII + (Math.random() * (maxASCII - minASCII));
			key += String.fromCharCode(Math.ceil(random));
		}
		return key;
	};

});
