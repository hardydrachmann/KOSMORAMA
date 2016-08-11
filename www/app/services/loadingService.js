// This is a service which can show and hide a progress-loader while waiting for data/tasks.

angular.module('kosmoramaApp').service('loadingService', function($ionicLoading, $timeout) {

  this.loaderShow = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="dots" class="spinner-positive"></ion-spinner>'
    });
  };

  this.loaderHide = function(time) {
    $timeout(function() {
      $ionicLoading.hide();
    }, time | 0);
  };

});
