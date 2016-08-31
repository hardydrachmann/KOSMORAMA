angular.module('kosmoramaApp').service('storageService', function($http) {

    this.persistentUserData = {
        userScreenNumber: '',
        syncDate: '',
        training: []
    };

    this.getUserScreenNumber = function() {
        var key = window.localStorage.getItem('kosmoramaKey');
        var encryptedId = window.localStorage.getItem('kosmoramaId');
        if (key && encryptedId) {
            return sjcl.decrypt(key, encryptedId);
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

    this.setLastSyncDate = function(date) {
        window.localStorage.setItem('syncDate', new Date().getDate());
    };

    this.getLastSyncDate = function() {
        return window.localStorage.getItem('syncDate');
    };

    this.resetPersistentData = function() {
        window.localStorage.removeItem('kosmoramaId');
        window.localStorage.removeItem('kosmoramaKey');
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
