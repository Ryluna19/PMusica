const musicRows = Array.from(document.querySelectorAll(".music-row"));

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

let currentIndex = 0;
let isPlaying = false;

const playlist = musicRows.map((row) => ({
    name: row.dataset.name,
    author: row.dataset.author,
    image: row.dataset.image,
    audio: row.dataset.audio
}));

function secondsToMinutes(time) {
    if (!time || Number.isNaN(time)) {
        return "00:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateActiveRow() {
    musicRows.forEach((row, index) => {
        row.classList.toggle("active", index === currentIndex);
    });
}

function loadMusic(index) {
    if (playlist.length === 0) {
        return;
    }

    currentIndex = index;

    const music = playlist[currentIndex];

    currentImg.src = music.image;
    currentName.innerText = music.name;
    currentArtist.innerText = music.author;

    audioPlayer.src = music.audio;
    audioPlayer.volume = Number(volume.value) / 100;

    progressbar.value = 0;
    currentDuration.innerText = "00:00";
    totalDuration.innerText = "00:00";

    updateActiveRow();
}

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

function pauseMusic() {
    audioPlayer.pause();

    isPlaying = false;
    playButtonIcon.classList.remove("bi-pause-fill");
    playButtonIcon.classList.add("bi-play-fill");
}

function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function nextMusic() {
    if (playlist.length === 0) {
        return;
    }

    currentIndex = (currentIndex + 1) % playlist.length;
    loadMusic(currentIndex);
    playMusic();
}

function previousMusic() {
    if (playlist.length === 0) {
        return;
    }

    currentIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    loadMusic(currentIndex);
    playMusic();
}

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

playButton.addEventListener("click", togglePlay);
nextButton.addEventListener("click", nextMusic);
prevButton.addEventListener("click", previousMusic);

audioPlayer.addEventListener("loadedmetadata", () => {
    progressbar.max = Math.floor(audioPlayer.duration);
    totalDuration.innerText = secondsToMinutes(audioPlayer.duration);
});

audioPlayer.addEventListener("timeupdate", () => {
    progressbar.value = Math.floor(audioPlayer.currentTime);
    currentDuration.innerText = secondsToMinutes(audioPlayer.currentTime);
});

audioPlayer.addEventListener("ended", nextMusic);

progressbar.addEventListener("input", () => {
    audioPlayer.currentTime = Number(progressbar.value);
});

volume.addEventListener("input", () => {
    audioPlayer.volume = Number(volume.value) / 100;
});

if (playlist.length > 0) {
    loadMusic(0);
}