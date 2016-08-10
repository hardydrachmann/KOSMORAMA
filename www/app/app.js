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
            navigator.splashscreen.hide();
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
    $ionicPlatform.registerBackButtonAction(function(e) {
        e.preventDefault();
        return false;
    }, 101);
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.tabs.style('standard');

    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'app/home/home.html',
        controller: 'HomeController'
    })

    .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html'
    })

    .state('language', {
        url: '/language',
        templateUrl: 'app/language/language.html'
    })

    .state('help', {
        url: '/help',
        templateUrl: 'app/help/help.html'
    })

    .state('mail', {
        url: '/mail',
        templateUrl: 'app/home/mail.html',
        controller: 'HomeController'
    })

    .state('trainingPlan', {
        url: '/trainingPlan',
        templateUrl: 'app/training/trainingPlan.html',
        controller: 'TrainingController'
    })

    .state('trainingDemo', {
        url: '/trainingDemo',
        templateUrl: 'app/training/trainingDemo.html',
        controller: 'TrainingController'
    })

    .state('training', {
        url: '/training',
        templateUrl: 'app/training/training.html',
        controller: 'TrainingController'
    })

    .state('feedback', {
        url: '/feedback',
        templateUrl: 'app/feedback/feedback.html',
        controller: 'FeedbackController'
    });

    $urlRouterProvider.otherwise('/login');
});
