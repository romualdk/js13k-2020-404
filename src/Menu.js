import { PAL, tiles } from './Tileset.js'
import { Canvas } from './lib/Canvas.js'
import { initGamepads, updateGamepads, onButtonPress } from './lib/Gamepad.js'
import { easeOutQuint } from './lib/Ease.js'
import { zzfx } from './lib/zzfx.js'
import { power } from './Sounds.js'

export class Menu {
  constructor (Game) {
    initGamepads()
    this.buttons = []

    this.game = Game
    this.waveSpeed = 100

    let g = this.game

    let wave = {
      tilesX: Math.ceil(g.offscreen.width / g.tw),
      tilesY: 20
    }

    wave.img = Canvas(wave.tilesX * g.tw, wave.tilesY * g.th)
    wave.img.ctx.fillStyle = PAL[g.colors][0]
    wave.img.ctx.fillRect(0, g.th, wave.img.width, wave.img.height)

    for (var i = 0; i < wave.tilesX; i++) {
      let sx = g.colors * g.tw
      let sy = tiles.wave * g.th
      let dx = i * g.tw
      let dy = 0

      wave.img.ctx.drawImage(g.tls.img, sx, sy, g.tw, g.th, dx, dy, g.tw, g.th)
    }

    this.stomp = 0

    this.wave = wave
    this.waveX = 0
    this.waveY = g.offscreen.height - wave.img.height

    this.game.cam.s = this.game.cam.scale

    this.shake = 0

    this.ss = 0
  }

  prepare () {

  }

  setButton (e) {
    this.chopTree(e.index)
  }

  chopTree (p) {
    if (this.game.players[p].active === false) {
      this.game.players[p].active = true
      this.game.trees[p].active = true
      this.game.trees[p].grow()
    }

    this.game.trees[p].chop()

    this.game.players[0].jump()
    this.game.state.shake = 1
  }

  stomp (p) {
    if (this.game.players[p].active === false) {
      this.game.players[p].active = true
      this.game.trees[p].active = true
      this.game.trees[p].grow()
    }

    if (this.game.trees[p].chop()) {
      this.stomp = 2
    }
  }

  update (dt) {
    let cam = this.game.cam

    cam.s -= 0.05 * dt
    if (cam.s < 1) {
      cam.s = 1
    }

    cam.scale = easeOutQuint(cam.s)

    if (this.shake > 0) {
      cam.dx = 4 - Math.random() * 8
      cam.dy = 4 - Math.random() * 8
      this.shake -= dt
    } else {
      cam.dx = 0
      cam.dy = 0
    }

    if (this.game.trees[0].segments === 1) {
      cam.dx = 16 - Math.random() * 32
      cam.dy = 16 - Math.random() * 32

      if (this.ss <= 0) {
        zzfx(...power)
        this.ss = 2.5
      } else {
        this.ss -= dt
      }
    }

    if (this.shake < 0) {
      this.shake = 0
    }

    updateGamepads()
    onButtonPress(this.setButton.bind(this))

    for (var i = 0; i < 4; i++) {
      let p = this.game.players[i]
      if (p.active) {
        p.update(dt)
        this.game.trees[i].update(dt)

        if (p.y > this.game.platforms[i].y - this.game.th) {
          p.y = this.game.platforms[i].y - this.game.th
          p.vr = 0
          p.r = 0

          if (p.jumping === true) {
            p.jumping = false
            this.shake = 1
          }
        }
      }
    }
  }

  render () {
    let g = this.game
    let scr = g.offscreen
    let cam = g.cam

    scr.ctx.clearRect(0, 0, scr.width, scr.height)
    scr.ctx.drawImage(this.wave.img, this.waveX, this.waveY)

    for (var i = 0; i < 4; i++) {
      scr.ctx.save()

      if (g.players[i].active === false) {
        scr.ctx.globalAlpha = 0.5
      }

      scr.ctx.drawImage(g.platforms[i].img, g.platforms[i].x, g.platforms[i].y)

      this.game.trees[i].render(scr.ctx)
      this.game.players[i].render(scr.ctx)

      /*
      if (this.buttons[i]) {
        scr.ctx.fillStyle = '#ffffff'
        scr.ctx.font = '90px Arial'
        let txt = this.buttons[i]
        let width = scr.ctx.measureText(txt).width
        scr.ctx.fillText(txt, x + w / 2 - width / 2, y + h / 2)
      }
      */

      scr.ctx.restore()
    }

    g.screen.ctx.clearRect(0, 0, g.screen.width, g.screen.height)
    g.screen.ctx.save()
    g.screen.ctx.translate(g.screen.width / 2, g.screen.height / 2)
    g.screen.ctx.rotate(cam.r * Math.PI / 180)
    g.screen.ctx.scale(cam.scale, cam.scale)
    g.screen.ctx.drawImage(scr, -cam.x - cam.dx, -cam.y - cam.dy)

    g.screen.ctx.restore()
  }
}
