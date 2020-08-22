let playing = true
let timeKey
let prevID
let CM
function init() {
  try {
    document.getElementById('player-container').classList.add('abp')
    document.getElementById('ytd-player').classList.add('container')
    document
      .querySelector('div.ytp-left-controls')
      .setAttribute('style', 'overflow: unset;')
    CM = new CommentManager(document.querySelector('#ytd-player'))
    CM.init() // 初始化

    buildControls()
    subEvent()
  } catch (e) {
    console.error(e)
    setTimeout(() => {
      init()
    }, 3000)
  }
}

function getDanmaku() {
  const iframe = document.querySelector('iframe#chatframe')
  if (iframe) {
    /**
     * @type {Document}
     */
    const idoc = iframe.contentDocument
    const messagesNode = Array.from(
      idoc.querySelectorAll('yt-live-chat-text-message-renderer')
    )
    const lastMessageNode = messagesNode.pop()
    if (lastMessageNode) {
      const nextID = lastMessageNode.id
      const message = lastMessageNode.querySelector('#message').textContent
      playing &&
        prevID !== nextID &&
        CM.send({ text: message, mode: 1, color: 0xffffff })
      prevID = nextID
    }
  }
}

function buildControls() {
  const div = document.createElement('div')
  div.style.width = 'auto'
  div.id = 'ytb-danmaku-config'
  document.querySelector('.ytp-left-controls').append(div)
}

function subEvent() {
  const video = document.querySelector('video')
  video.addEventListener('pause', () => {
    playing = false
    CM.stop()
    clearInterval(timeKey)
  })
  video.addEventListener('play', () => {
    playing = true
    CM.clear()
    CM.start()
    timeKey = setInterval(() => {
      getDanmaku()
    }, 100)
  })

  window.addEventListener('resize', () => {
    CM.init(document.querySelector('#ytd-player'))
  })

  video.addEventListener('fullscreenchange', () => {
    CM.init(document.querySelector('#ytd-player'))
  })
}

/**
 * @param {boolean} use
 */
function toggleDanmaku(use) {
  if (use) {
    playing = true
    CM.clear()
    CM.start()
    timeKey = setInterval(() => {
      getDanmaku()
    }, 100)
  } else {
    playing = false
    CM.stop()
    CM.clear()
    clearInterval(timeKey)
  }
}

/**
 * @param {number} scale
 */
function changeDanmakuSpeed(scale) {
  CM.options.global.scale = 3.1 - scale
}

/**
 * @param {number} opacity
 */
function changeOpacity(opacity) {
  CM.options.global.opacity = opacity
}

export { init, toggleDanmaku, changeDanmakuSpeed, changeOpacity }
