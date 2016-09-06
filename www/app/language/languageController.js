angular
    .module('kosmoramaApp')
    .controller('LanguageController',
        function($state, $ionicHistory, languageService, dataService, storageService) {

            var self = this;

            self.service = languageService;
            self.getText = languageService.getText;

            /**
             * Check for a preset language. Otherwise let the user choose.
             * If the user fails to select language, default to Danish.
             */
            (function init() {
                if (!languageService.lang) {
                    $state.go('language');
                }
            })();

            /**
             * Sets language equal to picked language from language menu.
             */
            self.selectLanguage = function(language) {
                languageService.setLanguage(language);
                var backView = $ionicHistory.backView();
                if (backView) {
                    $state.go(backView.stateName);
                }
                else {
                    $state.go('login');
                }
            };

            /**
             * Enables toggling to and from language menu, by clicking on the language tab.
             */
            self.langToggle = function() {
                if ($ionicHistory.currentView().stateName !== 'language') {
                    $state.go('language');
                }
                else {
                    $state.go($ionicHistory.backView().stateName);
                }
            };
        });
