angular.module('kosmoramaApp').controller('TrainingDemoController', function($scope, $state, $sce, dataService) {
  $scope.video = $sce.trustAsResourceUrl('https://www.youtube.com/embed/xx2cxo8WQoM?rel=0&showinfo=0');


  var description = '';
  var language = $scope.lang;
  $scope.TrainingItems = [];

  $scope.getTraining = function(userId) {
    dataService.factory.getTraining(userId, function(trainingData) {
      if (trainingData.length === 0) {
        console.log('error', 'ingen træning idag');
      } else {
        $scope.TrainingItems = trainingData[0].TrainingItems;
      }
    });
  };
  $scope.getTraining(79);

  $scope.trainingDescription = function() {
    var langs = $scope.TrainingItems[0];
    if (langs) {
      description = langs.LangDesc[language];
      return description;
    }
  };
});
