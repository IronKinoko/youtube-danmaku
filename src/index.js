import './index.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import Danmaku from './view'
import { init } from './configStore'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

if (typeof window.trustedTypes !== 'undefined') {
  window.trustedTypes.createPolicy('default', {
    createHTML: (string) => string,
  })
}

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    'zh-CN': {
      translation: zhCN,
    },
  },
  lng: window.ytcfg
    ? /^zh-/.test(window.ytcfg.get('HL'))
      ? 'zh-CN'
      : 'en'
    : /^zh/.test(navigator.language)
    ? 'zh-CN'
    : 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
})

window.addEventListener('load', () => {
  console.log('[ytb-danmaku] init')
  init(() => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(<Danmaku />, document.getElementById('ytb-danmaku-config'))
  })
})
