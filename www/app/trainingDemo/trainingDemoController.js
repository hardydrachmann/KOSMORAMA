angular.module('kosmoramaApp').controller('TrainingDemoController', function($scope, $state, $sce, dataService) {
<<<<<<< HEAD
  $scope.video= $sce.trustAsResourceUrl('https://www.youtube.com/embed/xx2cxo8WQoM?rel=0&showinfo=0&loop=0&playlist=xx2cxo8WQoM');
=======
>>>>>>> baa4336e11139b45286fd64cd35c9900eb3db295

  $scope.video = '';
  var description = '';
  var language = $scope.lang;
  $scope.TrainingItems = [];
  var url = '';

  $scope.getTraining = function(userId) {
    dataService.factory.getTraining(userId, function(trainingData) {
      if (trainingData.length === 0) {
        console.log('error', 'ingen træning idag');
      } else {
        $scope.TrainingItems = trainingData[0].TrainingItems;
        $scope.video();
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

  $scope.video = function() {
    var url = $scope.TrainingItems[0].ExeciseUrl;
    console.log('URL: ', url);
    if (url) {
      //$scope.myVid = $sce.trustAsResourceUrl(url+ '/embed/xx2cxo8WQoM?rel=0&showinfo=0');
      $scope.myVid = $sce.trustAsResourceUrl('https://www.youtube.com/embed/xx2cxo8WQoM?rel=0&showinfo=0');
    }
  };


});
