/* global Path2D */
import { Canvas } from './lib/Canvas.js'

export const PAL = [
  ['#dd4e54', '#ff5960', '#4b3733', '#5d433e', '#ead94c', '#4a3632'], // red
  ['#2c5460', '#3a7080', '#2c5460', '#67bd39', '#bcdc2f', '#59a331'], // green
  ['#2184d5', '#3399cc', '#10456d', '#3a4750', '#f3f3f3', '#303841'], // blue
  ['#ffd944', '#ffe580', '#d7c745', '#49b47e', '#94dd4d', '#409f6e'] // yellow
]

export const tiles = {
  fill: 0,
  wave: 12,
  treeTop: 13,
  treeTrunk: 14
}

export const TILE_SIZE = 16 // tile size

const TILE = [
  [ // filled
    ['M 0 0 16 0 16 16 0 16', 0]
  ],
  [ // filled with circle
    ['M 0 0 16 0 16 16 0 16', 3],
    ['M 3 8, A 5 5 0 1 1 13 8, A 5 5 0 1 1 3 8', 4],
    ['M 4 8, A 4 4 0 1 1 12 8, A 4 4 0 1 1 4 8', 3]
  ],
  [ // filled with small circle
    ['M 0 0 16 0 16 16 0 16', 3],
    ['M 5 8, A 3 3 0 1 1 11 8, A 3 3 0 1 1 5 8', 4]
  ],
  [ // filled with 2 circles
    ['M 0 0 16 0 16 16 0 16', 3],
    ['M 3 8, A 5 5 0 1 1 13 8, A 5 5 0 1 1 3 8', 4],
    ['M 4 8, A 4 4 0 1 1 12 8, A 4 4 0 1 1 4 8', 3],
    ['M 5 8, A 3 3 0 1 1 11 8, A 3 3 0 1 1 5 8', 4]
  ],
  [ // platform center
    ['M 0 0 16 0 16 16 0 16', 1],
    ['M 0 1 16 1 16 16 0 16', 0],
    ['M 0 6 4 4 8 6 12 4 16 6 16 16 0 16', 4],
    ['M 0 8 4 6 8 8 12 6 16 8 16 16 0 16', 3],
    ['M 0 12 4 10 8 12 12 10 16 12 16 16 0 16', 5]
  ],
  [ // platform left
    ['M 0 4, A 4 4 0 0 1 4 0, L 16 0 16 16 0 16', 1],
    ['M 1 4, A 3 3 0 0 1 4 1, L 16 1 16 16 1 16', 0],
    ['M 0 6 4 4 8 6 12 4 16 6 16 16 0 16', 4],
    ['M 0 8 4 6 8 8 12 6 16 8 16 16 0 16', 3],
    ['M 0 12 4 10 8 12 12 10 16 12 16 16 0 16', 5]
  ],
  [ // platform right
    ['M 12 0, A 4 4 0 0 1 16 4, L 16 16 0 16 0 0', 1],
    ['M 12 1, A 3 3 0 0 1 15 4, L 15 16 0 16 0 1', 0],
    ['M 0 6 4 4 8 6 12 4 16 6 16 16 0 16', 4],
    ['M 0 8 4 6 8 8 12 6 16 8 16 16 0 16', 3],
    ['M 0 12 4 10 8 12 12 10 16 12 16 16 0 16', 5]
  ],
  [ // platform single
    ['M 0 4, A 4 4 0 0 1 4 0, L 12 0, A 4 4 0 0 1 16 4, L 16 16 0 16', 1],
    ['M 1 4, A 3 3 0 0 1 4 1, L 12 1, A 3 3 0 0 1 15 4, L 15 16 1 16', 0],
    ['M 0 6 4 4 8 6 12 4 16 6 16 16 0 16', 4],
    ['M 0 8 4 6 8 8 12 6 16 8 16 16 0 16', 3],
    ['M 0 12 4 10 8 12 12 10 16 12 16 16 0 16', 5]
  ],
  [ // slope ascending outer
    ['M 0 16 16 0 16 16', 1],
    ['M 1 16 16 1 16 16', 0],
    ['M 6 16 16 6 16 16', 4],
    ['M 8 16 16 8 16 16', 3],
    ['M 12 16 16 12 16 16', 5]
  ],
  [ // slope ascending inner
    ['M 0 0 0 0 16 0 16 16 0 16', 1],
    ['M 0 1 1 0 16 0 16 16 0 16', 0],
    ['M 0 6 6 0 16 0 16 16 0 16', 4],
    ['M 0 8 8 0 16 0 16 16 0 16', 3],
    ['M 0 12 12 0 16 0 16 16 0 16', 5]
  ],
  [ // slope descending outer
    ['M 0 0 16 16 0 16', 1],
    ['M 0 1 15 16 0 16', 0],
    ['M 0 6 10 16 0 16', 4],
    ['M 0 8 8 16 0 16', 3],
    ['M 0 12 4 16 0 16', 5]
  ],
  [ // slope descending inner
    ['M 0 0 0 0 16 0 16 16 0 16', 1],
    ['M 15 0 16 1 16 16 0 16 0 0', 0],
    ['M 10 0 16 6 16 16 0 16 0 0', 4],
    ['M 8 0 16 8 16 16 0 16 0 0', 3],
    ['M 4 0 16 12 16 16 0 16 0 0', 5]
  ],
  [ // wave
    ['M 0 2, Q 4 0 8 2, Q 12 4 16 2, L 16 16 0 16', 4],
    ['M 0 3, Q 4 1 8 3, Q 12 5 16 3, L 16 16 0 16', 1],
    ['M 0 8, Q 4 6 8 8, Q 12 10 16 8, L 16 16 0 16', 0]
  ],
  [ // tree top
    ['M 7 8 9 8 9 16 7 16', 5],
    ['M 5 9, A 3 6 0 1 1 11 9, A 3 4 0 1 1 5 9', 1],
    ['M 8 16, A 6 6 0 0 0 14 10, L 8 14', 5],
    ['M 8 15, A 6 6 0 0 1 2 8, L 8 13', 5]
  ],
  [
    // tree trunk
    ['M 7 0 9 0 9 16 7 16', 5]
  ]
]

const CHAR = [
  [
    ['M 3 10, A 5 8 0 1 1 13 10, A 5 3 0 1 1 3 10', 1],
    ['M 5 8 7 8 7 16 5 16', 1],
    ['M 9 8 11 8 11 16 9 16', 1],
    ['M 5 8, A 1 1 0 1 1 7 8, A 1 1 0 1 1 5 8, M 9 8, A 1 1 0 1 1 11 8, A 1 1 0 1 1 9 8', 4]
  ],
  [
    ['M 3 10, A 5 8 0 1 1 13 10, A 5 3 0 1 1 3 10', 1],
    ['M 5 8, A 1 1 0 1 1 7 8, M 9 8, A 1 1 0 1 1 11 8', 4]
  ],

  [
    ['M 3 10, A 5 5 0 1 1 13 10, A 5 5 0 1 1 3 10', 1],
    ['M 5 8 7 8 7 16 5 16', 1],
    ['M 9 8 11 8 11 16 9 16', 1],
    ['M 5 8, A 1 1 0 1 1 7 8, A 1 1 0 1 1 5 8, M 9 8, A 1 1 0 1 1 11 8, A 1 1 0 1 1 9 8', 4]
  ],
  [
    ['M 3 10, A 5 5 0 1 1 13 10, A 5 5 0 1 1 3 10', 1],
    ['M 5 8, A 1 1 0 1 1 7 8, M 9 8, A 1 1 0 1 1 11 8', 4]
  ],

  [
    ['M 3 10, A 5 8 0 1 1 13 10, A 5 3 0 1 1 3 10', 1],
    ['M 5 8 7 8 7 16 5 16', 1],
    ['M 9 8 11 8 11 16 9 16', 1],
    ['M 4 8, A 4 4 0 1 1 12 8, A 4 4 0 1 1 4 8', 4],
    ['M 7 8, A 1 1 0 1 1 9 8, A 1 1 0 1 1 7 8', 5]
  ],
  [
    ['M 3 10, A 5 8 0 1 1 13 10, A 5 3 0 1 1 3 10', 1],
    ['M 4 8, A 4 4 0 1 1 12 8, A 4 4 0 1 1 4 8', 4],
    ['M 7 8, A 1 1 0 1 1 9 8', 5]
  ],

  [
    ['M 3 10, A 5 5 0 1 1 13 10, A 5 5 0 1 1 3 10', 1],
    ['M 5 8 7 8 7 16 5 16', 1],
    ['M 9 8 11 8 11 16 9 16', 1],
    ['M 4 8, A 4 4 0 1 1 12 8, A 4 4 0 1 1 4 8', 4],
    ['M 7 8, A 1 1 0 1 1 9 8, A 1 1 0 1 1 7 8', 5]
  ],
  [
    ['M 3 10, A 5 5 0 1 1 13 10, A 5 5 0 1 1 3 10', 1],
    ['M 4 8, A 4 4 0 1 1 12 8, A 4 4 0 1 1 4 8', 4],
    ['M 7 8, A 1 1 0 1 1 9 8', 5]
  ]
]

export function getTileset (scale) {
  let colors = PAL.length
  let tls = {
    tileWidth: TILE_SIZE * scale,
    tileHeight: TILE_SIZE * scale,
    columns: colors,
    sec1Rows: TILE.length,
    sec2Rows: CHAR.length / 4
  }

  tls.width = tls.tileWidth * tls.columns
  tls.rows = tls.sec1Rows + tls.sec2Rows
  tls.height = tls.tileHeight * tls.rows

  tls.img = Canvas(tls.width, tls.height)

  for (var t = 0; t < TILE.length; t++) {
    for (var c = 0; c < colors; c++) {
      let x = c * tls.tileWidth
      let y = t * tls.tileHeight

      tls.img.ctx.save()
      tls.img.ctx.translate(x, y)
      drawSvg(tls.img.ctx, TILE[t], PAL[c], scale)
      tls.img.ctx.restore()
    }
  }

  for (var i = 0; i < 4; i++) {
    let x = i * tls.tileWidth
    let y = tls.sec1Rows * tls.tileHeight

    tls.img.ctx.save()
    tls.img.ctx.translate(x, y)
    drawSvg(tls.img.ctx, CHAR[i * 2], PAL[i], scale)
    tls.img.ctx.restore()

    tls.img.ctx.save()
    tls.img.ctx.translate(x, y + tls.tileHeight)
    drawSvg(tls.img.ctx, CHAR[i * 2 + 1], PAL[i], scale)
    tls.img.ctx.restore()
  }

  return tls
}

let platformTiles = [5, 4, 6]

export function getPlatform (p, tls) {
  let platform = Canvas(tls.tileWidth * platformTiles.length, tls.tileHeight)

  for (var t in platformTiles) {
    let sx = p * tls.tileWidth
    let sy = platformTiles[t] * tls.tileHeight
    let dx = t * tls.tileWidth
    let dy = 0
    platform.ctx.drawImage(tls.img, sx, sy, tls.tileWidth, tls.tileHeight, dx, dy, tls.tileWidth, tls.tileHeight)
  }

  return platform
}

export function getPlayer (p, tls) {
  let player = Canvas(tls.tileWidth, tls.tileHeight)

  let sx = p * tls.tileWidth
  let sy = tls.sec1Rows * tls.tileHeight
  player.ctx.drawImage(tls.img, sx, sy, tls.tileWidth, tls.tileHeight, 0, 0, tls.tileWidth, tls.tileHeight)

  return player
}

export function getTree (p, segments, tls) {
  let tw = tls.tileWidth
  let th = tls.tileHeight

  let tree = Canvas(tw, th * (segments + 1))
  let sx = p * tw
  let sy = tiles.treeTop * th

  tree.ctx.drawImage(tls.img, sx, sy, tw, th, 0, 0, tw, th)

  sy = tiles.treeTrunk * th

  for (var s = 0; s < segments; s++) {
    tree.ctx.drawImage(tls.img, sx, sy, tw, th, 0, (1 + s) * th, tw, th)
  }

  return tree
}

/*
SVG utilities
*/

function scaleSVG (cmd, pts, s) {
  if (cmd === 'A') {
    return cmd + pts.map((n, i) => {
      return i < 2 || i > 4 ? n * s : n
    }).join(' ')
  } else {
    return cmd + pts.map((n) => n * s).join(' ')
  }
}

function drawSvgShape (ctx, string, color, scale) {
  ctx.fillStyle = color
  let shapes = string.split(',')
  for (var i = 0; i < shapes.length; i++) {
    let pts = shapes[i].trim().split(' ')
    let cmd = pts.shift()
    shapes[i] = scaleSVG(cmd, pts, scale)
  }

  ctx.fill(new Path2D(shapes.join(' ')))
}

function drawSvg (ctx, data, pal, scale) {
  for (var i in data) {
    drawSvgShape(ctx, data[i][0], pal[data[i][1]], scale)
  }
}
