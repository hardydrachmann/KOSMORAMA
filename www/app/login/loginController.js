angular.module('kosmoramaApp').controller('LoginController', function($scope, $state, popupService) {

    $scope.loginId = '';

    $(document).ready(function() {
        var encryptedId = window.localStorage.getItem('kosmoramaId');
        var key = window.localStorage.getItem('kosmoramaKey');
        if (encryptedId && key) {
            var decryptedId = sjcl.decrypt(key, encryptedId);
            // Does the decrypted key match the database value?
            $state.go('home');
        }
    });

    $scope.setLoginId = function() {
        $scope.loginId = $('#setId').val();
    };

    $scope.login = function() {
        if ($scope.loginId) {
            var key = $scope.getRandomKey();
            var id = sjcl.encrypt(key, $scope.loginId);
            window.localStorage.setItem('kosmoramaId', id);
            window.localStorage.setItem('kosmoramaKey', key);
            $state.go('home');
        }
    };

    $scope.logout = function() {
        popupService.confirmPopup('Exit', 'Are you sure?', function() {
            window.localStorage.removeItem('kosmoramaId');
            window.localStorage.removeItem('kosmoramaKey');
            $state.go('login');
            $scope.setTabs();
        });
    };

    var minASCII = 33;
    var maxASCII = 126;
    $scope.getRandomKey = function() {
        var key = "";
        for (var i = 0; i < 10; i++) {
            var random = minASCII + (Math.random() * (maxASCII - minASCII));
            key += String.fromCharCode(Math.ceil(random));
        }
        return key;
    };
});
