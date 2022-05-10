const musicPlayer = document.querySelector(".music-player")
const dashboard = document.querySelector(".dashboard")
const playList = document.querySelector(".play-list");
const musicThumbnail = document.querySelector(".dashboard .music-thumbnail");
const currSongName = document.querySelector(".header h2");
const currSongThumbnail = musicThumbnail.querySelector(".thumbnail");
const audio = document.querySelector("#audio");
const playBtn = document.querySelector(".control-btns .play-btn");
const progressBar = document.querySelector("#progress");
const volumeBar = document.querySelector("#volume-range");
const nextBtn = document.querySelector(".control-btns .next-btn");
const prevBtn = document.querySelector(".control-btns .prev-btn");
const randomBtn = document.querySelector(".control-btns .random-btn");
const repeatBtn = document.querySelector(".control-btns .repeat-btn");
const startTime = document.getElementById("start-time");
const endTime = document.getElementById("end-time");
const volumeBtn = document.querySelector(".volume .volume-btn");
const darkModeBtn = document.querySelector(".dark-mode-btn");
const darkModeIcon = darkModeBtn.querySelector("img");

const MUSIC_PLAYER_KEY = "music-player";

const app = {
    config: JSON.parse(localStorage.getItem(MUSIC_PLAYER_KEY)) || {},
    prevSongs: [], //keeps track of recent songs
    currVolume : 100,
    isPlaying: false,
    currSongIndex: 0,
    enableRandom: false,
    enableDarkMode: false,
    songs : [
        {
            name: "Payphone",
            author: "Wiz Khalifa",
            image: "./assets/img/payphone.jpg",
            path: "./assets/music/payphone.mp3"
        },
        {
            name: "Ez4Ence",
            author: "The Verkkars",
            image: "./assets/img/ez4ence.jpg",
            path: "./assets/music/ez4ence.mp3"
        },
        {
            name: "Can't help falling in love",
            author: "Elvis Presley",
            image: "./assets/img/canthelpfallinginlove.jpg",
            path: "./assets/music/canthelpfallinginlove.mp3"
        },
        {
            name: "The nights",
            author: "Avicii",
            image: "./assets/img/thenights.jpg",
            path: "./assets/music/thenights.mp3"
        },
        {
            name: "Blinding lights",
            author: "The Weeknd",
            image: "./assets/img/blindinglights.jpg",
            path: "./assets/music/blindinglights.mp3"
        },
        {
            name: "My Love",
            author: "West Life",
            image: "./assets/img/mylove.jpg",
            path: "./assets/music/mylove.mp3"
        },
        {
            name: "Sweet But Psycho",
            author: "Ava Max",
            image: "./assets/img/sweetbutpsycho.jpg",
            path: "./assets/music/sweetbutpsycho.mp3"
        },
        {
            name: "C'est La Vie",
            author: "Khaled",
            image: "./assets/img/cestlavie.jpg",
            path: "./assets/music/cestlavie.mp3"
        },
        {
            name: "Beautiful Now",
            author: "Zedd",
            image: "./assets/img/beautiful-now.jpg",
            path: "./assets/music/beautiful-now.mp3"
        },
        {
            name: "A Sky Full Of Stars",
            author: "Coldplay",
            image: "./assets/img/A-Sky-Full-Of-Stars.jpg",
            path: "./assets/music/A-Sky-Full-Of-Stars.mp3"
        }
    ],
    changeConfig: function(key,value) {
        this.config[key] = value;
        localStorage.setItem(MUSIC_PLAYER_KEY,JSON.stringify(this.config));
    },
    loadConfig: function() {
        if ("enableDarkMode" in this.config) {
            this.enableDarkMode = this.config.enableDarkMode;
            if (app.enableDarkMode)
                darkModeIcon.src = "./assets/img/dark-theme.png";
            document.body.classList.toggle("dark-mode",app.enableDarkMode);
        }
        if ("enableRandom" in this.config) {
            this.enableRandom = this.config.enableRandom;
            randomBtn.classList.toggle("active",app.enableRandom);
        }
        if ("enableLoop" in this.config) {
            audio.loop = this.config.enableLoop;
            repeatBtn.classList.toggle("active",audio.loop);
        }
        if ("currSongIndex" in this.config) {
            this.currSongIndex = this.config.currSongIndex;
        }
        this.prevSongs.push(this.currSongIndex);
    },
    renderSong: function() {
        const htmls = this.songs.map(function(song, index) {
            const isActiveSong = index === app.currSongIndex ? " active" : "";
            return `<div class="song${isActiveSong}" index="${index}">
            <div class="thumbnail" style="background-image: url(${song.image})"></div>
            <div class="detail">
                <h3 class="name">${song.name}</h3>
                <p class="author">${song.author}</p>
            </div>
            <div class="option">
                <i class="fa-solid fa-ellipsis"></i>
            </div>
        </div>`
        })
        playList.innerHTML = htmls.join(" ")
    },
    getCurrSong: function() {
        return this.songs[this.currSongIndex];
    },
    loadSong: function(song) {
        currSongName.innerHTML = song.name;
        currSongThumbnail.style["background-image"] = `url(${song.image})`;
        audio.src = song.path;
        this.renderSong();
        this.scrollToActiveSong();
    },
    nextSong: function() {
        if (audio.readyState === 4) {
            this.currSongIndex++;
            if (this.currSongIndex === this.songs.length)
                this.currSongIndex = 0;
            this.changeConfig("currSongIndex",this.currSongIndex);
            this.loadSong(this.getCurrSong())
            audio.play();
        } else {
            console.log("video loading...");
        }
    },
    prevSong: function() {
        if (audio.readyState === 4) {
            this.currSongIndex--;
            if (this.currSongIndex === -1)
                this.currSongIndex = this.songs.length - 1;
            this.changeConfig("currSongIndex",this.currSongIndex);
            this.loadSong(this.getCurrSong())
            audio.play();
        } else {
            console.log("video loading...");
        }
        
    },
    randomSong: function() { //not repeat 2 recent songs
        if (audio.readyState === 4) {
            if (this.songs.length > 1) {
                var randIndex = -1;
                if (this.songs.length >= 4) {
                    do {
                        randIndex = Math.floor(Math.random() * this.songs.length);
                    } while (randIndex === this.currSongIndex || this.prevSongs.includes(randIndex))
                    if (this.prevSongs.length == 2) this.prevSongs.shift();
                    this.prevSongs.push(randIndex);
                } else {
                    do {
                        randIndex = Math.floor(Math.random() * this.songs.length);
                    } while (randIndex === this.currSongIndex)
                }
                // console.log(randIndex);
                this.currSongIndex = randIndex;
                this.changeConfig("currSongIndex",this.currSongIndex);
                this.loadSong(this.getCurrSong())
                audio.play();
            }
        } else {
            console.log("video loading...");
        }
    },
    rotateThumbnail: function() {
        return currSongThumbnail.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
    },
    scrollToActiveSong: function() {
        setTimeout(function() {
            const activeSong = document.querySelector(".song.active");
            activeSong.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
        },300)
    },
    getTimeFormat: function(secs) {
        const date = new Date(secs * 1000);
        const minutes = date.getUTCMinutes();
        const seconds = date.getSeconds();
        return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    },
    changeVolume: function(percent) {
        audio.volume = percent / 100;
    },
    handleEvents: function() {
        const thumbnailRotation = this.rotateThumbnail();
        thumbnailRotation.pause();

        const thumbnailWidth = musicThumbnail.offsetWidth;
        // when scroll down/up
        document.onscroll = function(e) {
            // set new width for the thumbnail
            var newWidth = thumbnailWidth - window.scrollY;
            if (newWidth < 0) newWidth = 0;
            musicThumbnail.style.width = newWidth + "px";
            // set new opacity for the thumbnail
            musicThumbnail.style.opacity = newWidth / thumbnailWidth;
        }

        // when song is loaded 
        audio.ondurationchange = function() {
            endTime.innerHTML = app.getTimeFormat(audio.duration);
        }

        // when click play btn
        playBtn.onclick = function() {
            if (audio.readyState == 4) {
                if (app.isPlaying) audio.pause();
                else {
                    audio.play();
                } 
            } else {
                console.log("video loading...");
            }
        }

        // when audio is playing / not playing
        audio.onplay = function() {
            app.isPlaying = true;
            if (!playBtn.classList.contains("playing"))
                playBtn.classList.add("playing");
            thumbnailRotation.play();
        }

        audio.onpause = function() {
            app.isPlaying = false;
            if (playBtn.classList.contains("playing"))
                playBtn.classList.remove("playing");
            thumbnailRotation.pause();
        }

        // when playback position of audio changes
        audio.ontimeupdate = function() {
            const percent = audio.currentTime / audio.duration * 100;
            if (percent) {
                progressBar.value = percent;
                startTime.innerHTML = app.getTimeFormat(audio.currentTime);
            }
            var min = progressBar.min, max = progressBar.max, val = progressBar.value;
            progressBar.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
        }

        // when user changes audio position
        progressBar.oninput = function(e) {
            if (audio.paused || audio.readyState === 4) {
                const percent = e.target.value;
                const seconds = audio.duration / 100 * percent;
                audio.currentTime = seconds;
            } else {
                console.log("video loading...");
            }
            var min = progressBar.min, max = progressBar.max, val = progressBar.value;
            progressBar.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
        }

        // when user changes volume
        volumeBar.oninput = function(e) {
            const percent = e.target.value;
            if (percent == 0) {
                volumeBtn.classList.add("disabled");
            } else {
                if (volumeBtn.classList.contains("disabled"))
                    volumeBtn.classList.remove("disabled");
            }
            app.changeVolume(percent);
            app.currVolume = percent;
        }

        // when user clicks on volume btn
        volumeBtn.onclick = function() {
            if (this.classList.contains("disabled")) {
                this.classList.remove("disabled");
                volumeBar.value = app.currVolume == 0 ? 100 : app.currVolume;
                app.changeVolume(volumeBar.value);
            } else {
                this.classList.add("disabled");
                volumeBar.value = 0;
                app.changeVolume(0);
            }
        }

        // when user clicks next btn
        nextBtn.onclick = function() {
            if (app.enableRandom) app.randomSong();
            else app.nextSong();
        }

        // when user clicks prev btn
        prevBtn.onclick = function() {
            if (app.enableRandom) app.randomSong();
            else app.prevSong();
        }

        // when user clicks random btn
        randomBtn.onclick = function() {
            app.enableRandom = !app.enableRandom;
            randomBtn.classList.toggle("active",app.enableRandom);
            app.changeConfig("enableRandom",app.enableRandom);
        }

        // when user clicks repeat btn
        repeatBtn.onclick = function() {
            audio.loop = !audio.loop;
            repeatBtn.classList.toggle("active",audio.loop);
            app.changeConfig("enableLoop",audio.loop);
        }

        // when user clicks on playlist
        playList.onclick = function(e) {
            // if clicked on option (3 dots)
            if (e.target.closest(".option")) {
                console.log("option clicked");
            } else {
                // if click on a song (not including active song)
                const songClicked = e.target.closest(".song:not(.active)")
                if (songClicked) {
                    if (audio.readyState === 4) {
                        const index = songClicked.getAttribute("index");
                        app.currSongIndex = Number(index);
                        app.changeConfig("currSongIndex",app.currSongIndex);
                        app.loadSong(app.getCurrSong())
                        audio.play();
                    } else {
                        console.log("video loading...");
                    }
                }
            }
        }

        // when song has ended
        audio.onended = function() {
            if (!audio.loop) {
                if (app.enableRandom) app.randomSong();
                else app.nextSong();
            }
        }

        // when user clicks dark mode btn
        darkModeBtn.onclick = function() {
            app.enableDarkMode = !app.enableDarkMode;
            document.body.classList.toggle("dark-mode",app.enableDarkMode);
            var src = "./assets/img/";
            if (app.enableDarkMode)
                src += "dark-theme.png";
            else src += "light-theme.png";
            darkModeIcon.src = src;
            app.changeConfig("enableDarkMode",app.enableDarkMode);
        }
    },
    start: function() {
        this.loadConfig();
        this.renderSong();
        this.handleEvents();
        this.loadSong(this.getCurrSong());
    }
}

app.start();


/**
 * 1. increase randomness --done
 * 2. volume change -- done
 * 3. time of song  -- done
 * 4. save curr settings -- done
 * 5. progressBar color --done
 * 6. dark mode --done
 * 7. fix not have to render all songs again
 */
 
