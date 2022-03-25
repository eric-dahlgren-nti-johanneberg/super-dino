import { Entity } from '../entity/entity'
import { GameContext } from '../game-context'
import { Level } from '../level/level'
import { Trait } from '../traits/trait'

export class Physics extends Trait {
  update(entity: Entity, gameContext: GameContext, level: Level) {
    entity.pos.x += entity.vel.x * gameContext.deltaTime

    level.tileCollider.checkX(entity, gameContext, level)

    entity.pos.y += entity.vel.y * gameContext.deltaTime
    level.tileCollider.checkY(entity, gameContext, level)

    entity.vel.y += level.gravity * gameContext.deltaTime
  }
}
