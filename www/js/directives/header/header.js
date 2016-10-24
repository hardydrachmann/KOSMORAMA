var wdHeader = function() {
    return {
        templateUrl: 'js/directives/header/header.html',
        scope: {
            title: '='
        }
    };
};

angular.module('virtualTrainingApp').directive('wdHeader', wdHeader);