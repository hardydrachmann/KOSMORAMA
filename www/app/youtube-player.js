var player;

/**
 * If possible, create the youtube player, playing the specified video.
 * This player has no controls.
 */
function createPlayer(video) {
    if (hasPlayer()) {
        player = new YT.Player('yt-player', {
            height: '390',
            width: '640',
            videoId: video,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            },
            playerVars: {
                controls: 0
            }
        });
    }
}

/**
 * Whenever the player is ready, run this method.
 */
function onPlayerReady(event) {
    player = event.target;
    playVideo();
    playerReadyEvent();
    playerReadyEvent = function() {};
}

var playerReadyEvent = function() {};

function setPlayerReadyHandler(handler) {
    playerReadyEvent = handler;
}

/**
 * Whenever the player's state changes, run this method.
 */
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        onPlayerReady(event);
    }
}

/**
 * Destroy the player, if it exists.
 */
function destroyPlayer() {
    if (hasPlayer() && player.a) {
        player.destroy();
    }
}

/**
 * Check whether there is an element with the "yt-player" id on the page.
 */
function hasPlayer() {
    return $('#yt-player').length > 0;
}

function pauseVideo() {
    if (hasPlayer() && player.a) {
        player.pauseVideo();
    }
}

function playVideo() {
    if (hasPlayer() && player.a) {
        player.playVideo();
    }
}
