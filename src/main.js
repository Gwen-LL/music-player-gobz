import { gsap } from "gsap";
import { SplitText } from "gsap-trial/SplitText";

gsap.registerPlugin(SplitText);

class MusicPlayer {

  constructor() {
    // this.gap = 20
    // this.scrollY = 0
    this.tracks = [
      { id: 0, title: "Lose control", url: "LoseControl.mp3", img: "LoseControl.png", artist: "Amaria", album: "Bittersweet" },
      { id: 1, title: "Beggin'", url: "Beggin.mp3", img: "beggin.png", artist: "Amaria", album: "Free Fallin'" },
      { id: 2, title: "Lying To you", url: "LyingToYou.mp3", img: "LyingToYou.png", artist: "Amaria", album: "All for you" },
    ];

    this.currentTrackIndex = 0;
    this.oldElementImage = '';
    this.audio = new Audio();
    this.isPlaying = false;
    this.volume = 0.75;
    this.init();
    const lenis = new Lenis();
  }

  init() {
    this.cacheDOM();
    this.createAlbums();
    this.bindEvents();
    this.loadTrack();
    this.textSplit();
  }

  createAlbums() {
    this.tracks.forEach(track => {
      const img = document.createElement("img");
      const li = document.createElement("li");
      img.src = track.img;
      li.appendChild(img);
      this.playlist.appendChild(li);
      track.elementImage = img;
      // creer attribut data-id
    });
  }

  cacheDOM() {
    this.playlist = document.querySelector("#playlist");
    this.playButton = document.querySelector("#play");
    this.playButtonSpan = document.querySelector("#playSpan");
    this.nextButton = document.querySelector("#next");
    this.prevButton = document.querySelector("#prev");
    this.trackTitle = document.querySelector("#track-title");
    this.trackArtist = document.querySelector("#track-artist");
    this.trackAlbum = document.querySelector("#track-album");
    this.slider = document.querySelector("#slider-container");
    this.progressBar = document.querySelector("#progress-bar");
    this.currentTimeText = document.querySelector("#current-time");
    this.durationText = document.querySelector("#duration");
  }

  bindEvents() {
    this.playButton.addEventListener("click", () => this.togglePlay());
    this.nextButton.addEventListener("click", () => this.nextTrack());
    this.prevButton.addEventListener("click", () => this.prevTrack());
    this.audio.addEventListener("ended", () => this.nextTrack());
    this.tracks.forEach((track) => {
      track.elementImage.addEventListener("click", (event) => this.handleClickImage(event));
      track.elementImage.setAttribute("data-id", track.id);
    });
    this.audio.addEventListener("timeupdate", () => this.updateProgress());
    this.slider.addEventListener("click", (e) => this.seekTrack(e));
  }

  handleClickImage(event) {
    const dataId = event.target.getAttribute("data-id");
    this.currentTrackIndex = +dataId;
    this.loadTrack();
    this.audio.play(); // Bug: joue même si l'audio n'est pas chargé correctement
    this.isPlaying = true;
    this.textSplit();
  }

  loadTrack() {
    if (this.currentTrackIndex < 0 || this.currentTrackIndex >= this.tracks.length) {
      console.error("Index de piste invalide");
      return;
    }

    if (this.oldElementImage) this.oldElementImage.classList.remove("albumL");
    this.tracks[this.currentTrackIndex].elementImage.classList.add("albumL");
    this.oldElementImage = this.tracks[this.currentTrackIndex].elementImage;

    this.audio.src = this.tracks[this.currentTrackIndex].url;
    this.trackTitle.textContent = this.tracks[this.currentTrackIndex].title;
    this.trackArtist.textContent = this.tracks[this.currentTrackIndex].artist;
    this.trackAlbum.textContent = this.tracks[this.currentTrackIndex].album;
    this.audio.addEventListener("loadedmetadata", () => {
      this.updateProgress(); // Pour afficher direct la durée correcte
    });
  }

  togglePlay() {
    if (this.isPlaying) {
      this.isPlaying = false
      this.audio.pause();
      this.playButtonSpan.classList.remove("btn_pause");
      this.playButtonSpan.classList.add("btn_play");
    } else {
      this.isPlaying = true
      this.audio.play().catch(err => console.error("Erreur de lecture :", err));
      this.playButtonSpan.classList.remove("btn_play");
      this.playButtonSpan.classList.add("btn_pause");
    }
    console.log(this.isPlaying)
  }

  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.loadTrack();
    this.audio.play(); // Bug: joue même si l'audio n'est pas chargé correctement
    this.isPlaying = true;
    this.textSplit();
  }

  prevTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.loadTrack();
    this.audio.play();
    this.isPlaying = true;
    this.textSplit();
  }

  textSplit() {
    var typeSplit = new SplitText('#track-album', { type: 'lines' })
    const trackAlbumSplit = new SplitText ('#track-album', { type: 'lines' })
    gsap.from(typeSplit.lines, {
      y: '100%',
      opacity: 1,
      duration: 0.5,
      ease: 'power1.out',
      stagger: 0.1,

    })
  }
  updateProgress() {
    const { currentTime, duration } = this.audio;

    // Met à jour le temps actuel si connu
    if (!isNaN(currentTime)) {
      this.currentTimeText.textContent = this.formatTime(currentTime);
    }

    // Met à jour la durée totale et la barre si la durée est connue
    if (!isNaN(duration)) {
      this.durationText.textContent = this.formatTime(duration);
      const percent = (currentTime / duration) * 100;
      this.progressBar.style.width = `${percent}%`;
    } else {
      // Sinon, reset la barre et la durée
      this.durationText.textContent = "0:00";
      this.progressBar.style.width = `0%`;
    }
  }

  seekTrack(e) {
    const rect = this.slider.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    this.audio.currentTime = this.audio.duration * percent;
  }

  formatTime(time) {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }
}

new MusicPlayer();
