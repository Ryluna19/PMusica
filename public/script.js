// Select DOM elements used by the music player and filters
const musicRows = Array.from(document.querySelectorAll(".music-row"));
const filterButtons = Array.from(document.querySelectorAll(".playlist-filter"));

const searchInput = document.querySelector("#search-music");
const playlistTitle = document.querySelector("#playlistTitle");
const playlistCount = document.querySelector("#playlistCount");

const audioPlayer = document.querySelector("#audio-player");
const currentImg = document.querySelector("#currentImg");
const currentName = document.querySelector("#currentName");
const currentArtist = document.querySelector("#currentArtist");

const playButton = document.querySelector("#play-control");
const playButtonIcon = playButton.querySelector("i");

const prevButton = document.querySelector("#prev-control");
const nextButton = document.querySelector("#next-control");

const progressbar = document.querySelector("#progressbar");
const volume = document.querySelector("#volume");

const currentDuration = document.querySelector("#current-duration");
const totalDuration = document.querySelector("#total-duration");

// Player state
let currentIndex = 0;
let isPlaying = false;
let selectedPlaylist = "all";
let filteredIndexes = [];

// Build playlist data from the music rows rendered by EJS
const playlist = musicRows.map((row) => ({
  name: row.dataset.name,
  author: row.dataset.author,
  playlist: row.dataset.playlist || "Geral",
  image: row.dataset.image,
  audio: row.dataset.audio
}));

// Convert seconds into mm:ss format
function secondsToMinutes(time) {
  if (!time || Number.isNaN(time)) {
    return "00:00";
  }

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Highlight the selected song in the list
function updateActiveRow() {
  musicRows.forEach((row, index) => {
    row.classList.toggle("active", index === currentIndex);
  });
}

// Filter songs by selected playlist and search input
function applyFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  filteredIndexes = [];

  musicRows.forEach((row, index) => {
    const music = playlist[index];

    const matchesPlaylist =
      selectedPlaylist === "all" || music.playlist === selectedPlaylist;

    const matchesSearch =
      !searchTerm ||
      music.name.toLowerCase().includes(searchTerm) ||
      music.author.toLowerCase().includes(searchTerm) ||
      music.playlist.toLowerCase().includes(searchTerm);

    const shouldShow = matchesPlaylist && matchesSearch;

    row.hidden = !shouldShow;

    if (shouldShow) {
      filteredIndexes.push(index);
    }
  });

  playlistTitle.innerText =
    selectedPlaylist === "all" ? "Todas as músicas" : selectedPlaylist;

  playlistCount.innerText = `${filteredIndexes.length} música(s)`;

  updateActiveRow();
}

// Load selected song data into the player
function loadMusic(index) {
  if (playlist.length === 0) {
    return;
  }

  currentIndex = index;

  const music = playlist[currentIndex];

  currentImg.src = music.image;
  currentName.innerText = music.name;
  currentArtist.innerText = `${music.author} • ${music.playlist}`;

  audioPlayer.src = music.audio;
  audioPlayer.volume = Number(volume.value) / 100;

  progressbar.value = 0;
  currentDuration.innerText = "00:00";
  totalDuration.innerText = "00:00";

  updateActiveRow();
}

// Start playing the current song
async function playMusic() {
  if (playlist.length === 0) {
    return;
  }

  if (!audioPlayer.src) {
    loadMusic(currentIndex);
  }

  if (audioPlayer.ended) {
    audioPlayer.currentTime = 0;
  }

  try {
    await audioPlayer.play();

    isPlaying = true;
    playButtonIcon.classList.remove("bi-play-fill");
    playButtonIcon.classList.add("bi-pause-fill");
  } catch (error) {
    console.error("Erro ao reproduzir a música:", error);
  }
}

// Pause the current song
function pauseMusic() {
  audioPlayer.pause();

  isPlaying = false;
  playButtonIcon.classList.remove("bi-pause-fill");
  playButtonIcon.classList.add("bi-play-fill");
}

// Toggle between play and pause
function togglePlay() {
  if (isPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

// Get next visible song based on active filters
function getNextFilteredIndex() {
  if (filteredIndexes.length === 0) {
    return null;
  }

  const currentPosition = filteredIndexes.indexOf(currentIndex);

  if (currentPosition === -1 || currentPosition === filteredIndexes.length - 1) {
    return filteredIndexes[0];
  }

  return filteredIndexes[currentPosition + 1];
}

// Get previous visible song based on active filters
function getPreviousFilteredIndex() {
  if (filteredIndexes.length === 0) {
    return null;
  }

  const currentPosition = filteredIndexes.indexOf(currentIndex);

  if (currentPosition === -1 || currentPosition === 0) {
    return filteredIndexes[filteredIndexes.length - 1];
  }

  return filteredIndexes[currentPosition - 1];
}

// Play the next visible song
function nextMusic() {
  const nextIndex = getNextFilteredIndex();

  if (nextIndex === null) {
    return;
  }

  loadMusic(nextIndex);
  playMusic();
}

// Play the previous visible song
function previousMusic() {
  const previousIndex = getPreviousFilteredIndex();

  if (previousIndex === null) {
    return;
  }

  loadMusic(previousIndex);
  playMusic();
}

// Handle song row clicks
musicRows.forEach((row, index) => {
  row.addEventListener("click", () => {
    const isSameMusic = index === currentIndex && audioPlayer.src;

    if (isSameMusic) {
      togglePlay();
      return;
    }

    loadMusic(index);
    playMusic();
  });
});

// Handle playlist filter clicks
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedPlaylist = button.dataset.playlistFilter;

    filterButtons.forEach((filterButton) => {
      filterButton.classList.remove("active");
    });

    button.classList.add("active");

    applyFilters();
  });
});

// Handle search input
searchInput.addEventListener("input", applyFilters);

// Handle player controls
playButton.addEventListener("click", togglePlay);
nextButton.addEventListener("click", nextMusic);
prevButton.addEventListener("click", previousMusic);

// Update total duration when audio metadata loads
audioPlayer.addEventListener("loadedmetadata", () => {
  progressbar.max = Math.floor(audioPlayer.duration);
  totalDuration.innerText = secondsToMinutes(audioPlayer.duration);
});

// Update progress while the song plays
audioPlayer.addEventListener("timeupdate", () => {
  progressbar.value = Math.floor(audioPlayer.currentTime);
  currentDuration.innerText = secondsToMinutes(audioPlayer.currentTime);
});

// Automatically play the next song when current song ends
audioPlayer.addEventListener("ended", nextMusic);

// Allow user to seek through the song
progressbar.addEventListener("input", () => {
  audioPlayer.currentTime = Number(progressbar.value);
});

// Control audio volume
volume.addEventListener("input", () => {
  audioPlayer.volume = Number(volume.value) / 100;
});

// Initial page setup
if (playlist.length > 0) {
  loadMusic(0);
}

applyFilters();