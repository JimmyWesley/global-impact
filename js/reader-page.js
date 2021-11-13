
// Desenvolvido por Jimmy Wesley Maciel Soares

const audioContainer = document.getElementById('rp-audio-container');

audioContainer.classList.add('audio-container');
audioContainer.innerHTML = `
<div class="audio-info">
<h4 id="rp-title"></h4>
<div class="progress-container" id="rp-progress-container">
  <div class="progress" id="rp-progress"></div>
</div>
</div>
<audio src="#" id="rp-audio"></audio>
<div class="img-container">
<img src="images/girl-read.gif" alt="audio-cover" id="rp-cover" />
</div>
<div class="navigation">
<button id="rp-prev" class="action-btn">
  ⏮
</button>
<button id="rp-play" class="action-btn action-btn-big">
 ▶️
</button>
<button id="rp-next" class="action-btn">
  ⏭
</button>
</div>`;

const playBtn = document.getElementById('rp-play');
const prevBtn = document.getElementById('rp-prev');
const nextBtn = document.getElementById('rp-next');

const audio = document.getElementById('rp-audio');
const progress = document.getElementById('rp-progress');
const progressContainer = document.getElementById('rp-progress-container');
const title = document.getElementById('rp-title');
const cover = document.getElementById('rp-cover');
const currTime = document.querySelector('#currTime');
const durTime = document.querySelector('#durTime');

const audios=[];

document.querySelectorAll('h1,h2,h3,h4,h5,img,p').forEach(function(e){if(e.outerText.length > 0 )audios.push(e.outerText.trim())});

var songIndex = 0;

loadSong(audios[0]);

// Update song details
function loadSong(str) {
  title.innerText = str;
  audio.src = `https://text-to-speech-demo.ng.bluemix.net/api/v3/synthesize?text=`+encodeURIComponent(str.trim())+`&voice=pt-BR_IsabelaV3Voice&accept=audio/mp3`;  
}

// Play song
function playSong() {
  audioContainer.classList.add('play');
  playBtn.innerText = "⏸";

  audio.play();
}

// Pause song
function pauseSong() {
  audioContainer.classList.remove('play');  
  playBtn.innerText = "▶️";
  audio.pause();
}

// Previous song
function prevSong() {
  songIndex--;

  if (songIndex < 0) {
    songIndex = audios.length - 1;
  }

  loadSong(audios[songIndex]);

  playSong();
}

// Next song
function nextSong() {
  songIndex++;

  if (songIndex > audios.length - 1) {
    songIndex = 0;
  }

  loadSong(audios[songIndex]);

  playSong();
}

// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

// Set progress bar
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = audioContainer.classList.contains('play');

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Change song
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Time/song update
audio.addEventListener('timeupdate', updateProgress);

// Click on progress bar
progressContainer.addEventListener('click', setProgress);

// Song ends
audio.addEventListener('ended', nextSong);

// Time of song
try {
audio.addEventListener('timeupdate',DurTime);  
}catch(error){
}