import { musicLists } from '/js/musicLib.js';

const audioContext = new AudioContext();
const sampleAudio = document.querySelector("audio");
const audioTracker = document.getElementById("audioTracker");
const balancingPannerControl = document.getElementById("panner");
const pannerOptions = { pan: 0 };
const panner = new StereoPannerNode(audioContext, pannerOptions);
const track = audioContext.createMediaElementSource(sampleAudio);
const gainNode = audioContext.createGain();
track.connect(gainNode).connect(panner).connect(audioContext.destination);

const playButton = document.querySelector("#playPause");
const stopButton = document.getElementById("stop");
const volumeController = document.getElementById("volume");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const shuffleButton = document.getElementById("shuffle");
const songName = document.getElementById("songName");
const albumImg = document.getElementById("albumImg");
const songArtist = document.getElementById("songArtist");

let currentIndex = 0;

songName.innerText = musicLists[currentIndex].songName;
songArtist.innerText = musicLists[currentIndex].artist;
albumImg.src = musicLists[currentIndex].albumImage;

playButton.addEventListener("click", async () => {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  if (playButton.dataset.playing === "false") {
    sampleAudio.src = musicLists[currentIndex].fileSrc;
    songName.innerText = musicLists[currentIndex].songName;
    songArtist.innerText = musicLists[currentIndex].artist;
    sampleAudio.play();
    playButton.dataset.playing = "true";
    sampleAudio.currentTime = audioTracker.value;
  } else {
    sampleAudio.pause();
    playButton.dataset.playing = "false";
  }
});

sampleAudio.addEventListener("ended", () => {
  playButton.dataset.playing = "false";
  currentIndex = (currentIndex + 1) % musicLists.length; // Circular indexing to loop back to the beginning
  sampleAudio.src = musicLists[currentIndex].fileSrc;
  sampleAudio.play();
});

sampleAudio.addEventListener("loadedmetadata", () => {
  audioTracker.max = sampleAudio.duration;
});

sampleAudio.addEventListener("timeupdate", () => {
  audioTracker.value = sampleAudio.currentTime;
});

audioTracker.addEventListener("input", () => {
  sampleAudio.currentTime = audioTracker.value;
});

stopButton.addEventListener("click", () => {
  sampleAudio.pause();
  sampleAudio.currentTime = 0;
  playButton.dataset.playing = "false";
});

volumeController.addEventListener("input", () => {
  gainNode.gain.value = volumeController.value;
});

prevButton.addEventListener('click', () => {
  currentIndex = currentIndex === 0 ? musicLists.length - 1 : (currentIndex - 1 + musicLists.length) % musicLists.length;
  sampleAudio.src = musicLists[currentIndex].fileSrc;
  songName.innerText = musicLists[currentIndex].songName;
  songArtist.innerText = musicLists[currentIndex].artist;
  albumImg.src = musicLists[currentIndex].albumImage;
  sampleAudio.play();
});

nextButton.addEventListener('click', () => {
  currentIndex = currentIndex === 0 ? 1 : (currentIndex + 1) % musicLists.length;
  sampleAudio.src = musicLists[currentIndex].fileSrc;
  songName.innerText = musicLists[currentIndex].songName;
  songArtist.innerText = musicLists[currentIndex].artist;
  albumImg.src = musicLists[currentIndex].albumImage;
  sampleAudio.play();
});

function shuffle(array) {
  let newArray = array.slice(); // Create a copy of the input array
  let currentIndex = newArray.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
  }

  return newArray;
}

shuffleButton.addEventListener("click", () => {

  let shuff = shuffle(musicLists);
  console.log(shuff);
})

balancingPannerControl.addEventListener("input",
  () => {
    panner.pan.value = balancingPannerControl.value;
  },
);