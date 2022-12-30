export function Canvas (w, h, element) {
  const c = element
    ? document.getElementById(element)
    : document.createElement('canvas')

  c.width = w
  c.height = h
  c.ctx = c.getContext('2d')

  return c
}
