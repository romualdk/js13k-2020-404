import { getTree } from './Tileset.js'

export class Tree {
  constructor (i, x, y, segments, game) {
    this.game = game
    this.active = false
    this.segments = segments
    this.maxGrow = 1 * (this.segments + 1)
    this.grown = 0
    this.growing = false
    this.r = 0
    this.x = x
    this.y = y
    this.img = getTree(i, segments, this.game.tls)
    this.setSize()
  }

  update (dt) {
    if (this.growing) {
      this.grown += dt

      if (this.grown >= this.maxGrow) {
        this.grown = this.maxGrow
        this.growing = false
      }

      this.setSize()
    }
  }

  setSize () {
    this.w = this.img.width
    this.h = this.grown / this.maxGrow * (this.segments + 1) * this.game.th
    this.anchorX = this.w / 2
    this.anchorY = this.h
  }

  grow () {
    this.growing = true
  }

  chop () {
    if (this.segments > 1) {
      this.segments -= 1
      this.setSize()
      return true
    } else {
      return false
    }
  }

  render (ctx) {
    if (this.h > 0) {
      ctx.save()
      ctx.translate(this.x - this.anchorX, this.y - this.anchorY)
      // ctx.rotate(this.r * Math.PI / 180)
      // ctx.translate(-this.anchorX, -this.anchorY)
      ctx.drawImage(this.img, 0, 0, this.w, this.h, 0, 0, this.w, this.h)
      ctx.restore()
    }
  }
}
