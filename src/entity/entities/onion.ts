import { Entity } from '../entity'
import { loadSpriteSheet } from '../../loaders/sprite'
import { SpriteSheet } from '../../sprite-sheet'
import { Physics } from '../../traits/physics'
import { Solid } from '../../traits/solid'

export class Onion extends Entity {
  solid = this.addTrait(new Solid())
  physics = this.addTrait(new Physics())

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
