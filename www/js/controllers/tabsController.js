angular
    .module('virtualTrainingApp')
    .controller('TabsController',
        function($rootScope, $state, $timeout, $ionicHistory, $ionicSideMenuDelegate, languageService, tabsService, storageService) {

            var self = this;

            /**
             * Expand the left side menu.
             */
            self.expandLeftMenu = function() {
                $ionicSideMenuDelegate.toggleLeft();
                $rootScope.$broadcast('expandLeftEvent');
            };

            /**
             * Expand the right side menu.
             */
            self.expandRightMenu = function() {
                $ionicSideMenuDelegate.toggleRight();
                $rootScope.$broadcast('expandRightEvent');
            };

            /**
             * Checks current state and switches to the next state.
             * Also broadcasts a continueEvent.
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
                        if (storageService.isLastPassItem()) {
                            $state.go('painLevel');
                        }
                        else {
                            $state.go('trainingPlan');
                        }
                        break;
                    case 'painLevel':
                        if (storageService.getAllowMessage()) {
                            $state.go('notes');
                        }
                        else {
                            $state.go('home');
                        }
                        break;
                    case 'notes':
                        $state.go('home');
                        break;
                }
            };
            tabsService.continue = self.continue;
        });