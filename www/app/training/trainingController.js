angular.module('kosmoramaApp').controller('TrainingController', function($scope, $state, $sce, dataService, $timeout) {

  $scope.video = '';
  var description = '';
  var language = $scope.lang;
  $scope.TrainingItems = [];
  var url = '';

  $scope.getTraining = function(userId) {
    dataService.getTraining(userId, function(trainingData) {
      if (trainingData.length === 0) {
        console.log('error', 'ingen træning idag');
      } else {
        $scope.TrainingItems = trainingData[0].TrainingItems;
        $scope.video();
        $scope.timer();
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
      $scope.myVid = $sce.trustAsResourceUrl('https://www.youtube.com/embed/xx2cxo8WQoM?rel=0&showinfo=0&loop=0&playlist=xx2cxo8WQoM');
    }
  };
  
  $scope.formatTime = function(time) {
    var min = Math.floor(time / 60);
    var sec = time - min * 60;
    return min + " minutes " + sec + " seconds"
  };
  
  $scope.timer = function() {
    rep = $scope.TrainingItems[0].Repetitions;
    timerep = $scope.TrainingItems[0].TimeSet*60;
    timepause = $scope.TrainingItems[0].Pause*60;
    console.log("Repetitions: " + rep);
    console.log("Time pr rep: " + timerep);
    $scope.counter = timerep;
  };
  // timer stuff
  var mytimeout = null;
  var rep;
  var timerep;
  
  var timepause;
  $scope.counter = null;
  var pause = false;
  
  
  $scope.onTimeout = function() {
    if($scope.counter === 0) {
      $timeout.cancel(mytimeout);
      if(rep > 0) 
            if(!pause) {
              $scope.startExcerciseTimer();
            } else {
              $scope.startPauseTimer();
            }
      return;
    }
    $scope.counter--;
    mytimeout = $timeout($scope.onTimeout, 1000);
  };
  
  $scope.startExcerciseTimer = function() {
    $scope.counter = timerep + 1;
    pause = true;
    rep--;
    mytimeout = $timeout($scope.onTimeout);
  };
  
  $scope.startPauseTimer = function() {
    $scope.counter = timepause + 1;
    pause = false;
    mytimeout = $timeout($scope.onTimeout);
  };

});
