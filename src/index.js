import { getTileset, getPlatform } from './Tileset.js'
import { Canvas } from './lib/Canvas.js'
import { Loop } from './lib/Loop.js'
import { Menu } from './Menu.js'
import { Player } from './Player.js'
import { Tree } from './Tree.js'

/*
import { zzfxP } from './lib/zzfx.js'
import { zzfxM } from './lib/zzfxm.js'
import { theme } from './Sounds.js'

let mySongData = zzfxM(...theme)
zzfxP(...mySongData)
*/

const G = {}

G.colors = Math.floor(Math.random() * 4)
G.bg = '#52427a'

G.scale = 2.25 // quality
G.tilesH = 56
G.tilesV = 48

const Y = 22

G.tls = getTileset(G.scale)
G.tw = G.tls.tileWidth
G.th = G.tls.tileHeight
G.offscreen = Canvas(G.tilesH * G.tw, G.tilesV * G.th)

G.cam = {}
G.cam.baseHaight = G.offscreen.height
G.cam.x = Math.floor(G.offscreen.width / 2)
G.cam.y = Math.floor(G.offscreen.height / 2)
G.cam.r = 0
G.cam.scale = 2

G.players = []
G.platforms = []
G.trees = []

for (var i = 0; i < 4; i++) {
  let px = G.cam.x + (i - 2) * 7 * G.tw + G.tw
  let py = (G.tilesV - Y) * G.th

  G.players[i] = new Player(i, px + G.tw, py - G.th, G)

  G.platforms[i] = {
    x: px,
    y: py,
    img: getPlatform(i, G.tls)
  }

  /*
  G.trees[i] = {
    x: px + G.tw,
    y: py - (1 + 24) * G.tw,
    segments: 24,
    img: getTree(i, 24, G.tls)
  }
  */

  G.trees[i] = new Tree(i, px + G.tw * 1.5, py, 24, G)
}

G.cam.y = G.players[0].y - 4 * G.th

document.addEventListener('keypress', logKey)

function logKey (e) {
  if (e.code === 'Space') {
    G.state.chopTree(0)
  }
}

function resize () {
  G.screen = Canvas(window.innerWidth, window.innerHeight, 'screen')
  G.screen.ctx.fillStyle = G.bg
  G.screen.ctx.fillRect(0, 0, G.screen.width, G.screen.height)

  let cam = G.cam

  cam.height = cam.baseHaight
  cam.width = cam.height * G.screen.width / G.screen.height
  cam.halfHeight = cam.height / 2
  cam.halfWidth = cam.width / 2

  cam.sx = cam.x - cam.halfWidth
  cam.sy = cam.y - cam.halfHeight
  cam.sw = cam.width
  cam.sh = cam.height
  cam.dx = 0
  cam.dy = 0
  cam.dw = G.screen.width
  cam.dh = G.screen.height
}

window.addEventListener('resize', resize)
resize()

function init () {
  G.state = new Menu(G)
  G.loop = new Loop(G.state)

  G.loop.start()
}

init()
