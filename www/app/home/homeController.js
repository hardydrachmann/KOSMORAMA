angular
	.module('kosmoramaApp')
	.controller('HomeController',
		function($rootScope, $interval, $state, $timeout, $ionicHistory, $cordovaNetwork, languageService, storageService, popupService, dataService, loadingService, mediaService, downloadService, debugService, tabsService) {

			var self = this;
			self.audio = '';
			self.online = false;
			self.idle = true;

			(function init() {
				try {
					if (!debugService.device || $cordovaNetwork.getNetwork() === 'wifi') {
						assessNetwork();
					}
				} catch (err) {
					console.log('IOS homectrl init: ', JSON.stringify(err));
				}
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
			 * Pretend to access to network when working from a browser.
			 */
			self.spoofNetwork = true;
			$rootScope.forceSync = function() {
				if (!debugService.device || $cordovaNetwork.getNetwork() === 'wifi') {
					assessNetwork();
				}
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
					} else {
						getData();
					}
				}
			}

			/**
			 * Syncs data to the database and updates current training plan.
			 */
			function syncData() {
				var data = storageService.getCompleted();
				console.log('Syncing stored data.', data);
				if (data.length) {
					loadingService.loaderShow();
					var toSync = 0;
					for (var i = 0; i < data.length; i++) {
						if (data[i]) {
							for (var j = 0; j < data[i].reports.length; j++) {
								console.log('Training report', data[i].reports[j][0]);
								toSync++;
								dataService.postData(data[i].reports[j], function() {
									toSync--;
									console.log('Training submitted!');
								});
							}
							console.log('Training feedback', data[i].passData);
							toSync++;
							dataService.postFeedback(data[i].passData, function() {
								toSync--;
							});
						}
					}
					console.log('total items to sync', toSync);
					var syncInterval = $interval(function() {
						console.log('Syncing items...', toSync);
						if (toSync <= 0) {
							console.log('Done syncing!');
							getData();
							$interval.cancel(syncInterval);
						}
					}, 1000);
				} else {
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
						} else {
							done();
						}
						sortTraining(data);
					} else {
						done();
						popupService.alertPopup(languageService.getText('noTrainingText'));
					}
				});
			}

			/**
			 * Remove all media files on device, then download all new media files.
			 */
			function downloadTraining(trainings) {
				mediaService.removeMedia();
				self.audio = '';
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
								// self.audio = mediaService.getAudio('prompt');
								done();
								$interval.cancel(downloadInterval);
							}
						}, 1000);
						self.audio = '';
					});
				} else {
					done();
				}
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

			var done = function() {
				loadingService.loaderHide();
				self.idle = true;
				console.log('Idle?', self.idle);
			};
		});
