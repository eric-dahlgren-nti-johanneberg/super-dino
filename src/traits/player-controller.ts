import { Entity } from '../entity/entity'
import { GameContext } from '../game-context'
import { Level } from '../level/level'
import { Vec2 } from '../math'
import { Trait } from '../traits/trait'

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
      level.entities.add(this.player)
    }
  }
}
