// import { gsap } from "gsap";

class MusicPlayer {

  constructor() {
    // this.gap = 20
    // this.scrollY = 0
    this.tracks = [
      { id: 1, title: "Lose control", url: "LoseControl.mp3", img: "LoseControl.png", artist : "Amaria", album: "Bittersweet"},
      { id: 2, title: "Beggin'" , url: "Beggin.mp3", img: "beggin.png", artist: "Amaria", album: "Free Fallin'"},
      { id: 3, title: "Lying To you", url: "LyingToYou.mp3", img: "LyingToYou.png", artist: "Amaria", album: "All for you" },
    ];
    this.currentTrackIndex = 0;
    this.oldElementImage = '';
    this.audio = new Audio();
    this.isPlaying = false;
    this.volume = 0.75;
    this.init();
    // this.setupImages();
    // this.updatePosition();
  }

  // setupImages(){
  //   this.allItems = document.querySelectorAll("#playlist");
  //   this.coverSize = this.allItems[0].getBoundingClientRect().width;
  //   this.containerSize = this.allItems.length * (this.coverSize + this.gap)
  //   console.log(this.allItems.length)
  // }

  // updatePosition(){
  //   this.tracks.forEach((track, index) => {
  //     track.elementImage.style.left = `${(index*(this.coverSize+this.gap)+this.scrollY+this.containerSize) % this.containerSize}px`
  //   })
  // }

  init() {
    this.cacheDOM();
    this.bindEvents();
    // this.setupDraggable();
    this.createAlbums();
    this.loadTrack();
    // this.initScroll();
  }
  // Rappelle toi que les "const" sont limité à leur portée de bloc (donc ici, à la fonction).
  // Alors que les membres de classes (this.truc) sont appelable n'importe ou dans la classe.

  initScroll(){
    document.addEventListener("wheel", this.handleScroll.bind(this));
  }

  handleScroll(e){
    this.scrollY += e.wheelDeltaY;
    this.updatePosition();
    console.log(this.scrollY);
  }

  createAlbums() {
    this.tracks.forEach(track => {
      const img = document.createElement("img");
      const li = document.createElement("li"); 
      img.src = track.img;
      li.appendChild(img);
      this.playlist.appendChild(li);
      track.elementImage = img;
    });
  }

  cacheDOM() {
    this.playlist = document.querySelector("#playlist");
    this.playButton = document.querySelector("#play");
    this.nextButton = document.querySelector("#next");
    this.prevButton = document.querySelector("#prev");
    this.trackTitle = document.querySelector("#track-title");
    // this.trackImage = document.querySelector("#url_img");
    this.trackArtist = document.querySelector("#track-artist");
    this.trackAlbum = document.querySelector("#track-album");
  }

  bindEvents() {
    this.playButton.addEventListener("click", () => this.togglePlay());
    this.nextButton.addEventListener("click", () => this.nextTrack());
    this.prevButton.addEventListener("click", () => this.prevTrack());
    this.audio.addEventListener("ended", () => this.nextTrack());
  }

  loadTrack() {
    if (this.currentTrackIndex < 0 || this.currentTrackIndex >= this.tracks.length) {
      console.error("Index de piste invalide");
      return;
    }

    if(this.oldElementImage) this.oldElementImage.classList.remove("albumL");
    this.tracks[this.currentTrackIndex].elementImage.classList.add("albumL");
    this.oldElementImage = this.tracks[this.currentTrackIndex].elementImage;

    this.audio.src = this.tracks[this.currentTrackIndex].url;
    this.trackTitle.textContent = this.tracks[this.currentTrackIndex].title;
    this.trackArtist.textContent = this.tracks[this.currentTrackIndex].artist;
    this.trackAlbum.textContent = this.tracks[this.currentTrackIndex].album;
  }

  togglePlay() {
    if (this.isPlaying) {     
      this.isPlaying = false 
      this.audio.pause();
    } else {
      this.isPlaying = true
      this.audio.play().catch(err => console.error("Erreur de lecture :", err));
    }
  console.log(this.isPlaying)
  }

  // Challenge : les fonction Next et previous track ont sensiblement le même traitement. En code, on cherche toujours à ne pas dupliquer de la logique, mais plutôt à factoriser.
  // Peux tu créer une seule fonction à la place de deux ? Comment gérerais tu le cas à ce moment ?

  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.loadTrack();
    this.audio.play(); // Bug: joue même si l'audio n'est pas chargé correctement
    this.isPlaying = true; 
  }

  prevTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.loadTrack();
    this.audio.play();
    this.isPlaying = true;
  }
}

new MusicPlayer();


// Fonctionnalités : Draggable
// On va utiiser Draggable pour drag n drop les images de notre slider, et passer d'une musique à l'autre
// https://gsap.com/docs/v3/Plugins/Draggable/

// Tu dois commencer par installer gsap dans ton projet : npm i gsap
// L'importer en haut du fichier, puis entre ton import et ta classe, ajouter gsap.registerPlugin(Draggable)

// On va créer une fonction setupDraggable que l'on va appeler ensuite dans le constructor. Elle contiendra la logique du drag.
// On va utiliser la fonction create de Draggable pour construire notre instance de Draggable.
// On voit dans la doc que Draggable a besoin d'un id de container HTML pour déclencher la feature de drag sur cet élément.
// En deuxième paramètre, c'est l'objet de config de cette instance draggable

// Dans cet objet veut utiliser le "Snap", c'est à dire la magnétisation vers un item lorsqu'on relache le drag
// Pour utiliser Snap, il faut également ajouter le Inertia Plugin, (normalement payant, mais la on peut simplement utiliser une version gratos)
// La façon de le faire est d'importer le fichier js https://assets.codepen.io/16327/InertiaPlugin.min.js, dans une balise script, dans ton fichier HTML.

// Bien, si tu cherches dans la doc de Draggable le mot "snap", tu vas trouver comment est ce qu'on s'en sert. Elle se déclenche dès lors que tu relâche le drag.

// Ton objectif est de lui passer la valeur vers laquelle il va se déplacer (en fonction de la où tu te trouves déjà)
// Indice : tu as besoin de la largeur de tes covers de musique.
// Teste, expérimente, réfléchis.


// Fonctionnalité : Split Text

// De même, on va utiliser le Plugin Split Text (normalement payant) de GSAP.
// Tu peux trouver le fichier à utiliser ici : https://codepen.io/GreenSock/full/OPqpRJ/


// De même, on va créer une fonction à appeler dans le constructeur pour "Split" tous nos titres en petits lignes, mots, ou caractères. Nomme la comme tu veux.
// Dedans, construit un SplitText comme dans la doc (avec le mot clef New)
// Split text prend en premier paramètre le selecteur (ID, class css...) à Splitter, et en second, un objet de config, comprenant le type en quoi casser ce texte : lines, words, chars.

// Tu peux regarder dans ton inspecteur, il aura automatiquement cassé le HTML en plus petits blocs.

// De la, tu peux utiliser la fonction gsap.from

// NB : gsap.to(), prends les valeurs par défaut de ton élément, et anime jusqu'aux valeurs que tu donnes dans le to()
// alors que gsap.from(), prend les valeurs que tu donnes dans le from(), et les anim jusqu'à la valeur de base de ton élément.

// ex: j'ai une div avec un background bleu par défaut, si je fais

// gsap.to('#element', {
//   duration: 1, 
//   backgroundColor: 'red'
// });

// il passera du bleu à rouge.
// alors que si je fais

// gsap.from('#element', {
//   duration: 1, 
//   backgroundColor: 'red'
// });

// il passera de rouge à bleu.

// Quand tu auras fait le split, tu voudras peut être qu'il soit caché par un bloc invisible.
// Indice : Tu peux surement y arriver avec une dif parente qui possède un overflow: hidden


// Si tu veux lancer les animations de texte sur le bon élément à chaque fois que tu changes de musique, il va falloir que tu créer une fonction qui sera appelée :
// A chaque snap (quand tu changes de musique avec Draggable)
// A chaque click sur (previous ou next)

// Tu voudras surement que tes éléments soient en absolute.
// Et tu cherches à lancer une fonction pour "cacher" ton split text précédent, et "faire apparaitre" ton split text suivant

// Je te laisse chercher et collaborer avec les autres :)