var app = angular.module('kosmoramaApp');
app.controller('TrainingController', function($scope, $state, $sce, $timeout, $rootScope, $ionicHistory, dataService, loadingService, audioService) {

    $scope.TrainingItems = [];
    $scope.userId = "";

    $(document).ready(function() {
        getUserTraning();
        setPlayerReadyHandler(function() {
            // This runs the first time the player is ready.
        });
        $rootScope.$on('continueEvent', function() {
            destroyPlayer();
        });
    });

    /**
     * Getting the user from service
     */
     var getUserTraning = function(){
        dataService.getUser($scope.userScreenNumber, function(result) {
            console.log("id", result.Id);
          getTraining(result.Id);
        });
     }

    /**
     * Getting training items from service
     */
    var getTraining = function(userId) {
        loadingService.loaderShow();
        dataService.getTraining(userId, function(data) {
            sortTraining(data);
            loadingService.loaderHide();
            var currentState = $ionicHistory.currentView().stateName;
            if (currentState !== 'trainingPlan') {
                var source = currentState === 'trainingDemo' ? 'https://welfaredenmark.blob.core.windows.net/exercises/Exercises/05_left/speak/en-GB/speak.mp3' : 'https://welfaredenmark.blob.core.windows.net/exercises/Exercises/start_stop/start.mp3';
                createPlayer(getVideo());
                // audioService.playAudio(source, function() {});
            }
            if (currentState !== 'training') {
                // $scope.trainingViewTimer(30);
            }
        });
    };

    /**
     * Sorting and adding a pass Item for each set of training.
     */
    function sortTraining(data) {
        if (data.TrainingItems.length > 0) {
            var trainingData = data.TrainingItems;
            var setCount = data.TrainingItems[0].SessionOrderNumber,
                pass = 1,
                firstTrainingId = data.TrainingItems[0].TrainingId;
            for (var i = 0; i < trainingData.length; i++) {
                var exercise = trainingData[i];
                if (exercise.SessionOrderNumber === setCount || exercise.TrainingId > firstTrainingId) {
                    $scope.TrainingItems.push({
                        passTitle: $scope.getText('passText') + pass++
                    });
                    setCount++;
                    firstTrainingId = exercise.TrainingId;
                }
                $scope.TrainingItems.push(exercise);
            }
        }
    }

    $scope.trainingViewTimer = function(time) {
        $timeout(function() {
            $scope.continue();
        }, time * 1000);
    };

    $scope.getNextTrainingItem = function() {
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
        if (item) {
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
});
