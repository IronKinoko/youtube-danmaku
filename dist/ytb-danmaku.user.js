// ==UserScript==
// @name         youtube-danmaku
// @namespace    https://github.com/IronKinoko/ytb-danmaku
// @version      2.0.9
// @license      MIT
// @description  Youtube livechat danmaku
// @author       Ironkinoko
// @match        https://www.youtube.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/comment-core-library@0.11.1/dist/CommentCoreLibrary.min.js
// @require      https://cdn.jsdelivr.net/gh/IronKinoko/ytb-danmaku@##hash##/dist/ytb-danmaku-core.min.js
// ==/UserScript==

;(function () {
  'use strict'
  const style = document.createElement('style')
  style.innerHTML =
    ".abp{position:relative;}.abp .container{border:0;bottom:0;display:block;left:0;margin:0;overflow:hidden;position:absolute;right:0;top:0;touch-callout:none;-webkit-transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}.abp .container .cmt{color:#fff;font-family:SimHei,SimSun,Heiti,'MS Mincho',Meiryo,'Microsoft YaHei',monospace;font-size:25px;letter-spacing:0;line-height:100%;margin:0;padding:3px 0 0 0;position:absolute;text-decoration:none;text-shadow:-1px 0 #000,0 1px #000,1px 0 #000,0 -1px #000;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;text-size-adjust:none;-webkit-transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0;white-space:pre;word-break:keep-all;}.abp .container .cmt.no-shadow{text-shadow:none;}.abp .container .cmt.reverse-shadow{text-shadow:-1px 0 #fff,0 1px #fff,1px 0 #fff,0 -1px #fff;}.abp .container .cmt.css-optimize{will-change:transform;}"
  document.head.append(style)
  // Your code here...
  
})()
