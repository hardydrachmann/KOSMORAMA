angular.module('kosmoramaApp').controller('HomeController', function($scope, $state, dataService) {
    $scope.mails = [];
    $scope.hasMail = false;

    var getMails = function() {
        // Produce mock data.
        for (var i = 0; i < 10; i++) {
            $scope.mails.push({
                title: 'title' + i,
                message: 'message' + i,
                timestamp: '2016'
            });
        }
        $scope.hasMail = $scope.mails.length > 0;
    };
    getMails();

    $scope.toggleMailDisplay = function(index) {
        var mail = $('#mail' + index);
        if (mail.hasClass('inactive-mail')) {
            mail.removeClass('inactive-mail');
            mail.addClass('active-mail');
        }
        else {
            mail.removeClass('active-mail');
            mail.addClass('inactive-mail');
        }
    };

    $scope.logMail = function(index) {
        console.log($scope.mails[index]);
    };
});
