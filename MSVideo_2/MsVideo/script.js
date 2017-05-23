var player,
    time_update_interval = 0;
var sTime = "";
var eTime = "";

  function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        //playerVars: {'controls':0},
        events: {
          'onReady': initialize,
          'onStateChange': onPlayerStateChange
        }
    });
  }
  function onPlayerReady(event) {
    document.getElementById('video-placeholder').style.borderColor = '#FF6D00';
  }
  function changeBorderColor(playerStatus) {
    var color;
    if (playerStatus == -1) {
      color = "#37474F"; // unstarted = gray
      console.log("unstarted");
    } else if (playerStatus == 0) {
      color = "#FFFF00"; // ended = yellow
      videoPa();
      console.log("end");
    } else if (playerStatus == 1) {
      color = "#33691E"; // playing = green
      console.log("playing");
      videoPl();
    } else if (playerStatus == 2) {
      color = "#DD2C00"; // paused = red
      videoPa();
      console.log("pause");
    } else if (playerStatus == 3) {
      color = "#AA00FF"; // buffering = purple
      console.log("buffering");
    } else if (playerStatus == 5) {
      color = "#FF6DOO"; // video cued = orange
      console.log("cued");
    }
    if (color) {
      document.getElementById('video-placeholder').style.borderColor = color;
    }
  }
  function onPlayerStateChange(event) {
    changeBorderColor(event.data);
  }

function initialize(){

    // Update the controls on load
    updateTimerDisplay();
    updateProgressBar();

    // Clear any old interval.
    clearInterval(time_update_interval);

    // Start interval to update elapsed time display and
    // the elapsed part of the progress bar every second.
    time_update_interval = setInterval(function () {
        updateTimerDisplay();
        updateProgressBar();
    }, 1000);


    $('#volume-input').val(Math.round(player.getVolume()));
}


// This function is called by initialize()
function updateTimerDisplay(){
    // Update current time text display.
    $('#current-time').text(formatTime( player.getCurrentTime() ));
    $('#duration').text(formatTime( player.getDuration() ));
}


// This function is called by initialize()
function updateProgressBar(){
    // Update the value of our progress bar accordingly.
    $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);
}


// Progress bar

/*
$('#progress-bar').on('mouseup touchend', function (e) {

    // Calculate the new time for the video.
    // new time in seconds = total duration in seconds * ( value of range input / 100 )
    var newTime = player.getDuration() * (e.target.value / 100);

    // Skip video to new time.
    player.seekTo(newTime);

});*/


// Playback

$('#play').on('click', function () {
    player.playVideo();
    videoPl();
});


$('#pause').on('click', function () {
    player.pauseVideo();
    videoPa();
});

function videoPl(){
    sTime = Date.now();
	$("#starts").val(new Date().toISOString().slice(0, 19).replace('T', ' '));
	$("#ends").val("");
	$("#timespend").val("");
}

function videoPa(){
    eTime = Date.now();
	$("#ends").val(new Date().toISOString().slice(0, 19).replace('T', ' '));
	$("#timespend").val(eTime-sTime);  
	sendCommand2("addData");
	sendCommand4("getReport");//getting report
}
// Sound volume

$('#mute-toggle').on('click', function() {
    var mute_toggle = $(this);

    if(player.isMuted()){
        player.unMute();
        mute_toggle.text('volume_up');
    }
    else{
        player.mute();
        mute_toggle.text('volume_off');
    }
});

$('#volume-input').on('change', function () {
    player.setVolume($(this).val());
});


// Other options

$('#speed').on('change', function () {
    player.setPlaybackRate($(this).val());
});

$('#quality').on('change', function () {
    player.setPlaybackQuality($(this).val());
});


// Playlist

$('#next').on('click', function () {
    player.nextVideo()
});

$('#prev').on('click', function () {
    player.previousVideo()
});


// Load video

$(document).on("click", ".btns", function(sender) {

    var url = $(this).attr('data-video-id');
    $("#sourceid").val($(this).attr("id"));
    player.cueVideoById(url);
    $("#audiofile").val("Media/"+$(this).attr("data-video-id"));//for audio

});


// Helper Functions

function formatTime(time){
    time = Math.round(time);

    var minutes = Math.floor(time / 60),
        seconds = time - minutes * 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    return minutes + ":" + seconds;
}


$('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
});