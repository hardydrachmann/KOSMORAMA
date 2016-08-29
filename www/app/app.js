// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('kosmoramaApp', ['ionic', 'ngCordova', 'angular-svg-round-progressbar'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the            accessory bar above the keyboard
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
    $ionicPlatform.registerBackButtonAction(function(e) {
        e.preventDefault();
        return false;
    }, 101);
})

/**
 * Binds our views to our controllers, allowing for the use of SPA(Single Page Application)
 */
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
        controller: 'TrainingController',
        cache: false
    })

    .state('trainingDemo', {
        url: '/trainingDemo',
        templateUrl: 'app/training/trainingDemo.html',
        controller: 'TrainingController',
        cache: false
    })

    .state('training', {
        url: '/training',
        templateUrl: 'app/training/training.html',
        controller: 'TrainingController',
        cache: false
    })

    .state('feedback', {
        url: '/feedback',
        templateUrl: 'app/feedback/feedback.html',
        controller: 'FeedbackController',
        cache: false
    })

    .state('painLevel', {
        url: '/painLevel',
        templateUrl: 'app/feedback/painLevel.html',
        controller: 'NotesController',
        cache: false
    })

    .state('notes', {
        url: '/notes',
        templateUrl: 'app/feedback/notes.html',
        controller: 'NotesController',
        cache: false
    });

    $urlRouterProvider.otherwise('/login');
});
