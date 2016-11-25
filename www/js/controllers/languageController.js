var languageCtrl = function($rootScope, $state, $ionicHistory, $timeout, languageService, dataService, storageService) {
	var ctrl = this;

	ctrl.service = languageService;
	ctrl.getText = languageService.getText;
	ctrl.langMenu = false;

	(function init() {
		$rootScope.$on('expandLeftEvent', function() {
			ctrl.langMenu = false;
		});
	})();

	/**
	 * Toggle language menu display.
	 */
	ctrl.langToggle = function() {
		if (ctrl.langMenu) {
			$timeout(function() {
				ctrl.langMenu = false;
			}, 50);
		} else {
			ctrl.langMenu = true;
		}
	};

	/**
	 * Sets language equal to picked language from language menu.
	 */
	ctrl.selectLanguage = function(language) {
		ctrl.langToggle();
		languageService.setLanguage(language);
		ctrl.langMenu = false;
	};
};

angular.module('virtualTrainingApp').controller('LanguageController', languageCtrl);
