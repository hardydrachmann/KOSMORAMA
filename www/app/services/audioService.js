// This is a service which can play and stop playback of audio files.

angular.module('kosmoramaApp').service('audioService', function($cordovaMedia, $cordovaNativeAudio, loadingService) {

  var audioPlaying = null;

  this.playURL = function(source) {
    if (audioPlaying !== null) {
      audioPlaying.stop();
    }
    var audio = new Media(source, null, null, mediaStatusCallback);
    audioPlaying = audio;
    audio.play(audio);
  };
  var mediaStatusCallback = function(status) {
    if (status == 1) {
      loadingService.loaderShow();
    } else {
      loadingService.loaderHide();
    }
  };

  this.stop = function() {
    audioPlaying.stop();
  };

  this.playLocal = function(audioFile) {
    if (audioFile) {
      $cordovaNativeAudio.preloadSimple(audioFile, 'app/audio/' + audioFile + '.mp3');
      $cordovaNativeAudio.play(audioFile)
        .then(function(msgOK) {
          console.log(msgOK);
        })
        .catch(function(msgError) {
          console.error(msgError);
        });
    }
  };

});
