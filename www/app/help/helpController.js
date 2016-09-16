angular
	.module('kosmoramaApp')
	.controller('HelpController',
		function($rootScope, $state, $ionicHistory) {

			var self = this;

			/**
			 * Enables the help button to return to the previews view.
			 */
			self.getState = function() {
				var currentView = $ionicHistory.currentView();
				if (currentView) {
					return currentView.stateName;
				}
				return '';
			};

			/**
			 * Enables toggling to and from help menu.
			 */
			self.helpToggle = function() {
				if ($ionicHistory.currentView().stateName != 'help') {
					$state.go('help');
					$rootScope.$broadcast('helpEvent');
				}
				else {
					var toState = $ionicHistory.backView().stateName;
					$state.go(toState);
				}
			};
		});
