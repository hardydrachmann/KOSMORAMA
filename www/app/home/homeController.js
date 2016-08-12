angular.module('kosmoramaApp').controller('HomeController', function($scope, $state, $ionicHistory, dataService, loadingService) {

  $scope.mails = [];
  $scope.hasMail = false;

  $scope.dateLatestMsg = new Date();
  $scope.dateNow = new Date();

  var getMails = function() {
    loadingService.loaderShow();
    dataService.getUser($scope.userScreenNumber, function(result) {
      console.log('user1: ', $scope.userScreenNumber);
      console.log('user2: ', result);
      $scope.mails = result.UserMessages;
      console.log('mails: ', result.UserMessages);
      $scope.hasMail = $scope.newMail($scope.mails) > 0;
      loadingService.loaderHide();
      $scope.dateLatestMsg = new Date(result.UserMessages[result.UserMessages.length -1].Time);
      compareMsgDate();
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


// still needs fixing this function checks dates
  var compareMsgDate = function(){
    // var d = new Date();
    //d.setDate(d.getDate()-5);
    var checkDate = $scope.dateNow;
    checkDate.setDate(checkDate.getDate()-7);
    if($scope.dateLatestMsg <  checkDate){
      console.log('true', checkDate);
      return true;
    }else{
    console.log('false', checkDate);
    return false;
  }
  };


});
