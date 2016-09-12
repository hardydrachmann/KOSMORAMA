angular
    .module('kosmoramaApp')
    .controller('LoginController',
        function($state, $timeout, tabsService, languageService, popupService, dataService, storageService) {

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
                    storageService.setUserScreenNumber(inputValue);
                }
            };

            /**
             * If user does not exist, check the DB for a user with the entered login id.
             * If this user exist, encrypt the login id in local storage using a random key.
             */
            self.login = function() {
                if (screenNumber) {
                    dataService.getUser(screenNumber, function(result) {
                        $('#setUserScreenNumber').val('');
                        if (result) {
                            $state.go('home');
                            tabsService.setTabs();
                        }
                        else {
                            popupService.AlertPopup(languageService.getText('loginFail'));
                        }
                    });
                }
                else {
                    popupService.AlertPopup(languageService.getText('loginHelp'));
                }
            };

            /**
             * At logout, remove the locally stored users data, then set the scope to 'empty' and logout.
             */
            self.logout = function() {
                popupService.confirmPopup(languageService.getText('logoutText'), '', function() {
                    storageService.clearPersistentData();
                    screenNumber = '';
                    $state.go('login');
                    tabsService.setTabs();
                });
            };

        });
