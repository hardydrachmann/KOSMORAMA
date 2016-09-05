angular.module('kosmoramaApp').service('storageService', function($window) {

    this.persistentUserData = {
        userScreenNumber: '',
        language: '',
        syncDate: '',
        training: []
    };

    this.proceduralUserData = {
        isLastPassItem: false,
        allowMessage: true, // needs impl.
        currentTraining: {},
        passData: {
            trainingId: 0,
            sessionOrderNumber: 0,
            painLevel: null,
            message: null
        }
    };

    var passCount = 0;
    this.completed = [{
        reports: [],
        passData: {
            trainingId: 0,
            sessionOrderNumber: 0,
            painLevel: null,
            message: null
        }
    }];

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

    this.getStored = function() {
        if (!this.completed) {
            this.completed = $window.localStorage['kosmoramaCompletedData'];
        }
        return this.completed;
    };

    this.setStored = function(completedTraining){
        if(this.completed){
          $window.localStorage['kosmoramaCompletedData'] = this.completed.push(completedTraining);
        }
        $window.localStorage['kosmoramaCompletedData'] = completedTraining;
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
        console.log('Completed training data: ', this.completed);
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
        this.proceduralUserData.passData = {
            trainingId: this.persistentUserData.training[1].TrainingId,
            sessionOrderNumber: this.persistentUserData.training[1].SessionOrderNumber,
            painLevel: null,
            message: null
        };
        return this.persistentUserData.training;
    };

    var isTrainingItem = function(item) {
        return item.hasOwnProperty('ExerciseId');
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
        return null;
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

    this.getLastSyncDate = function() {
        if (this.persistentUserData.language) {
            return this.persistentUserData.language;
        }
        return $window.localStorage['kosmoramaSyncDate'];
    };

    this.setLastSyncDate = function() {
        $window.localStorage['kosmoramaSyncDate'] = new Date().getDate();
    };

    this.resetPersistentData = function() {
        $window.localStorage.removeItem('kosmoramaId');
        $window.localStorage.removeItem('kosmoramaKey');
        $window.localStorage.removeItem('kosmoramaLang');
    };

    this.resetCompletedData = function() {
        $window.localStorage.removeItem('kosmoramaCompletedData');
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
