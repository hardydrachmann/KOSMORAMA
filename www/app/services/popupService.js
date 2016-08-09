angular.module('kosmoramaApp').service('popupService', ['$ionicPopup', '$timeout', function($ionicPopup, $timeout) {

  this.popup = function(message, time) {
    var popup = $ionicPopup.show({
      template: message
    });
    $timeout(function() {
      popup.close();
    }, time || 2000);
  };

  this.confirmPopup = function(title, toConfirm, callback) {
    var confirm = $ionicPopup.confirm({
      title: title,
      template: toConfirm,
      okText: ' ',
      okType: 'button icon-center ion-ios-checkmark-outline button-balanced',
      cancelText: ' ',
      cancelType: 'button icon-center ion-ios-close-outline button-assertive'
    });

    confirm.then(function(response) {
      if (response) {
        callback();
      }
    });
  };

  this.AlertPopup = function(message) {
    var alert = $ionicPopup.alert({
      template: message,
      buttons: [{
        type: 'button icon-center ion-ios-checkmark-outline button-balanced'
      }]
    });
  };

}]);
