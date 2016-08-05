angular.module('kosmoramaApp')

.controller('HelpController', function($scope, $state, $ionicHistory) {
    $scope.getState = function() {
        var prevView = $ionicHistory.backView();
        if (prevView)
            return prevView.stateName;
    };

    $scope.helpToggle = function() {
        if ($ionicHistory.currentView().stateName != 'help') {
            $state.go('help');
        }
        else {
            var toState = $ionicHistory.backView().stateName;
            $state.go(toState);
        }
    };
});