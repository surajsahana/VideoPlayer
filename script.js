const player = document.querySelector('.player');
const video = document.querySelector('video');
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.getElementById('play-btn');
const volumeIcon = document.getElementById('volume-icon');
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');
const currentTime = document.querySelector('.time-elapsed');
const duration = document.querySelector('.time-duration');
const speed = document.querySelector('.player-speed');
const fullscreenBtn = document.querySelector('.fullscreen');

// Play & Pause ----------------------------------- //

function showPlayIcon() {
	playBtn.classList.replace('fa-pause', 'fa-play');
	playBtn.setAttribute('title', 'Play');
}

function togglePlay() {
	if(video.paused) {
		video.play();
		playBtn.classList.replace('fa-play', 'fa-pause');
		playBtn.setAttribute('title', 'Pause');
	}else{
		video.pause();
		showPlayIcon();
	}
}

// On video end, show play button icon
video.addEventListener('ended', showPlayIcon);

// Progress Bar ---------------------------------- //

// calculate display time format
function displayTime(time) {
	const minutes = Math.floor(time / 60);
	let seconds = Math.floor(time % 60);
	seconds = seconds > 9 ? seconds : `0${seconds}`;
	return `${minutes}:${seconds}`;
}

// update progress bar as the video plays
function updateProgress() {
	progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
	currentTime.textContent = `${displayTime(video.currentTime)} / `;
	duration.textContent = `${displayTime(video.duration)}`;
}

// click to seek within the video
function setProgress(e) {
	const newTime = e.offsetX / progressRange.offsetWidth;
	progressBar.style.width = `${newTime * 100}%`;
	video.currentTime = newTime * video.duration;
}

// Volume Controls --------------------------- //


let lastVolume = 1;

// Volume bar
function changeVolume(e) {
	let volume = e.offsetX / volumeRange.offsetWidth;
	// Rounding volume up and down
	if(volume < 0.1) {
		volume = 0;
	}

	if(volume > 0.9) {
		volume = 1;
	}

	volumeBar.style.width = `${volume * 100}%`;
	video.volume = volume;

	// Change volume icon depending on volume
	volumeIcon.className = '';
	if(volume > 0.7) {
		volumeIcon.classList.add('fas', 'fa-volume-up');
	}else if(volume <= 0.7 && volume > 0) {
		volumeIcon.classList.add('fas', 'fa-volume-down');
	}else if(volume === 0) {
		volumeIcon.classList.add('fas', 'fa-volume-off');
	}

	lastVolume = volume;
}

// Mute/Unmute function by clicking on the volume button
function toggleMute() {
	volumeIcon.className = '';
	if(video.volume) {
		lastVolume = video.volume;
		video.volume = 0;
		volumeBar.style.width = 0;
		volumeIcon.classList.add('fas', 'fa-volume-mute');
		volumeIcon.setAttribute('title', 'Unmute');
	}else {
		video.volume = lastVolume;
		volumeBar.style.width = `${lastVolume * 100}%`;
		
		if(video.volume > 0.7) {
		volumeIcon.classList.add('fas', 'fa-volume-up');
		}else if(video.volume < 0.7 && video.volume > 0) {
		volumeIcon.classList.add('fas', 'fa-volume-down');
		}else if(video.volume === 0) {
		volumeIcon.classList.add('fas', 'fa-volume-off');
		};
		
		volumeIcon.setAttribute('title', 'Mute');
	}
}

// Change Playback Speed -------------------- //

function changeSpeed() {
	video.playbackRate = speed.value;
}

// Fullscreen ------------------------------- //

// Start fullscreen
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }

  video.classList.add('video-fullscreen');
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }

	video.classList.remove('video-fullscreen');

}

let fullscreen = false;

//  Toggle fullscreen
function toggleFullscreen() {
	console.log(fullscreen);
	!fullscreen ? openFullscreen(player) : closeFullscreen(player);

	fullscreen = !fullscreen;
} 

// Event Listeners
playBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('canplay', updateProgress);
progressRange.addEventListener('click', setProgress);
volumeRange.addEventListener('click', changeVolume);
volumeIcon.addEventListener('click', toggleMute);
speed.addEventListener('change', changeSpeed);
fullscreenBtn.addEventListener('click', toggleFullscreen);

// Event listeners on the keyboard button
document.body.onkeyup = function(e) {
	// Play/Pause with the help of spacebar and enter key
	if(e.keyCode === 32 || e.keyCode == 13) {
		togglePlay();
	}

	// Toggle Fullscreen with the help of F button
	// Exit Fullscreen with the help of esc key
	if(e.keyCode === 27 && fullscreen === true || e.keyCode === 70) {
		//video.classList.remove('video-fullscreen');
		toggleFullscreen();
	}

	// Toggle Mute with the help of M key
	if(e.keyCode === 77) {
		toggleMute();
	}
}