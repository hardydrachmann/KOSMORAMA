angular.module('kosmoramaApp').controller('LoginController', function($scope, $ionicPopup, $timeout, $state) {

  $scope.id = '';

  $(document).ready(function() {
    var id = window.localStorage.getItem('id');
    if (id != undefined && !id.isEmpty) {
      //$state.go('home');
    }
  });

  $scope.login = function() {
    window.localStorage.setItem('id', $scope.id);
    $state.go('home');
  };

  $scope.logout = function() {
    window.localStorage.removeItem('id');
    $state.go('login');
  };

  $scope.showPopUpMessage = function(message) {
    var popUp = $ionicPopup.show({
      title: 'message:',
      template: message
    });
    $timeout(function() {
      popUp.close();
    }, 2000);
  };
});
