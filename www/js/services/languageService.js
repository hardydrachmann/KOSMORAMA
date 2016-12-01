// This is a service which gets and sets the chosen language and the appropriate text to display, where needed.

var languageService = function ($rootScope, $timeout, storageService) {
	var self = this;

	self.langs = [];
	self.text = {};
	self.lang = 'da_DK';

	loadData();

	$rootScope.$on('initEvent', function () {
		self.lang = storageService.getSelectedLanguage();
		console.log('Storage Language', self.lang);
		if (!self.lang) {
			self.lang = self.langs[0].tag;
			storageService.setSelectedLanguage(self.lang);
		}
	});

	/**
	 * Sets language equal to picked language from language menu.
	 */
	self.setLanguage = function (language) {
		self.lang = language.tag;
		storageService.setSelectedLanguage(self.lang);
	};

	/**
	 * Used in other classes to get appropriate text for titles and other strings, depending on selected language.
	 */
	self.getText = function (name) {
		if (!self.text) {
			loadData();
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
		$.getJSON('data/content.json', function (data) {
			self.text = data;
		});
		$.getJSON('data/langs.json', function (data) {
			self.langs = data;
		});
	}
};

angular.module('virtualTrainingApp').service('languageService', languageService);