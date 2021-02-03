export function rgba2hex(rgba) {
  rgba = rgba.match(/\((.*)\)/)[1]
  rgba = rgba.split(',')
  rgba.pop()
  return parseInt(rgba.reduce((s, n) => s + r2h(n), '0x'))
}

function r2h(s) {
  return parseInt(s).toString(16)
}
