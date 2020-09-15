let playing = true
let timeKey
let prevID
let CM
/**
 * @type {MutationObserver}
 */
let videoObserver
/**
 * @type {MutationObserver}
 */
let bodyObserver

function init(cb) {
  if (process.env.NODE_ENV === 'development') {
    let button = document.createElement('button')
    button.innerText = '发送弹幕'
    button.onclick = () =>
      CM.send({
        text: '<div style="color:red;">123</div>',
        mode: 1,
        useHTML: true,
      })
    document.body.append(button)
    return inject(cb)
  }
  let prevVID
  let inited = false
  if (bodyObserver) bodyObserver.disconnect()
  bodyObserver = new MutationObserver(() => {
    if (location.pathname === '/watch') {
      const VID = getQueryString('v')
      if (prevVID !== VID) {
        prevVID = VID
        inject(cb)
      } else {
        if (!inited) {
          inited = true
          inject(cb)
        }
      }
    } else {
      inited = false
      prevVID = null
      clearInterval(timeKey)
    }
  })
  bodyObserver.observe(document.body, { childList: true, subtree: true })
}
function inject(cb) {
  try {
    console.log('ytb-danmaku-inited')
    const config = JSON.parse(
      localStorage.getItem('ytb-danmaku-config') ||
        JSON.stringify({
          use: true,
          scale: 0.5,
          opacity: 0.7,
        })
    )

    clearInterval(timeKey)
    document.getElementById('ytd-player').classList.add('danmaku-container')
    document
      .querySelector('div.ytp-left-controls')
      .setAttribute('style', 'overflow: unset;')
    CM = new CommentManager(document.querySelector('#ytd-player'))
    changeDanmakuSpeed(config.scale)
    changeDanmakuOpacity(config.opacity)
    CM.init() // 初始化

    buildControls()
    subEvent()
    toggleDanmaku(config.use)
    cb && cb()
  } catch (e) {
    console.error(e)
    setTimeout(() => {
      inject()
    }, 3000)
  }
}

function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = location.search.substr(1).match(reg)
  if (r != null) return unescape(decodeURI(r[2]))
  return null
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
  if (document.getElementById('ytb-danmaku-config')) return
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

  if (videoObserver) videoObserver.disconnect()
  videoObserver = new MutationObserver(() => {
    setTimeout(() => {
      CM.init(document.querySelector('#ytd-player'))
    }, 500)
  })
  videoObserver.observe(video, { attributes: true })
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
function changeDanmakuOpacity(opacity) {
  CM.options.global.opacity = opacity
}

export { init, toggleDanmaku, changeDanmakuSpeed, changeDanmakuOpacity }
