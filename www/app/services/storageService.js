angular
	.module('kosmoramaApp')
	.service('storageService', function($window) {

		/**
		 * Print completed training from local storage.
		 */
		this.printStorage = function() {
			console.log('Completed data from local storage:', this.getCompleted());
		};

		this.persistentUserData = {
			userScreenNumber: '',
			language: '',
			allowMessage: false,
			training: []
		};

		this.proceduralUserData = {
			isLastPassItem: false,
			currentTraining: {},
			passData: {
				trainingId: 0,
				sessionOrderNumber: 0,
				painLevel: null,
				message: null
			}
		};

		this.temporaryTimerData = {
			currentSet: 0,
			setsRemaining: 0,
			isPauseNext: true,
			counter: 0,
			progress: 0
		};

		var passCount = 0;
		this.completed = [];

		/**
		 * Get the completed trainings from local storage.
		 */
		this.getCompleted = function() {
			if (!this.completed.length) {
				var stored = $window.localStorage['kosmoramaCompleted'];
				if (stored) {
					stored = JSON.parse(stored);
					this.completed = stored;
				}
			}
			return this.completed;
		};

		/**
		 * Get the selected language from local storage.
		 */
		this.getSelectedLanguage = function() {
			if (this.persistentUserData.language) {
				return this.persistentUserData.language;
			}
			var language = $window.localStorage['kosmoramaLang'];
			if (language) {
				this.persistentUserData.language = language;
				return language;
			}
			return '';
		};

		/**
		 * Checks the current selected language (if it is 'en_US', change it to 'en_GB'), then return it.
		 */
		this.getCorrectedLanguageString = function() {
			var language = this.getSelectedLanguage();
			return this.getCorrectLanguageStringFromInput(language);
		};

		/**
		 *  Checks the current selected language from a string input (if it is 'en_US', change it to 'en_GB'), then return it.
		 */
		this.getCorrectLanguageStringFromInput = function(language) {
			if (language === 'en_US') {
				language = 'en_GB';
			}
			return language.replace('_', '-');
		};

		/**
		 * Set the selected language chosen by the user.
		 */
		this.setSelectedLanguage = function(language) {
			this.persistentUserData.language = language;
			$window.localStorage['kosmoramaLang'] = language;
		};

		/**
		 * Get the user screen number from the local storage.
		 */
		this.getUserScreenNumber = function() {
			if (this.persistentUserData.userScreenNumber) {
				return this.persistentUserData.userScreenNumber;
			}
			var key = $window.localStorage['kosmoramaKey'];
			var encryptedId = $window.localStorage['kosmoramaId'];
			if (key && encryptedId) {
				var decryptedId = sjcl.decrypt(key, encryptedId);
				this.persistentUserData.userScreenNumber = decryptedId;
				return decryptedId;
			}
			return '';
		};

		/**
		 * Set the user screen number of the current user by encrypting it and storing it locally.
		 */
		this.setUserScreenNumber = function(number) {
			var key = getRandomKey();
			var id = sjcl.encrypt(key, number);
			$window.localStorage['kosmoramaKey'] = key;
			$window.localStorage['kosmoramaId'] = id;
			this.persistentUserData.userScreenNumber = number;
		};

		/**
		 * Access whether the user is allowed to send messages to the therapist.
		 */
		this.getAllowMessage = function() {
			this.persistentUserData.allowMessage = $window.localStorage['kosmoramaNote'];
			return this.persistentUserData.allowMessage;
		};

		/**
		 * Alter whether the current user is allowed to send messages to the therapist.
		 */
		this.setAllowMessage = function(allow) {
			this.persistentUserData.allowMessage = allow;
			$window.localStorage['kosmoramaNote'] = allow;
		};

		/**
		 * Clear all persistent user data from the device.
		 */
		this.clearPersistentData = function() {
			$window.localStorage.removeItem('kosmoramaId');
			$window.localStorage.removeItem('kosmoramaKey');
			$window.localStorage.removeItem('kosmoramaLang');
			$window.localStorage.removeItem('kosmoramaNote');
		};

		/**
		 * Clear completed training data from local storage.
		 */
		this.clearTrainingData = function() {
			$window.localStorage.removeItem('kosmoramaCompleted');
			this.persistentUserData.training = [];
			this.completed = [];
		};

		/**
		 * Upon completing a training, it's kept in the completed trainings array.
		 * Takes into account that there might be pass headers in the list.
		 */
		this.complete = function(trainingReport) {
			if (!this.completed[passCount]) {
				this.completed[passCount] = getTemplate();
			}
			this.completed[passCount].reports.push(trainingReport);
			if (this.proceduralUserData.isLastPassItem) {
				this.persistentUserData.training.shift();
				this.persistentUserData.training.shift();
			}
			else {
				this.persistentUserData.training.splice(1, 1);
			}
		};

		/**
		 * Save the current pass data in local storage.
		 */
		this.retainCurrentPassData = function() {
			if (!this.completed[passCount]) {
				console.log('Pretty sure this is not ever supposed to happen!');
				this.completed[passCount] = getTemplate();
			}
			this.completed[passCount].passData = this.proceduralUserData.passData;
			this.proceduralUserData.passData = null;
			$window.localStorage['kosmoramaCompleted'] = JSON.stringify(this.completed);
			passCount++;
		};

		/**
		 * Shuffle the persistent user data object to the next training item in line.
		 * Also create procedural data points, if next training is available.
		 * Takes into account that there might be pass headers in the list.
		 */
		this.nextTraining = function() {
			// Is this the last pass item?
			var isLastItem = this.persistentUserData.training[2] == undefined;
			if (!isLastItem) {
				isLastItem = !isTrainingItem(this.persistentUserData.training[2]);
			}
			this.proceduralUserData.isLastPassItem = isLastItem;
			// Assess the current training item.
			this.proceduralUserData.currentTraining = this.persistentUserData.training[1];
			// Prepare the data for the current training pass.
			if (this.persistentUserData.training.length) {
				this.proceduralUserData.passData = {
					trainingId: this.persistentUserData.training[1].TrainingId,
					sessionOrderNumber: this.persistentUserData.training[1].SessionOrderNumber,
					painLevel: null,
					message: null
				};
				return this.persistentUserData.training;
			}
			return [];
		};

		/**
		 * Get a new clone of a training pass template.
		 */
		var getTemplate = function() {
			return {
				reports: [],
				passData: {
					trainingId: 0,
					sessionOrderNumber: 0,
					painLevel: null,
					message: null
				}
			};
		};

		/**
		 * Determine whether the item is a training item.
		 */
		var isTrainingItem = function(item) {
			return item.hasOwnProperty('ExerciseId');
		};

		var minASCII = 33;
		var maxASCII = 126;
		/**
		 * Return a random key generated from a set of ASCII characters, to use with the sjcl encryption-process.
		 */
		var getRandomKey = function() {
			var key = "";
			for (var i = 0; i < 10; i++) {
				var random = minASCII + (Math.random() * (maxASCII - minASCII));
				key += String.fromCharCode(Math.ceil(random));
			}
			return key;
		};

		/* Not yet implemented section */
		this.setTemporaryTimerData = function(timerData) {
			this.temporaryTimerData = timerData;
			window.localStorage.setItem('timer', JSON.stringify(this.temporaryTimerData));
		};

		this.getTemporaryTimerData = function() {
			var data = window.localStorage.getItem('timer');
			return JSON.parse(data);
		};

		this.removeTemporaryTimerData = function() {
			window.localStorage.removeItem('timer');
		};

	});
