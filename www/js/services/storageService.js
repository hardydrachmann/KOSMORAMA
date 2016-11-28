// This is a service which can save and get needed data onto a physical device.

var storageService = function ($rootScope, $window, $cordovaFile, $interval, deviceService, CacheFactory) {

	const VT = 'VirtualTraining'

	var fileName = 'persistent.json';
	var persistentFilePath;
	var deviceApplicationPath;

	//	document.addEventListener('deviceready', function () {
	//		var start = performance.now();
	//		console.log('@ Putting data into cache');
	//		var testCache = CacheFactory('test');
	//		testCache.put('data', {
	//			name: 'test'
	//		});
	//		var done = performance.now();
	//		var putTime = +(done - start);
	//		console.log('@ Data stored in: ' + putTime.toFixed(2) + 'ms');
	//		console.log(testCache.get('data'));
	//		var end = performance.now();
	//		var getTime = +(end - start - putTime);
	//		console.log('@ Data read in: ' + getTime.toFixed(2) + 'ms');
	//	});

	//	StorageService initialization for the deprecated persistent.json method.
	//		document.addEventListener('deviceready', function () {
	//			deviceApplicationPath = deviceService.getDeviceApplicationPath();
	//			persistentFilePath = deviceApplicationPath + 'json';
	//			initPersistentJsonFile();
	//			verifyData();
	//		}, false);

	/**
	 * User meta data.
	 */
	var userData = {};

	/**
	 * Procedural training data.
	 */
	var trainingData = {};

	/**
	 * List of completed training and pass data.
	 */
	this.completed = [];

	/**
	 * The counter for the passes. Holds the current pass count.
	 */
	this.passCount = 0;

	/**
	 * Get a new clone of a user data template.
	 */
	var getUserDataTemplate = function () {
		return {
			userScreenNumber: '',
			language: '',
			allowMessage: false,
			training: []
		};
	};

	/**
	 * Get a new clone of a training data template.
	 */
	var getTrainingDataTemplate = function () {
		return {
			isLastPassItem: false,
			currentTraining: {},
			passData: {
				trainingId: 0,
				sessionOrderNumber: 0,
				painLevel: null,
				message: null
			}
		};
	};

	/**
	 * Get a new clone of a completed training pass template.
	 */
	var getCompletedTemplate = function () {
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
	 * Verify that the service has data. If not acquire it from local storage.
	 */
	var verifyData = function () {
		//		console.log('Verifying training data', trainingData);
		if (isEmptyObject(trainingData)) {
			//			console.log('Verifying user data', userData);
			if (isEmptyObject(userData)) {
				loadUserData();
			}
			if (userData.training) {
				initTrainingData();
			} else {
				console.warn('User data initialized, but training data missing. Initializing training data.');
			}
		}
	};

	/**
	 * Load and decrypt user data from local storage.
	 */
	var loadUserData = function () {
		var decryptionKey = $window.localStorage.getItem(VT + 'Key');
		var encryptedData = $window.localStorage.getItem(VT + 'UserData');
		if (decryptionKey && encryptedData) {
			var decryptedData = sjcl.decrypt(decryptionKey, encryptedData);
			userData = JSON.parse(decryptedData);
			// console.log('Loaded user data:', userData);
		}
		//	var decryptionKey, encryptedData;
		//	loadItem('Key', function (data) {
		//		decryptionKey = data;
		//		loadItem('UserData', function (data) {
		//			encryptedData = data;
		//			if (decryptionKey && encryptedData) {
		//				var decryptedData = sjcl.decrypt(decryptionKey, encryptedData);
		//				userData = JSON.parse(decryptedData);
		//				$rootScope.$broadcast('initEvent');
		//			}
		//		});
		//	});
	};

	/**
	 * Initialize the training data from the user meta data and prepare the first training pass.
	 */
	var initTrainingData = function () {
		console.log('Ready to init:', userData);
		trainingData = getTrainingDataTemplate();
		var n = userData.training.length;
		if (n > 1) {
			trainingData.currentTraining = userData.training[1];
			trainingData.passData.trainingId = userData.training[1].TrainingId;
			trainingData.passData.sessionOrderNumber = userData.training[1].SessionOrderNumber;
			var nextItem = userData.training[2];
			if (!nextItem || (nextItem && isTrainingItem(nextItem))) {
				trainingData.isLastPassItem = true;
			}
		} else {
			console.warn('Currently no training data to assign.');
		}
		//		console.log('Initialized training data:', trainingData);
	};

	/**
	 * Encrypt and save user data in local storage.
	 */
	var saveUserData = function () {
		// console.log('Saving user data...:', userData);
		var userDataString = JSON.stringify(userData);
		var encryptionKey = getRandomKey();
		var encryptedData = sjcl.encrypt(encryptionKey, userDataString);
		//		console.log('userDataString', userDataString);
		//		console.log('encryptionKey', encryptionKey);
		//		console.log('encryptedData', encryptedData);
		//		storeItem('Key', encryptionKey, function() {
		//			storeItem('UserData', encryptedData);
		//		});
		$window.localStorage.setItem(VT + 'Key', encryptionKey);
		$window.localStorage.setItem(VT + 'UserData', encryptedData);
	};

	/**
	 * Clear all persistent user data from the device.
	 */
	this.clearUserData = function () {
		//		if (deviceService.device) {
		//			if ($cordovaFile.checkDir(deviceApplicationPath, 'json')) {
		//				$cordovaFile.removeRecursively(deviceApplicationPath, 'json');
		//				var removeInterval = $interval(function() {
		//					if ($cordovaFile.checkDir(deviceApplicationPath, 'json')) {
		//						$interval.cancel(removeInterval);
		//					}
		//				}, 1000);
		//			}
		//		}
		$window.localStorage.removeItem(VT + 'Key');
		$window.localStorage.removeItem(VT + 'UserData');
		userData = {};
	};

	/**
	 * Clear completed training data from local storage.
	 */
	this.clearTrainingData = function () {
		trainingData = {};
		this.completed = [];
		userData.training = [];
		saveUserData();
	};


	// PERSISTENT DATA CALLS:
	/**
	 * Get the selected language from local storage.
	 */
	this.getSelectedLanguage = function () {
		verifyData();
		// console.log('Getting selected language');
		return userData.language;
	};

	/**
	 * Set the selected language chosen by the user.
	 */
	this.setSelectedLanguage = function (language) {
		verifyData();
		// console.log('Setting selected language', language);
		userData.language = language;
		saveUserData();
	};

	/**
	 *  Checks the current selected language from a string input (if it is 'en_US', change it to 'en-GB'), then return it.
	 */
	this.getCorrectLanguageStringFromInput = function (language) {
		if (language) {
			if (language === 'en_US') {
				language = 'en_GB';
			}
			return language.replace('_', '-');
		}
	};

	/**
	 * Checks the current selected language (if it is 'en_US', change it to 'en-GB'), then return it.
	 */
	this.getCorrectedLanguageString = function () {
		var language = this.getSelectedLanguage();
		return this.getCorrectLanguageStringFromInput(language);
	};

	/**
	 * Get the user screen number from the local storage.
	 */
	this.getUserScreenNumber = function (back) {
		verifyData();
		console.log('Getting userScreenNumber', userData.userScreenNumber);
		return userData.userScreenNumber;
	};

	/**
	 * Set the user screen number of the current user by encrypting it and storing it locally.
	 */
	this.setUserScreenNumber = function (number) {
		verifyData();
		// console.log('Setting userScreenNumber', number);
		userData.userScreenNumber = number;
		saveUserData();
	};

	/**
	 * Access whether the user is allowed to send messages to the therapist.
	 */
	this.getAllowMessage = function () {
		verifyData();
		// console.log('Getting allowMessage', userData.allowMessage);
		return userData.allowMessage;
	};

	/**
	 * Alter whether the current user is allowed to send messages to the therapist.
	 */
	this.setAllowMessage = function (allow) {
		verifyData();
		// console.log('Setting allowMessage', allow);
		userData.allowMessage = allow;
		saveUserData();
	};

	// PROCEDURAL DATA CALLS:
	/**
	 * Get whether this is the last item in the pass.
	 */
	this.isLastPassItem = function () {
		verifyData();
		// console.log('Getting isLastPassItem', trainingData.isLastPassItem);
		return trainingData.isLastPassItem;
	};

	/**
	 * Get the currently active training.
	 */
	this.getCurrentTraining = function () {
		verifyData();
		// console.log('Getting current Training', trainingData.currentTraining);
		return trainingData.currentTraining;
	};

	/**
	 * Get the currently active pass data.
	 */
	this.getCurrentPassData = function () {
		verifyData();
		// console.log('Getting current PassData', trainingData.passData);
		return trainingData.passData;
	};

	/**
	 * Get the pain level for the currently active pass.
	 */
	this.getCurrentPainLevel = function () {
		verifyData();
		console.log('Getting current Pain Level', trainingData.passData.painLevel);
		return trainingData.passData.painLevel;
	};

	/**
	 * Set the pain level for the currently active pass.
	 */
	this.setCurrentPainLevel = function (level) {
		verifyData();
		//		console.log('Setting current Pain Level', level);
		trainingData.passData.painLevel = level;
	};

	/**
	 * Get the message for the currently active pass.
	 */
	this.getCurrentNotesMessage = function () {
		verifyData();
		// console.log('Getting current Message', trainingData.passData.message);
		return trainingData.passData.message;
	};

	/**
	 * Get the message for the currently active pass.
	 */
	this.setCurrentNotesMessage = function (message) {
		verifyData();
		//		console.log('Setting current Message', message);
		trainingData.passData.message = message;
	};

	/**
	 * Sorting and adding a pass item for each set of training.
	 */
	this.sortTraining = function (data) {
		if (data.length > 0) {
			var setCount = data[0].SessionOrderNumber,
				pass = 1,
				firstTrainingId = data[0].TrainingId;
			for (var i = 0; i < data.length; i++) {
				if (data[i].SessionOrderNumber === setCount || data[i].TrainingId > firstTrainingId) {
					var passHeader = {
						'passTitle': pass++,
						'date': data[i].date
					};
					userData.training.push(passHeader);
					setCount++;
					firstTrainingId = data[i].TrainingId;
				}
				userData.training.push(data[i]);
			}
			initTrainingData();
		} else {
			console.error('No training submitted for sorting.');
		}
	};

	/**
	 * Get the amount of remaining training passes to complete.
	 */
	this.getPassCount = function () {
		var passCount = 0;
		if (userData.training) {
			for (var i = 0; i < userData.training.length; i++) {
				var training = userData.training[i];
				if (!isTrainingItem(training)) {
					var date = new Date(training.date).setHours(0, 0, 0, 0);
					if (date == new Date().setHours(0, 0, 0, 0)) {
						passCount++;
					}
				}
			}
		}
		return passCount;
	};

	/**
	 * Get the completed trainings from local storage.
	 */
	this.getCompleted = function () {
		// console.log('Completed data in memory: ', this.completed);
		if (!this.completed.length) {
			var stored = $window.localStorage.getItem(VT + 'Completed');
			var stored;
			//			loadItem('Completed', function (data) {
			//				stored = data;
			//				console.log('loadItem', stored);
			//			});
			// console.log('Getting completed data as string from storage.', stored);
			if (stored) {
				stored = JSON.parse(stored);
				this.completed = stored;
			}
		}
		// console.log('Returning completed data:', this.completed);
		return this.completed;
	};

	/**
	 * Upon completing a training, it's kept in the completed trainings array.
	 * Takes into account that there might be pass headers in the list.
	 * At the last item in the pass, shift the array twice to remove the header which each pass has.
	 */
	this.complete = function (trainingReport) {
		this.evaluateLastItem();
		if (!this.completed[this.passCount]) {
			this.completed[this.passCount] = getCompletedTemplate();
		}
		this.completed[this.passCount].reports.push(trainingReport);
		if (trainingData.isLastPassItem) {
			userData.training.shift();
			userData.training.shift();
		} else {
			userData.training.splice(1, 1);
		}
	};

	/**
	 * Save the current pass data in local storage.
	 */
	this.retainCurrentPassData = function () {
		console.log('Retaining pass data:', this.completed[this.passCount]);
		if (!this.completed[this.passCount]) {
			console.error('Pretty sure this is not ever supposed to happen!');
		}
		this.completed[this.passCount].passData = trainingData.passData;
		trainingData.passData = {};
		$window.localStorage.setItem(VT + 'Completed', JSON.stringify(this.completed));
		//		storeItem('Completed', JSON.stringify(this.completed));
		trainingData.currentTraining = {};
		this.passCount++;
	};

	/**
	 * Shift the next training item in the persistent user data object to the next item in line.
	 * Also create procedural data points, if next training is available.
	 * Takes into account that there might be pass headers in the list.
	 * Headers take up the first position, so if it's not the last item in the pass,
	 * which is definitely a header in that case.
	 * This is why index 1 and 2 are used as opposed to 0 and 1.
	 */
	this.nextTraining = function () {
		this.evaluateLastItem();
		// Assess the current training item.
		trainingData.currentTraining = userData.training[1];
		// Prepare the data for the current training pass.
		if (userData.training.length) {
			trainingData.passData = {
				trainingId: userData.training[1].TrainingId,
				sessionOrderNumber: userData.training[1].SessionOrderNumber,
				painLevel: null,
				message: null
			};
			console.log('Next training list', userData.training);
			return userData.training;
		}
		return [];
	};

	this.evaluateLastItem = function () {
		// Is this the last pass item?
		var isLastItem = userData.training[2] == undefined;
		if (!isLastItem) {
			isLastItem = !isTrainingItem(userData.training[2]) && isToday(userData.training[1].date);
		}
		trainingData.isLastPassItem = isLastItem;
	}

	/**
	 * Compare the exercise date with current date, and return true if date is the same.
	 */
	function isToday(date) {
		var dateToday = new Date();
		if (date && date.setHours(0, 0, 0, 0) == dateToday.setHours(0, 0, 0, 0)) {
			return true;
		}
		return false;
	};

	/**
	 * Print completed training from local storage.
	 */
	this.printStorage = function () {
		console.log('Completed data in local storage:', this.getCompleted());
		console.log('Persistent user data in memory:', userData);
		console.log('Procedural user data in memory:', trainingData);
	};

	/**
	 * Determine whether the object is an empty object.
	 */
	var isEmptyObject = function (obj) {
		return JSON.stringify(obj) === JSON.stringify({});
	};

	/**
	 * Determine whether the item is a training item.
	 */
	var isTrainingItem = function (item) {
		return item.hasOwnProperty('ExerciseId');
	};

	var minASCII = 33;
	var maxASCII = 126;
	/**
	 * Return a random key generated from a set of ASCII characters, to use with the sjcl encryption-process.
	 */
	var getRandomKey = function () {
		var key = "";
		for (var i = 0; i < 10; i++) {
			var random = minASCII + (Math.random() * (maxASCII - minASCII));
			key += String.fromCharCode(Math.ceil(random));
		}
		return key;
	};
};

angular.module('virtualTrainingApp').service('storageService', storageService);