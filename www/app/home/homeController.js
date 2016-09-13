angular
	.module('kosmoramaApp')
	.controller('HomeController',
		function($rootScope, $state, $timeout, $ionicHistory, $cordovaNetwork, languageService, storageService, popupService, dataService, loadingService, mediaService, downloadService, debugService, tabsService) {

			var self = this;
			self.mails = [];
			self.newMailCount = 0;
			self.audio = '';

			self.online = false;

			/**
			 * Acquire mails and user data upon connecting to the internet.
			 */
			(function init() {
				tabsService.setTabs();
				if ($ionicHistory.currentView().stateName !== 'mail') {
					if (!debugService.device || $cordovaNetwork.getNetwork() === 'wifi') {
						assessNetwork();
					}
				}
				else {
					getMails();
				}
				$rootScope.device = debugService.device;

				$rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
					if (!self.online) {
						if (networkState === 'wifi') {
							self.online = true;
							assessNetwork(networkState);
						}
					}
				});

				$rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
					if (self.online) {
						if (networkState !== 'wifi') {
							self.online = false;
						}
					}
				});
			})();

			/**
			 * Checks the internet status to determine whether it's possible to sync.
			 */
			function assessNetwork(networkState) {
				// alert('online: ' + self.online);
				if (debugService.device) {
					networkState = $cordovaNetwork.getNetwork();
				}
				if (storageService.getCompleted().length) {
					syncData();
				}
				else {
					getData();
				}
			}

			/**
			 * Syncs data to the database and updates current training plan.
			 */
			function syncData() {
				var data = storageService.getCompleted();
				if (data) {
					loadingService.loaderShow();
					for (var i = 0; i < data.length; i++) {
						if (data[i]) {
							console.log(data[i]);
							for (var j = 0; j < data[i].reports.length; j++) {
								console.log('Training report', data[i].reports[j][0]);
								// dataService.postData(data[i].reports[j]);
							}
							console.log('Training feedback', data[i].passData);
							// dataService.postFeedback(data[i].passData);
						}
					}
					getData();
				}
			}

			/**
			 * Get all necessary user data, including mails and training plan.
			 */
			function getData() {
				loadingService.loaderShow();
				storageService.clearTrainingData();
				dataService.getUser(storageService.persistentUserData.userScreenNumber, function(result) {
					self.mails = result.UserMessages;
					countNewMails(self.mails);
					getTraining(result.Id);
				});
			}

			/**
			 * Get training items from service.
			 * 1. Remove all media files on device.
			 * 2. Download all new media files.
			 */
			function getTraining(userId) {
				dataService.getTraining(userId, function(data) {
					if (data) {
						downloadTraining(data);
						sortTraining(data);
						loadingService.loaderHide();
						storageService.printStorage();
					}
					else {
						loadingService.loaderHide();
						popupService.alertPopup(languageService.getText('noTrainingText'));
						$timeout(function() {
							tabsService.setTabs();
						}, 1000);
					}
				});
			}

			/**
			 * Remove all media files on device, then download all new media files.
			 */
			function downloadTraining(data) {
				self.audio = '';
				mediaService.removeMedia();
				var success = false;
				for (var i = 0; i < data.length; i++) {
					success = downloadService.downloadMedia(data[i].ExerciseId);
					if (!success) {
						break;
					}
				}
				loadingService.loaderHide();
				$timeout(function() {
					self.audio = mediaService.getAudio('prompt');
				}, 100);
				if (success) {
					popupService.checkPopup(true);
				}
				else {
					popupService.checkPopup(false);
					tabsService.setTabs();
				}
				self.audio = '';
			}

			/**
			 * Sorting and adding a pass Item for each set of training.
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

			/**
			 * Used to navigate back to home menu, when closing the mail view.
			 */
			self.closeMailView = function() {
				$state.go('home');
			};

			/**
			 * Enables the unfolding of mails, so that they can be read.
			 */
			self.toggleMailDisplay = function(index) {
				var mail = $('#mail' + index);
				if (mail.hasClass('inactive-mail')) {
					mail.removeClass('inactive-mail');
					mail.addClass('active-mail');
				}
				else {
					mail.removeClass('active-mail');
					mail.addClass('inactive-mail');
				}
			};

			/**
			 * Saves the message as read.
			 */
			self.logMail = function(mailId) {
				dataService.postNoteData(mailId, function(result) {
					if (!result.result) {
						// If for some reason the server is unavailable.
						popupService.alertPopup(languageService.getText('mailError'));
					}
					getMails();
				});
			};

			/**
			 * Loads messages for user by using the screen number.
			 */
			function getMails() {
				dataService.getUser(storageService.persistentUserData.userScreenNumber, function(result) {
					self.mails = result.UserMessages;
					countNewMails(self.mails);
				});
			}

			/**
			 * Gets messages that has not been read.
			 */
			function countNewMails(mails) {
				self.newMailCount = 0;
				for (var i = 0; i < mails.length; i++) {
					if (mails[i].IsRead === false) {
						self.newMailCount++;
					}
				}
			}

		});
