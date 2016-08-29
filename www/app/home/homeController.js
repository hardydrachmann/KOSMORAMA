angular.module('kosmoramaApp').controller('HomeController', function($scope, $state, $ionicHistory, popupService, dataService, loadingService) {

	$scope.mails = [];
	$scope.newMailCount = 0;

	$(document).ready(function() {
		getMails();
	});

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
