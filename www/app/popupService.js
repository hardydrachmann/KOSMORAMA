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
}]);
