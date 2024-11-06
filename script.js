

//variables definition
let index = 0;
let forbackIcon = document.body.querySelectorAll(".forback_icon");
let audioSource = document.body.querySelector(".song source");
let title = document.body.querySelector(".title");
let singer = document.body.querySelector(".singer");
let image = document.body.querySelector(".song_image");
let playButton = document.body.querySelector(".play_icon i");
let playButtonB = document.body.querySelector(".play_icon");
let song = document.body.querySelector(".song");
let progress = document.body.querySelector("#progress");
let volumeControl = document.body.querySelector("#volume_controller");
let volumeIcon = document.body.querySelector(".volume i");
let previousVolume = song.volume;
let runningTime = document.body.querySelector("#first");
let totalTime = document.body.querySelector("#second");
let arraySize = songData.length;
let progressChange;
let songDuration;
let events = ["touchend", "click"];
let currentTime = song.currentTime;




//on loading page, song should be paused
function initializaSong() {
    let eachObject = songData[index];
    audioSource.setAttribute("src", eachObject.source);
    title.textContent = eachObject.title;
    singer.textContent = eachObject.singer;
    image.setAttribute("src", eachObject.image);
    image.style.animationPlayState = "paused";
    song.load();

    song.onloadedmetadata = function () {
        progress.min = 0;
        progress.max = song.duration;
        progress.value = song.currentTime;
        songDuration = song.duration;
        timeOfSong(songDuration);
    };
    song.pause();
}
initializaSong();




function changingSongData() {
    let eachObject = songData[index];
    audioSource.setAttribute("src", eachObject.source);
    title.textContent = eachObject.title;
    singer.textContent = eachObject.singer;
    image.setAttribute("src", eachObject.image);
    song.load();

    if (playButton.classList.contains("fa-play")) {
        song.pause();
        image.style.animationPlayState = "paused";
        playButton.classList.replace("fa-pause", "fa-play");
        clearInterval(progressChange);
    } else {
        image.style.animation = "infiniteRotation 23s linear infinite";
        image.style.animationPlayState = "running";
        updateProgressBar();
    }
}



//to play next song
function playNextSong() {
    index = (index + 1) % arraySize; //simplified modulus to reset index to start after last song
    changingSongData();
}
events.forEach(e => forbackIcon[1].addEventListener(e, playNextSong));




//to play previous song
function playPreviousSong() {
    index = (index - 1 + arraySize) % arraySize; //simplified modulus to reset index to end if before first song
    changingSongData();
}
events.forEach(e => forbackIcon[0].addEventListener(e, playPreviousSong));





//To pause and play the song custom icons
function playPauseSong(event) {
    if (event) event.preventDefault();

    if (playButton.classList.contains("fa-play")) {
        song.load();
        song.play().then(() => { //added then/catch to handle playback restrictions on mobile
            playButton.classList.replace("fa-play", "fa-pause");
            image.style.animation = "infiniteRotation 23s linear infinite";
            image.style.animationPlayState = "running";
            updateProgressBar();
        }).catch(error => {
            console.error("Playback error on mobile:", error);
        });
    } else {
        song.pause();
        playButton.classList.replace("fa-pause", "fa-play");
        image.style.animationPlayState = "paused";
        clearInterval(progressChange);
    }
}
events.forEach(e => playButtonB.addEventListener(e, playPauseSong));





function updateProgressBar() {
    song.play();
    playButton.classList.replace("fa-play", "fa-pause");
    progressChange = setInterval(() => {
        progress.value = song.currentTime;
        runningTime.textContent = `${Math.floor(song.currentTime / 60).toString().padStart(2, '0')}:${Math.floor(song.currentTime % 60).toString().padStart(2, '0')}`; //used padStart for double digits
        if (song.currentTime === songDuration) playNextSong();
    }, 1000);
}


//to change the progressBar on click
progress.oninput = function () {
    song.currentTime = progress.value;
    updateProgressBar();
};





//change the volume of music
function changeVolume() {
    song.volume = volumeControl.value / 100;
    volumeIcon.classList.toggle("fa-volume-xmark", song.volume === 0); //toggle used to manage icon on mute
    volumeIcon.classList.toggle("fa-volume-low", song.volume > 0);
    previousVolume = song.volume;
}
volumeControl.addEventListener("input", changeVolume);




//mute the sound
function muteVolume() {
    if (song.volume > 0) {
        previousVolume = song.volume;
        song.volume = 0;
        volumeControl.value = 0;
        volumeIcon.classList.replace("fa-volume-low", "fa-volume-xmark");
    } else {
        song.volume = previousVolume;
        volumeControl.value = previousVolume * 100;
        volumeIcon.classList.replace("fa-volume-xmark", "fa-volume-low");
    }
}
events.forEach(e => volumeIcon.addEventListener(e, muteVolume));




// Display total song duration
function timeOfSong(songDuration) {
    totalTime.textContent = `${Math.floor(songDuration / 60).toString().padStart(2, '0')}:${Math.floor(songDuration % 60).toString().padStart(2, '0')}`;
}