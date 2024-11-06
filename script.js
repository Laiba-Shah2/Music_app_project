//variables definition
let index = 0;
let forbackIcon = document.body.querySelectorAll(".forback_icon");
let audioSource = document.body.querySelector(".song source"); //Laiba it is good pra ctice to add semi (;) colen at the end or every statement
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
let events = ["touchend", "click"]; //Laiba beta always formate your code after writing some lins of code by pressing alt+shif+F
let currentTime = song.currentTime; //always try to add keywords when everywhere when making veriables

//on loading page song should be paused
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

//to play back song
function playBackSong() {
    index = (index - 1 + arraySize) % arraySize; //simplified modulus to reset index to end if before first song
    changingSongData();
}
events.forEach(e => forbackIcon[0].addEventListener(e, playBackSong));


// To pause and play the song custom icons
function playPauseSong(event) {
    if (event) event.preventDefault();

    if (playButton.classList.contains("fa-play")) {
        song.play().then(() => { // Play from current time, don't reload
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

// Debounce function to prevent multiple rapid clicks
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

//mute the sound
function muteVolume() {
    song.muted = !song.muted; // Toggle muted property

    if (song.muted) {
        // When muted, set volume icon to "muted" state
        volumeControl.value = 0;
        volumeIcon.classList.replace("fa-volume-low", "fa-volume-xmark");
    } else {
        // When unmuted, restore previous volume level
        volumeControl.value = previousVolume * 100;
        volumeIcon.classList.replace("fa-volume-xmark", "fa-volume-low");
        song.volume = previousVolume; // Restore volume
    }
}

// Debounce the muteVolume function
const debouncedMuteVolume = debounce(muteVolume, 300);

// Add event listeners with debounced function for mobile support
events.forEach(e => volumeIcon.addEventListener(e, debouncedMuteVolume));



// Display total song duration
function timeOfSong(songDuration) {
    totalTime.textContent = `${Math.floor(songDuration / 60).toString().padStart(2, '0')}:${Math.floor(songDuration % 60).toString().padStart(2, '0')}`;
}
