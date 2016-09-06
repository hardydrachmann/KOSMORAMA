angular
    .module('kosmoramaApp')
    .controller('LanguageController',
        function($rootScope, $state, $ionicHistory, dataService, storageService) {

            var self = this;

            self.text = {};
            self.lang = '';
            self.langs = [];

            /**
             * Check for a preset language. Otherwise let the user choose.
             * If the user fails to select language, default to Danish.
             */
            (function init() {
                loadData();
                var lang = storageService.getSelectedLanguage();
                if (!lang) {
                    self.lang = 'da_DK';
                    storageService.setSelectedLanguage(self.lang);
                    $state.go('language');
                }
                else {
                    self.lang = lang;
                }
                $rootScope.getText = self.getText;
                $rootScope.lang = self.lang;
            })();

            /**
             * Sets language equal to picked language from language menu.
             */
            self.setLanguage = function(language) {
                $rootScope.lang = self.lang = language.tag;
                storageService.setSelectedLanguage(self.lang);
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
                if ($ionicHistory.currentView().stateName != 'language') {
                    $state.go('language');
                }
                else {
                    $state.go($ionicHistory.backView().stateName);
                }
            };

            /**
             * Used in other classes to get appropriate text for titles and other strings, depending on selected language.
             */
            self.getText = function(name) {
                if (!self.text) {
                    self.loadText();
                    return '';
                }
                if (self.text[name] !== undefined) {
                    return self.text[name][self.lang];
                }
                return ' ';
            };

            /**
             * Loads appropriate data from content.json, depending on which language has been selected.
             */
            function loadData() {
                $.getJSON('app/language/content.json', function(data) {
                    self.text = data;
                });
                $.getJSON('app/language/langs.json', function(data) {
                    self.langs = data;
                });
            }
        });
