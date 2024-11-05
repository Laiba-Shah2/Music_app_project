
//variables definition
let index = 0;
let forbackIcon = document.body.querySelectorAll(".forback_icon");
let audioSource = document.body.querySelector(".song source")
let title = document.body.querySelector(".title");
let singer = document.body.querySelector(".singer");
let image = document.body.querySelector(".song_image")
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
let events= ["touchend","click"]
currentTime = song.currentTime;


//on loading page song should be paused
function initializaSong(){

    let eachObject = songData[index];
    audioSource.setAttribute("src", eachObject.source);
    title.textContent = eachObject.title;
    singer.textContent = eachObject.singer;
    image.setAttribute("src", eachObject.image);
    image.style.animationPlayState = "paused";
    song.load();

    song.onloadedmetadata = function() {
 
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
    
    // Set new audio and image sources
    audioSource.setAttribute("src", eachObject.source);
    title.textContent = eachObject.title;
    singer.textContent = eachObject.singer;
    image.setAttribute("src", eachObject.image);

    // Load the audio and wait until it is ready before playing
    song.load();
    
    // Add an event listener to play only once the audio is loaded
    song.addEventListener("canplaythrough", () => {
        if (!playButton.classList.contains("fa-play")) { 
            // Handle play state and rotation
            song.play();
            image.style.transform = "rotate(0deg)";
            image.style.animation = "none"; // Stop previous animation

            setTimeout(() => {
                image.style.animation = "infiniteRotation 23s linear infinite";
                image.style.animationPlayState = "running";
            }, 0);

            updateProgressBar();
        } else {
            // If paused, pause the song and reset the image state
            song.pause();
            image.style.animationPlayState = "paused";
            playButton.classList.replace("fa-pause", "fa-play");
            clearInterval(progressChange);
        }
    }, { once: true }); // Ensures the listener runs only once
}





//to play next song
function playNextSong() {
    if (index === arraySize - 1) {
        index = 0; // Reset to the first song when reaching the end of the array
    } else {
        index++;
    }
    changingSongData()
    
    
}
events.forEach((e)=>{forbackIcon[1].addEventListener(e, playNextSong);}) 




//to play the back song
function playBackSong() {
    if (index === 0) {
        index = arraySize - 1; // Go to the last song if at the first song
    } else {
        index--;
    }
   changingSongData()

}
events.forEach((e)=>{forbackIcon[0].addEventListener(e, playBackSong);}) 





//To pause and play the song custom icons
function playPauseSong() {

    if (playButton.classList.contains("fa-play")) {

        updateProgressBar();     
        image.style.animation = "infiniteRotation 23s linear infinite";
        image.style.animationPlayState = "running";

    }

    else {
        song.pause();
        image.style.animationPlayState = "paused";
        playButton.classList.replace("fa-pause", "fa-play");
        clearInterval(progressChange);
    }
    


}
events.forEach((e)=>{playButtonB.addEventListener(e, playPauseSong);}) 

playButtonB.addEventListener("keypress",function(e){

    if (e.code === "Space"){
        playPauseSong();

    }
})



song.onloadedmetadata = function () {


    progress.min = 0;
    progress.max = song.duration;
    progress.value = song.currentTime;
    songDuration = song.duration;
    timeOfSong(songDuration);
    runningTime.textContent = `${Math.floor(song.currentTime / 60) < 10 ? "0" : ""}${Math.floor(song.currentTime / 60)}:${Math.floor(song.currentTime % 60) < 10 ? "0" : ""}${Math.floor(song.currentTime % 60)}`;


}



//updatingprogress bar and rotaion of image as the song will played 
function updateProgressBar() {


    // Math.floor(song.currentTime / 60);to get minutes
    // Math.floor(song.currentTime % 60);to get seconds       
             song.play();
             playButton.classList.replace("fa-play", "fa-pause");
    
            progressChange = setInterval(() => {
            progress.value = song.currentTime;           
            runningTime.textContent = `${Math.floor(song.currentTime / 60) < 10 ? "0" : ""}${Math.floor(song.currentTime / 60)}:${Math.floor(song.currentTime % 60) < 10 ? "0" : ""}${Math.floor(song.currentTime % 60)}`;
            if (song.currentTime == songDuration){forbackIcon[1].click();};
            
        }, 1000); // Use 1000ms (1 second) interval 

    

}



//to change the progressBar on click
progress.oninput = function () {

    song.currentTime = progress.value;
    updateProgressBar();

}




//change the volume of music
function changeVolume() {

    song.volume = (volumeControl.value) / 100;
    if (song.volume == 0) {
        volumeIcon.classList.replace("fa-volume-low", "fa-volume-xmark")
    }
    else {
        volumeIcon.classList.replace("fa-volume-xmark", "fa-volume-low")
        previousVolume = song.volume;
    }

}
volumeControl.addEventListener("input", changeVolume)





//mute the sound
function muteVolume() {



    if (volumeIcon.classList.contains("fa-volume-low")) {
        previousVolume = song.volume; // Save current volume before muting
        song.volume = 0;
        volumeControl.value = 0;
        volumeIcon.classList.replace("fa-volume-low", "fa-volume-xmark");
    } else {
        song.volume = previousVolume;
        volumeControl.value = previousVolume * 100;
        volumeIcon.classList.replace("fa-volume-xmark", "fa-volume-low");
    }


}


events.forEach((e)=>{volumeIcon.addEventListener(e, muteVolume);}) 




function timeOfSong(songDuration) {

    let minutes = Math.floor(songDuration / 60);
    let seconds = Math.floor(songDuration % 60);
    totalTime.textContent = ` ${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    // console.log(minutes);
    

}


