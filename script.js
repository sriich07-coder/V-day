const YOUTUBE_VIDEO_ID = 'vEmBUhnBtFI';

const gifStages = [
  "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",
  "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",
  "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",
  "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",
  "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",
  "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",
  "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",
  "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"
]

// *Revised* expanded funny No responses
const noMessages = [
  "No",
  "Are you *sure* sure? 🤔",
  "Babe please... my heart is fragile 🥺",
  "Pretty please my dear cloudy 🥺💕",
  "If you say no I'll write sad poetry about you...",
  "I'm gonna need a minute... and maybe ice cream 😢",
  "Please??? My little heart can't take it 💔",
  "Don't do me like this...",
  "Last chance! I'm too cute to refuse 😭",
  "You can't catch me anyway 😜",
  "No power in this verse can make me say yes!",
  "Is that your final answer? Millionaire? 🤑",
  "I'm training for the No Olympics 🏃‍♂️",
  "Sorry, my heart says 'No' but my eyes say 'maybe' 👀",
  "On strike until I get chocolate! 🍫",
  "Are you even trying? 😂",
  "Just hit Yes, it's fate! 🔮"
];

// Tease pokes WITHOUT 'Yes is best answer'
const yesTeasePokes = [
  "Hey you! Try clicking No first... it's worth it, promise 💕",
  "No is the secret button. Go on, give it a tap! ✨",
  "Pssst... the No button does something silly. You'll see 😊",
  "Let's explore what the No button does! 💖"
];

let yesTeasedCount = 0;
let noClickCount = 0;
let runawayEnabled = false;
let musicPlaying = true;
let ytPlayer = null;

const catGif = document.getElementById('cat-gif');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const musicToggle = document.getElementById('music-toggle');

// ---- YouTube Music Logic (untouched) ----

function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('youtube-player-wrap', {
    height: '1',
    width: '1',
    videoId: YOUTUBE_VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      loop: 1,
      playlist: YOUTUBE_VIDEO_ID,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
      showinfo: 0,
      start: 13
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

const START_TIME = 13;

function onPlayerReady(event) {
  event.target.mute();
  event.target.playVideo();
  document.addEventListener('click', unmuteOnFirstClick, { once: true });
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    event.target.seekTo(START_TIME);
    event.target.playVideo();
  }
}

function unmuteOnFirstClick() {
  if (ytPlayer && ytPlayer.unMute) {
    ytPlayer.unMute();
    musicPlaying = true;
    if (musicToggle) musicToggle.textContent = '🔊';
  }
}

function toggleMusic() {
  if (!ytPlayer || !ytPlayer.getPlayerState) return;
  const state = ytPlayer.getPlayerState();
  if (musicPlaying) {
    ytPlayer.pauseVideo();
    musicPlaying = false;
    musicToggle.textContent = '🔇';
  } else {
    ytPlayer.unMute();
    ytPlayer.playVideo();
    musicPlaying = true;
    musicToggle.textContent = '🔊';
  }
}

// ---- UI and Button Logic ----

function spawnHearts() {
  const wrap = document.getElementById('hearts-float')
  if (!wrap) return;
  const hearts = ['💕', '💗', '💖', '💝', '💓', '❤️', '💘', '✨', '🌸', '🌷'];
  for (let i = 0; i < 12; i++) {
    const el = document.createElement('span');
    el.className = 'heart-bubble';
    el.textContent = hearts[i % hearts.length];
    el.style.left = Math.random() * 100 + '%';
    el.style.animationDelay = Math.random() * 8 + 's';
    el.style.animationDuration = (10 + Math.random() * 6) + 's';
    wrap.appendChild(el);
  }
}

// Teasing Yes message logic
function handleYesClick() {
  if (!runawayEnabled) {
    const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)];
    yesTeasedCount++;
    showTeaseMessage(msg);
    return;
  }
  window.location.href = 'yes.html';
}

function showTeaseMessage(msg) {
  const toast = document.getElementById('tease-toast')
  toast.textContent = msg;
  toast.classList.add('show', 'tease-toast-moving');
  clearTimeout(toast._timer);
}

// Main No logic! (never vanishes)
function handleNoClick() {
  noClickCount++;

  // Pick response, never overflow array
  const msgIndex = Math.min(noClickCount, noMessages.length - 1);
  noBtn.textContent = noMessages[msgIndex];

  // Animate Yes growing
  const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
  yesBtn.style.fontSize = `${currentSize * 1.35}px`;
  const padY = Math.min(18 + noClickCount * 5, 60);
  const padX = Math.min(45 + noClickCount * 10, 120);
  yesBtn.style.padding = `${padY}px ${padX}px`;

  // Animate No shrinking a bit (but not smaller than 14px)
  if (noClickCount >= 2) {
    const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize);
    noBtn.style.fontSize = `${Math.max(noSize * 0.88, 14)}px`;
  }

  // GIF swap
  const gifIndex = Math.min(noClickCount, gifStages.length - 1);
  swapGif(gifStages[gifIndex]);

  // After N clicks, make No run away!
  if (noClickCount >= 5 && !runawayEnabled) {
    enableRunaway();
  }
  // ON EVERY CLICK: ensure it's on screen!
  ensureNoVisible();
}

// Keep the gif fading smoothly
function swapGif(src) {
  catGif.style.opacity = '0';
  setTimeout(() => {
    catGif.src = src;
    catGif.style.opacity = '1';
  }, 200);
}

// Runaway logic
function enableRunaway() {
  runawayEnabled = true;
  noBtn.style.position = 'fixed';
  noBtn.style.zIndex = '50';
  runAway();
  noBtn.addEventListener('mouseover', runAway);
  noBtn.addEventListener('touchstart', runAway, { passive: true });
  document.addEventListener('mousemove', runAwayIfClose);
  noBtn.style.opacity = '1';
  noBtn.style.display = 'block';
  noBtn.style.visibility = 'visible';
}

// Run away if cursor is near
const RUNAWAY_DISTANCE = 120;
function runAwayIfClose(e) {
  if (!runawayEnabled) return;
  const rect = noBtn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
  if (dist < RUNAWAY_DISTANCE) runAway();
}

function runAway() {
  const margin = 24;
  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;
  // Clamp boundaries so button cannot go outside
  const maxX = window.innerWidth - btnW - margin;
  const maxY = window.innerHeight - btnH - margin;
  const randomX = Math.random() * maxX + margin / 2;
  const randomY = Math.random() * maxY + margin / 2;
  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;
  ensureNoVisible();
}

// Ensure No button is always visible and clickable
function ensureNoVisible() {
  noBtn.style.opacity = '1';
  noBtn.style.display = 'block';
  noBtn.style.visibility = 'visible';
  noBtn.disabled = false;
  noBtn.style.pointerEvents = 'auto';
  // Clamp button inside viewport
  const rect = noBtn.getBoundingClientRect();
  if (rect.left < 0 || rect.top < 0 ||
      rect.right > window.innerWidth ||
      rect.bottom > window.innerHeight) {
    noBtn.style.left = '50vw';
    noBtn.style.top = '70vh';
  }
}

// Hearts and page anim onload
spawnHearts();
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('main-container');
  if (container) requestAnimationFrame(() => container.classList.add('loaded'));
});
// Redundant interval safeguard
setInterval(ensureNoVisible, 333);
