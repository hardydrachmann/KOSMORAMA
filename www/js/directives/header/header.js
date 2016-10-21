angular
    .module('virtualTrainingApp')
    .directive('wdHeader', function() {
        return {
            templateUrl: 'js/directives/header/header.html',
            scope: {
                title: '='
            }
        };
    });