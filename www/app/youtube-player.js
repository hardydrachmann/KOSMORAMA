var player;
var id = 'gC7q17VoB6M';

// Pass video id as parameter.
function createPlayer() {
    if (hasPlayer()) {
        player = new YT.Player('yt-player', {
            height: '390',
            width: '640',
            videoId: id,
            events: {
                'onReady': onPlayerReady
            }
        });
    }
}

function onPlayerReady(event) {
    player = event.target;
    player.playVideo();
}

function destroyPlayer() {
    if (hasPlayer() && player.a) {
        player.destroy();
    }
}

function hasPlayer() {
    return $('#yt-player').length > 0;
}