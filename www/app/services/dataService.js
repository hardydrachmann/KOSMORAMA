// This is a data service which gets and posts data in the API-service.

angular
	.module('virtualTrainingApp')
	.service('dataService', function($http, debugService, mockService) {

		var url = 'http://176.62.203.178/Comm/DataService';
		// var url = 'http://localhost:8080/Comm/DataService';

		//var hardcodedScreenNumber = 'AA02';

		// This function gets a user by the Screen number entered on login.
		this.getUser = function(userScreenNumber, callback) {
			if (debugService.mock) {
				mockService.getUser(userScreenNumber, callback);
				return;
			}
			// Preparing the content for the header required to get user in Api-service
			var content = {
				id: '0',
				method: 'GetUsers',
				params: userScreenNumber
			};
			var dataString = JSON.stringify(content); // Converting javascript to Json

			// Doing the http post request
			$http({
				method: 'POST',
				url: url,
				data: dataString,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).success(function(userdata) {
				if (callback) {
					callback(userdata.result[0]);
				}
			}).error(function(data, status, headers, config) {
				console.log('testfail', data, status, headers, config);
				if (callback) {
					callback(null);
				}
			});

		};

		// This function gets the trainig for a user on the current day.
		this.getTraining = function(UserId, callback) {
			if (debugService.mock) {
				mockService.getTraining(UserId, callback);
				return;
			}
			var content = {
				id: '1',
				method: 'GetScheduledTrainingAndQuestionnaires',
				params: UserId
			};

			var dataString = JSON.stringify(content); //Converting javascript to Json

			// Doing the http post request and returns an array of training objects.
			$http({
				method: 'POST',
				url: url,
				data: dataString,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).success(function(trainingData) {
				var train = [];
				var date = new Date();
				var maxDate = new Date();
				maxDate.setDate(date.getDate() + 7);
				// Checking for current days training Items and adding them to array.
				for (var i = 0; i < trainingData.result.length; i++) {
					var trainingDate = new Date(trainingData.result[i].Date);
					if (trainingDate <= maxDate) {
						for (var item in trainingData.result[i].TrainingItems) {
							if (trainingData.result[i].TrainingItems[item].Type == 40) {
								var addedItem = {
									'date': trainingDate,
									'ExeciseUrl': trainingData.result[i].TrainingItems[item].ExeciseUrl,
									'ExerciseId': trainingData.result[i].TrainingItems[item].ExerciseId,
									'ExerciseOrderNumber': trainingData.result[i].TrainingItems[item].ExerciseOrderNumber,
									'IsTest': trainingData.result[i].TrainingItems[item].IsTest,
									'LangDesc': trainingData.result[i].TrainingItems[item].LangDesc,
									'LangName': trainingData.result[i].TrainingItems[item].LangName,
									'Pause': trainingData.result[i].TrainingItems[item].Pause,
									'PlanExerciseId': trainingData.result[i].TrainingItems[item].PlanExerciseId,
									'Questions': trainingData.result[i].TrainingItems[item].Questions,
									'Repetitions': trainingData.result[i].TrainingItems[item].Repetitions,
									'SessionOrderNumber': trainingData.result[i].TrainingItems[item].SessionOrderNumber,
									'SetId': trainingData.result[i].TrainingItems[item].SetId,
									'Sets': trainingData.result[i].TrainingItems[item].Sets,
									'TimeSet': trainingData.result[i].TrainingItems[item].TimeSet,
									'TrainingId': trainingData.result[i].TrainingItems[item].TrainingId,
									'Type': trainingData.result[i].TrainingItems[item].Type
								};

								train.push(addedItem);
							}
						}
					}
				}
				if (callback) {
					callback(train);
				}
			}).error(function(trainingData, status, headers, config) {
				console.log('testfail', trainingData, status, headers, config);
				if (callback) {
					callback('error');
				}
			});
		};

		// This function post traning data.
		this.postData = function(trainingReport, callback) {
			if (debugService.mock) {
				mockService.postData(trainingReport, callback);
				return;
			}
			var content = {
				id: '2',
				method: 'PostTrainingReport',
				params: trainingReport
			};

			var dataString = JSON.stringify(content); //Converting javascript to Json

			// Doing the http post request and returns an array of trainig objects.
			$http({
				method: 'POST',
				url: url,
				data: dataString,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).success(function(trainingData) {
				if (callback) {
					callback(trainingData);
				}
			}).error(function(trainingData, status, headers, config) {
				console.log('testfail', trainingData, status, headers, config);
				if (callback) {
					callback('error');
				}
			});
		};

		// This function saves the note as read
		// returns true if success and false when an error has occured.
		this.postNoteData = function(noteId, callback) {
			if (debugService.mock) {
				mockService.postNoteData(noteId, callback);
				return;
			}
			var content = {
				id: '3',
				method: 'PostNoteAsRead',
				params: noteId
			};

			var dataString = JSON.stringify(content); // Converting javascript to Json

			// Doing the http post request and returns true if succes and false if not.
			$http({
				method: 'POST',
				url: url,
				data: dataString,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).success(function(result) {
				if (callback) {
					callback(result);
				}
			}).error(function(result, status, headers, config) {
				console.log('testfail', result, status, headers, config);
				if (callback) {
					callback(result);
				}
			});
		};

		// This function saves feedbackReport to therpist, it handles both message and PainLevel
		// returns true if success and false when an error has occured.
		this.postFeedback = function(feedbackCollection, callback) {
			if (debugService.mock) {
				mockService.postFeedback(feedbackObject, callback);
				return;
			}

			//
			var convertedFeedbackCollection = [];
			for (var i = 0; i < feedbackCollection.length; i++) {
				var feedbackReport = {
					"ScheduleId": feedbackCollection[i].trainingId,
					"SessionOrderNumber": feedbackCollection[i].sessionOrderNumber,
					"Message": feedbackCollection[i].message,
					"PainLevel": feedbackCollection[i].painLevel || 0,
				};
				convertedFeedbackCollection.push(feedbackReport);
			}

			var content = {
				id: '3',
				method: 'PostFeedback',
				params: convertedFeedbackCollection
			};

			var dataString = JSON.stringify(content); // Converting javascript to Json

			// Doing the http post request and returns true if succes and false if not.
			$http({
				method: 'POST',
				url: url,
				data: dataString,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).success(function(trainingData) {
				if (callback) {
					callback(trainingData);
				}
			}).error(function(trainingData, status, headers, config) {
				console.log('testfail', trainingData, status, headers, config);
				if (callback) {
					callback('error');
				}
			});
		};

		/**
		 * Check if a given audio URL/file exist on the blob server.
		 */
		this.checkAudioUrlExist = function(audioUrl, existCall) {
			$http.head(audioUrl)
				.then(function(result) {
					if (result.status !== 404) {
						existCall(true);
					}
				}, function(result) {
					existCall(false);
				});
		};
	});
