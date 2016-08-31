angular.module('kosmoramaApp').controller('NotesController', function($scope, $state, $rootScope, $ionicHistory, dataService) {

	$scope.painValue = '';
	$scope.messageText = '';

	$(document).ready(main);

	/**
	 * Gets the data from the current view and puts the data into the rootscope. 
	 */
	var main = function() {
		console.log($rootScope.passData);
		var handler = $rootScope.$on('continueEvent', function() {
			if ($scope.painValue && $rootScope.passData.painLevel === null) {
				$rootScope.passData.painLevel = $scope.painValue;
			} else if ($scope.messageText && $rootScope.passData.message === null) {
				$rootScope.passData.message = $scope.messageText;
			}
			$rootScope.lastPassTraining = false;
			$rootScope.currentTraining = {};
			if ($rootScope.passData && $ionicHistory.currentView().stateName === 'notes') {
				dataService.postFeedback($rootScope.passData);
				$rootScope.passData = null;
			}
			handler();
		});
	};

	/**
	 * When the text area is entered, clear the placeholder text.
	 */
	$scope.clearContent = function(event) {
		var element = $(event.target);
		element.attr('placeholder', '');
	};

	/**
	 * When no text is entered into the text area when entered, and you leave, insert the default placeholder text once again.
	 */
	$scope.revertContent = function(event) {
		var element = $(event.target);
		element.attr('placeholder', $scope.getText('notesTitle'));
	};

	/**
	 * Display remaining amount of characters to the user (max is set at 500).
	 */
	$scope.maxChars = 500;
	$scope.messageText = '';
	$scope.remainingChars = function() {
		var textLength = $scope.messageText.length;
		var remainingChars = $scope.maxChars - textLength;
		$('#showCharsCount').html(remainingChars);
	};

});
