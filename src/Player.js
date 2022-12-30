import { getPlayer } from './Tileset.js'
import { zzfx } from './lib/zzfx.js'
import { jump } from './Sounds.js'

export class Player {
  constructor (i, x, y, game) {
    this.game = game
    this.active = false
    this.x = x
    this.y = y
    this.ax = 0
    this.ay = 0
    this.vx = 0
    this.vy = 0
    this.g = 9.8
    this.r = 0
    this.vr = 0
    this.jumping = false
    this.jumps = 0
    this.img = getPlayer(i, this.game.tls)
    this.anchorX = this.img.width / 2
    this.anchorY = this.img.height / 2
  }

  update (dt) {
    this.vy += (this.ay + this.g) * dt
    this.vx += this.ax * dt
    this.x += this.vx * dt
    this.y += this.vy * dt
    this.r += this.vr * dt
  }

  jump () {
    if (!this.jumping) {
      this.vy = -50
      this.vr = 35
      this.jumping = true
    }

    zzfx(...jump)
  }

  render (ctx) {
    ctx.save()
    ctx.translate(this.x + this.anchorX, this.y + this.anchorY)
    ctx.rotate(this.r * Math.PI / 180)
    ctx.translate(-this.anchorX, -this.anchorY)
    ctx.drawImage(this.img, 0, 0)
    ctx.restore()
  }
}
