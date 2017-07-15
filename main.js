
// Function to play or pause the song or vice versa as per the user requirement
function toggleSong() {
var song = document.querySelector('audio');
if(song.paused == true) {
$('.play-icon').removeClass('fa-play').addClass('fa-pause');
song.play();
}
else {
$('.play-icon').removeClass('fa-pause').addClass('fa-play');
song.pause();
}
}

// Function to play or pause the song when play icon is pressed by the user
$('.play-icon').on('click', function() {
    toggleSong();

  });

  // Function to let the song playing even when spacebar is pressed while typing the song details inside the search box of the datatable
  $('body').on('keypress',function(event) {
    var target = event.target;
    if (event.keyCode == 32 && target.tagName !='INPUT')
    {
        toggleSong();
    }
});


// Function to display the time in minutes and seconds format of a song
  function fancyTimeFormat(time)
  {
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = time % 60;
  // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }


// Function to change the song details as according to the songs object passed as the argument
  function changeCurrentSongDetails(songObj) {
    $('.current-song-image').attr('src','img/' + songObj.image)
    $('.current-song-name').text(songObj.name)
    $('.current-song-album').text(songObj.album)
}

// Function to update the song time as song progresses
  function updateCurrentTime() {
    var song = document.querySelector('audio');
    var currentTime = Math.floor(song.currentTime);
    currentTime = fancyTimeFormat(currentTime);
    var duration = Math.floor(song.duration);
    duration = fancyTimeFormat(duration)
    $('.time-elapsed').text(currentTime);
    $('.song-duration').text(duration);
}

// Function to load the window when website loads for the very first time
window.onload = function() {
  var currentSongNumber = 1;
  var willLoop = 0;
  var willShuffle = 0;

// Initialisation of the Datatables
  $('#songs').DataTable({
    paging:false <!--To remove page numbers from the table-->
  });


// Executes the setInterval function after every 1s to update the time of the song as per the progress
        updateCurrentTime();
        setInterval(function() {
          updateCurrentTime();
        },1000);



// Function to change the song name,image ,details as per the song to be required by the user
        function addSongNameClickEvent(songObj,position) {
          var songName=songObj.fileName;
        var id = '#song' + position;
        $(id).click(function() {
            var audio = document.querySelector('audio');
            var currentSong = audio.src;
            if(currentSong.search(songName) != -1)
          {
            toggleSong();
          }
          else {
            audio.src = songName;
            toggleSong();
             changeCurrentSongDetails(songObj);
          }
        });
        }

  // Object of arrays containing songs details
        var songs = [{
        'name': 'Despacito',
        'artist': 'Luis Fonsi,Daddy Yankee',
        'album': 'Luis Fonsi Despacito Ft. Daddy Yankee',
        'duration':'3:27',
       'fileName': 'song0.mp3',
       'image':'song0.jpeg'

        },
        {
            'name': 'Bailando',
            'artist': 'Enrique Iglesias',
            'album': 'Love',
            'duration': '4:03',
            'fileName': 'song1.mp3',
            'image':'song1.jpg'
        },
        {
            'name':'A Sky Full Of Stars',
            'artist':'Coldplay',
            'album': 'Ghost Stories',
            'duration': '4:28',
            'fileName': 'song2.mp3',
            'image':'song2.png'
        },
        {
            'name': 'Burn It Down',
            'artist': 'Linkin Park',
            'album': 'Living Things',
            'duration':'3:51',
            'fileName': 'song3.mp3',
            'image':'song3.jpg'

        },
        {
            'name': 'Hymn For The Weekend',
            'artist': 'Coldplay',
            'album': 'A Head Full Of Dreams',
            'duration':'4:20',
            'fileName': 'song4.mp3',
            'image':'song4.jpg'
        }]



      



 // Javascript execution starts from here
          changeCurrentSongDetails(songs[0])
        for(var i =0; i < songs.length;i++) {
         var obj = songs[i];
            var name = '#song' + (i);
            var song = $(name);
            song.find('.song-name').text(obj.name);
        song.find('.song-artist').text(obj.artist);
        song.find('.song-album').text(obj.album);
        song.find('.song-length').text(obj.duration);
        addSongNameClickEvent(obj,i)
          }

// Progress  in progress bar updated at every instant
$('audio').on('timeupdate', function() {
  var audio = document.querySelector('audio');
  $('.progress-filled').stop().animate({'width': (audio.currentTime) / (audio.duration) * 100 + '%'}, 250, 'linear');
});

// Progress bar progress enhanced to the place where user clicks on the progress bar
$('.player-progress').on('click', function(event) {
  var audio = document.querySelector('audio');
  var progress = document.querySelector('.player-progress');

  var scrubTime = (event.offsetX / progress.offsetWidth) * audio.duration;
  audio.currentTime = scrubTime;
});

// Function to enable and disable loop button
$('.fa-repeat').on('click',function(){
  $('.fa-repeat').toggleClass('disabled');
  willLoop=1-willLoop;
});

// Function to ebable and disable shuffle button
$('.fa-random').on('click', function() {
  $('.fa-random').toggleClass('disabled');
  willShuffle = 1 - willShuffle;
});

// Function works to loop the playlist when song ends and loop button is enabled
$('audio').on('ended',function(){
  if(willLoop) {
    var audio = document.querySelector('audio');
    if(currentSongNumber < songs.length) {

      var nextSongObj = songs[currentSongNumber];
      audio.src = nextSongObj.fileName;
      toggleSong();
      changeCurrentSongDetails(nextSongObj);
      currentSongNumber++;
    }
    else {
      // Play the first song
      audio.src = songs[0].fileName;
      toggleSong();
      changeCurrentSongDetails(songs[0]);
      currentSongNumber = 1;
    }
}
else {
    var audio = document.querySelector('audio');
    toggleSong();
}
});

// Function works to shuffle the playlist when shuffle button is enabled
$('audio').on('ended', function() {
  if(willShuffle) {
  var  audio = document.querySelector('audio');
    currentSongNumber = Math.floor((Math.random() * 4) + 1);
    var nextSongObj = songs[currentSongNumber - 1];
    audio.src = nextSongObj.fileName;
    toggleSong();
    changeCurrentSongDetails(nextSongObj);
  }

});

// Function for getting the next song
$('.fa-step-forward').on('click', function() {
  var audio = document.querySelector('audio');
  if(currentSongNumber < songs.length) {
    currentSongNumber++;
    console.log(audio);
    console.log(currentSongNumber);
    var nextSongObj = songs[currentSongNumber - 1];
    audio.src = nextSongObj.fileName;
    toggleSong();
    changeCurrentSongDetails(nextSongObj);

  }
  else {
    currentSongNumber = 1;
    audio.src = songs[0].fileName;
    toggleSong();
    changeCurrentSongDetails(songs[0]);
  }
});




// Function to get the previous song of the playlist
$('.fa-step-backward').on('click', function() {
  var audio = document.querySelector('audio');
  if(currentSongNumber >= 1) {
    currentSongNumber--;
    var prevSongObj = songs[currentSongNumber - 1];
    audio.src = prevSongObj.fileName;
    toggleSong();
    changeCurrentSongDetails(prevSongObj);
  }
  else {
    currentSongNumber = songs.length;
    audio.src = songs[currentSongNumber - 1].fileName;
    toggleSong();
    changeCurrentSongDetails(songs[currentSongNumber - 1]);
  }
});


// Function to play the last song of the playlist when button clicked by the user
$('.fa-fast-forward').on('click', function() {
  var audio = document.querySelector('audio');
  audio.src = songs[4].fileName;
  toggleSong();
  changeCurrentSongDetails(songs[4]);
});

// Function to play the first song of the playlist when button clicked by the user
$('.fa-fast-backward').on('click', function() {
  var audio = document.querySelector('audio');
  audio.src = songs[0].fileName;
  toggleSong();
  changeCurrentSongDetails(songs[0]);
});

}
// <!--End of javascript file code-->
