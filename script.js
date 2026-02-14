const YOUTUBE_VIDEO_ID = 'vEmBUhnBtFI'

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
  "You can't catch me anyway 😜"
]

const yesTeasePokes = [
  "Hey you! Try clicking No first... it's worth it, promise 💕",
  "No is the secret button. Go on, give it a tap! ✨",
  "Pssst... the No button does something silly. You'll see 😊",
  "Let's explore what the No button does! 💖"
]

let yesTeasedCount = 0
let noClickCount = 0
let runawayEnabled = true  // Keep runaway button continuously active
let musicPlaying = true
let ytPlayer = null

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const musicToggle = document.getElementById('music-toggle')

// YouTube IFrame API
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
  })
}

const START_TIME = 13

function onPlayerReady(event) {
  // Start muted; unmute on first user click (browser policy)
  event.target.mute()
  event.target.playVideo()
  document.addEventListener('click', unmuteOnFirstClick, { once: true })
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    event.target.seekTo(START_TIME)
    event.target.playVideo()
  }
}

function unmuteOnFirstClick() {
  if (ytPlayer && ytPlayer.unMute) {
    ytPlayer.unMute()
    musicPlaying = true
    if (musicToggle) musicToggle.textContent = '🔊'
  }
}

function toggleMusic() {
  if (!ytPlayer || !ytPlayer.getPlayerState) return
  const state = ytPlayer.getPlayerState()
  if (musicPlaying) {
    ytPlayer.pauseVideo()
    musicPlaying = false
    musicToggle.textContent = '🔇'
  } else {
    ytPlayer.unMute()
    ytPlayer.playVideo()
    musicPlaying = true
    musicToggle.textContent = '🔊'
  }
}

// Spawn extra floating hearts
function spawnHearts() {
  const wrap = document.getElementById('hearts-float')
  if (!wrap) return
  const hearts = ['💕', '💗', '💖', '💝', '💓', '❤️', '💘', '✨', '🌸', '🌷']
  for (let i = 0; i < 12; i++) {
    const el = document.createElement('span')
    el.className = 'heart-bubble'
    el.textContent = hearts[i % hearts.length]
    el.style.left = Math.random() * 100 + '%'
    el.style.animationDelay = Math.random() * 8 + 's'
    el.style.animationDuration = (10 + Math.random() * 6) + 's'
    wrap.appendChild(el)
  }
}

function handleYesClick() {
  if (!runawayEnabled) {
    const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
    yesTeasedCount++
    showTeaseMessage(msg)
    return
  }
  window.location.href = 'yes.html'
}

function showTeaseMessage(msg) {
  const toast = document.getElementById('tease-toast')
  toast.textContent = msg
  toast.classList.add('show', 'tease-toast-moving')
  clearTimeout(toast._timer)
  // Keep message visible and moving until they click Yes (navigate away)
}

function handleNoClick() {
  noClickCount++

  const msgIndex = Math.min(noClickCount, noMessages.length - 1)
  noBtn.textContent = noMessages[msgIndex]

  const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
  yesBtn.style.fontSize = `${currentSize * 1.35}px`
  const padY = Math.min(18 + noClickCount * 5, 60)
  const padX = Math.min(45 + noClickCount * 10, 120)
  yesBtn.style.padding = `${padY}px ${padX}px`

  if (noClickCount >= 2) {
    const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
    noBtn.style.fontSize = `${Math.max(noSize * 0.88, 14)}px`
  }

  const gifIndex = Math.min(noClickCount, gifStages.length - 1)
  swapGif(gifStages[gifIndex])

  if (noClickCount >= 5 && !runawayEnabled) {
    enableRunaway()
    runawayEnabled = true
  }
}

function swapGif(src) {
  catGif.style.opacity = '0'
  setTimeout(() => {
    catGif.src = src
    catGif.style.opacity = '1'
  }, 200)
}

function enableRunaway() {
  noBtn.style.position = 'fixed'
  noBtn.style.zIndex = '50'
  runAway()

  noBtn.addEventListener('mouseover', runAway)
  noBtn.addEventListener('touchstart', runAway, { passive: true })

  // Run away when cursor gets close (before hover) so it keeps moving until they hit Yes
  // Keep the mousemove listener active to continuously track cursor
  document.addEventListener('mousemove', runAwayIfClose)
}

const RUNAWAY_DISTANCE = 120

function runAwayIfClose(e) {
  // Continuously run away while cursor is nearby
  const rect = noBtn.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const dist = Math.hypot(e.clientX - cx, e.clientY - cy)
  if (dist < RUNAWAY_DISTANCE) runAway()
}

function runAway() {
  const margin = 24
  const btnW = noBtn.offsetWidth
  const btnH = noBtn.offsetHeight
  const maxX = window.innerWidth - btnW - margin
  const maxY = window.innerHeight - btnH - margin

  const randomX = Math.random() * maxX + margin / 2
  const randomY = Math.random() * maxY + margin / 2

  noBtn.style.left = `${randomX}px`
  noBtn.style.top = `${randomY}px`
}

spawnHearts()

// Initial page entrance animation
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('main-container')
  if (container) requestAnimationFrame(() => container.classList.add('loaded'))
})