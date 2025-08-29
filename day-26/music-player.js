const player = {
  NEXT: 1,
  PREV: -1,
  timeToPrev: 2,
  playlist: document.querySelector(".playlist"),
  songTitle: document.querySelector(".song-title"),
  thumbSong: document.querySelector(".cd-thumb"),
  audio: document.querySelector("#audio"),
  playIcon: document.querySelector("#icon-play"),
  nextIcon: document.querySelector(".btn-next"),
  prevIcon: document.querySelector(".btn-prev"),
  progress: document.querySelector("#progress"),
  currentTime: document.querySelector(".current-time"),
  totalTime: document.querySelector(".total-time"),
  repeatIcon: document.querySelector(".btn-repeat"),
  shuffleIcon: document.querySelector(".btn-random"),
  songList: document.querySelectorAll(".song"),
  cd: document.querySelector(".cd"),
  // Mảng chứa các bài hát
  songs: [
    {
      id: 1,
      name: "Kho Báu (with Rhymastic)",
      path: "./musics/songs/nhac1.mp3",
      artist: "Nguyễn A",
      pathThumb: "./musics/thumbs/image1.png",
    },
    {
      id: 2,
      name: "NÉT",
      path: "./musics/songs/nhac2.mp3",
      artist: "Nguyễn B",
      pathThumb: "./musics/thumbs/image2.png",
    },
    {
      id: 3,
      name: "Yêu Em Dài Lâu - Yêu 5",
      path: "./musics/songs/nhac3.mp3",
      artist: "Nguyễn C",
      pathThumb: "./musics/thumbs/image3.png",
    },
    {
      id: 4,
      name: "Nơi Này Có Anh",
      path: "./musics/songs/nhac4.mp3",
      artist: "M-TP",
      pathThumb: "./musics/thumbs/image4.png",
    },
    {
      id: 5,
      name: "Âm Thầm Bên Em",
      path: "./musics/songs/nhac5.mp3",
      artist: "M-TP",
      pathThumb: "./musics/thumbs/image5.png",
    },
  ],
  playedSongs: new Set(),
  currentIndex: 0,
  isScrolling: false,
  isRepeat: localStorage.getItem("isRepeat") === "true",
  isShuffle: localStorage.getItem("isShuffle") === "true",
  getCurrentSong() {
    return this.songs[this.currentIndex];
  },
  loadCurrentSong() {
    const currentSong = this.getCurrentSong(this.currentIndex);
    this.songTitle.textContent = currentSong.name;
    this.audio.src = currentSong.path;

    this.thumbSong.style.backgroundImage = `url("${currentSong.pathThumb}")`;
  },
  getRandomSong() {
    if (this.playedSongs.size === this.songs.length) {
      this.playedSongs.clear();
    }
    let index;
    do {
      index = Math.floor(Math.random() * this.songs.length);
    } while (this.playedSongs.has(index));
    this.playedSongs.add(index);
    return index;
  },
  changeIndexSong(step) {
    if (!this.isShuffle)
      this.currentIndex =
        (this.currentIndex + step + this.songs.length) % this.songs.length;
    else this.currentIndex = this.getRandomSong();
    this.loadCurrentSong();
    this.render();
    this.audio.play();
  },
  formatTime(sec) {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  },
  init() {
    // Task 1
    // Task 2
    // Task ...
    // Tai bai hat hien tai

    this.loadCurrentSong();
    // Xu ly su kien DOM
    // Xu ly su kien click button play/pause
    this.playIcon.addEventListener("click", () => {
      if (this.audio.paused) this.audio.play();
      else this.audio.pause();
    });

    // Xu ly su kien trang thai icon play/pause
    this.audio.addEventListener("play", () => {
      this.playIcon.classList.remove("fa-play");
      this.playIcon.classList.add("fa-pause");
    });
    this.audio.addEventListener("pause", () => {
      this.playIcon.classList.remove("fa-pause");
      this.playIcon.classList.add("fa-play");
    });

    // Xu ly su kien next & prev song

    this.nextIcon.addEventListener("click", () =>
      this.changeIndexSong(this.NEXT)
    );
    this.prevIcon.addEventListener("click", () => {
      if (this.audio.currentTime < this.timeToPrev)
        this.changeIndexSong(this.PREV);
      else this.audio.currentTime = 0;
    });

    // Xu ly timeupdate
    this.audio.addEventListener("timeupdate", () => {
      const progressPercent = Math.round(
        (this.audio.currentTime * 100) / this.audio.duration
      );
      if (!progressPercent || this.isScrolling) return;
      else {
        this.progress.value = progressPercent;
      }
      this.currentTime.textContent = this.formatTime(Math.round(this.audio.currentTime));
      this.totalTime.textContent = this.formatTime(Math.round(this.audio.duration));
    });

    // Xu ly scroll progress percent
    this.progress.addEventListener("mousedown", () => {
      this.isScrolling = true;
    });

    this.progress.addEventListener("mouseup", () => {
      const nextDuration = (this.progress.value / 100) * this.audio.duration;
      this.audio.currentTime = nextDuration;
      this.isScrolling = false;
    });

    // Xu ly khi end song

    this.audio.addEventListener("ended", () => {
      this.isRepeat ? this.audio.play() : this.changeIndexSong(this.NEXT);
    });

    // Xu ly repeat
    this.repeatIcon.classList.toggle("active", this.isRepeat);
    this.repeatIcon.addEventListener("click", () => {
      this.isRepeat = !this.isRepeat;
      localStorage.setItem("isRepeat", this.isRepeat);
      this.repeatIcon.classList.toggle("active", this.isRepeat);
    });

    // Xu ly shuffle
    this.shuffleIcon.classList.toggle("active", this.isShuffle);
    this.shuffleIcon.addEventListener("click", () => {
      this.isShuffle = !this.isShuffle;
      localStorage.setItem("isShuffle", this.isShuffle);
      this.shuffleIcon.classList.toggle("active", this.isShuffle);
    });

    // Xu ly quay dia CD
    this.audio.addEventListener("play", () => {
      this.cd.style.animation = "rotateCD 5s linear infinite";
      this.cd.style.animationPlayState = "running";
    });
    this.audio.addEventListener("pause", () => {
      this.cd.style.animationPlayState = "paused";
    });
    this.audio.addEventListener("end", () => {
      this.cd.style.animationPlayState = "paused";
    });

    // Xy lu time tren progress
    // Render danh sách songs
    this.render();
  },
  render() {
    // 1. Render danh sách các bài hát từ "songs"
    // 2. Sử dụng innerHTML
    const html = this.songs
      .map((song, index) => {
        return `<div class="song ${this.currentIndex == index ? "active" : ""}">
                    <div
                        class="thumb"
                        style="
                            background-image: url(${song.pathThumb});
                        "
                    ></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.artist}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>`;
      })
      .join("");
    this.playlist.innerHTML = html;
    // Xu ly click song

    document.querySelectorAll(".song").forEach((songEl, index) => {
      songEl.addEventListener("click", () => {
        this.currentIndex = index;
        this.loadCurrentSong();
        this.render();
        this.audio.play();
      });
    });
  },
};

// Khởi tạo player
player.init();
