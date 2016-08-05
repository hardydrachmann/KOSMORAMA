// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('kosmoramaApp', ['ionic'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.tabs.style('standard');

    $stateProvider

        .state('home', {
        url: '/home',
        templateUrl: 'app/home/home.html',
        controller: 'HomeController'
    })

    .state('help', {
        url: '/help',
        templateUrl: 'app/help/help.html'
    })

    .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html'
    })

    .state('trainingPlan', {
        url: '/trainingPlan',
        templateUrl: 'app/trainingPlan/trainingPlan.html',
        controller: 'TrainingPlanController'
    })

    .state('language', {
        url: '/language',
        templateUrl: 'app/language/language.html'
    })

    .state('trainingInstruction', {
        url: '/trainingInstruction',
        templateUrl: 'app/trainingInstruction/trainingInstruction.html',
        controller: 'TrainingInstructionController'
    });

    $urlRouterProvider.otherwise('/login');
});
