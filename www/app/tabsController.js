angular.module('kosmoramaApp').controller('TabsController', function($scope, $ionicHistory) {
    $scope.showHelpTab = true;
    $scope.showHomeTab = true;
    $scope.showLoginTab = true;
    $scope.showLogoutTab = false;

    var helpActive = false;
    var loggedIn = false;
    $scope.helpToggle = function() {
        helpActive = !helpActive;
        $scope.showHomeTab = !helpActive;
        if (loggedIn) {
            $scope.showLogoutTab = !helpActive;
        }
        else {
            $scope.showLoginTab = !helpActive;
        }
    };

    // $scope.loginToggle = function() {
    //     loggedIn = !loggedIn;
    //     $scope.showLogoutTab = loggedIn;
    //     $scope.showLoginTab = !loggedIn;
    // };

    $scope.loginToggle = function() {
        loggedIn = $ionicHistory.currentView().stateName !== 'login';
        $scope.showLogoutTab = loggedIn;
        $scope.showLoginTab = !loggedIn;
    };
});