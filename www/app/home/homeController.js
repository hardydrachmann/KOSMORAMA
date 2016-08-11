
angular.module('kosmoramaApp').controller('HomeController', function($scope, $state, $ionicHistory, dataService, loadingService) {

  $scope.mails = [];
  $scope.hasMail = false;

  var getMails = function() {
    loadingService.loaderShow();
    dataService.getUser($scope.userScreenNumber, function(result) {
      console.log('user1: ', $scope.userScreenNumber);
      console.log('user2: ', result);
      $scope.mails = result.UserMessages;
      console.log('mails: ', result.UserMessages);
      $scope.hasMail = $scope.newMail($scope.mails) > 0;
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
    } else {
      mail.removeClass('active-mail');
      mail.addClass('inactive-mail');
    }
  };

  $scope.logMail = function(index) {
    console.log($scope.mails[index]);
  };

  $scope.newMail = function(mails) {
    var count = 0;
    console.log('mails: ', mails);
    console.log('mailsene: ', mails.length);
    for (var i = 0; i < mails.length; i++) {
      if (mails[i].IsRead === false) {
        count++;
      }
    }
    console.log('newMail: ', count);
    $scope.newMailCount = count;
    return count;
  };

});
