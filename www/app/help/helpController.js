angular.module('kosmoramaApp')

.controller('HelpController', function($scope, $rootScope, $state, $ionicHistory) {

	/**
	 * Enables the help button to return to the previews view.
	 */
	$scope.getState = function() {
		var prevView = $ionicHistory.backView();
		if (prevView)
			return prevView.stateName;
	};

	/**
	 * Enables toggling to and from help menu.
	 */
	$scope.helpToggle = function() {
		if ($ionicHistory.currentView().stateName != 'help') {
			$state.go('help');
			$rootScope.$broadcast('helpEvent');
		} else {
			var toState = $ionicHistory.backView().stateName;
			$state.go(toState);
		}
	};
});
