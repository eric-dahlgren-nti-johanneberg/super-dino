import { Entity } from '../entity/entity'
import { GameContext } from '../game-context'
import { Level } from '../level/level'
import { Vec2 } from '../math'
import { Trait } from '../traits/trait'
import { Killable } from './killable'

/**
 * Sparar senaste checkpointen för spelaren
 */
export class PlayerController extends Trait {
  checkpoint = new Vec2(0, 0)

  constructor(private player: Entity) {
    super()
  }

  update(_: Entity, __: GameContext, level: Level) {
    if (!level.entities.has(this.player)) {
      this.player.pos.set(this.checkpoint.x, this.checkpoint.y)
      const killable = this.player.getTrait(Killable)
      if (killable) {
        console.log(killable.dead)
        killable.revive()
      }
      level.entities.add(this.player)
    }
  }
}
