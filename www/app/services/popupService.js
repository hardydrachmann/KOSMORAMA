// This is a service which can show and hide different popup boxes.

angular.module('kosmoramaApp').service('popupService', function($ionicPopup, $timeout) {

  this.popup = function(message, time) {
    var popup = $ionicPopup.show({
      template: message
    });
    $timeout(function() {
      popup.close();
    }, time || 2000);
  };

  /**
   * Initiates a Popup when called.
   */
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

  /**
   * Alerts Popup when called.
   */
  this.alertPopup = function(message) {
    var alert = $ionicPopup.alert({
      template: message,
      buttons: [{
        type: 'button icon-center ion-ios-checkmark-outline button-balanced'
      }]
    });
  };

});
