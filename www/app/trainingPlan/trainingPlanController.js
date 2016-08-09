angular.module('kosmoramaApp').controller('TrainingPlanController', function($scope, $state, dataService) {

  $scope.TrainigItems = [];

  var name = '';
  var language = $scope.lang;
  var initialPictureURLString = 'https://welfaredenmark.blob.core.windows.net/exercises/Exercises/';
  var initialPictureString = '/picture/picture.png';


  $scope.getTraining = function(userId) {
    dataService.factory.getTraining(userId, function(trainingData) {
      if (trainingData.length === 0) {
        console.log('error', 'ingen træning idag');
      } else {
        $scope.TrainigItems = trainingData[0].TrainingItems;
        console.log('Traning Array: ', $scope.TrainigItems);
        console.log('Schedule info Object: ', trainingData['0']);
        console.log('ExerciseId', $scope.TrainigItems[0].ExerciseId);
      }
    });
  };
  $scope.getTraining(79);

  $scope.trainingName = function(trainingItem) {
    var langs = trainingItem.LangName;
    name = langs[language];
    return name;
  };

  $scope.picture = function(ExerciseId) {
    console.log('id', ExerciseId);
    var pic = initialPictureURLString + ExerciseId + initialPictureString;
    if (pic) {
      return pic;
    }
  };
});
