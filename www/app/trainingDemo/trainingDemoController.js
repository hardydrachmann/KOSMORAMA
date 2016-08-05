angular.module('kosmoramaApp').controller('TrainingDemoController', function($scope, $state, $sce) {
  $scope.video= $sce.trustAsResourceUrl('https://www.youtube.com/embed/hsc2bhCW80Y?rel=0&showinfo=0');
});
