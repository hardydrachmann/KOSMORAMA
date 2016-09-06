angular
    .module('kosmoramaApp')
    .controller('FeedbackController',
        function($state, tabsService, dataService, loadingService, storageService) {

            var self = this;

            /**
             * Sets the selected smiley value and saves the training as done in the database.
             */
            self.setSmileyValue = function(value) {
                var stats = value * 20;
                var training = storageService.proceduralUserData.currentTraining;
                var trainingReport = [{
                    "PlanExerciseId": training.PlanExerciseId,
                    "Id": training.TrainingId,
                    "Exercise": training.ExerciseId,
                    "Score": stats,
                    "Time": calculateTime(training),
                    "Repetitions": [],
                    "Questions": null
                }];
                storageService.complete(trainingReport);
                tabsService.continue();
            };

            /**
             * Used to calculate the total time of an exercise.
             */
            function calculateTime(trainingItem) {
                var setTime = (trainingItem.TimeSet * 60) * trainingItem.Sets;
                var totalPauseTime = (60 * trainingItem.Pause * (trainingItem.Sets - 1));
                return setTime + totalPauseTime;
            }

        });
