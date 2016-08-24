angular.module('kosmoramaApp').controller('HomeController', function($scope, $state, $ionicHistory, popupService, dataService, loadingService) {

	$scope.mails = [];
	$scope.newMailCount = 0;

	$(document).ready(function() {
		getMails();
	});

	var getMails = function() {
		loadingService.loaderShow();
		dataService.getUser($scope.userScreenNumber, function(result) {
			$scope.mails = result.UserMessages;
			getNewMails($scope.mails);
			loadingService.loaderHide();
		});
	};

	var getNewMails = function(mails) {
		$scope.newMailCount = 0;
		for (var i = 0; i < mails.length; i++) {
			if (mails[i].IsRead === false) {
				$scope.newMailCount++;
			}
		}
	};

	$scope.closeMailView = function() {
		$state.go('home');
	};

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
