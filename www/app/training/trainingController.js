var app = angular.module('kosmoramaApp');
app.controller('TrainingController', function($scope, $state, $sce, $timeout, $rootScope, dataService, loadingService, $ionicHistory) {

    $scope.TrainingItems = [];
    $scope.rep;
    $scope.counter = null;
    var player;
    var mytimeout = null;
    var pause = false;
    var trainingLength;

    $(document).ready(function() {
        getTraining(79);
    });

    var getTraining = function(userId) {
        loadingService.loaderShow();
        dataService.getTraining(userId, function(data) {
            if (data.length > 0) {
                var trainingData = data[0].TrainingItems;
                var prevPlanId = 0,
                    prevSetId = 0,
                    trainingLength = trainingData.length,
                    setCount = 1;
                for (var i = 0; i < trainingData.length; i++) {
                    var exercise = trainingData[i];
                    if (exercise.PlanExerciseId - prevPlanId != 1 || exercise.SetId != prevSetId) {
                        $scope.TrainingItems.push({
                            passTitle: $scope.getText('passText') + setCount++
                        });
                    }
                    $scope.TrainingItems.push(exercise);
                    prevPlanId = exercise.PlanExerciseId;
                    prevSetId = exercise.SetId;
                }
            }
            getYouTubePlayer();
            getTrainingSetInfo();
            loadingService.loaderHide();
        });
        if ($ionicHistory.currentView().stateName === 'trainingPlan') {
            timeOut(45);
        }
    };

    $scope.getNextTrainingItem = function() {
        console.log('all items: ', $scope.TrainingItems);
        if ($scope.TrainingItems.length > 0) {
            if (!$scope.TrainingItems[0].hasOwnProperty('ExerciseId')) {
                return $scope.TrainingItems[1];
            }
        }
        return $scope.TrainingItems[0];
    };

    $scope.getTrainingName = function(trainingItem) {
        // Returns the appropriate language name for the selected item.
        return trainingItem.LangName[$scope.lang];
    };

    $scope.trainingDescription = function() {
        // Returns the appropriate language description for the next exercise.
        var item = $scope.getNextTrainingItem();
        if (item != undefined) {
            return item.LangDesc[$scope.lang];
        }
    };

    var getVideo = function() {
        // Returns the videoId from the current exerciseUrl.
        var item = $scope.getNextTrainingItem();
        if (item) {
            var url = item.ExeciseUrl;
            if (url) {
                var exerciseUrl;
                if (url.startsWith("https")) {
                    exerciseUrl = url.substring(26, 37);
                }
                else if (url.startsWith("http")) {
                    exerciseUrl = url.substring(25, 36);
                }
                return exerciseUrl;
            }
        }
    };

    var url = 'https://welfaredenmark.blob.core.windows.net/exercises/Exercises/';
    var urn = '/picture/picture.png';
    $scope.getPicture = function(exerciseId) {
        return url + exerciseId + urn;
    };

    var loadPlayer = function() {
        // Instantiates the YouTube Player.
        player = new YT.Player('player', {
            videoId: getVideo(),
            events: {
                'onReady': onPlayerReady
            }
        });
    };

    var destroyPlayer = function() {
        try {
            player.destroy();
        }
        catch (error) {
            console.log('Player destruction error: ' + error);
        }
    };

    var getYouTubePlayer = function() {
        // Destroy the YouTube Player for the previous view, and loads the new one.
        loadPlayer();
        destroyPlayer();
        loadPlayer();
    };

    var onPlayerReady = function(event) {
        // Handles logic when the 'onReady' event is triggered.
        event.target.loadPlaylist(getVideo());

        event.target.setLoop(true);
        startExcerciseTimer();
        if ($ionicHistory.currentView().stateName === 'trainingDemo') {
            timeOut(trainingLength * 3);
        }
    }

    var timeOut = function(time) {
        $timeout(function() {
            $scope.continue();

        }, time * 1000);
    }

    $scope.formatTime = function(time) {
        // Takes the time as seconds in the parameter and returns it in a formatted string with min/sec.
        var min = Math.floor(time / 60);
        var sec = time - min * 60;
        return min + " " + $scope.getText('minutes') + " " + +sec + " " + $scope.getText('seconds');
    };

    var getTrainingSetInfo = function() {
        // Gets the number of repetitions, duration for repetitions and pauses for the current excercise, and sets the initial value for the timer.
        $scope.rep = $scope.TrainingItems[0].Repetitions;
        $scope.counter = $scope.TrainingItems[0].TimeSet * 60;
    };

    $scope.onTimeout = function() {
        // Handles what happens next, everytime the timer times out.
        if ($scope.counter === 0) {
            $timeout.cancel(mytimeout);
            if ($scope.rep > 0)
                if (!pause)
                    startExcerciseTimer();
                else
                    startPauseTimer();
            else {
                player.stopVideo();
                if ($ionicHistory.currentView().stateName === 'training') {
                    timeOut(5);
                }
            }
            return;
        }
        $scope.counter--;
        mytimeout = $timeout($scope.onTimeout, 1000);
    };

    var startExcerciseTimer = function() {
        // Starts the timer and handles relevant logic.
        $scope.counter = $scope.TrainingItems[0].TimeSet * 60;
        player.playVideo();
        pause = true;
        $scope.rep--;
        mytimeout = $timeout($scope.onTimeout);

    };

    var startPauseTimer = function() {
        // Pauses the timer and handles relevant logic.
        $scope.counter = $scope.TrainingItems[0].Pause * 60;
        player.pauseVideo();
        pause = false;
        mytimeout = $timeout($scope.onTimeout);
    };
});
