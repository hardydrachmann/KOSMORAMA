var tabsCtrl = function ($rootScope, $state, $timeout, $ionicHistory, $ionicSideMenuDelegate, languageService, tabsService, storageService) {
	var ctrl = this;

	var continueLock = false;

	/**
	 * Expand the left side menu.
	 */
	ctrl.expandLeftMenu = function () {
		$ionicSideMenuDelegate.toggleLeft();
		$rootScope.$broadcast('expandLeftEvent');
	};

	ctrl.isLeftMenuOpen = function () {
		return $ionicSideMenuDelegate.isOpenLeft();
	};

	/**
	 * Expand the right side menu.
	 */
	ctrl.expandRightMenu = function () {
		$ionicSideMenuDelegate.toggleRight();
		$rootScope.$broadcast('expandRightEvent');
	};

	ctrl.isRightMenuOpen = function () {
		return $ionicSideMenuDelegate.isOpenRight();
	};

	/**
	 * Checks current state and switches to the next state.
	 * Also broadcasts a continueEvent.
	 */
	ctrl.continue = function () {
		if (!continueLock) {
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
				if (storageService.isLastPassItem()) {
					$state.go('painLevel');
				} else {
					$state.go('trainingPlan');
				}
				break;
			case 'painLevel':
				if (storageService.getAllowMessage()) {
					$state.go('notes');
				} else {
					$state.go('home');
				}
				break;
			case 'notes':
				$state.go('home');
				break;
			}
			continueLock = true;
			$timeout(function () {
				continueLock = false;
			}, 1000);
		}
	};
	tabsService.continue = ctrl.continue;
};

angular.module('virtualTrainingApp').controller('TabsController', tabsCtrl);