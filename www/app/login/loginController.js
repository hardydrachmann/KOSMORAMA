angular.module('kosmoramaApp').controller('LoginController', function($scope, $state, $ionicPlatform, $ionicLoading, $timeout) {

  $scope.loginId = '';

  $(document).ready(function() {
    var encryptedId = window.localStorage.getItem('kosmoramaId');
    var key = window.localStorage.getItem('kosmoramaKey');
    if (encryptedId && key) {
      var decryptedId = sjcl.decrypt(key, encryptedId);
      $state.go('home');
    }
  });

  $scope.setLoginId = function() {
    $scope.loginId = $('#setId').val();
  };

  $scope.showLoading = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
  };

  $scope.hideLoading = function() {
    $ionicLoading.hide();
  };

  $scope.login = function() {
    if ($scope.loginId) {
      $scope.showLoading();
      var key = $scope.getRandomKey();
      var id = sjcl.encrypt(key, $scope.loginId);
      window.localStorage.setItem('kosmoramaId', id);
      window.localStorage.setItem('kosmoramaKey', key);
      $('#setId').val('');
      $timeout(function() {
        $state.go('home');
        $scope.hideLoading();
      }, 1000);
    }
  };

  $scope.logout = function() {
    window.localStorage.removeItem('kosmoramaId');
    window.localStorage.removeItem('kosmoramaKey');
    $state.go('login');
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
