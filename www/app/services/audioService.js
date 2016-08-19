// This is a service which can play and stop playback of audio files (DOES NOT WORK IN BROWSER, TEST ON DEVICE ONLY!).

angular.module('kosmoramaApp').service('audioService', function($cordovaMedia, loadingService) {

  var audioPlaying = null;

  this.stopAudio = function() {
    audioPlaying.stop();
    audioPlaying.release();
  };

  this.playAudio = function(source, callback) {
    if (audioPlaying !== null) {
      this.stopAudio();
    }
    var audio = new Media(source, function() {
      if (callback) {
        callback();
      }
      this.stopAudio();
    }, null, mediaStatusCallback);
    audioPlaying = audio;
    audio.play();
  };

  var mediaStatusCallback = function(status) {
    if (status == 1) {
      loadingService.loaderShow();
    } else {
      loadingService.loaderHide();
    }
  };

});
