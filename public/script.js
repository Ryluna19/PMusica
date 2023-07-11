// logica é : identificar a onde esta cliclando(determinar a terefa) -> tudo vai ser apartir dos controles
// vamos captar os eventops do player(controls) que esta na <section id="controls">

const controls = document.querySelector("#controls");
const btnPlay = document.querySelector("#play-control");

let index = 0; //primeira musica do player
let currentMusic;
let isPlaying = false;

controls.addEventListener("click", function (event) {
    const audios = [];
    let music = {};
    console.log(event);
    //const musics = event.path[2].childNodes[3].childNodes[5].childNodes[1].childNodes[3].childNodes;
    //console.log(musics);
    if (event.target.id != "controls") {
        const nodeList = document.body.childNodes
        const musics = nodeList[3].childNodes[5].childNodes[1].childNodes[3].childNodes;

        musics.forEach(function (item) {
            if (item.nodeName != "#text") {
                music.name = item.childNodes[3].childNodes[0].data; // identifica o nome da musica  
                music.artist = item.childNodes[5].childNodes[0].data; // identifica o artista da musica 
                music.image = item.childNodes[1].childNodes[0].currentSrc; // identifica a imagem da musica
                music.audio = item.childNodes[7].childNodes[1]; // identifica o audio da musica
                audios.push(music);
                music = {};// identifico o nome da musica 
            }
        });
         
    }
    console.log(audios);   

    function updateDataMusic(){
        currentMusic = audios[index]//
        document.querySelector("#currentImg").src = currentMusic.image;
        document.querySelector("#currentName").innerText = currentMusic.name;
        document.querySelector("#currentArtist").innerText = currentMusic.artist;
        document.querySelector("#volume").value = currentMusic.audio.volume * 100;

        const progressbar = document.querySelector("#progressbar");
        const textCurrentDuration = document.querySelector("#current-duration");
        const textTotalDuration = document.querySelector("#total-duration");

        progressbar.max = currentMusic.audio.duration;
        textTotalDuration.innerText = secondsToMinutes(currentMusic.audio.duration);


        currentMusic.audio.ontimeupdate = function (){
            textCurrentDuration.innerText = secondsToMinutes(
                currentMusic.audio.currentTime
            );
            progressbar.valueAsNumber = currentMusic.audio.currentTime;
        };
        
    }
    updateDataMusic();
});

function secondsToMinutes(time){
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`;
}