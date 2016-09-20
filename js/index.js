
window.addEventListener("load", function() {
    // Si no se selecciona ninguna, la primera estará por defecto
    var currentSong = 0;
    // Tiempo en pausa por defecto
    var running = false;
    // Tiempo total transcurrido
    var totalTime = 0;
    // Intervalo para el tiempo a desplegar
    var interval;

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
            song[CONSTANTS.SONG_DURATION].textContent = album.songList[i].duration;

            document.querySelector('#album').appendChild( document.importNode(t, true));
            
            var songList = document.getElementsByClassName("song-item");
            (function(newCurrent) { songList[newCurrent].addEventListener("click", function() {
                    setCurrentSong(newCurrent);
                    console.log("cancion actual: " + currentSong);
                });
            })(i);
        }
    };

    displaySongList();
    
    /**
     * Establece la canción actual asignándole una clase para su estilo
     * A su vez quita la clase a la que estuviese activa previamente.
     * @param {Number} previous
     * @param {Number} current
     * @returns {undefined}
     */
    var setCurrentSong = function(current) {
        var songList = document.getElementsByClassName("song-item");
        songList[currentSong].classList.remove("currentSong");
        currentSong = current;
        songList[current].classList.add("currentSong");
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
     * Se establece la cuenta para el timer.
     * @returns {undefined}
     */
    var songTimer = function () {
        if(!running) {
            running = true;
            interval = setInterval(function () {
                totalTime++;
                document.getElementById("sec").textContent = (totalTime);
            }, 1000);
        } else {
            clearInterval(interval);
            running = false;
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
    
    document.getElementById("pauseAndResume").addEventListener("click", function () {
        songTimer();
    });
});
