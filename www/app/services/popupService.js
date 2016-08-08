angular.module('kosmoramaApp').service('popupService', ['$ionicPopup', '$timeout', function($ionicPopup, $timeout) {

    this.popup = function(message, time) {
        var popup = $ionicPopup.show({
            title: 'message:',
            template: message
        });
        $timeout(function() {
            popup.close();
        }, time || 2000);
    };

    this.confirmPopup = function(title, toConfirm, callback) {
        var confirm = $ionicPopup.confirm({
            title: title,
            template: toConfirm
        });

        confirm.then(function(response) {
            if (response) {
                callback();
            }
        });
    };
}]);
