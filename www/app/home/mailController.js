angular
    .module('kosmoramaApp')
    .controller('MailController',
        function($rootScope, $timeout, $ionicHistory, languageService, popupService, dataService, storageService) {

            var self = this;

            self.mails = [];
            self.newMailCount = 0;
            self.mailMenu = false;

            (function init() {
                var currentView = $ionicHistory.currentView();
                if (currentView) {
                    if (currentView.stateName !== 'login') {
                        getMails();
                    }
                }
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
            function getMails() {
                dataService.getUser(storageService.persistentUserData.userScreenNumber, function(result) {
                    self.mails = result.UserMessages;
                    countNewMails(self.mails);
                });
            }

            /**
             * Gets messages that has not been read.
             */
            function countNewMails(mails) {
                self.newMailCount = 0;
                for (var i = 0; i < mails.length; i++) {
                    if (mails[i].IsRead === false) {
                        self.newMailCount++;
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
                    getMails();
                });
            };
        });