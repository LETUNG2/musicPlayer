const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";


const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const progressBar = $(".progress-bar");
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const cd = $('.cd');
const playList = $('.playlist');
const timeSongTotal = $('.time-music-end');
const timeSongCurrent = $('.time-music-start');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    songs: [{
        name: 'Là Anh',
        singer: 'Phạm lịch',
        path: './assets/music/laanh.mp3',
        image: './assets/img/laanh.jpg',

    },
    {
        name: 'Có Thể Hay Không',
        singer: 'Trương Tử Hào',
        path: './assets/music//cothehaykhong.mp3',
        image: './assets/img/cothehaykhong.jpg',

    },
    {
        name: 'Vây Giữ',
        singer: 'Vương Tĩnh Văn',
        path: './assets/music/vaygiu.mp3',
        image: './assets/img/vaygiu.jpg',

    },
    {
        name: 'Nàng Thơ',
        singer: 'Hà Anh Tuấn x Hoàng Dũng',
        path: './assets/music/nangtho.mp3',
        image: './assets/img/nangtho.jpg',

    },
    {
        name: 'Nấu Ăn Cho Em',
        singer: 'Đen',
        path: './assets/music/nauanchoem.mp3',
        image: './assets/img/nauanchoem.jpg',

    },
    {
        name: 'Về Quê',
        singer: 'Mikelodic',
        path: './assets/music/veque.mp3',
        image: './assets/img/veque.jpg',

    },
    {
        name: 'Hoa Cỏ Lau',
        singer: 'H2K cover',
        path: './assets/music/hoacolau.mp3',
        image: './assets/img/hoacolau.jpg',

    },
    {
        name: 'Mở Mắt',
        singer: 'Lil Wuyn ft. Đen',
        path: './assets/music/momat.mp3',
        image: './assets/img/momat.jpg',

    },
    {
        name: 'Sao Cha Không',
        singer: 'Phan Mạnh Quỳnh',
        path: './assets/music/saochakhong.mp3',
        image: './assets/img/saochakhong.jpg',

    },
    {
        name: 'Anh Ghét Làm Bạn Em',
        singer: 'Phan Mạnh Quỳnh',
        path: './assets/music/anhghetlambanem.mp3',
        image: './assets/img/anhghetlambanem.jpg',

    },
    {
        name: 'Mười Năm',
        singer: 'Đen',
        path: './assets/music/muoinam.mp3',
        image: './assets/img/muoinawm.jpg',

    },

    ],
    setConfig(key, value) {
        this.config[key] = value;
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render() {
        const html = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
            </div>
            `
        })
        $('.playlist').innerHTML = html.join('');
    },
    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex];
            }
        });
    },

    handleEvents() {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        // Xử lý CD quay / dừng
        // Handle CD spins / stops
        const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        // Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        // Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        // Khi song bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        //khi tiến độ bài thay đổi
        audio.ontimeupdate = function () {
            if (audio.currentTime) {
                const progressPercent = (audio.currentTime / audio.duration) * 100;
                progress.style.width = progressPercent + "%";
                //set durationTime và currentTime cho bài hát
                timeSongCurrent.textContent = _this.timeSongCurrent();
                timeSongTotal.textContent = _this.timeSongTotal();
            }
        };

        // Xử lý khi tua song
        progressBar.onmousedown = function (e) {
            const seekTime = (e.offsetX / this.offsetWidth) * audio.duration;
            audio.currentTime = seekTime;
        };
        // Khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        // Khi prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        // Xử lý bật / tắt random song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
            _this.setConfig("isRandom", _this.isRandom);
        }
        // Xử lý bật / tắt repeat song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
            _this.setConfig("isRepeat", _this.isRepeat);
        }
        // Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }
        // Lắng nghe hành vi click vào playlist
        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }


    },

    scrollToActiveSong() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: "end",
                inline: "nearest"
            })
        }, 300)
    },
    loadConfig() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    loadCurrentSong() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

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
    playRandomSong() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    timeSongTotal() {
        const time = audio.duration;
        const minutes = Math.floor(time / 60)
            .toString()
            .padStart(2, "0");
        const seconds = Math.floor(time - 60 * minutes)
            .toString()
            .padStart(2, "0");
        return (finalTime = minutes + ":" + seconds);
    },
    timeSongCurrent() {
        const time = audio.currentTime;
        const minutes = Math.floor(time / 60)
            .toString()
            .padStart(2, "0");
        const seconds = Math.floor(time - 60 * minutes)
            .toString()
            .padStart(2, "0");
        return (finalTime = minutes + ":" + seconds);
    },

    start() {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // Hiển thị trạng thái ban đầu của button repeat & random
        // Display the initial state of the repeat & random button
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
        progress.style.width = 0;
    }
};

app.start();