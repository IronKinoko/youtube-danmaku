import { autorun, makeAutoObservable } from 'mobx'
import Danmaku from '@ironkinoko/danmaku'
import { getQueryString, waitFor } from './utils'

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

async function inject(cb) {
  try {
    console.trace('ytb-danmaku-inited')

    await waitFor(
      () => !!document.querySelector('ytd-watch-flexy .ytp-left-controls')
    )
    const player = document.getElementById('movie_player')

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
    await tryOpenDanmakuList()

    cb && cb()
  } catch (e) {
    console.error(e)
  }
}

async function tryOpenDanmakuList() {
  await waitFor(() => !!document.querySelector('ytd-live-chat-frame'), 60000)
  const root = document.querySelector('ytd-live-chat-frame')
  const btnWrap = root.querySelector('#show-hide-button')
  if (!btnWrap.hidden) {
    const btn = btnWrap.querySelector('ytd-button-renderer')
    btn.click()
  }
}

function getDanmaku() {
  /** @type {HTMLIFrameElement} */
  const iframe = document.querySelector('iframe#chatframe')
  if (!iframe) return

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
  const maxCount = 30
  const lastMessageNodes = messagesNode.slice(-maxCount)
  lastMessageNodes.forEach((lastMessageNode) => {
    const nextID = lastMessageNode.id

    if (!playing || prevID.includes(nextID)) return
    prevID = [...prevID, nextID].slice(-maxCount * 2)

    if (config.filterUse) {
      const filterList = config.filterList.filter((o) => o.isuse)
      const messageText =
        lastMessageNode.querySelector('#message').innerText || ''
      if (filterList.some((o) => messageText.includes(o.content))) return
    }

    let message = config.showStickers
      ? lastMessageNode.querySelector('#message').innerHTML
      : lastMessageNode.querySelector('#message').innerText

    const isPaidMessage =
      lastMessageNode.tagName.toLowerCase() ===
      'yt-live-chat-paid-message-renderer'

    let color = isPaidMessage
      ? getComputedStyle(lastMessageNode).getPropertyValue(
          '--yt-live-chat-paid-message-primary-color'
        )
      : 'white'

    const authorType = lastMessageNode.getAttribute('author-type')

    let richTextRender = config.showStickers

    if (authorType === 'owner' || authorType === 'moderator') {
      richTextRender = true

      const authorNode = lastMessageNode.querySelector('#author-name')
      const authorName = authorNode.textContent
      let color, bgColor, icon
      const style = getComputedStyle(authorNode)

      if (authorType === 'owner') {
        color = style.color
        bgColor = style.backgroundColor
        icon = ''
      } else {
        color = 'white'
        bgColor = style.color
        icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" style="display:inline-block;vertical-align:-0.125em;">
          <path d="M9.64589146,7.05569719 C9.83346524,6.562372 9.93617022,6.02722257 9.93617022,5.46808511 C9.93617022,3.00042984 7.93574038,1 5.46808511,1 C4.90894765,1 4.37379823,1.10270499 3.88047304,1.29027875 L6.95744681,4.36725249 L4.36725255,6.95744681 L1.29027875,3.88047305 C1.10270498,4.37379824 1,4.90894766 1,5.46808511 C1,7.93574038 3.00042984,9.93617022 5.46808511,9.93617022 C6.02722256,9.93617022 6.56237198,9.83346524 7.05569716,9.64589147 L12.4098057,15 L15,12.4098057 L9.64589146,7.05569719 Z"></path>
        </svg>`
      }

      message = `<span style="
        display:inline-block;
        color:${color};
        background-color:${bgColor};
        padding: 2px 4px;
        border-radius: 4px;
        margin-right: 4px;
        ">${authorName}${icon}</span>${message}`
    }

    core.emit({
      mode: 'rtl',
      style: { color },
      ...(richTextRender
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
    prevID = []
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
