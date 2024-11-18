const pianokeys = document.querySelectorAll(".piano-keys .key");
const volumeSlider = document.querySelector(".volume-slider input");
const keysCheckbox = document.querySelector(".keys-checkbox input");

//Call Audio
let allKeys = [],
  audio = new Audio("asset/sound/a.wav");

const playTune = (key) => {
  audio.src = `asset/sound/${key}.wav`;
  audio.play();

  //Add animation when using keyboard
  const clickedKey = document.querySelector(`[data-key="${key}"]`);
  clickedKey.classList.add("active");
  setTimeout(() => {
    clickedKey.classList.remove("active");
  }, 150);
};

//Play sound using mouse
pianokeys.forEach((key) => {
  allKeys.push(key.dataset.key);
  key.addEventListener("click", () => playTune(key.dataset.key));
});

//Hide key
const handleHideKey = (e) => {
  pianokeys.forEach((key) => key.classList.toggle("hide"));
};

//Volume
const handleVolume = (e) => {
  audio.volume = e.target.value;
};

//Play sound using keyboard
const pressedKey = (e) => {
  if (allKeys.includes(e.key)) {
    playTune(e.key);
  }
};

keysCheckbox.addEventListener("click", handleHideKey);
volumeSlider.addEventListener("input", handleVolume);
document.addEventListener("keydown", pressedKey);
