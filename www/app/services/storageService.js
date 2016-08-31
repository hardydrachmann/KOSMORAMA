angular.module('kosmoramaApp').service('storageService', function($http) {
    this.persistentUserData = {
        userScreenNumber: 'aa10',
        training: []
    };

    this.setUserScreenNumber = function(number) {
        var key = getRandomKey();
        var id = sjcl.encrypt(key, number);
        window.localStorage.setItem('kosmoramaKey', key);
        window.localStorage.setItem('kosmoramaId', number);
    };

    this.getUserScreenNumber = function() {
        var key = window.localStorage.getItem('kosmoramaKey');
        var encryptedId = window.localStorage.getItem('kosmoramaId');
        if (key && encryptedId) {
            return sjcl.decrypt(key, encryptedId);
        }
        return 0;
    };

    this.destroy = function(key) {
        return window.localStorage.removeItem(key);
    };

    var minASCII = 33;
    var maxASCII = 126;
    var getRandomKey = function() {
        var key = "";
        for (var i = 0; i < 10; i++) {
            var random = minASCII + (Math.random() * (maxASCII - minASCII));
            key += String.fromCharCode(Math.ceil(random));
        }
        return key;
    };

});
