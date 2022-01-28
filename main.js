/**
 * 1. Render songs --> OK
 * 2. Scroll top  --> OK
 * 3. Play / pause / seek  --> OK
 * 4. CD rotate  --> OK
 * 5. Next / previous --> OK
 * 6. Random music -> OK
 * 7. Next / Repeat when ended -> OK
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

// const $ = document.querySelector.bind(document);
// const $$ = document.querySelectorAll(document);

const player = document.querySelector(".player");
const playList = document.querySelector(".playlist");
const cd = document.querySelector(".cd");
const btnPlay = document.querySelector(".btn-toggle-play");
const headerNameSong = document.querySelector("header h2");
const cdThump = document.querySelector(".cd-thumb");
const audio = document.querySelector("#audio");
const range = document.querySelector("#progress");
const btnNext = document.querySelector(".btn-next");
const btnPrev = document.querySelector(".btn-prev");
const btnRandom = document.querySelector(".btn-random");
const btnRepeat = document.querySelector(".btn-repeat");

const app = {
    config: JSON.parse(localStorage.getItem("F8-config")) || {},
    songs: [
        {
            name: "Chân tình",
            singer: "TLinhxDlab",
            path: "./assets/mp3/chantinh.mp3",
            image: "./assets/img/chantinh.jpg",
        },
        {
            name: "Độ tộc 2",
            singer: "Độ Mixi, Phúc Du, Pháo, Masew",
            path: "./assets/mp3/dotoc.mp3",
            image: "./assets/img/dotoc.jpg",
        },
        {
            name: "Freaky Squad",
            singer: "SpaceSpeaker",
            path: "./assets/mp3/freaky.mp3",
            image: "./assets/img/freaky.jpg",
        },
        {
            name: "Phi hành gia",
            singer: "LilWuyn",
            path: "./assets/mp3/phihanhgia.mp3",
            image: "./assets/img/phihanhgia.jpg",
        },
        {
            name: "Trưởng thành",
            singer: "DeeA",
            path: "./assets/mp3/truongthanh.mp3",
            image: "./assets/img/truongthanh.jpg",
        },
        {
            name: "Va vào giai điệu này",
            singer: "MCK",
            path: "./assets/mp3/vavaogiaidieu.mp3",
            image: "./assets/img/vavaogiaidieu.jpg",
        },
        {
            name: "Bồ em",
            singer: "Dính",
            path: "./assets/mp3/boem.mp3",
            image: "./assets/img/boem.jpg",
        },
        {
            name: "Nước hoa",
            singer: "Hoàng Tôn",
            path: "./assets/mp3/nuochoa.mp3",
            image: "./assets/img/nuochoa.jpg",
        },
        {
            name: "Only U",
            singer: "Hoàng Tôn",
            path: "./assets/mp3/onlyu.mp3",
            image: "./assets/img/onlyu.jpg",
        },
        {
            name: "Suýt nữa thì",
            singer: "Andiez",
            path: "./assets/mp3/suytnuathi.mp3",
            image: "./assets/img/suytnuathi.jpg",
        },
    ],
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    render() {
        var htmlPlayList = this.songs
            .map((song, index) => {
                return `<div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
                        <div class="thumb" style="background-image: url('${song.image}')"></div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>`;
            })
            .join("");
        playList.innerHTML = htmlPlayList;
    },

    defineProperties() {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    saveConfigKey(key, value) {
        this.config[key] = value;
        localStorage.setItem("F8-config", JSON.stringify(this.config));
    },

    loadCurrentSong() {
        headerNameSong.textContent = this.currentSong.name;
        cdThump.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    whenAudioPlay(cdThumpAnimate) {
        audio.onplay = function () {
            player.classList.add("playing");
            app.isPlaying = true;
            cdThumpAnimate.play();
        };
    },

    whenAudioPause(cdThumpAnimate) {
        audio.onpause = function () {
            player.classList.remove("playing");
            app.isPlaying = false;
            cdThumpAnimate.pause();
        };
    },

    nextSong() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    randomSong() {
        const currentIndex = this.currentIndex;
        do {
            this.currentIndex = Math.floor(Math.random() * this.songs.length);
        } while (this.currentIndex === currentIndex);
        this.loadCurrentSong();
    },

    repeatSong() {
        this.loadCurrentSong();
    },

    scrollToActiveSong() {
        setTimeout(() => {
            document.querySelector(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 300);
    },

    handleEvents() {
        const cdThumpAnimate = cdThump.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000,
            iterations: Infinity,
        });
        cdThumpAnimate.pause();
        // Scroll
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const newCDWidth = cdWidth - scrollTop;

            cd.style.width = newCDWidth > 0 ? newCDWidth + "px" : "0px";

            cd.style.opacity = newCDWidth / cdWidth;
        };

        // Play
        btnPlay.onclick = function () {
            if (!app.isPlaying) {
                audio.play();
            } else {
                audio.pause();
            }

            app.whenAudioPlay(cdThumpAnimate);
            app.whenAudioPause(cdThumpAnimate);
        };

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const durationTime = audio.duration;
                const currentTime = audio.currentTime;
                const progress = Math.floor((currentTime / durationTime) * 100);
                range.value = progress;
            }
        };

        // Xử lý khi tua song
        range.onchange = function () {
            const seekTime = (this.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        };

        // Khi nhấn nút Next
        btnNext.onclick = function () {
            if (app.isRandom) {
                app.randomSong();
            } else {
                app.nextSong();
            }
            audio.play();
            app.whenAudioPlay(cdThumpAnimate);
            app.render();
            app.scrollToActiveSong();
        };

        // Khi nhấn nút Prev
        btnPrev.onclick = function () {
            if (app.isRandom) {
                app.randomSong();
            } else {
                app.prevSong();
            }
            audio.play();
            app.whenAudioPlay(cdThumpAnimate);
            app.render();
            app.scrollToActiveSong(); 
        };

        // Khi nhấn nút Random
        btnRandom.onclick = function () {
            if (app.isRepeat) {
                app.isRepeat = false;
                app.saveConfigKey("repeat", app.isRepeat);
                btnRepeat.classList.remove("active");
            }
            app.isRandom = !app.isRandom;
            app.saveConfigKey("random", app.isRandom);
            this.classList.toggle("active", this.isRandom);
        };

        // Khi nhấn nút Repeat
        btnRepeat.onclick = function () {
            if (app.isRandom) {
                app.isRandom = false;
                app.saveConfigKey("random", app.isRandom);
                btnRandom.classList.remove("active");
            }
            app.isRepeat = !app.isRepeat;
            app.saveConfigKey("repeat", app.isRepeat);
            this.classList.toggle("active", this.isRepeat);
        };

        // Next song when ended
        audio.onended = function () {
            if (app.isRandom) {
                app.randomSong();
            } else if (app.isRepeat) {
                app.repeatSong();
            } else {
                app.nextSong();
            }
            audio.play();
            app.whenAudioPlay(cdThumpAnimate);
            app.render();
            app.scrollToActiveSong();
        };

        // Phát khi click vào 1 bài nhạc
        playList.onclick = function (e) {
            const songNotActive = e.target.closest(".song:not(.active)");
            if (songNotActive || e.target.closest(".option")) {
                if (songNotActive) {
                    // Cách 1: Dùng getAttribute
                    // app.currentIndex = Number(songNotActive.getAttribute("data-index"));
                    // Cách 2: Nếu thuộc tính để dạng data-...
                    app.currentIndex = Number(songNotActive.dataset.index)
                    app.render();
                    app.loadCurrentSong();
                    audio.play();
                    app.whenAudioPlay(cdThumpAnimate);
                }
                if (e.target.closest(".option")) {
                }
            }
        };
    },

    start() {
        // Render songs
        this.render();
        if(app.config["repeat"] !== undefined) {
            this.isRepeat = app.config["repeat"]
            btnRepeat.classList.toggle("active", app.config["repeat"]);
        }
        if(app.config["random"] !== undefined) {
            this.isRandom = app.config["random"]
            btnRandom.classList.toggle("active", app.config["random"]);
        }

        // Define properties
        this.defineProperties();

        // Load the first song
        this.loadCurrentSong();

        // Handle events
        this.handleEvents();
    },
};

app.start();
