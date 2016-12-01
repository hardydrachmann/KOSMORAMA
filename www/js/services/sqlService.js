var sqlService = function(deviceService) {
	var service = this;
	var db;

	(function init() {
		try {
			db = openDatabase('VTDB', '1.0', 'Virtual Training persistent data.', 1024 * 1024 * 2);
			console.log('Using WebSQL:', db);
		} catch (error) {
			console.log('Database could not be opened.', error);
		}
		// Create database tables.
		db.transaction(function(tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS Key (value TEXT)', [], onSuccess, onError);
			tx.executeSql('CREATE TABLE IF NOT EXISTS UserData (value TEXT)', [], onSuccess, onError);
			tx.executeSql('CREATE TABLE IF NOT EXISTS Completed (value TEXT)', [], onSuccess, onError);
		});
	})();

	service.store = function(key, value, callback) {
		service.remove(key, function() {
			db.transaction(function(tx) {
				//				console.log('Storing...')
				var statement = 'INSERT INTO ' + key + ' (value) VALUES (?)';
				tx.executeSql(statement, [value], function(tx) {
					onSuccess(arguments);
					if (callback) {
						callback();
					}
				}, onError);
			});
		});
	};

	service.load = function(key, callback) {
		db.transaction(function(tx) {
			//			console.log('Loading...')
			var statement = 'SELECT * FROM ' + key;
			tx.executeSql(statement, [], function(tx, resultSet) {
				onSuccess(arguments);
				if (resultSet.rows.length) {
					if (deviceService.isAndroid()) {
						callback(resultSet.rows[0].value);
					} else {
						callback(resultSet.rows.item(0).value);
					}
				}
			}, onError);
		});
	};

	service.remove = function(key, callback) {
		db.transaction(function(tx) {
			//			console.log('Deleting...')
			var statement = 'DELETE FROM ' + key;
			tx.executeSql(statement, [], function(tx) {
				if (callback) {
					callback();
				}
			}, onError);
		});
	};

	function onSuccess() {
		//		console.log('Transaction completed successfully.', arguments[0]);
	}

	function onError(error) {
		console.error('Service encountered an error.', error);
	}

};

angular.module('virtualTrainingApp').service('sqlService', sqlService);
