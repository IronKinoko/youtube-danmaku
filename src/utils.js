export function rgba2hex(rgba) {
  rgba = rgba.match(/\((.*)\)/)[1];
  rgba = rgba.split(",");
  rgba.pop();
  return parseInt(rgba.reduce((s, n) => s + r2h(n), "0x"));
}

function r2h(s) {
  return parseInt(s).toString(16);
}

/**
 *
 * @export
 * @param {HTMLElement} panel
 */
export function getPanelSize(panel) {
  const clone = panel.cloneNode(true);
  clone.style.opacity = 0;
  clone.style.position = "absolute";
  clone.removeAttribute("hidden");

  panel.parentNode.appendChild(clone);
  const width = clone.scrollWidth;
  const height = clone.scrollHeight;

  clone.remove();
  return { width, height };
}
