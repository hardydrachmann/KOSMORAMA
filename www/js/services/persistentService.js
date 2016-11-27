var persistentService = function() {

	// Write to json file.
	function storeItem(key, value, callback) {
		// initPersistentJsonFile();
		readPersistentJsonFile(function(data) {
			data[key] = value;
			$window.resolveLocalFileSystemURL(persistentFilePath, function(dir) {
				var path = dir.toInternalURL();
				$cordovaFile.writeFile(path, fileName, data, true)
					.then(function(success) {
						if (callback) {
							callback();
						}
					}, function(error) {
						console.log('storeItem error', error);
					});
			}, function(error) {
				console.log('resolveLocalFileSystemURL', error);
			});
		});
	}

	// Read from json file.
	function loadItem(key, callback) {
		// initPersistentJsonFile();
		readPersistentJsonFile(function(data) {
			console.log('loadItem', data[key]);
			callback(data[key]);
		});
	}

	// Read from json file.
	function readPersistentJsonFile(callback) {
		$window.resolveLocalFileSystemURL(persistentFilePath, function(dir) {
			var path = dir.toInternalURL();
			$cordovaFile.readAsText(path, fileName)
				.then(function(success) {
					if (success) {
						callback(JSON.parse(success));
					} else {
						callback({});
					}
				}, function(error) {
					console.log('read error', error);
				});
		});
	}

	// Create 'json' directory if it does not exist, and create json file.
	function initPersistentJsonFile() {
		$cordovaFile.createDir(deviceApplicationPath, 'json').then(createPersistentJsonFile, createPersistentJsonFile);
	}

	// Create json file in 'json' directory.
	function createPersistentJsonFile() {
		$cordovaFile.createFile(persistentFilePath, fileName, true).then(function(success) {}, function(error) {
			console.log('createFile error', error);
		});
	}

};

angular.module('virtualTraining').service('persistentService', persistentService);