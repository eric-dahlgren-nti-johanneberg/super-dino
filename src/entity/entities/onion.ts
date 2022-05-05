import { Entity } from '../entity'
import { loadSpriteSheet } from '../../loaders/sprite'
import { SpriteSheet } from '../../sprite-sheet'
import { Physics } from '../../traits/physics'
import { Solid } from '../../traits/solid'
import { Killable } from '../../traits/killable'
import { Trait } from '../../traits/trait'
import { Stomper } from '../../traits/stomper'
import { PendulumMove } from '../../traits/pendulum-move'

class OnionBehaviour extends Trait {
  collides(us: Entity, them: Entity) {
    if (us.getTrait(Killable)?.dead) {
      return
    }

    const stomper = them.getTrait(Stomper)
    if (stomper) {
      if (them.vel.y > us.vel.y) {
        this.handleStomp(us, them)
      } else {
        this.handleNudge(us, them)
      }
    }
  }

  // rör toppen
  handleStomp(us: Entity, them: Entity) {
    us.useTrait(Killable, (it) => it.kill())
    us.vel.set(100, -200)
    us.useTrait(Solid, (s) => (s.obstructs = false))
  }

  // rör sidan
  handleNudge(us: Entity, them: Entity) {
    const killable = them.getTrait(Killable)
    console.log("nudge", killable)
    if (killable && !killable.dead) {
      killable.kill()
    }
  }
}

export class Onion extends Entity {
  solid = this.addTrait(new Solid())
  physics = this.addTrait(new Physics())
  killable = this.addTrait(new Killable())
  behaviour = this.addTrait(new OnionBehaviour())
  move = this.addTrait(new PendulumMove())

  constructor(private sprites: SpriteSheet) {
    super()

    this.size.set(16, 16)
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
