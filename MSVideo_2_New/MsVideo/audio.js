        // Global variable to track current file name.
        var currentFile = "";
 
        function playAudio() {
            // Check for audio element support.
            if (window.HTMLAudioElement) {
                try {
                    var oAudio = document.getElementById('myaudio');
                    var btn = document.getElementById('play3'); 
                    var audioURL = document.getElementById('audiofile2'); 

                    //Skip loading if current file hasn't changed.
                    if (audioURL.innerHTML !== currentFile) {
                        oAudio.src = audioURL.innerHTML;
                        currentFile = audioURL.innerHTML;                       
                    }
                    /*
                    if (audioURL.value !== currentFile) {
                        oAudio.src = audioURL.value;
                        currentFile = audioURL.value;                       
                    }*/
                    // Tests the paused attribute and set state. 
                    if (oAudio.paused) {
                        oAudio.play();
                        btn.textContent = "Pause";
                        videoPl();
                    }
                    else {
                        oAudio.pause();
                        btn.textContent = "Play";
                        videoPa();
                    }
                }
                catch (e) {
                    // Fail silently but show in F12 developer tools console
                     if(window.console && console.error("Error:" + e));
                }
            }
        }
             // Rewinds the audio file by 30 seconds.

        function rewindAudio() {
             // Check for audio element support.
            if (window.HTMLAudioElement) {
                try {
                    var oAudio = document.getElementById('myaudio');
                    oAudio.currentTime -= 30.0;
                }
                catch (e) {
                    // Fail silently but show in F12 developer tools console
                     if(window.console && console.error("Error:" + e));
                }
            }
        }

             // Fast forwards the audio file by 30 seconds.

        function forwardAudio() {

             // Check for audio element support.
            if (window.HTMLAudioElement) {
                try {
                    var oAudio = document.getElementById('myaudio');
                    oAudio.currentTime += 30.0;
                }
                catch (e) {
                    // Fail silently but show in F12 developer tools console
                     if(window.console && console.error("Error:" + e));
                }
            }
        }

             // Restart the audio file to the beginning.

        function restartAudio() {
             // Check for audio element support.
            if (window.HTMLAudioElement) {
                try {
                    var oAudio = document.getElementById('myaudio');
                    oAudio.currentTime = 0;
                }
                catch (e) {
                    // Fail silently but show in F12 developer tools console
                     if(window.console && console.error("Error:" + e));
               }
            }
        }
