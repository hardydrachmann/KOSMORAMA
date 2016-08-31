angular.module('kosmoramaApp').controller('LanguageController', function($scope, $state, $ionicHistory, dataService) {
	$scope.text = {};
	$scope.lang = '';
	$scope.langs = [];

	$(document).ready(main);

	/**
	 * Checks if there is a saved language.
	 * if there is a saved language: set scope.lang equal to language.
	 * else set scope.lang to da_DK and save the variable in local storage and navigate to language menu.
	 */
	function main() {
		var lang = window.localStorage.getItem('kosmoramaLang');
		if (!lang) {
			$scope.lang = 'da_DK';
			window.localStorage.setItem('kosmoramaLang', $scope.lang);
			$state.go('language');
		} else {
			$scope.lang = lang;
		}
	}

	/**
	 * Sets language equal to picked language from language menu.
	 */
	$scope.setLanguage = function(language) {
		$scope.lang = language.tag;
		window.localStorage.setItem('kosmoramaLang', $scope.lang);
		var backView = $ionicHistory.backView();
		if (backView) {
			$state.go(backView.stateName);
		} else {
			$state.go('login');
		}
	};

	/**
	 * Enables toggling to and from language menu, by clicking on the language tab.
	 */
	$scope.langToggle = function() {
		if ($ionicHistory.currentView().stateName != 'language') {
			$state.go('language');
		} else {
			$state.go($ionicHistory.backView().stateName);
		}
	};
	/**
	 * Loads appropriate data from content.json, depending on which language has been selected.
	 */
	var loadData = function() {
		$.getJSON('app/language/content.json', function(data) {
			$scope.text = data;
		});
		$.getJSON('app/language/langs.json', function(data) {
			$scope.langs = data;
		});
	};
	loadData();
	/**
	 * Used in other classes to get appropriate text for titles and other strings, depending on selected language.
	 */
	$scope.getText = function(name) {
		if (!$scope.text) {
			$scope.loadText();
			return '';
		}
		if ($scope.text[name] !== undefined) {
			return $scope.text[name][$scope.lang];
		}
		return ' ';
	};
})

.directive('language', function() {
	return {
		templateUrl: 'app/language/language.html',
	};
});
