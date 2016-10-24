var notesCtrl = function($rootScope, $state, $ionicHistory, languageService, storageService, dataService) {
    var ctrl = this;

    ctrl.painValue = '0';
    ctrl.messageText = '';

    /**
     * Gets the data from the current view and puts the data into the rootscope.
     */
    (function init() {
        var handler = $rootScope.$on('continueEvent', function() {
            if (ctrl.painValue && $ionicHistory.currentView().stateName === 'painLevel') {
                storageService.setCurrentPainLevel(ctrl.painValue);
            }
            else if (ctrl.messageText && $ionicHistory.currentView().stateName === 'notes') {
                storageService.setCurrentNotesMessage(ctrl.messageText);
            }
            if ($ionicHistory.currentView().stateName === 'notes') {
                storageService.retainCurrentPassData();
            }
            else if (!storageService.getAllowMessage()) {
                storageService.retainCurrentPassData();
            }
            // Terminate the handler after running.
            handler();
        });
    })();

    var red = {
        'color': '#DB1A1A'
    };
    var green = {
        'color': '#19DC19'
    };

    /**
     * Get the description for the pain levels.
     */
    ctrl.getPainLevelDescription = function() {
        var level = Math.ceil(ctrl.painValue / 2);
        level = level == 0 ? 1 : level;
        return languageService.getText('painDescription' + level);
    };

    /**
     * Get appropriate pain level color.
     */
    ctrl.getPainLevelColor = function() {
        return ctrl.painValue > 5 ? red : green;
    };

    /**
     * Get color for the remaining chars indicator.
     */
    ctrl.getRemainingCharsColor = function() {
        return ctrl.maxChars - ctrl.messageText.length < 100 ? red : green;
    };

    /**
     * When the text area is entered, clear the placeholder text.
     */
    ctrl.clearContent = function(event) {
        var element = $(event.target);
        element.attr('placeholder', '');
    };

    /**
     * When no text is entered into the text area when entered, and you leave, insert the default placeholder text once again.
     */
    ctrl.revertContent = function(event) {
        var element = $(event.target);
        element.attr('placeholder', languageService.getText('notesPlaceholder'));
    };

    ctrl.maxChars = 500;
    ctrl.messageText = '';
    /**
     * Display remaining amount of characters to the user.
     */
    ctrl.remainingChars = function() {
        var remainingChars = ctrl.maxChars - ctrl.messageText.length;
        $('#showCharsCount').html(remainingChars);
    };
};

angular.module('virtualTrainingApp').controller('NotesController', notesCtrl);
