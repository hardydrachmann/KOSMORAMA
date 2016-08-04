angular.module('kosmoramaApp').controller('TrainingInstructionController', function($scope, $state, $sce) {
  $scope.video= $sce.trustAsResourceUrl('https://www.youtube.com/embed/hsc2bhCW80Y?autoplay=1&loop=1');
});
