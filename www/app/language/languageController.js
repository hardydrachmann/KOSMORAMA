angular.module('kosmoramaApp').controller('LanguageController', function($rootScope, $state, $ionicHistory, dataService, storageService) {
    var self = this;

    self.text = {};
    self.lang = '';
    self.langs = [];

    $(document).ready(main);

    /**
     * Checks if there is a saved language.
     * if there is a saved language: set scope.lang equal to language.
     * else set scope.lang to da_DK and save the variable in local storage and navigate to language menu.
     */
    function main() {
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
    }

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
     * Loads appropriate data from content.json, depending on which language has been selected.
     */
    var loadData = function() {
        $.getJSON('app/language/content.json', function(data) {
            self.text = data;
        });
        $.getJSON('app/language/langs.json', function(data) {
            self.langs = data;
        });
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
});
