import React from 'react'
import ReactDOM from 'react-dom'
import Danmaku from './Danmaku'
import { init } from './CM'

window.addEventListener('load', (e) => {
  init()
  ReactDOM.render(<Danmaku />, document.getElementById('ytb-danmaku-config'))
})
