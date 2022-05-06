import { Entity } from './entity/entity'
import { LevelTimer } from './traits/level-timer'
import { Player } from './traits/player'
import { PlayerController } from './traits/player-controller'

export function createPlayerEnv(playerEntity: Entity) {
  const playerEnv = new Entity()
  const playerControl = new PlayerController(playerEntity)
  playerControl.checkpoint.set(16, 160)
  playerEnv.addTrait(playerControl)
  playerEnv.addTrait(new LevelTimer())
  return playerEnv
}

export function* findPlayers(entities: Iterable<Entity>) {
  for (const entity of entities) {
    if (entity.getTrait(Player)) yield entity
  }
}

export function makePlayer(entity: Entity, name: string) {
  const player = new Player()
  player.name = name
  entity.addTrait(player)
}
