angular.module('kosmoramaApp').controller('TabsController', function($scope, $rootScope, $state, $timeout, $ionicHistory) {

  $scope.showHelpTab = true;
  $scope.showLangTab = true;
  $scope.showContTab = false;
  $scope.showLoginTab = true;
  $scope.showLogoutTab = false;

  $(document).ready(function() {
    $timeout(function() {
      if ($state.current.name !== 'login') {
        $scope.showLogoutTab = true;
        $scope.showLoginTab = false;
      }
    }, 250);
  });

  $scope.setTabs = function() {
    $scope.showHelpTab = false;
    $scope.showLangTab = false;
    $scope.showContTab = false;
    $scope.showLoginTab = false;
    $scope.showLogoutTab = false;
    $timeout(function() {
      var state = $ionicHistory.currentView().stateName;
      switch (state) {
        case 'home':
          $scope.showHelpTab = true;
          $scope.showLangTab = true;
          $scope.showLogoutTab = true;
          break;
        case 'login':
          $scope.showHelpTab = true;
          $scope.showLangTab = true;
          $scope.showLoginTab = true;
          break;
        case 'trainingPlan':
          $scope.showHelpTab = true;
          $scope.showContTab = true;
          $scope.showLogoutTab = true;
          break;
        case 'trainingDemo':
          $scope.showHelpTab = true;
          $scope.showContTab = true;
          $scope.showLogoutTab = true;
          break;
        case 'training':
          $scope.showHelpTab = true;
          $scope.showContTab = true;
          $scope.showLogoutTab = true;
          break;
        case 'feedback':
          $scope.showHelpTab = true;
          $scope.showContTab = true;
          $scope.showLogoutTab = true;
          break;
        case 'help':
          $scope.showHelpTab = true;
          break;
        case 'language':
          $scope.showLangTab = true;
          break;
        case 'notes':
          $scope.showHelpTab = true;
          $scope.showContTab = true;
          $scope.showLogoutTab = true;
          break;
      }
    }, 100);
  };

  $scope.continue = function() {
    $rootScope.$broadcast('continueEvent');
    var state = $ionicHistory.currentView().stateName;
    switch (state) {
      case 'trainingPlan':
        $state.go('trainingDemo');
        break;
      case 'trainingDemo':
        $state.go('training');
        break;
      case 'training':
        $state.go('feedback');
        break;
      case 'feedback':
        $state.go('trainingPlan');
        break;
      case 'notes': // send note and go home
        $state.go('home');
        break;
    }
    $scope.setTabs();
  };
});
