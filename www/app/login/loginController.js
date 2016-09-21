angular
    .module('kosmoramaApp')
    .controller('LoginController',
        function($state, $timeout, $cordovaNetwork, tabsService, debugService, languageService, popupService, dataService, storageService, mediaService) {

            var self = this;

            var screenNumber;

            /**
             * On launch, check if a user exist in local storage. If so, decrypt user, then place this user on the scope and login.
             */
            (function init() {
                screenNumber = storageService.getUserScreenNumber();
                if (screenNumber) {
                    $timeout(function() {
                        $state.go('home');
                    }, 100);
                }
            })();

            /**
             * Get the input from the input field (on changed) an update the scope with this value.
             */
            self.setUserScreenNumber = function() {
                var inputValue = $('#setUserScreenNumber').val();
                if (inputValue) {
                    screenNumber = inputValue;
                }
            };

            /**
             * If user does not exist, check the DB for a user with the entered login id.
             * If this user exist, encrypt the login id in local storage using a random key.
             */
            self.login = function() {
                if (!debugService.device || $cordovaNetwork.getNetwork() === 'wifi') {
                    if (screenNumber) {
                        dataService.getUser(screenNumber, function(result) {
                            if (result) {
                                storageService.setUserScreenNumber(screenNumber);
                                storageService.setAllowMessage(result.AllowMsgFeedback);
                                $state.go('home');
                                $('#setUserScreenNumber').val('');
                            }
                            else {
                                popupService.alertPopup(languageService.getText('loginFail'));
                            }
                        });
                    }
                    else {
                        popupService.alertPopup(languageService.getText('loginHelp'));
                    }
                }
                else {
                    popupService.alertPopup(languageService.getText('loginNoWifi'));
                }
            };

            /**
             * At logout, remove the locally stored users data, then set the scope to 'empty' and logout.
             */
            self.logout = function() {
                popupService.confirmPopup(languageService.getText('logoutText'), '', function() {
                    storageService.clearPersistentData();
                    mediaService.removeMedia();
                    screenNumber = '';
                    $state.go('login');
                });
            };

        });
