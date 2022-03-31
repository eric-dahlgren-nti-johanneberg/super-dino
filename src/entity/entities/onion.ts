import { Entity } from '../entity'
import { loadSpriteSheet } from '../../loaders/sprite'
import { SpriteSheet } from '../../sprite-sheet'
import { Velocity } from '../../traits/velocity'

export class Onion extends Entity {
  velocity = this.addTrait(new Velocity())

  constructor(private sprites: SpriteSheet) {
    super()
  }

  draw(context: CanvasRenderingContext2D) {
    this.sprites.draw('idle', context, 0, 0)
  }
}

export async function loadOnion() {
  const [onionSprites] = await Promise.all([loadSpriteSheet('onion')])

  return function createOnion() {
    return new Onion(onionSprites)
  }
}
