angular
	.module('virtualTrainingApp')
	.controller('MailController',
		function($rootScope, $timeout, $ionicHistory, languageService, popupService, dataService, storageService) {

			var self = this;

			self.mails = [];
			self.newMailCount = 0;
			self.mailMenu = false;

			(function init() {
				$timeout(function() {
					var currentView = $ionicHistory.currentView();
					if (currentView) {
						if (currentView.stateName !== 'login') {
							self.getMails();
						}
					}
				}, 1000);
				$rootScope.$on('expandLeftEvent', function() {
					self.mailMenu = false;
				});
			})();

			/**
			 * Toggle mail menu active.
			 */
			self.mailToggle = function() {
				self.mailMenu = !self.mailMenu;
			};

			/**
			 * Enables the unfolding of mails, so that they can be read.
			 */
			self.toggleMailDisplay = function(index) {
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
			self.getMails = function() {
				dataService.getUser(storageService.getUserScreenNumber(), function(result) {
					self.mails = result.UserMessages;
					countNewMails(self.mails);
					// Use this line to simulate an empty inbox.
					//self.mails = [];
				});
			};

			/**
			 * Gets messages that has not been read.
			 */
			function countNewMails(mails) {
				self.newMailCount = 0;
				if (mails) {
					for (var i = 0; i < mails.length; i++) {
						if (mails[i].IsRead === false) {
							self.newMailCount++;
						}
					}
				}
			}

			/**
			 * Saves the message as read.
			 */
			self.logMail = function(mailId) {
				dataService.postNoteData(mailId, function(result) {
					if (!result.result) {
						// If for some reason the server is unavailable.
						popupService.alertPopup(languageService.getText('mailError'));
					}
					self.getMails();
				});
			};
		});
