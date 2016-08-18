var player;

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

function onPlayerReady(event) {
    player = event.target;
    playVideo();
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        onPlayerReady(event);
    }
}

function destroyPlayer() {
    if (hasPlayer() && player.a) {
        player.destroy();
    }
}

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