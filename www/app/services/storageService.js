angular
    .module('kosmoramaApp')
    .service('storageService', function($window) {

        this.printStorage = function() {
            console.log('DATA FROM LOCAL STORAGE:');
            // console.log('Key/Id:', [$window.localStorage['kosmoramaKey'], $window.localStorage['kosmoramaId']]);
            // console.log('Lang:', $window.localStorage['kosmoramaLang']);
            console.log('Completed:', this.getCompleted());
        };

        this.persistentUserData = {
            userScreenNumber: '',
            language: '',
            training: []
        };

        this.proceduralUserData = {
            isLastPassItem: false,
            allowMessage: true,
            currentTraining: {},
            passData: {
                trainingId: 0,
                sessionOrderNumber: 0,
                painLevel: null,
                message: null
            }
        };

        this.temporaryTimerData = {
            currentSet: 0,
            setsRemaining: 0,
            isPauseNext: true,
            counter: 0,
            progress: 0
        };

        var passCount = 0;
        this.completed = [];

        this.getCompleted = function() {
            if (!this.completed.length) {
                var stored = $window.localStorage['kosmoramaCompleted'];
                if (stored) {
                    this.completed = JSON.parse(stored);
                }
                else {
                    return this.completed;
                }
            }
            return this.completed;
        };

        this.getSelectedLanguage = function() {
            if (this.persistentUserData.language) {
                return this.persistentUserData.language;
            }
            var language = $window.localStorage['kosmoramaLang'];
            if (language) {
                this.persistentUserData.language = language;
                return language;
            }
            return '';
        };

        /**
         * Checks the current selected language (if it is 'en_US', change it to 'en_GB'), then return it.
         */
        this.getCorrectedLanguageString = function() {
            var language = this.getSelectedLanguage();
            if (language === 'en_US') {
                language = 'en_GB';
            }
            return language.replace('_', '-');
        };

        this.setSelectedLanguage = function(language) {
            this.persistentUserData.language = language;
            $window.localStorage['kosmoramaLang'] = language;
        };

        this.getUserScreenNumber = function() {
            if (this.persistentUserData.userScreenNumber) {
                return this.persistentUserData.userScreenNumber;
            }
            var key = $window.localStorage['kosmoramaKey'];
            var encryptedId = $window.localStorage['kosmoramaId'];
            if (key && encryptedId) {
                var decryptedId = sjcl.decrypt(key, encryptedId);
                this.persistentUserData.userScreenNumber = decryptedId;
                return decryptedId;
            }
            return '';
        };

        this.setUserScreenNumber = function(number) {
            var key = getRandomKey();
            var id = sjcl.encrypt(key, number);
            $window.localStorage['kosmoramaKey'] = key;
            $window.localStorage['kosmoramaId'] = id;
            this.persistentUserData.userScreenNumber = number;
        };

        this.clearPersistentData = function() {
            $window.localStorage.removeItem('kosmoramaId');
            $window.localStorage.removeItem('kosmoramaKey');
            $window.localStorage.removeItem('kosmoramaLang');
        };

        this.clearTrainingData = function() {
            $window.localStorage.removeItem('kosmoramaCompleted');
            this.persistentUserData.training = [];
            this.completed = [];
        };

        this.complete = function(trainingReport) {
            if (!this.completed[passCount]) {
                this.completed[passCount] = getTemplate();
            }
            this.completed[passCount].reports.push(trainingReport);
            if (this.proceduralUserData.isLastPassItem) {
                this.persistentUserData.training.shift();
                this.persistentUserData.training.shift();
            }
            else {
                this.persistentUserData.training.splice(1, 1);
            }
        };

        this.retainCurrentPassData = function() {
            if (!this.completed[passCount]) {
                console.log('Pretty sure this is not ever supposed to happen!');
                this.completed[passCount] = getTemplate();
            }
            this.completed[passCount].passData = this.proceduralUserData.passData;
            this.proceduralUserData.passData = null;
            $window.localStorage['kosmoramaCompleted'] = JSON.stringify(this.completed);
            passCount++;
        };

        this.nextTraining = function() {
            // Is this the last pass item?
            var isLastItem = this.persistentUserData.training[2] == undefined;
            if (!isLastItem) {
                isLastItem = !isTrainingItem(this.persistentUserData.training[2]);
            }
            this.proceduralUserData.isLastPassItem = isLastItem;
            // Assess the current training item.
            this.proceduralUserData.currentTraining = this.persistentUserData.training[1];
            // Prepare the data for the current training pass.
            if (this.persistentUserData.training.length) {
                this.proceduralUserData.passData = {
                    trainingId: this.persistentUserData.training[1].TrainingId,
                    sessionOrderNumber: this.persistentUserData.training[1].SessionOrderNumber,
                    painLevel: null,
                    message: null
                };
                return this.persistentUserData.training;
            }
            return [];
        };

        this.setTemporaryTimerData = function(timerData) {
            this.temporaryTimerData = timerData;
            window.localStorage.setItem('timer', JSON.stringify(this.temporaryTimerData));
        };

        this.getTemporaryTimerData = function() {
            var data = window.localStorage.getItem('timer');
            return JSON.parse(data);
        };

        this.removeTemporaryTimerData = function() {
            window.localStorage.removeItem('timer');
        };

        var getTemplate = function() {
            return {
                reports: [],
                passData: {
                    trainingId: 0,
                    sessionOrderNumber: 0,
                    painLevel: null,
                    message: null
                }
            };
        };

        var isTrainingItem = function(item) {
            return item.hasOwnProperty('ExerciseId');
        };

        var minASCII = 33;
        var maxASCII = 126;
        /**
         * Return a random key generated from a set of ASCII characters, to use with the above encryption-process.
         */
        var getRandomKey = function() {
            var key = "";
            for (var i = 0; i < 10; i++) {
                var random = minASCII + (Math.random() * (maxASCII - minASCII));
                key += String.fromCharCode(Math.ceil(random));
            }
            return key;
        };

    });