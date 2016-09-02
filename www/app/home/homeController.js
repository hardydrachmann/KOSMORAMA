angular.module('kosmoramaApp').controller('HomeController', function($scope, $state, $ionicHistory, $cordovaNetwork, storageService, $rootScope, popupService, dataService, loadingService) {

	$scope.mails = [];
	$scope.newMailCount = 0;

	$(document).ready(function() {
		if (!$scope.mails.length) {
			getMails();
		}
		if ($ionicHistory.currentView().stateName !== 'mail') {
			loadingService.loaderShow();
			getUser(function(result) {
				getTraining(result.Id, function() {
					loadingService.loaderHide();
				});
			});
			if ($cordovaNetwork.isOnline) {
				// checkSync();
			}
		}
	});

	/**
	 * Calls the checkSync method, if the phone is connected to the internet somehow.
	 */
	$rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
		checkSync();
		popupService.alertPopup('network event');
	});

	/**
	 * Getting the user from service.
	 */
	var getUser = function(callback) {
		dataService.getUser($scope.userScreenNumber, function(result) {
			callback(result);
		});
	};

	/**
	 * Getting training items from service.
	 */
	function getTraining(userId, callback) {
		dataService.getTraining(userId, function(data) {
			if (data) {
				sortTraining(data);
				if (callback) {
					callback();
				}
			} else {
				popupService.alertPopup($scope.getText('noTrainingText'));
				$state.go('home');
			}
		});
	}

	/**
	 * Sorting and adding a pass Item for each set of training.
	 */
	function sortTraining(data) {
		if (data.length > 0) {
			var setCount = data[0].SessionOrderNumber,
				pass = 1,
				firstTrainingId = data[0].TrainingId;
			for (var i = 0; i < data.length; i++) {
				if (data[i].SessionOrderNumber === setCount || data[i].TrainingId > firstTrainingId) {
					storageService.persistentUserData.training.push({
						passTitle: $scope.getText('passText') + pass++
					});
					setCount++;
					firstTrainingId = data[i].TrainingId;
				}
				storageService.persistentUserData.training.push(data[i]);
			}
		}
	}


	/*
	 * Checks whether the saved data is less than todays date or not.
	 */
	var checkSync = function() {
		if (!storageService.getLastSyncDate() || new Date().getDate() != storageService.getLastSyncDate()) {
			checkForWifi();
		}
	};

	/**
	 * This function is called if the device is connected to the internet, to check whether the device is connected to wifi or not.
	 */
	var checkForWifi = function() {
		if ($cordovaNetwork.getNetwork() != 'wifi') {
			popupService.confirmPopup('NO WIFI', 'Do you want to download your training plan, without Wifi', syncData());
		} else {
			syncData();
		}
	};

	/**
	 * Updates current training plan and sets the key date equal to today.
	 */
	var syncData = function() {
		storageService.setLastSyncDate();
	};

	/**
	 * When called, loads messages for user by using the screen number.
	 */
	var getMails = function() {
		loadingService.loaderShow();
		dataService.getUser($scope.userScreenNumber, function(result) {
			$scope.mails = result.UserMessages;
			getNewMails($scope.mails);
		});
	};
	/**
	 * Gets messages that has not been read.
	 */
	var getNewMails = function(mails) {
		$scope.newMailCount = 0;
		for (var i = 0; i < mails.length; i++) {
			if (mails[i].IsRead === false) {
				$scope.newMailCount++;
			}
		}
	};

	/**
	 * Used to navigate back to home menu, when closing the mail view.
	 */
	$scope.closeMailView = function() {
		$state.go('home');
	};

	/**
	 * Enables the unfolding of mails, so that they can be read.
	 */
	$scope.toggleMailDisplay = function(index) {
		var mail = $('#mail' + index);
		if (mail.hasClass('inactive-mail')) {
			mail.removeClass('inactive-mail');
			mail.addClass('active-mail');
		} else {
			mail.removeClass('active-mail');
			mail.addClass('inactive-mail');
		}
	};

	/**
	 * Saves the message as read.
	 */
	$scope.logMail = function(mailId) {
		dataService.postNoteData(mailId, function(result) {
			if (!result.result) {
				// If for some reason the server is unavailable.
				popupService.alertPopup($scope.getText('mailError'));
			}
			getMails();
		});
	};

});
