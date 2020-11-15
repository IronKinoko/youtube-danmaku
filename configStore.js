import { autorun, observable, action } from 'mobx'

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

class DanmakuOptions {
  @observable use = true
  @observable opacity = 0.7
  @observable showStickers = true
  @observable scale = 0.5

  constructor() {
    const config = JSON.parse(
      localStorage.getItem('ytb-danmaku-config') ||
        JSON.stringify({
          use: true,
          showStickers: true,
          scale: 0.5,
          opacity: 0.7,
        })
    )
    this.use = config.use
    this.opacity = config.opacity
    this.showStickers = config.showStickers
    this.scale = config.scale
  }

  /**
   * @param {boolean} use
   */
  @action toggleDanmaku(use) {
    config.use = use
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
  @action changeDanmakuSpeed(scale) {
    this.scale = scale
    CM.options.global.scale = 3.1 - scale
  }

  /**
   * @param {number} opacity
   */
  @action changeDanmakuOpacity(opacity) {
    this.opacity = opacity
    CM.options.global.opacity = opacity
  }

  /**
   * @param {boolean} showStickers
   */
  @action toggleShowSticker(showStickers) {
    this.showStickers = showStickers
  }
}

const config = new DanmakuOptions()

autorun(() => {
  localStorage.setItem('ytb-danmaku-config', JSON.stringify(config))
})

function init(cb) {
  if (process.env.NODE_ENV === 'development') {
    return devModeInit(cb)
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

function devModeInit(cb) {
  let button = document.createElement('button')
  button.innerText = '发送弹幕'
  button.onclick = () =>
    CM.send({
      text: '<div style="color:red;">123</div>',
      mode: 1,
      useHTML: config.showStickers,
    })
  document.body.append(button)
  return inject(cb)
}

function inject(cb) {
  try {
    console.log('ytb-danmaku-inited')

    clearInterval(timeKey)
    document.getElementById('ytd-player').classList.add('danmaku-container')
    document
      .querySelector('div.ytp-left-controls')
      .setAttribute('style', 'overflow: unset;')
    CM = new CommentManager(document.querySelector('#ytd-player'))
    config.changeDanmakuSpeed(config.scale)
    config.changeDanmakuOpacity(config.opacity)
    CM.init() // 初始化

    buildControls()
    subEvent()
    config.toggleDanmaku(config.use)
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
      const message = config.showStickers
        ? lastMessageNode.querySelector('#message').innerHTML
        : lastMessageNode.querySelector('#message').innerText
      playing &&
        prevID !== nextID &&
        CM.send({
          text: message,
          mode: 1,
          color: 0xffffff,
          useHTML: config.showStickers,
        })
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
    if (!config.use) return
    playing = false
    CM.stop()
    clearInterval(timeKey)
  })
  video.addEventListener('play', () => {
    if (!config.use) return
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
export { init, config }
