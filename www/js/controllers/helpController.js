var helpCtrl = function($rootScope, $state, $ionicHistory) {
	var ctrl = this;

	/**
	 * Enables the help button to return to the previews view.
	 */
	ctrl.getState = function() {
		var currentView = $ionicHistory.currentView();
		if (currentView) {
			return currentView.stateName;
		}
		return '';
	};

	/**
	 * Enables toggling to and from help menu.
	 */
	ctrl.helpToggle = function() {
		if ($ionicHistory.currentView().stateName != 'help') {
			$state.go('help');
			$rootScope.$broadcast('helpEvent');
		}
		else {
			var toState = $ionicHistory.backView().stateName;
			$state.go(toState);
		}
	};
};

angular.module('virtualTrainingApp').controller('HelpController', helpCtrl);