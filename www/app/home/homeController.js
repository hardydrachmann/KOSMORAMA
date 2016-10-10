angular
	.module('virtualTrainingApp')
	.controller('HomeController',
		function($rootScope, $interval, $state, $timeout, $ionicHistory, $cordovaNetwork, languageService, storageService, popupService, blobService, dataService, loadingService, mediaService, downloadService, debugService, tabsService) {
			var self = this;

			self.getAudio = '';
			self.online = false;
			self.idle = true;
			$rootScope.forceSync = doSync;
			self.getPassCount = storageService.getPassCount;

			var syncHasFailed = false;

			(function init() {
				$timeout(doSync, 1000);
				$rootScope.device = debugService.device;
			})();

			/**
			 * Force accessing the network to do a selective sync.
			 */
			function doSync() {
				if (!debugService.device || $cordovaNetwork.getNetwork() === 'wifi') {
					assessNetwork();
				}
				else if (!debugService.device || $cordovaNetwork.getNetwork() === '4g' || $cordovaNetwork.getNetwork() === '3g') {
					popupService.confirmPopup(languageService.getText('noWifiSyncHeader'), languageService.getText('noWifiSyncTitle'), '', function() {
						assessNetwork();
					});
				}
			}

			var syncPromise;
			/**
			 * Checks the internet status to determine whether it's possible to sync.
			 */
			function assessNetwork(networkState) {
				syncHasFailed = false;
				if (self.idle) {
					console.log('Assessing network state...');
					syncPromise = $timeout(function() {
						syncHasFailed = true;
						done();
						popupService.alertPopup(languageService.getText('syncError'));
					}, 5000);
					self.idle = false;
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
			 * Start button functions:
			 * if success, advance to training plan view.
			 * if error, alert user and return.
			 */
			self.startButton = function() {
				if (syncHasFailed) {
					popupService.alertPopup(languageService.getText('syncHasFailed'));
					return;
				}
				$state.go('trainingPlan');
			};

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
				loadingService.loaderShow();
				storageService.clearTrainingData();
				dataService.getUser(storageService.getUserScreenNumber(), function(result) {
					getTrainingFromDB(result.Id);
				});
			}

			/**
			 * Get training items from service and download media.
			 */
			function getTrainingFromDB(userId) {
				dataService.getTraining(userId, function(data) {
					if (data) {
						console.log('All training get!');
						if (debugService.device) {
							downloadTraining(data);
						}
						else {
							done();
						}
						storageService.sortTraining(data);
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
									if (!syncHasFailed) {
										self.getAudio = debugService.device ? mediaService.getAudio('prompt') : blobService.getAudio('prompt');
										mediaService.playIosAudio('prompt');
									}
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


			function done() {
				loadingService.loaderHide();
				self.idle = true;
				$timeout.cancel(syncPromise);
				// console.log('Idle?', self.idle);
			}
		});
