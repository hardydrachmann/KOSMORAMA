var mailCtrl = function($rootScope, $timeout, $ionicHistory, languageService, popupService, dataService, storageService) {
	var ctrl = this;

	ctrl.mails = [];
	ctrl.newMailCount = 0;
	ctrl.mailMenu = false;

	(function init() {
		$timeout(function() {
			var currentView = $ionicHistory.currentView();
			if (currentView) {
				if (currentView.stateName !== 'login') {
					ctrl.getMails();
				}
			}
		}, 1000);
		$rootScope.$on('expandLeftEvent', function() {
			ctrl.mailMenu = false;
		});
	})();

	/**
	 * Toggle mail menu active.
	 */
	ctrl.mailToggle = function() {
		ctrl.mailMenu = !ctrl.mailMenu;
	};

	/**
	 * Enables the unfolding of mails, so that they can be read.
	 */
	ctrl.toggleMailDisplay = function(index) {
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
	 * Loads messages for user by using the screen number.
	 */
	ctrl.getMails = function() {
		dataService.getUser(storageService.getUserScreenNumber(), function(result) {
			ctrl.mails = result.UserMessages;
			countNewMails(ctrl.mails);
			// Use this line to simulate an empty inbox.
			// ctrl.mails = [];
		});
	};

	/**
	 * Saves the message as read.
	 */
	ctrl.logMail = function(mailId) {
		dataService.postNoteData(mailId, function(result) {
			if (!result.result) {
				// If for some reason the server is unavailable.
				popupService.alertPopup(languageService.getText('mailError'));
			}
			ctrl.getMails();
		});
	};

	/**
	 * Gets messages that has not been read.
	 */
	function countNewMails(mails) {
		ctrl.newMailCount = 0;
		if (mails) {
			for (var i = 0; i < mails.length; i++) {
				if (mails[i].IsRead === false) {
					ctrl.newMailCount++;
				}
			}
		}
	}
};

angular.module('virtualTrainingApp').controller('MailController', mailCtrl);