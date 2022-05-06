import { Entity } from '../entity/entity'
import { GameContext } from '../game-context'
import { Level } from '../level/level'
import { Vec2 } from '../math'
import { Trait } from '../traits/trait'
import { Killable } from './killable'
import { Player } from './player'

/**
 * Sparar senaste checkpointen för spelaren
 */
export class PlayerController extends Trait {
  checkpoint = new Vec2(0, 0)

  static KILLED = Symbol('killed')

  constructor(private player: Entity) {
    super()
  }

  update(_: Entity, __: GameContext, level: Level) {
    if (!level.entities.has(this.player)) {
      const killable = this.player.getTrait(Killable)

      if (killable) {
        level.events.emit(PlayerController.KILLED)
        this.player.useTrait(Player, (p) => p.addLives(-1))
        killable.revive()
        this.player.pos.set(this.checkpoint.x, this.checkpoint.y)
      }
      level.entities.add(this.player)
    }
  }
}
