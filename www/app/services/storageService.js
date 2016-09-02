angular.module('kosmoramaApp').service('storageService', function($http) {

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

    this.getSelectedLanguage = function() {
        if (this.persistentUserData.language) {
            return this.persistentUserData.language;
        }
        var language = window.localStorage.getItem('kosmoramaLang');
        if (language) {
            this.persistentUserData.language = language;
            return language;
        }
        return null;
    };

    this.setSelectedLanguage = function(language) {
        this.persistentUserData.language = language;
        window.localStorage.setItem(language, 'kosmoramaLang');
    };

    this.getUserScreenNumber = function() {
        if (this.persistentUserData.userScreenNumber) {
            return this.persistentUserData.userScreenNumber;
        }
        var key = window.localStorage.getItem('kosmoramaKey');
        var encryptedId = window.localStorage.getItem('kosmoramaId');
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
        window.localStorage.setItem('kosmoramaKey', key);
        window.localStorage.setItem('kosmoramaId', id);
        this.persistentUserData.userScreenNumber = number;
    };

    this.getLastSyncDate = function() {
        if (this.persistentUserData.language) {
            return this.persistentUserData.language;
        }
        return window.localStorage.getItem('kosmoramaSyncDate');
    };

    this.setLastSyncDate = function(date) {
        window.localStorage.setItem('kosmoramaSyncDate', new Date().getDate());
    };

    this.resetPersistentData = function() {
        window.localStorage.removeItem('kosmoramaId');
        window.localStorage.removeItem('kosmoramaKey');
        window.localStorage.removeItem('kosmoramaLang');
        window.localStorage.removeItem('kosmoramaSyncDate');
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
