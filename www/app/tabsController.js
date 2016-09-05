angular.module('kosmoramaApp').controller('TabsController', function($rootScope, $state, $timeout, $ionicHistory, storageService) {
    var self = this;

	self.showHelpTab = true;
	self.showLangTab = true;
	self.showContTab = false;
	self.showLoginTab = true;
	self.showLogoutTab = false;

	$(document).ready(function() {
		$timeout(function() {
			if ($state.current.name !== 'login') {
				self.showLogoutTab = true;
				self.showLoginTab = false;
			}
		}, 250);
		$rootScope.setTabs = self.setTabs;
		$rootScope.continue = self.continue;
	});

	/**
	 * Sets the correct tabs for each view.
	 */
	self.setTabs = function() {
		self.showHelpTab = false;
		self.showLangTab = false;
		self.showContTab = false;
		self.showLoginTab = false;
		self.showLogoutTab = false;
		$timeout(function() {
			var state = $ionicHistory.currentView().stateName;
			switch (state) {
				case 'login':
					self.showHelpTab = true;
					self.showLangTab = true;
					self.showLoginTab = true;
					break;
				case 'home':
				case 'mail':
					self.showHelpTab = true;
					self.showLangTab = true;
					self.showLogoutTab = true;
					break;
				case 'trainingPlan':
				case 'notes':
				case 'painLevel':
					self.showHelpTab = true;
					self.showContTab = true;
					self.showLogoutTab = true;
					break;
				case 'trainingDemo':
					self.showHelpTab = true;
					self.showContTab = true;
					break;
				case 'training':
					self.showHelpTab = true;
					self.showContTab = true; // Debug
					break;
				case 'feedback':
				case 'help':
					self.showHelpTab = true;
					break;
				case 'language':
					self.showLangTab = true;
					break;
			}
		}, 100);
	};


	/**
	 * Continue event on rootscope, checks current state and switches to the next state.
	 */
	self.continue = function() {
		$rootScope.$broadcast('continueEvent');
		var state = $ionicHistory.currentView().stateName;
		switch (state) {
			case 'trainingPlan':
				$state.go('trainingDemo');
				break;
			case 'trainingDemo':
				$state.go('training');
				break;
			case 'training':
				$state.go('feedback');
				break;
			case 'feedback':
				if (storageService.proceduralUserData.isLastPassItem) {
					$state.go('painLevel');
				} else {
					$state.go('trainingPlan');
				}
				break;
			case 'painLevel':
				if (storageService.proceduralUserData.allowMessage) {
					$state.go('notes');
				} else {
					$state.go('home');
				}
				break;
			case 'notes':
				$state.go('home');
				break;
		}
		self.setTabs();
	};
});
