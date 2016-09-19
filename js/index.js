
window.addEventListener("load", function() {
    // Si no se selecciona ninguna, la primera estará por defecto
    var currentSong = 0;

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
                    setCurrentSong(currentSong, newCurrent);
                    console.log("cancion actual: " + currentSong);
                });
            })(i);
        }
    };
    
    displaySongList();
    
    
    var setCurrentSong = function(previous, current) {
        var songList = document.getElementsByClassName("song-item");
        songList[previous].classList.remove("currentSong");
        currentSong = current;
        songList[current].classList.add("currentSong");
    };

    document.getElementById("nextSong").addEventListener("click", function () {
        setCurrentSong(currentSong, getNextSongToPlay());
    });
    
    document.getElementById("prevSong").addEventListener("click", function () {
        setCurrentSong(currentSong, getPrevSongToPlay());
    });

    /**
     * Devuelve la siguiente canción a reproducir
     * En caso de que la actual sea la última de la lista vuelve a la primera
     * En otro caso reproduce la siguiente
     * @returns {Number}
     */
    var getNextSongToPlay = function () {
        if(currentSong === album.songList.length) {
            return 0;
        }
        return ++currentSong;
    };
    
    var getPrevSongToPlay = function () {
        var current = currentSong;
        if(current === 0) {
            alert("¡Está en la primera canción!");
            return 0;
        }
        return --current;
    };

});

