var homeCtrl = function($rootScope, $interval, $state, $timeout, $ionicHistory, $cordovaNetwork, languageService, storageService, popupService, blobService, dataService, loadingService, mediaService, downloadService, deviceService, tabsService) {
	var ctrl = this;

	var nameOfUser = '';
	var syncHasFailed = false;
	var syncTimeoutPromise;

	ctrl.getAudio = '';
	ctrl.online = false;
	ctrl.idle = true;

	$rootScope.forceSync = assessNetwork;

	(function init() {
		$timeout(assessNetwork, 1000);
		$rootScope.device = deviceService.device;
	})();

	/**
	 * Get the welcome text on the home screen, displaying the user's name as well as remaining passes.
	 */
	ctrl.getWelcomeText = function() {
		if (nameOfUser) {
			return languageService.getText('welcomeText1') + ', ' + nameOfUser + '. ' + languageService.getText('welcomeText2') + storageService.getPassCount() + languageService.getText('welcomeText3');
		}
		return '';
	};

	/**
	 * Start button functions:
	 * if success, advance to training plan view.
	 * if error, alert user and return.
	 */
	ctrl.startButton = function() {
		if (syncHasFailed) {
			popupService.alertPopup(languageService.getText('syncHasFailed'));
			return;
		}
		$state.go('trainingPlan');
	};

	/**
	 * Force accessing the network to do a selective sync.
	 */
	function assessNetwork() {
		var networkState = $cordovaNetwork.getNetwork();
		if (!deviceService.device || networkState === 'wifi') {
			doSync();
		}
		else if (networkState === '4g' || networkState === '3g') {
			popupService.confirmPopup(languageService.getText('noWifiSyncHeader'), languageService.getText('noWifiSyncTitle'), function() {
				doSync();
			});
		}
	}

	/**
	 * Checks the internet status to determine whether it's possible to sync.
	 */
	function doSync() {
		syncHasFailed = false;
		if (ctrl.idle) {
			console.log('Assessing network state...');
			syncTimeoutPromise = $timeout(function() {
				syncHasFailed = true;
				done();
				popupService.alertPopup(languageService.getText('syncError'));
			}, 60000);
			ctrl.idle = false;
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
		loadingService.loaderShow();
		storageService.clearTrainingData();
		dataService.getUser(storageService.getUserScreenNumber(), function(result) {
			nameOfUser = result.Name;
			getTrainingFromDB(result.Id);
		});
	}

	/**
	 * Get training items from service and download media.
	 */
	function getTrainingFromDB(userId) {
		dataService.getTraining(userId, function(data) {
			if (data && data.length) {
				console.log('All training get!');
				if (deviceService.device) {
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
			ctrl.getAudio = '';
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
								ctrl.getAudio = deviceService.device ? mediaService.getAudio('prompt') : blobService.getAudio('prompt');
								mediaService.playIosAudio('prompt');
							}
							done();
							$interval.cancel(downloadInterval);
						}
					}, 1000);
					ctrl.getAudio = '';
				});
			}
			else {
				done();
			}
		});
	}

	/**
	 * Done syncing. This method removes the loading spinner, stops the sync timeout and reverts to idle state.
	 */
	function done() {
		loadingService.loaderHide();
		ctrl.idle = true;
		$timeout.cancel(syncTimeoutPromise);
		// console.log('Idle?', ctrl.idle);
	}
};

angular.module('virtualTrainingApp').controller('HomeController', homeCtrl);
