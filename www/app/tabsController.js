angular.module('kosmoramaApp').controller('TabsController', function($scope, $rootScope, $state, $timeout, $ionicHistory) {

    $scope.showHelpTab = true;
    $scope.showLangTab = true;
    $scope.showContTab = false;
    $scope.showLoginTab = true;
    $scope.showLogoutTab = false;

    $(document).ready(function() {
        $timeout(function() {
            if ($state.current.name !== 'login') {
                $scope.showLogoutTab = true;
                $scope.showLoginTab = false;
            }
        }, 250);
    });

    $scope.setTabs = function() {
        $scope.showHelpTab = false;
        $scope.showLangTab = false;
        $scope.showContTab = false;
        $scope.showLoginTab = false;
        $scope.showLogoutTab = false;
        $timeout(function() {
            var state = $ionicHistory.currentView().stateName;
            switch (state) {
                case 'login':
                    $scope.showHelpTab = true;
                    $scope.showLangTab = true;
                    $scope.showLoginTab = true;
                    break;
                case 'home':
                case 'mail':
                    $scope.showHelpTab = true;
                    $scope.showLangTab = true;
                    $scope.showLogoutTab = true;
                    break;
                case 'help':
                    $scope.showHelpTab = true;
                    break;
                case 'language':
                    $scope.showLangTab = true;
                    break;
                case 'trainingPlan':
                case 'trainingDemo':
                case 'training':
                case 'feedback':
                case 'notes':
                case 'painLevel':
                    $scope.showHelpTab = true;
                    $scope.showContTab = true;
                    $scope.showLogoutTab = true;
                    break;
            }
        }, 100);
    };

    $scope.continue = function() {
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
                if ($rootScope.lastPassTraining) {
                    $state.go('painLevel');
                }
                else {
                    $state.go('trainingPlan');
                }
                break;
            case 'painLevel':
                $state.go('notes');
                break;
            case 'notes':
                $state.go('home');
                break;
        }
        $scope.setTabs();
    };
});
