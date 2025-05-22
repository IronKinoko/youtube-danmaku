export function genUserScriptInfo(pkg) {
  return `// ==UserScript==
// @name         youtube-danmaku
// @namespace    https://github.com/IronKinoko/ytb-danmaku
// @version      ${pkg.version}
// @icon         https://www.youtube.com/favicon.ico
// @license      MIT
// @description  Youtube livechat danmaku
// @author       Ironkinoko
// @match        https://www.youtube.com/*
// @exclude      https://www.youtube.com/live_chat*
// @grant        none
// @require      https://unpkg.com/react@16.14.0/umd/react.production.min.js
// @require      https://unpkg.com/react-dom@16.14.0/umd/react-dom.production.min.js
// @require      https://unpkg.com/mobx@6.3.2/dist/mobx.umd.production.min.js
// @require      https://unpkg.com/mobx-react-lite@3.2.0/dist/mobxreactlite.umd.production.min.js
// @require      https://unpkg.com/mobx-react@7.2.0/dist/mobxreact.umd.production.min.js
// @require      https://unpkg.com/@ironkinoko/danmaku@1.4.4/dist/danmaku.umd.js
// ==/UserScript==`
}
