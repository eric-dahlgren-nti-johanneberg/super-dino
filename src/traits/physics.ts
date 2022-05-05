import { Entity } from '../entity/entity'
import { GameContext } from '../game-context'
import { Level } from '../level/level'
import { Trait } from '../traits/trait'

export class Physics extends Trait {
  update(entity: Entity, gameContext: GameContext, level: Level) {
    /* Uppdatera positionen beroende på entitetens fart */
    entity.pos.x += entity.vel.x * gameContext.deltaTime
    
    /* Kolla om den nya positionen kolliderar med något */
    level.tileCollider.checkX(entity, gameContext, level)
    
    /* Uppdatera positionen beroende på entitetens fart */
    entity.pos.y += entity.vel.y * gameContext.deltaTime
    /* Kolla om den nya positionen kolliderar med något */
    level.tileCollider.checkY(entity, gameContext, level)
    
    /* Applicera banans gravitation på entiteten */
    entity.vel.y += level.gravity * gameContext.deltaTime
  }
}
