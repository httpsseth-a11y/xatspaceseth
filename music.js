// Player de música
const tracks = [
  { name: "Amiga Mía", artist: "Alejandro Sanz", duration: "4:28", file: "musicas/alejandrosanz.mp3", cover: "https://i.ibb.co/Rpjdgqp3/images-q-tbn-ANd9-Gc-QNt-RLg5-JOt-R6-QN93-Cmevl-SXDr2-Kq-T-0-y-FA-s.jpg" },
  { name: "Me Gustas Tu", artist: "Manu Chao", duration: "3:58", file: "musicas/megustas.mp3", cover: "https://i.ibb.co/9kz85Pw8/image.png" },
  { name: "Cotillón", artist: "Indios", duration: "3:42", file: "musicas/indios.mp3", cover: "https://i.ibb.co/DfHWZJzT/image.png" },
  { name: "Aquel Lugar", artist: "Adolescent's Orquesta", duration: "4:15", file: "musicas/aquel.mp3", cover: "https://i.ibb.co/B58QN10z/image.png" },
  { name: "Si Te Vas", artist: "Marc Anthony", duration: "5:10", file: "musicas/sitevas.mp3", cover: "https://i.ibb.co/Ndm9GZqw/image.png" }
];

let currentTrack = 0;
let isPlaying = false;

// Criar elemento de áudio
const audio = new Audio();
audio.volume = 0.7;

const trackName = document.getElementById('track-name');
const artistName = document.getElementById('artist-name');
const albumArt = document.querySelector('.album-art');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const trackItems = document.querySelectorAll('.track-item');
const progressBar = document.getElementById('progress');
const progressContainer = document.querySelector('.progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume');
const spinningDisc = document.getElementById('spinning-disc');

function setDiscSpinning(active) {
  if (!spinningDisc) return;
  spinningDisc.classList.toggle('spinning', active);
}

// Carregar track
function loadTrack(index) {
  currentTrack = index;
  audio.src = tracks[index].file;
  trackName.textContent = tracks[index].name;
  artistName.textContent = tracks[index].artist;

  if (albumArt) {
    if (tracks[index].cover) {
      albumArt.style.backgroundImage = `url('${tracks[index].cover}')`;
      albumArt.textContent = '';
    } else {
      albumArt.style.backgroundImage = '';
      albumArt.textContent = '♪';
    }
  }
  
  // Remover active de todos
  trackItems.forEach(item => item.classList.remove('active'));
  // Adicionar active ao atual
  trackItems[index].classList.add('active');
}

// Formatar tempo
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Play/Pause
playBtn.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
    playBtn.textContent = '▶';
    playBtn.classList.remove('playing');
  } else {
    audio.play();
    playBtn.textContent = '⏸';
    playBtn.classList.add('playing');
  }
  isPlaying = !isPlaying;
});

// Previous
prevBtn.addEventListener('click', () => {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrack);
  if (isPlaying) {
    audio.play();
  }
});

// Next
nextBtn.addEventListener('click', () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);
  if (isPlaying) {
    audio.play();
  }
});

// Atualizar progresso
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = progress + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
});

// Quando carrega metadados
audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('play', () => setDiscSpinning(true));
audio.addEventListener('pause', () => setDiscSpinning(false));

// Clique/Toque na barra de progresso para buscar (adiantar/voltar)
function seekToPosition(clientX) {
  if (!audio.duration || !progressContainer) return;
  const rect = progressContainer.getBoundingClientRect();
  const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
  const ratio = x / rect.width;
  audio.currentTime = ratio * audio.duration;
}

if (progressContainer) {
  progressContainer.addEventListener('click', (e) => {
    seekToPosition(e.clientX);
  });

  // Suporte a toque em dispositivos móveis
  progressContainer.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      seekToPosition(e.touches[0].clientX);
    }
  }, { passive: true });
}

// Quando termina a música
audio.addEventListener('ended', () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);
  audio.play();
});

// Controle de volume
const volumeIcon = document.querySelector('.volume-icon');
let previousVolume = 0.7;

// SVG paths para diferentes níveis de volume
const volumeIcons = {
  high: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
  medium: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>',
  muted: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>'
};

function updateVolumeIcon(volume) {
  if (volume === 0) {
    volumeIcon.innerHTML = volumeIcons.muted;
    volumeIcon.classList.add('muted');
  } else if (volume < 0.5) {
    volumeIcon.innerHTML = volumeIcons.medium;
    volumeIcon.classList.remove('muted');
  } else {
    volumeIcon.innerHTML = volumeIcons.high;
    volumeIcon.classList.remove('muted');
  }
}

if (volumeSlider) {
  volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    audio.volume = volume;
    updateVolumeIcon(volume);
  });
}

// Clicar no ícone de volume para mutar/desmutar
if (volumeIcon) {
  volumeIcon.addEventListener('click', () => {
    if (audio.volume > 0) {
      previousVolume = audio.volume;
      audio.volume = 0;
      volumeSlider.value = 0;
      updateVolumeIcon(0);
    } else {
      audio.volume = previousVolume;
      volumeSlider.value = previousVolume * 100;
      updateVolumeIcon(previousVolume);
    }
  });
}

// Clicar em track da playlist
trackItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    loadTrack(index);
    audio.play();
    playBtn.textContent = '⏸';
    playBtn.classList.add('playing');
    isPlaying = true;
  });
});

// Salvar estado da música no localStorage
function saveMusicState() {
  const state = {
    trackIndex: currentTrack,
    currentTime: audio.currentTime,
    isPlaying: isPlaying,
    volume: audio.volume
  };
  localStorage.setItem('musicPlayerState', JSON.stringify(state));
}

// Carregar estado da música do localStorage
function loadMusicState() {
  const savedState = localStorage.getItem('musicPlayerState');
  if (savedState) {
    try {
      const state = JSON.parse(savedState);
      currentTrack = state.trackIndex || 0;
      loadTrack(currentTrack);
      audio.volume = state.volume || 0.7;
      volumeSlider.value = (state.volume || 0.7) * 100;
      updateVolumeIcon(audio.volume);
      
      // Não tocar automaticamente
      playBtn.textContent = '▶';
      playBtn.classList.remove('playing');
      isPlaying = false;
    } catch (e) {
      console.error('Erro ao carregar estado da música:', e);
    }
  }
}

// Salvar estado periodicamente
setInterval(saveMusicState, 1000);

// Salvar ao sair da página
window.addEventListener('beforeunload', saveMusicState);

// Carregar estado ao iniciar
loadMusicState();

// Se não havia estado salvo, carregar primeira música
if (!localStorage.getItem('musicPlayerState')) {
  loadTrack(0);
}
