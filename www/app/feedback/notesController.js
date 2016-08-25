angular.module('kosmoramaApp').controller('NotesController', function($scope, $state, $rootScope, $ionicHistory, dataService) {

    $scope.painValue = '';
    $scope.messageText = '';

    $(document).ready(function() {
        console.log($rootScope.passData);
        var handler = $rootScope.$on('continueEvent', function() {
            if ($scope.painValue && $rootScope.passData.painLevel === null) {
                $rootScope.passData.painLevel = $scope.painValue;
            }
            else if ($scope.messageText && $rootScope.passData.message === null) {
                $rootScope.passData.message = $scope.messageText;
            }
            $rootScope.lastPassTraining = false;
            $rootScope.currentTraining = {};
            if ($rootScope.passData && $ionicHistory.currentView().stateName === 'notes') {
                dataService.postFeedback($rootScope.passData);
                $rootScope.passData = null;
            }
            handler();
        });
    });

    $scope.clearContent = function(event) {
        var element = $(event.target);
        element.attr('placeholder', '');
    };

    $scope.revertContent = function(event) {
        var element = $(event.target);
        element.attr('placeholder', $scope.getText('notesTitle'));
    };

    $scope.maxChars = 500;
    $scope.messageText = '';
    $scope.remainingChars = function() {
        var textLength = $scope.messageText.length;
        var remainingChars = $scope.maxChars - textLength;
        $('#showCharsCount').html(remainingChars);
    };

});
