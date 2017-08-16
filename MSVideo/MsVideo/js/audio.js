// Global variable to track current file name.
var currentFile = "";
var oAudio = document.getElementById('myaudio');
var btn = document.getElementById('play3'); 
			      
var myVar = setInterval(myTimer ,1000);
				
function stopColor() 
{
  clearInterval(myVar);
}			

function myTimer() 
{
  //0:00/NaN:NaN
	document.getElementById("current-time2").innerHTML = formatTime(oAudio.currentTime);
	document.getElementById("duration2").innerHTML = formatTime(oAudio.duration);
	var st = formatTime(oAudio.currentTime);
	var ed = formatTime(oAudio.duration);
	//console.log("durtion:"+ed+", current time:"+st);	
		  			
	//check if end of the audio
	if (st=="0:00"){}
	else if(ed==st)
	{
	  //at the end of video, save record, change to play, clear data
	  //videoPa();
	  oAudio.currentTime = 0;
	  //oAudio.pause();
	  //btn.textContent = "Play";
  	//$("#ends").val("");
	  //$("#timespend").val("");	  

		//console.log("End of music, save record");
	}
}

function playAudio() 
{
// Check for audio element support.
           
  if (window.HTMLAudioElement) 
  {
    try 
    {
     // var oAudio = document.getElementById('myaudio');
      
      var audioURL = document.getElementById('audiofile'); 

      //Skip loading if current file hasn't changed.
  /*    if (audioURL.innerHTML !== currentFile) {
        oAudio.src = audioURL.innerHTML;
        currentFile = audioURL.innerHTML;                       
      }*/
      
      //Skip loading if current file hasn't changed, this is for text
      if (audioURL.value !== currentFile) {
          oAudio.src = audioURL.value;
          currentFile = audioURL.value;                       
      }      
      // Tests the paused attribute and set state. 
      //when it display Play
      if (oAudio.paused) {
        console.log("Pause");
        
        oAudio.play();
        btn.textContent = "Pause";
        videoPl();
        
      }
      //when it display Pause
      else {//in pause mode, save record
        console.log("Play");
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
  if (window.HTMLAudioElement)  {
    try {
      //var oAudio = document.getElementById('myaudio');
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
     // var oAudio = document.getElementById('myaudio');
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
      //var oAudio = document.getElementById('myaudio');
      oAudio.currentTime = 0;
    }
    catch (e) {
      // Fail silently but show in F12 developer tools console
      if(window.console && console.error("Error:" + e));
    }
  }
}
