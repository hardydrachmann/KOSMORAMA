angular.module('kosmoramaApp').controller('NotesController', function($state, $rootScope, $ionicHistory, storageService, dataService) {
    var self = this;

    self.painValue = '5';
    self.messageText = '';

    $(document).ready(main);

    /**
     * Gets the data from the current view and puts the data into the rootscope.
     */
    function main() {
        var handler = $rootScope.$on('continueEvent', function() {
            if (self.painValue && storageService.proceduralUserData.passData.painLevel === null) {
                storageService.proceduralUserData.passData.painLevel = self.painValue;
            }
            else if (self.messageText && storageService.proceduralUserData.passData.message === null) {
                storageService.proceduralUserData.passData.message = self.messageText;
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
    self.clearContent = function(event) {
        var element = $(event.target);
        element.attr('placeholder', '');
    };

    /**
     * When no text is entered into the text area when entered, and you leave, insert the default placeholder text once again.
     */
    self.revertContent = function(event) {
        var element = $(event.target);
        element.attr('placeholder', $rootScope.getText('notesTitle'));
    };

    /**
     * Display remaining amount of characters to the user (max is set at 500).
     */
    self.maxChars = 500;
    self.messageText = '';
    self.remainingChars = function() {
        var textLength = self.messageText.length;
        var remainingChars = self.maxChars - textLength;
        $('#showCharsCount').html(remainingChars);
    };

});
