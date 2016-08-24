angular.module('kosmoramaApp').controller('NotesController', function($scope, $state, $rootScope, $ionicHistory, dataService) {

    $scope.painValue = 5;
    $scope.messageText = '';

    $(document).ready(function() {
        var handler = $rootScope.$on('continueEvent', function() {
            if ($scope.painValue) {
                $rootScope.passData.painLevel = $scope.painValue;
            }
            else if ($scope.messageText) {
                $rootScope.passData.message = $scope.messageText;
            }
            console.log('Cycle done!', $rootScope.passData);
            $rootScope.lastPassTraining = false;
            $rootScope.currentTraining = {};
            if ($rootScope.passData && $ionicHistory.currentView().stateName === 'notes') {
                dataService.postFeedback($rootScope.passData);
                $rootScope.passData = null;
            }
            console.log('Should be null: ', $rootScope.passData);
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
        $('#showCharsCount').html($scope.getText('remainingChars').concat(remainingChars));
    };

});
