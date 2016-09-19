angular
    .module('kosmoramaApp')
    .directive('wdHeader', function() {
        return {
            templateUrl: 'header.html',
            scope: {
                title: '='
            }
        };
    });