// This is a data Service factory which get and post data in Api-service.

angular.module('kosmoramaApp').service('dataService', function($http) {

    var url = 'http://176.62.203.178/Comm/DataService';
    //var url = 'http://localhost:8080/Comm/DataService';
    var userScreenNumber = 'AA10';

    // This function gets a user by the Screen number entered on login.
    this.getUser = function(userScreenNumber, callback) {

        //Preparing the content for the header required to get user in Api-service
        var content = {
            id: '0',
            method: 'GetUsers',
            params: userScreenNumber
        };

        var dataString = JSON.stringify(content); //Converting javascript to Json

        // Doing the http post request
        $http({
            method: 'POST',
            url: url,
            data: dataString,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(userdata) {
            callback(userdata.result);
        }).error(function(data, status, headers, config) {
            console.log('testfail', data, status, headers, config);
            callback(null);
        });

    };


    //This function gets the trainig for a user on the current day.
    this.getTraining = function(UserId, callback) {

        var content = {
            id: '1',
            method: 'GetScheduledTrainingAndQuestionnaires',
            params: UserId
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
            callback(trainingData.result);
        }).error(function(trainingData, status, headers, config) {
            console.log('testfail', trainingData, status, headers, config);
            callback('error');
        });

    };

    //This function post traning data.
    //Still needs work
    this.postData = function(id, callback) {
        var traningReport = [{
            "PlanExerciseId": 250575,
            "Id": 212031,
            "Exercise": "100",
            "Score": 80,
            "Time": 60.0,
            "Repetitions": [],
            "Questions": null
        }, ];

        var content = {
            id: '2',
            method: 'PostTrainingReport',
            params: traningReport
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
            console.log('callbackData', trainingData);
            callback(trainingData);
        }).error(function(trainingData, status, headers, config) {
            console.log('testfail', trainingData, status, headers, config);
            callback('error');
        });
    };
});
