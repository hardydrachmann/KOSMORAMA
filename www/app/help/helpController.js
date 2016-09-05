angular.module('kosmoramaApp')

.controller('HelpController', function($state, $ionicHistory) {
	var self = this;

	/**
	 * Enables the help button to return to the previews view.
	 */
	self.getState = function() {
		var prevView = $ionicHistory.backView();
		if (prevView)
			return prevView.stateName;
	};

	/**
	 * Enables toggling to and from help menu.
	 */
	self.helpToggle = function() {
		if ($ionicHistory.currentView().stateName != 'help') {
			$state.go('help');
		} else {
			var toState = $ionicHistory.backView().stateName;
			$state.go(toState);
		}
	};
});
