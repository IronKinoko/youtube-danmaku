/**
 *
 * @export
 * @param {HTMLElement} panel
 */
export function getPanelSize(panel) {
  const clone = panel.cloneNode(true)
  clone.style.opacity = 0
  clone.style.position = 'absolute'
  clone.removeAttribute('hidden')

  panel.parentNode.appendChild(clone)
  const width = clone.scrollWidth
  const height = clone.scrollHeight

  clone.remove()
  return { width, height }
}

export function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = location.search.substr(1).match(reg)
  if (r != null) return unescape(decodeURI(r[2]))
  return null
}
