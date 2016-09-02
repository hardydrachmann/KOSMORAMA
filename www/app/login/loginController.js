angular.module('kosmoramaApp').controller('LoginController', function($scope, $state, $timeout, popupService, dataService, loadingService, storageService) {

	$scope.userScreenNumber = '';

	$(document).ready(main);

	/**
	 * On launch, check if a user exist in local storage. If so, unencrypt user, then place this user on the scope and login.
	 */
	function main() {
		$scope.userScreenNumber = storageService.getUserScreenNumber();
		if ($scope.userScreenNumber) {
			$state.go('home');
		}
	}

	/**
	 * Get the input from the input field (on changed) an update the scope with this value.
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
					storageService.setUserScreenNumber($scope.userScreenNumber);
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
			storageService.resetPersistentData();
			$scope.userScreenNumber = '';
			$state.go('login');
			$scope.setTabs();
		});
	};

});
