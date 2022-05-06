import { Entity } from '../entity/entity'
import { GameContext } from '../game-context'
import { focusPlayer, Level } from '../level/level'
import { Vec2 } from '../math'
import { Trait } from '../traits/trait'
import { Killable } from './killable'

/**
 * Sparar senaste checkpointen för spelaren
 */
export class PlayerController extends Trait {
  checkpoint = new Vec2(0, 0)

  static KILLED = Symbol('killed')
  static REVIVED = Symbol('revived')

  constructor(private player: Entity) {
    super()
  }

  update(_: Entity, __: GameContext, level: Level) {
    if (!level.entities.has(this.player)) {
      const killable = this.player.getTrait(Killable)

      if (killable) {
        if (killable.dead) {
          level.events.emit(PlayerController.KILLED)
          killable.revive(() => level.events.emit(PlayerController.REVIVED))
          this.player.pos.set(this.checkpoint.x, this.checkpoint.y)
        }
      }
      level.entities.add(this.player)
    }
  }
}
