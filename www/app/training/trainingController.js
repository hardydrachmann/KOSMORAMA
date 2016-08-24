var app = angular.module('kosmoramaApp');
app.controller('TrainingController', function($scope, $state, $timeout, $rootScope, $ionicHistory, popupService, dataService, loadingService, audioService, blobService) {

    $scope.TrainingItems = [];

    $(document).ready(function() {
        var currentState = $ionicHistory.currentView().stateName;
        if (currentState === 'trainingPlan') {
            getUser(function(result) {
                getTraining(result.Id, function() {
                    storeData();
                    stateAction(currentState);
                });
            });
        }
        else {
            stateAction(currentState);
        }
        setPlayerReadyHandler(function() {
            // This runs the first time the player is ready.
        });
        $rootScope.$on('continueEvent', function() {
            destroyPlayer();
            $scope.cancelViewTimer();
        });
    });

    /**
     * Store data which is necessary for later views in the root scope.
     */
    var storeData = function() {
        $rootScope.lastPassTraining = $scope.TrainingItems[2] == undefined;
        if (!$rootScope.lastPassTraining) {
            $rootScope.lastPassTraining = !$scope.TrainingItems[2].hasOwnProperty('ExerciseId');
        }
        $rootScope.allowMessage = true;
        $rootScope.currentTraining = $scope.TrainingItems[1];
        $rootScope.passData = {
            trainingId: $scope.TrainingItems[1].TrainingId,
            sessionOrderNumber: $scope.TrainingItems[1].SessionOrderNumber,
            painLevel: 0,
            message: null
        };
    };

    /**
     * Getting the user from service.
     */
    var getUser = function(callback) {
        dataService.getUser($scope.userScreenNumber, function(result) {
            callback(result);
        });
    };

    /**
     * Getting training items from service.
     */
    function getTraining(userId, callback) {
        loadingService.loaderShow();
        dataService.getTraining(userId, function(data) {
            if (data) {
                sortTraining(data);
                loadingService.loaderHide();
                callback();
            }
            else {
                popupService.alertPopup($scope.getText('noTrainingText'));
                loadingService.loaderHide();
                $state.go('home');
            }
        });
    }

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

    /**
     * Execute the appropriate action for the current training view variation.
     */
    var stateAction = function(currentState) {
        if (currentState.startsWith('training')) {
            if (currentState !== 'trainingPlan') {
                play(currentState === 'trainingDemo', false);
            }
            if (currentState !== 'training') {
                $scope.trainingViewTimer(10);
            }
        }
    };

    var startStopAudioUrl = 'https://welfaredenmark.blob.core.windows.net/exercises/Exercises/start_stop/';
    /**
     * Plays video, and sound if it's wanted.
     */
    function play(isTrainingDemo, playSound) {
        var source = isTrainingDemo ? $scope.getAudio() : startStopAudioUrl + 'start.mp3';
        if (playSound) {
            audioService.playAudio(source, function() {
                $('#video-show-hide').css('display', 'block');
                createPlayer(getVideo());
            });
        }
        else {
            $timeout(function() {
                $('#video-show-hide').css('display', 'block');
                createPlayer(getVideo());

            }, 1000);
        }
    }

    /**
     * Return the video id for the video of the next training item on the list.
     */
    function getVideo() {
        // Returns the videoId from the current exerciseUrl.
        var item = $rootScope.currentTraining;
        if (item) {
            var url = item.ExeciseUrl;
            if (url) {
                var videoId;
                if (url.startsWith("https")) {
                    videoId = url.substring(26, 37);
                }
                else if (url.startsWith("http")) {
                    videoId = url.substring(25, 36);
                }
                return videoId;
            }
        }
    }

    var trainingPromise;
    /**
     * Cancel the view timer.
     */
    $scope.cancelViewTimer = function() {
        if (trainingPromise) {
            $timeout.cancel(trainingPromise);
            trainingPromise = undefined;
        }
    };

    /**
     * Start the training view timer to automatically move on to the next view by calling continue().
     */
    $scope.trainingViewTimer = function(time) {
        $scope.cancelViewTimer();
        trainingPromise = $timeout(function() {
            $scope.continue();
        }, time * 1000);
    };

    $scope.getTrainingName = function(trainingItem) {
        // Returns the appropriate language name for the selected item.
        return trainingItem.LangName[$scope.lang];
    };

    $scope.trainingDescription = function() {
        // Returns the appropriate language description for the next exercise.
        var item = $rootScope.currentTraining;
        if (item) {
            return item.LangDesc[$scope.lang];
        }
    };

    $scope.formatTime = function(time) {
        // Takes the time as seconds in the parameter and returns it in a formatted string with min/sec.
        var min = Math.floor(time / 60);
        var sec = time - min * 60;
        return min + " " + $scope.getText('min') + " " + sec + " " + $scope.getText('sec');
    };

    $scope.getAudio = function() {
        return blobService.getExerciseAudio($rootScope.currentTraining.ExerciseId);
    };

    $scope.getPicture = function(exerciseId) {
        return blobService.getExercisePicture(exerciseId);
    };
});
