import { Entity } from '../entity/entity'
import { GameContext } from '../game-context'
import { Trait } from './trait'

export class Velocity extends Trait {
  update(entity: Entity, { deltaTime }: GameContext) {
    entity.pos.x += entity.vel.x * deltaTime
    entity.pos.y += entity.vel.y * deltaTime
  }
}
