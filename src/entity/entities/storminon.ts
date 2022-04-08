import { Entity } from '../entity'
import { loadSpriteSheet } from '../../loaders/sprite'
import { SpriteSheet } from '../../sprite-sheet'
import { Physics } from '../../traits/physics'
import { Solid } from '../../traits/solid'
import { Trait } from '../../traits/trait'
import { Killable } from '../../traits/killable'
import { Stomper } from '../../traits/stomper'
import { PendulumMove } from '../../traits/PendulumMove'

enum StorMinonState {
  walking,
  angry,
}

class StorMinonBehaviour extends Trait {
  state = StorMinonState.walking
  angrySpeed = 300
  walkSpeed?: number

  collides(us: Entity, them: Entity) {
    if (us.getTrait(Killable)?.dead) {
      return
    }

    const stomper = them.getTrait(Stomper)
    if (stomper) {
      if (them.vel.y > us.vel.y) {
        this.handleStomp(us, them)
      }
    }
  }

  handleStomp(us: Entity, them: Entity) {
    if (this.state === StorMinonState.walking) {
      this.panic(us, them)
    } else if (this.state === StorMinonState.angry) {
      us.useTrait(Killable, (it) => it.kill())
      us.vel.set(100, -200)
      us.useTrait(Solid, (s) => (s.obstructs = false))
    }
  }

  panic(us: Entity, them: Entity) {
    us.useTrait(PendulumMove, (pm) => {
      pm.speed = this.angrySpeed * Math.sign(them.vel.x)
      pm.enabled = true
    })
    this.state = StorMinonState.angry
  }
}

export class StorMinon extends Entity {
  physics = this.addTrait(new Physics())
  solid = this.addTrait(new Solid())
  walk = this.addTrait(new PendulumMove())

  constructor(private sprites: SpriteSheet) {
    super()

    this.size.set(16, 32)
  }

  draw(context: CanvasRenderingContext2D) {
    this.sprites.draw('idle', context, 0, 0)
  }
}

export async function loadStorMinon() {
  const [onionSprites] = await Promise.all([loadSpriteSheet('storminon')])

  return function createOnion() {
    return new StorMinon(onionSprites)
  }
}
