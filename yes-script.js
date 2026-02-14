const YOUTUBE_VIDEO_ID = 'vEmBUhnBtFI'
let musicPlaying = false
let ytPlayer = null

function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('youtube-player-wrap', {
    height: '1',
    width: '1',
    videoId: YOUTUBE_VIDEO_ID,
    playerVars: {
      autoplay: 1,
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
  event.target.unMute()
  event.target.playVideo()
  musicPlaying = true
  const toggle = document.getElementById('music-toggle')
  if (toggle) toggle.textContent = '🔊'
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    event.target.seekTo(START_TIME)
    event.target.playVideo()
  }
}

function toggleMusic() {
  if (!ytPlayer) return
  if (musicPlaying) {
    ytPlayer.pauseVideo()
    musicPlaying = false
    document.getElementById('music-toggle').textContent = '🔇'
  } else {
    ytPlayer.unMute()
    ytPlayer.playVideo()
    musicPlaying = true
    document.getElementById('music-toggle').textContent = '🔊'
  }
}

function spawnHearts() {
  const wrap = document.getElementById('hearts-float')
  if (!wrap) return
  const hearts = ['💕', '💗', '💖', '💝', '💓', '❤️', '💘']
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

window.addEventListener('load', () => {
  launchConfetti()
  spawnHearts()
})

function launchConfetti() {
  const colors = ['#ff69b4', '#ff1493', '#ff85a2', '#ffb3c1', '#ff0000', '#ff6347', '#fff', '#ffdf00', '#e91e8c', '#c2185b']
  const duration = 6000
  const end = Date.now() + duration

  confetti({
    particleCount: 150,
    spread: 100,
    origin: { x: 0.5, y: 0.3 },
    colors
  })

  const interval = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval)
      return
    }
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors
    })
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors
    })
  }, 300)
}
