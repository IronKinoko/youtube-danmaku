import React from 'react'
import ReactDOM from 'react-dom'
import Danmaku from './Danmaku.jsx'
import { init } from './configStore'

window.addEventListener('load', (e) => {
  init(() =>
    ReactDOM.render(<Danmaku />, document.getElementById('ytb-danmaku-config'))
  )
})
