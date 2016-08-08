angular.module('kosmoramaApp').controller('TrainingPlanController', function($scope, $state, dataService) {

  $scope.TrainigItems = [];

  var name = '';
  var language = $scope.lang;


  $scope.getTraining = function(userId) {
    dataService.factory.getTraining(userId, function(trainingData) {
      if (trainingData.length === 0) {
        console.log('error', 'ingen træning idag');
      } else {
        $scope.TrainigItems = trainingData[0].TrainingItems;
        console.log('Traning Array: ', $scope.TrainigItems);
        console.log('Schedule info Object: ', trainingData['0']);
      }
    });
  };
  $scope.getTraining(79);

  $scope.trainingName = function(trainingItem) {
    var langs = trainingItem.LangName;
    name = langs[language];
    return name;
  };
});
