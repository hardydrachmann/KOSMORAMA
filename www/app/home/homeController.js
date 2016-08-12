angular.module('kosmoramaApp').controller('HomeController', function($scope, $state, $ionicHistory, popupService, dataService, loadingService) {

    $scope.mails = [];

    var getMails = function() {
        loadingService.loaderShow();
        dataService.getUser($scope.userScreenNumber, function(result) {
            $scope.mails = result.UserMessages;
            loadingService.loaderHide();
        });
    };
    getMails();

    $scope.closeMailView = function() {
        $state.go($ionicHistory.backView().stateName);
    };

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

    $scope.logMail = function(mailId) {
        dataService.postNoteData(mailId, function(result) {
            // If for some reason the server is unavailable.
            if (!result.result) {
                popupService.alertPopup($scope.getText('mailError'));
            }
            getMails();
        });
    };

    $scope.newMail = function(mails) {
        var count = 0;
        for (var i = 0; i < mails.length; i++) {
            if (mails[i].IsRead === false) {
                count++;
            }
        }
        $scope.newMailCount = count;
        return count;
    };

});
