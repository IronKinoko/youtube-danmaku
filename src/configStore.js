import { autorun, makeAutoObservable } from 'mobx'
import Danmaku from '@ironkinoko/danmaku'
import { getQueryString } from './utils'

let sendDanmakuLock = false
let playing = false
let prevID = []
/** @type {Danmaku} */
let core
/**
 * @type {MutationObserver}
 */
let videoObserver
/**
 * @type {MutationObserver}
 */
let bodyObserver

class DanmakuOptions {
  use = true
  opacity = 0.7
  showSuperChat = false
  showStickers = true
  scale = 0.5
  fontSize = 24
  filterList = []
  filterUse = false

  constructor() {
    makeAutoObservable(this)

    Object.assign(
      this,
      {
        use: true,
        showStickers: true,
        showSuperChat: false,
        scale: 1,
        opacity: 0.7,
        filterList: [],
        filterUse: false,
        fontSize: 24,
      },
      JSON.parse(localStorage.getItem('ytb-danmaku-config'))
    )
  }

  /**
   * @param {boolean} use
   */
  toggleDanmaku(use) {
    config.use = use
    if (use) {
      playing = true
      core.show()
      rAFDanmaku()
    } else {
      playing = false
      core.hide()
    }
  }

  /**
   * @param {number} scale
   */
  changeDanmakuSpeed(scale) {
    this.scale = scale
    core.speed = 144 * scale
  }

  /**
   * @param {number} opacity
   */
  changeDanmakuOpacity(opacity) {
    this.opacity = opacity
    core.opacity = opacity
  }

  /**
   * @param {number} fontSize
   */
  changeDanmakuFontSize(fontSize) {
    this.fontSize = fontSize
    document
      .querySelector('.danmaku-stage')
      ?.style.setProperty('--danmaku-font-size', `${fontSize}px`)
  }

  /**
   * @param {boolean} showStickers
   */
  toggleShowSticker(showStickers) {
    this.showStickers = showStickers
  }
  /**
   * @param {boolean} showSuperChat
   */
  toggleShowSuperChat(showSuperChat) {
    this.showSuperChat = showSuperChat
  }

  /**
   * @param {string} content
   */
  addFilter(content) {
    if (content.trim().length === 0) return
    config.filterList.push({
      content,
      isuse: true,
      id: Math.random().toString(16).slice(2),
    })
  }

  changeFilterUse(id) {
    const target = config.filterList.find((o) => o.id === id)
    target.isuse = !target.isuse
  }

  deleteFilter(id) {
    config.filterList = config.filterList.filter((o) => o.id !== id)
  }

  toggleFilterUse(bool) {
    config.filterUse = bool
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
        inited = true
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
      playing = false
    }
  })
  bodyObserver.observe(document.body, { childList: true, subtree: true })
}

function devModeInit(cb) {
  const message = '<div style="color:red;">123</div>'
  let button = document.createElement('button')
  button.innerText = '发送弹幕'

  button.onclick = () =>
    core.emit({
      mode: 'rtl',
      ...(config.showStickers
        ? {
            render: () => {
              const div = document.createElement('div')
              div.innerHTML = message
              return div
            },
          }
        : { text: message }),
    })
  document.body.append(button)
  return inject(cb)
}

function inject(cb) {
  try {
    console.trace('ytb-danmaku-inited')

    const player = document.getElementById('movie_player')
    if (!player) throw new Error('not find player')
    document
      .querySelector('ytd-watch-flexy .ytp-left-controls')
      .setAttribute('style', 'overflow: unset;')
    core?.destroy()
    core = new Danmaku({
      container: player,
    })
    document.querySelector('#movie_player').prepend(core._.stage)
    config.changeDanmakuSpeed(config.scale)
    config.changeDanmakuOpacity(config.opacity)
    config.changeDanmakuFontSize(config.fontSize)

    buildControls()
    subEvent()
    config.toggleDanmaku(config.use)
    cb && cb()
  } catch (e) {
    console.error(e)
    setTimeout(() => {
      inject(cb)
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
      idoc.querySelectorAll(
        config.showSuperChat
          ? 'yt-live-chat-paid-message-renderer,yt-live-chat-text-message-renderer'
          : 'yt-live-chat-text-message-renderer'
      )
    )
    const lastMessageNodes = messagesNode.slice(-10)
    lastMessageNodes.forEach((lastMessageNode) => {
      const nextID = lastMessageNode.id

      if (!playing || prevID.includes(nextID)) return
      prevID = [...prevID, nextID].slice(-20)

      if (config.filterUse) {
        const filterList = config.filterList.filter((o) => o.isuse)
        const messageText =
          lastMessageNode.querySelector('#message').innerText || ''
        if (filterList.some((o) => messageText.includes(o.content))) return
      }

      const message = config.showStickers
        ? lastMessageNode.querySelector('#message').innerHTML
        : lastMessageNode.querySelector('#message').innerText

      const isPaidMessage =
        lastMessageNode.tagName.toLowerCase() ===
        'yt-live-chat-paid-message-renderer'

      const color = isPaidMessage
        ? getComputedStyle(lastMessageNode).getPropertyValue(
            '--yt-live-chat-paid-message-primary-color'
          )
        : 'white'
      core.emit({
        mode: 'rtl',
        style: { color },
        ...(config.showStickers
          ? {
              render: () => {
                const div = document.createElement('div')
                div.innerHTML = message
                div.style.color = color
                return div
              },
            }
          : { text: message }),
      })
    })
  }
}

function rAFDanmaku() {
  if (playing) requestAnimationFrame(rAFDanmaku)
  if (sendDanmakuLock) return
  sendDanmakuLock = true
  getDanmaku()
  sendDanmakuLock = false
}

function buildControls() {
  if (document.getElementById('ytb-danmaku-config')) return
  const div = document.createElement('div')
  div.style.width = 'auto'
  div.id = 'ytb-danmaku-config'
  document.querySelector('ytd-watch-flexy .ytp-left-controls').append(div)
}

function subEvent() {
  const video = document.querySelector('video')
  video.addEventListener('pause', () => {
    if (!config.use) return
    playing = false
    core.hide()
  })
  video.addEventListener('play', () => {
    if (!config.use) return
    playing = true
    core.show()
    rAFDanmaku()
  })

  window.addEventListener('resize', () => {
    core.resize()
  })

  if (videoObserver) videoObserver.disconnect()
  videoObserver = new MutationObserver(() => {
    setTimeout(() => {
      core.resize()
    }, 500)
  })
  videoObserver.observe(video, { attributes: true })
}
export { init, config }
