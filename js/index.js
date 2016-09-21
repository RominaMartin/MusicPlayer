
window.addEventListener("load", function() {
    // Si no se selecciona ninguna, la primera estará por defecto
    var currentSong = 0;
    // Tiempo en pausa por defecto
    var running = false;
    // Tiempo total transcurrido
    var totalTime = 0;
    // Intervalo para el tiempo a desplegar
    var interval;
    // Elemento "arm", se usará cada vez que se pause/reanude
    var armElement = document.getElementById('arm');
    // Elemento "disc", se usará cada vez que se pause/reanude
    var discElement = document.getElementById('disc');
    
    // Inicialmente no habrá música así que se quita el brazo del disco
    armElement.classList.add('moveArmDown');

    /**
     * Establece la canción actual 
     * Hace la llamada al timer para el cambio de canción
     * @param {type} current
     * @returns {undefined}
     */
    var setCurrentSong = function(current) {
        removePreviousStyle();
        currentSong = current;
        setCurrentSongStyle();
        timer.startNewSong();
    };

    var removePreviousStyle = function () {
        var songList = document.getElementsByClassName("song-item");
        songList[currentSong].classList.remove("currentSong");
        
        var playing = document.getElementsByClassName("song-current");
        playing[currentSong].classList.remove("song-playing");
        playing[currentSong].classList.remove("song-paused");
    };

    var setCurrentSongStyle = function () {
        var songList = document.getElementsByClassName("song-item");
        songList[currentSong].classList.add("currentSong");
        
        var playing = document.getElementsByClassName("song-current");
        playing[currentSong].classList.add("song-playing");

        armElement.classList.remove('moveArmDown');
        armElement.classList.add('moveArmUp');
        discElement.classList.add('discRolling');
        

        document.getElementById("total-duration").textContent = (" / " + minutesFormat(album.songList[currentSong].duration));
        document.getElementById("current-song").textContent = album.songList[currentSong].name;
        document.getElementById("current-artist").textContent = album.songList[currentSong].interpreter;
    };
    /**
     * Cuando se pausa:
     * - El disco deja de girar
     * - El brazo baja
     * @returns {undefined}
     */
    var setPausedStyle = function () {
        armElement.classList.add('moveArmDown');
        armElement.classList.remove('moveArmUp');
        discElement.classList.remove('discRolling');

        var playing = document.getElementsByClassName("song-current");
        playing[currentSong].classList.remove("song-playing");
        playing[currentSong].classList.add("song-paused");
    };
    
    /**
     * Devuelve la siguiente canción a reproducir
     * En caso de que la actual sea la última de la lista vuelve a la primera
     * En otro caso reproduce la siguiente
     * @returns {Number}
     */
    var getNextSongToPlay = function () {
        var current = currentSong;
        if(current === (album.songList.length - 1)) {
            return 0;
        }
        return ++current;
    };
    
    /**
     * Devuelve la canción anterior a la actual.
     * En caso que la actual sea la primera de la lista, va a la última
     * En otro caso reproduce la anterior.
     * @returns {Number}
     */
    var getPrevSongToPlay = function () {
        var current = currentSong;
        if(current === 0) {
            return (album.songList.length - 1);
        }
        return --current;
    };

    /**
     * Timer para las canciones. En caso de acabar el tiempo de la canción avanza a la siguiente
     * En caso de cambiar de canción se resetea y comienza la cuenta.
     * Se puede pausar la canción.
     * @type type
     */
    var timer = {
      start: function () {
          interval = setInterval(function () {
              totalTime++;
              document.getElementById("current-duration").textContent = (minutesFormat(totalTime));
              if(totalTime === album.songList[currentSong].duration){
                totalTime = 0;
                clearInterval(interval);
                setCurrentSong(getNextSongToPlay());
              }
          }, 1000);
      },

      pause: function () {
          clearInterval(interval);
      },

      startNewSong: function () {
          totalTime = 0;
          running = true;
          clearInterval(interval);
          this.start();
      }
    };
    /**
     * Calcula los minutos y los devuelve en formato correcto
     * @param {type} seconds
     * @returns {String}
     */
    var minutesFormat = function (seconds) {
        var minutes = Math.floor(seconds / 60);
        var leftSeconds = seconds - (minutes * 60);

        if(minutes < 10) {
            minutes = "0" + minutes;
        }
        if(leftSeconds < 10) {
            leftSeconds = "0" + leftSeconds;
        }
        return (minutes + ":" + leftSeconds);
    };

    /*
     * Recorre el JSON con los datos y rellena el template de canciones con
     * tantas como encuentre en el JSON.
     * 
     */
    var displaySongList = function () {
        var t = document.querySelector('template').content;
        var song = t.querySelectorAll("li");
        for (var i = 0; i < album.songList.length; i++) {
            song[CONSTANTS.SONG_NAME].textContent = album.songList[i].name;
            song[CONSTANTS.SONG_ARTIST].textContent = album.songList[i].interpreter;
            song[CONSTANTS.SONG_DURATION].textContent = minutesFormat(album.songList[i].duration);

            document.querySelector('#albumList').appendChild( document.importNode(t, true));
            
            var songList = document.getElementsByClassName("song-item");
            (function(newCurrent) { songList[newCurrent].addEventListener("click", function() {
                    if(newCurrent === currentSong) {
                        pauseOrResume();
                    } else {
                        setCurrentSong(newCurrent);
                    }
                    console.log("Canción actual: " + currentSong);
                });
            })(i);
        }
        document.getElementById("albumName").textContent = album.name;
    };

    displaySongList();

    var pauseOrResume = function () {
        if(!running) {
            removePreviousStyle();
            setCurrentSongStyle(currentSong);
            running = true;
            timer.start();
        } else {
            running = false;
            setPausedStyle();
            timer.pause();
        }
    };

    /**
     * Eventos
     */
    document.getElementById("nextSong").addEventListener("click", function () {
        setCurrentSong(getNextSongToPlay());
    });
    
    document.getElementById("prevSong").addEventListener("click", function () {
        setCurrentSong(getPrevSongToPlay());
    });

    armElement.addEventListener("click", function () {
        if(!running) {
            removePreviousStyle();
            setCurrentSongStyle(currentSong);
            running = true;
            timer.start();
        } else {
            running = false;
            setPausedStyle();
            timer.pause();
        }
    });
});
