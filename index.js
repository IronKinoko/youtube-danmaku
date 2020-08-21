window.addEventListener('load', (e) => {
  init()
})

let playing = true
let timeKey
let prevID
let button
function init() {
  try {
    document.getElementById('player-container').classList.add('abp')
    document.getElementById('ytd-player').classList.add('container')
    window.CM = new CommentManager(document.querySelector('#ytd-player'))
    CM.options.global.scale = 1.5
    CM.options.global.opacity = 0.6
    CM.init() // 初始化
    CM.start()
    timeKey = setInterval(() => {
      getDanmaku()
    }, 100)

    buildControls()
    subEvent()
    window.addEventListener('resize', () => {
      CM.init(document.querySelector('#ytd-player'))
    })
  } catch (e) {
    setTimeout(() => {
      init()
    }, 3000)
  }
}

function getDanmaku() {
  /**
   * @type {Document}
   */
  const idoc = document.querySelector('iframe#chatframe').contentDocument
  const messagesNode = Array.from(
    idoc.querySelectorAll('yt-live-chat-text-message-renderer'),
  )

  const lastMessageNode = messagesNode.pop()
  if (lastMessageNode) {
    const nextID = lastMessageNode.id
    const message = lastMessageNode.querySelector('#message').innerHTML

    playing &&
      prevID !== nextID &&
      CM.send({ text: message, mode: 1, color: 0xffffff })
    prevID = nextID
  }
}

function buildControls() {
  button = document.createElement('button')
  button.textContent = '弹幕: 开'
  button.classList.add('ytp-button')
  button.style.width = 'auto'
  button.onclick = () => {
    if (playing) {
      playing = false
      CM.stop()
      CM.clear()
      button.textContent = '弹幕: 关'
      clearInterval(timeKey)
    } else {
      playing = true
      CM.clear()
      CM.start()
      button.textContent = '弹幕: 开'
      timeKey = setInterval(() => {
        getDanmaku()
      }, 100)
    }
  }
  document.querySelector('.ytp-left-controls').append(button)
}

function subEvent() {
  const video = document.querySelector('video')
  video.addEventListener('pause', () => {
    CM.stop()
    playing = false
    button.textContent = '弹幕: 关'
  })
  video.addEventListener('play', () => {
    CM.clear()
    CM.start()
    playing = true
    button.textContent = '弹幕: 开'
  })
}
