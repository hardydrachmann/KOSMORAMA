angular
    .module('kosmoramaApp')
    .controller('LanguageController',
        function($rootScope, $state, $ionicHistory, $timeout, languageService, dataService, storageService) {

            var self = this;

            self.service = languageService;
            self.getText = languageService.getText;
            self.langMenu = false;

            (function init() {
                $rootScope.$on('expandLeftEvent', function() {
                    self.langMenu = false;
                });
            })();

            /**
             * Toggle language menu display.
             */
            self.langToggle = function() {
                if (self.langMenu) {
                    $timeout(function() {
                        self.langMenu = false;
                    }, 50);
                }
                else {
                    self.langMenu = true;
                }
            };

            /**
             * Sets language equal to picked language from language menu.
             */
            self.selectLanguage = function(language) {
                self.langToggle();
                languageService.setLanguage(language);
            };
        });
