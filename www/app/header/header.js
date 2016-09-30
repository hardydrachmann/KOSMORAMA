angular
    .module('kosmoramaApp')
    .directive('wdHeader', function() {
        return {
            templateUrl: 'app/header/header.html',
            scope: {
                title: '='
            }
        };
    });