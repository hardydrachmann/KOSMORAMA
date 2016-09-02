angular.module('kosmoramaApp').controller('NotesController', function($scope, $state, $rootScope, $ionicHistory, storageService, dataService) {

    $scope.painValue = '5';
    $scope.messageText = '';

    $(document).ready(main);

    /**
     * Gets the data from the current view and puts the data into the rootscope.
     */
    function main() {
        var handler = $rootScope.$on('continueEvent', function() {
            if ($scope.painValue && storageService.proceduralUserData.passData.painLevel === null) {
                storageService.proceduralUserData.passData.painLevel = $scope.painValue;
            }
            else if ($scope.messageText && storageService.proceduralUserData.passData.message === null) {
                storageService.proceduralUserData.passData.message = $scope.messageText;
            }
            storageService.proceduralUserData.isLastPassTraining = false;
            storageService.proceduralUserData.currentTraining = {};
            if ($ionicHistory.currentView().stateName === 'notes') {
                storageService.retainCurrentPassData();
            }
            handler();
        });
    }

    /**
     * When the text area is entered, clear the placeholder text.
     */
    $scope.clearContent = function(event) {
        var element = $(event.target);
        element.attr('placeholder', '');
    };

    /**
     * When no text is entered into the text area when entered, and you leave, insert the default placeholder text once again.
     */
    $scope.revertContent = function(event) {
        var element = $(event.target);
        element.attr('placeholder', $scope.getText('notesTitle'));
    };

    /**
     * Display remaining amount of characters to the user (max is set at 500).
     */
    $scope.maxChars = 500;
    $scope.messageText = '';
    $scope.remainingChars = function() {
        var textLength = $scope.messageText.length;
        var remainingChars = $scope.maxChars - textLength;
        $('#showCharsCount').html(remainingChars);
    };

});
