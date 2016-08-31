angular.module('kosmoramaApp').controller('HomeController', function($scope, $state, $ionicHistory, $cordovaNetwork, storageService, $rootScope, popupService, dataService, loadingService) {

	$scope.mails = [];
	$scope.newMailCount = 0;
	var currentDate = "";


	$(document).ready(function() {
		getMails();
		if($cordovaNetwork.isOnline){
			// checkSync();
		}
	});

	/**
	 * Calls the checkSync method, if the phone is connected to the internet somehow.
	 */
	$rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
		checkSync();
		popupService.alertPopup('network event');
	});

	/*
	 * Checks whether the saved data is less than todays date or not.
	 */
	var checkSync = function() {
		var date = new Date();
		currentDate = date.getDate();
		if (!storageService.getKey('syncDate')) {
			storageService.setKey('syncDate', currentDate);
			checkForWifi();
		}
		if (currentDate != storageService.getKey('syncDate')) {
			checkForWifi();
		}
	};

	/**
	 * This function is called if the device is connected to the internet, to check whether the device is connected to wifi or not.
	 */
	var checkForWifi = function() {
		popupService.alertPopup('checking for wifi');
		if ($cordovaNetwork.getNetwork() != 'wifi') {
			popupService.confirmPopup('NO WIFI','Do you want to download your training plan, without Wifi', syncData());
		}
		else {
			syncData();
		}
	};

	/**
	 * Updates current training plan and sets the key date equal to today.
	 */
	var syncData = function(){

		console.log(currentDate);
		storageService.setKey('syncDate', currentDate);
	};
	/**
	 * When called, loads messages for user by using the screen number.
	 */
	var getMails = function() {
		loadingService.loaderShow();
		dataService.getUser($scope.userScreenNumber, function(result) {
			$scope.mails = result.UserMessages;
			getNewMails($scope.mails);
			loadingService.loaderHide();
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
		}
		else {
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
