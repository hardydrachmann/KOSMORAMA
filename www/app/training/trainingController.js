angular.module('kosmoramaApp').controller('TrainingController', function($scope, $state, $sce) {
  $scope.video= $sce.trustAsResourceUrl('https://www.youtube.com/embed/xx2cxo8WQoM?rel=0&showinfo=0');
});
