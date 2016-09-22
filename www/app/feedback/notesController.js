angular
    .module('kosmoramaApp')
    .controller('NotesController',
        function($rootScope, $state, $ionicHistory, languageService, storageService, dataService) {

            var self = this;

            self.painValue = '0';
            self.messageText = '';

            /**
             * Gets the data from the current view and puts the data into the rootscope.
             */
            (function init() {
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
                    else if (!storageService.persistentUserData.allowMessage) {
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

            self.getPainLevelDescription = function() {
                var level = Math.ceil(self.painValue / 2);
                level = level == 0 ? 1 : level;
                return languageService.getText('painDescription' + level);
            };

            self.getPainLevelColor = function() {
                return self.painValue > 5 ? red : green;
            };

            self.getRemainingCharsColor = function() {
                var remainingChars = self.maxChars - self.messageText.length;
                console.log(remainingChars)
                return remainingChars < 100 ? red : green;
            };

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
                element.attr('placeholder', languageService.getText('notesPlaceholder'));
            };

            self.maxChars = 500;
            self.messageText = '';
            /**
             * Display remaining amount of characters to the user.
             */
            self.remainingChars = function() {
                var remainingChars = self.maxChars - self.messageText.length;
                $('#showCharsCount').html(remainingChars);
            };

        });
