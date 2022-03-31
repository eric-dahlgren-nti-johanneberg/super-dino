import { Entity } from '../entity'
import { loadSpriteSheet } from '../../loaders/sprite'
import { SpriteSheet } from '../../sprite-sheet'
import { Go } from '../../traits/go'
import { Jump } from '../../traits/jump'
import { Physics } from '../../traits/physics'
import { Solid } from '../../traits/solid'

const FAST_DRAG = 1 / 5000
const SLOW_DRAG = 1 / 1000

export class Sario extends Entity {
  go = this.addTrait(new Go())
  jump = this.addTrait(new Jump())
  // se till att sario faller och inte faller igenom block
  physics = this.addTrait(new Physics())
  solid = this.addTrait(new Solid())

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
