/**
 * music.js
 * Background music: playlist, fade-in, volume persistence.
 * No autoplay on load — starts only after user interaction.
 */

const MUSIC_VOLUME_KEY = "rimworld-music-volume";

const PLAYLIST = [
  "Soundeffects/music1.mp3",
  "Soundeffects/music2.mp3",
  "Soundeffects/music3.mp3"
];

let backgroundMusic   = null;
let currentTrackIndex = 0;
let musicStartedOnce  = false;
let fadeInterval      = null;

// ---------------------------------------------------------------------------
// Volume persistence
// ---------------------------------------------------------------------------

export function getSavedVolume() {
  const parsed = Number(localStorage.getItem(MUSIC_VOLUME_KEY));
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 100 ? parsed : 10;
}

function saveVolume(volumePercent) {
  localStorage.setItem(MUSIC_VOLUME_KEY, String(volumePercent));
}

// ---------------------------------------------------------------------------
// Audio helpers
// ---------------------------------------------------------------------------

function clearFadeInterval() {
  if (fadeInterval) {
    clearInterval(fadeInterval);
    fadeInterval = null;
  }
}

function fadeInMusic(audio, targetVolumePercent, duration = 1000) {
  clearFadeInterval();
  const target      = Math.max(0, Math.min(1, targetVolumePercent / 100));
  const steps       = 20;
  const stepMs      = Math.max(20, Math.floor(duration / steps));
  let   currentStep = 0;

  audio.volume = 0;

  fadeInterval = setInterval(() => {
    currentStep++;
    audio.volume = target * (currentStep / steps);
    if (currentStep >= steps) {
      audio.volume = target;
      clearFadeInterval();
    }
  }, stepMs);
}

function createAudio(index = 0) {
  const audio    = new Audio(PLAYLIST[index]);
  audio.preload  = "auto";
  audio.volume   = 0;

  audio.addEventListener("ended", async () => {
    currentTrackIndex = (currentTrackIndex + 1) % PLAYLIST.length;
    backgroundMusic   = createAudio(currentTrackIndex);
    try {
      await backgroundMusic.play();
      fadeInMusic(backgroundMusic, getSavedVolume(), 1200);
      updateButtons(true);
    } catch (err) {
      console.warn("Music autoadvance failed:", err);
      updateButtons(false);
    }
  });

  return audio;
}

function ensureAudio() {
  if (!backgroundMusic) backgroundMusic = createAudio(currentTrackIndex);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function playBackgroundMusic() {
  ensureAudio();
  try {
    await backgroundMusic.play();
    musicStartedOnce = true;
    fadeInMusic(backgroundMusic, getSavedVolume(), 1200);
    updateButtons(true);
  } catch (err) {
    console.warn("Background music play failed:", err);
    updateButtons(false);
  }
}

export function stopBackgroundMusic() {
  if (!backgroundMusic) return;
  clearFadeInterval();
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  backgroundMusic.volume      = 0;
  updateButtons(false);
}

export function setMusicVolume(volumePercent) {
  const clamped = Math.max(0, Math.min(100, volumePercent));
  saveVolume(clamped);
  if (backgroundMusic) backgroundMusic.volume = clamped / 100;

  const label = document.getElementById("volumeLabel");
  if (label) label.textContent = `${clamped}%`;
}

function updateButtons(isPlaying) {
  const playBtn = document.getElementById("playMusicBtn");
  const stopBtn = document.getElementById("stopMusicBtn");
  if (playBtn) playBtn.style.opacity = isPlaying ? "0.6" : "1";
  if (stopBtn) stopBtn.style.opacity = isPlaying ? "1"   : "0.6";
}

/**
 * Wires up the music controls in the hero section.
 * Call once during init().
 */
export function setupMusicControls() {
  ensureAudio();

  const savedVolume  = getSavedVolume();
  const volumeSlider = document.getElementById("volumeSlider");
  const volumeLabel  = document.getElementById("volumeLabel");

  if (volumeSlider) volumeSlider.value   = String(savedVolume);
  if (volumeLabel)  volumeLabel.textContent = `${savedVolume}%`;

  document.getElementById("playMusicBtn")
    ?.addEventListener("click", playBackgroundMusic);

  document.getElementById("stopMusicBtn")
    ?.addEventListener("click", stopBackgroundMusic);

  volumeSlider?.addEventListener("input", () => {
    setMusicVolume(Number(volumeSlider.value));
  });

  updateButtons(false);
}

/**
 * Starts music on the very first user interaction, then removes itself.
 * Attach to click / keydown / touchstart with { once: true }.
 */
export function startMusicOnFirstInteraction() {
  if (musicStartedOnce) return;
  playBackgroundMusic();
}
