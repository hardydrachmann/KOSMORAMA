angular.module('kosmoramaApp').controller('LoginController', function($scope, $state, $ionicLoading, $timeout, popupService, dataService) {

  $scope.userScreenNumber = '';

  $(document).ready(function() {
    var encryptedId = window.localStorage.getItem('kosmoramaId');
    var key = window.localStorage.getItem('kosmoramaKey');
    if (encryptedId && key) {
      var decryptedId = sjcl.decrypt(key, encryptedId);
      $state.go('home');
    }
  });

  $scope.setUserScreenNumber = function() {
    var inputValue = $('#setUserScreenNumber').val();
    if (inputValue) {
      $scope.userScreenNumber = inputValue;
    }
    console.log($scope.userScreenNumber);
  };

  $scope.showLoading = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>'
    });
  };

  $scope.hideLoading = function() {
    $ionicLoading.hide();
  };

  $scope.login = function() {
    if ($scope.userScreenNumber) {
      $scope.showLoading();
      dataService.getUser($scope.userScreenNumber, function(result) {
        if (result) {
          var key = $scope.getRandomKey();
          var id = sjcl.encrypt(key, $scope.userScreenNumber);
          window.localStorage.setItem('kosmoramaId', id);
          window.localStorage.setItem('kosmoramaKey', key);
          $('#setUserScreenNumber').val('');
          $scope.setTabs();
          $scope.hideLoading();
          $state.go('home');
        }
        else {
          $scope.hideLoading();
          popupService.AlertPopup($scope.getText('loginFail'));
        }
      });
    }
    else {
      popupService.AlertPopup($scope.getText('loginHelp'));
    }
  };

  $scope.logout = function() {
    popupService.confirmPopup($scope.getText('logoutText') + '?', '', function() {
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
