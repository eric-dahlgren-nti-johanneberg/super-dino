import { Entity } from '../entity'
import { loadSpriteSheet } from '../../loaders/sprite'
import { SpriteSheet } from '../../sprite-sheet'
import { Go } from '../../traits/go'
import { Velocity } from '../../traits/velocity'

const FAST_DRAG = 1 / 5000
const SLOW_DRAG = 1 / 1000

export class Sario extends Entity {
  go = this.addTrait(new Go())
  velocity = this.addTrait(new Velocity())

  constructor(private sprites: SpriteSheet) {
    super()

    this.go.dragFactor = SLOW_DRAG

    this.setTurboState(false)
  }

  draw(context: CanvasRenderingContext2D) {
    this.sprites.draw('idle', context, 0, 0, this.go.heading < 0)
  }

  setTurboState(turboState: boolean) {
    this.go.dragFactor = turboState ? FAST_DRAG : SLOW_DRAG
  }
}

export async function loadSario() {
  const [sarioSprites] = await Promise.all([loadSpriteSheet('sario')])

  return function createSario() {
    return new Sario(sarioSprites)
  }
}
