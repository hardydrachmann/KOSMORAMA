angular.module('kosmoramaApp').controller('TabsController', function($scope, $timeout, $ionicHistory) {

    $scope.showHelpTab = true;
    $scope.showLangTab = true;
    $scope.showLoginTab = true;
    $scope.showLogoutTab = false;

    $(document).ready(function() {
        $timeout(function() {
            loggedIn = $ionicHistory.currentView().stateName !== 'login';
            $scope.showLogoutTab = loggedIn;
            $scope.showLoginTab = !loggedIn;
        }, 250);
    });

    var helpActive = false;
    var loggedIn = false;
    $scope.helpToggle = function() {
        helpActive = !helpActive;
        $scope.showLangTab = !helpActive;
        if (loggedIn) {
            $scope.showLogoutTab = !helpActive;
        }
        else {
            $scope.showLoginTab = !helpActive;
        }
    };

    $scope.loginToggle = function() {
        var login = $('#setId').val();
        if (login === undefined || login) {
            loggedIn = !loggedIn;
            $scope.showLogoutTab = loggedIn;
            $scope.showLoginTab = !loggedIn;
        }
    };
});