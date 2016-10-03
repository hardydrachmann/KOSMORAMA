angular
	.module('kosmoramaApp')
	.controller('HomeController',
		function($rootScope, $interval, $state, $timeout, $ionicHistory, $cordovaNetwork, languageService, storageService, popupService, blobService, dataService, loadingService, mediaService, downloadService, debugService, tabsService) {

			var self = this;
			self.getAudio = '';
			self.online = false;
			self.idle = true;
			$rootScope.forceSync = doSync;

			(function init() {
				$timeout(doSync, 1000);
				$rootScope.device = debugService.device;

				// $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
				// 	if (!self.online) {
				// 		if (networkState === 'wifi') {
				// 			self.online = true;
				// 			assessNetwork(networkState);
				// 		}
				// 	}
				// });
				//
				// $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
				// 	if (self.online) {
				// 		if (networkState !== 'wifi') {
				// 			self.online = false;
				// 		}
				// 	}
				// });
			})();

			/**
			 * Force accessing the network to do a selective sync.
			 */
			function doSync() {
				if (!debugService.device || $cordovaNetwork.getNetwork() === 'wifi') {
					assessNetwork();
				}
			}

			/**
			 * Get the amount of remaining training passes to complete.
			 */
			self.getPassCount = function() {
				var trainings = storageService.persistentUserData.training;
				var passCount = 0;
				for (var i = 0; i < trainings.length; i++) {
					if (trainings[i].passTitle) {
						passCount++;
					}
				}
				return passCount;
			};

			/**
			 * Checks the internet status to determine whether it's possible to sync.
			 */
			function assessNetwork(networkState) {
				if (self.idle) {
					console.log('Assessing network state...');
					self.idle = false;
					console.log('Idle?', self.idle);
					if (debugService.device) {
						// Actually get the network state of the device.
						networkState = $cordovaNetwork.getNetwork();
					}
					if (storageService.getCompleted().length) {
						syncData();
					}
					else {
						getData();
					}
				}
			}

			/**
			 * Syncs data to the database and updates current training plan.
			 */
			function syncData() {
				var data = storageService.getCompleted();
				var feedbackCollection = [];
				var trainingReportCollection = [];
				console.log('Syncing stored data.', data);
				if (data.length) {
					loadingService.loaderShow();
					for (var i = 0; i < data.length; i++) {
						if (data[i]) {
							for (var x = 0; x < data[i].reports.length; x++) {
								trainingReportCollection.push(data[i].reports[x][0]);
							}
							feedbackCollection.push(data[i].passData);
						}
					}
					dataService.postData(trainingReportCollection, function(result) {
						getData();
					});
					dataService.postFeedback(feedbackCollection);
				}
				else {
					getData();
				}
			}

			/**
			 * Get the user's training plan.
			 */
			function getData() {
				console.log('Getting user and training data...');
				loadingService.loaderShow();
				storageService.clearTrainingData();
				// storageService.printUserData();
				dataService.getUser(storageService.getUserScreenNumber(), function(result) {
					getTraining(result.Id);
				});
			}

			/**
			 * Get training items from service and download media.
			 */
			function getTraining(userId) {
				dataService.getTraining(userId, function(data) {
					if (data) {
						console.log('All training get!');
						if (debugService.device) {
							downloadTraining(data);
						}
						else {
							done();
						}
						sortTraining(data);
					}
					else {
						done();
						popupService.alertPopup(languageService.getText('noTrainingText'));
					}
				});
			}

			/**
			 * Remove all media files on device, then download all new media files.
			 */
			function downloadTraining(trainings) {
				mediaService.removeMedia(function() {
					self.getAudio = '';
					if (trainings.length) {
						var toDownload = trainings.length;
						var downloadDone = function() {
							toDownload--;
						};
						console.log('INIT DOWNLOAD ', toDownload);
						downloadService.createMediaFolders(trainings, function() {
							for (var i = 0; i < trainings.length; i++) {
								downloadService.downloadMedia(trainings[i].ExerciseId, downloadDone);
							}

							var downloadInterval = $interval(function() {
								console.log('DOWNLOAD BUNDLES...', toDownload);
								if (toDownload <= 0) {
									console.log('Download completed');
									self.getAudio = debugService.device ? mediaService.getAudio('prompt') : blobService.getAudio('prompt');
									mediaService.playIosAudio('prompt');
									done();
									$interval.cancel(downloadInterval);
								}
							}, 1000);
							self.getAudio = '';
						});
					}
					else {
						done();
					}
				});
			}

			/**
			 * Sorting and adding a pass item for each set of training.
			 */
			function sortTraining(data) {
				if (data.length > 0) {
					var setCount = data[0].SessionOrderNumber,
						pass = 1,
						firstTrainingId = data[0].TrainingId;
					for (var i = 0; i < data.length; i++) {
						if (data[i].SessionOrderNumber === setCount || data[i].TrainingId > firstTrainingId) {
							storageService.persistentUserData.training.push({
								passTitle: languageService.getText('passText') + pass++
							});
							setCount++;
							firstTrainingId = data[i].TrainingId;
						}
						storageService.persistentUserData.training.push(data[i]);
					}
				}
			}

			function done() {
				loadingService.loaderHide();
				self.idle = true;
				// console.log('Idle?', self.idle);
			}
		});