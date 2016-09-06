angular
    .module('kosmoramaApp')
    .controller('LoginController',
        function($rootScope, $state, $timeout, popupService, dataService, loadingService, storageService) {

            var self = this;

            var screenNumber;

            /**
             * On launch, check if a user exist in local storage. If so, decrypt user, then place this user on the scope and login.
             */
            (function init() {
                screenNumber = storageService.getUserScreenNumber();
                if (screenNumber) {
                    $state.go('home');
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
                    loadingService.loaderShow();
                    dataService.getUser(screenNumber, function(result) {
                        if (result) {
                            loadingService.loaderHide();
                            $('#setUserScreenNumber').val('');
                            $state.go('home');
                            $rootScope.setTabs();
                        }
                        else {
                            loadingService.loaderHide();
                            $('#setUserScreenNumber').val('');
                            popupService.AlertPopup($rootScope.getText('loginFail'));
                        }
                    });
                }
                else {
                    popupService.AlertPopup($rootScope.getText('loginHelp'));
                }
            };

            /**
             * At logout, remove the locally stored users data, then set the scope to 'empty' and logout.
             */
            self.logout = function() {
                popupService.confirmPopup($rootScope.getText('logoutText') + '?', '', function() {
                    storageService.resetPersistentData();
                    screenNumber = '';
                    $state.go('login');
                    $rootScope.setTabs();
                });
            };

        });
