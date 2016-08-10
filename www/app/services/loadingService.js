// This is a service which can show and hide a progress-loader while waiting for data/tasks.

angular.module('kosmoramaApp').service('loadingService', function($ionicLoading) {

  this.showLoading = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>'
    });
  };

  this.hideLoading = function() {
    $ionicLoading.hide();
  };

});
