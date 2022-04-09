import { Camera } from '../contols/camera'
import { Entity } from '../entity/entity'
import { EntityCollider } from '../entity/collider'
import { GameContext } from '../game-context'
import { findPlayers } from '../player'
import { Scene } from './Scene'
import { TileCollider } from '../tiles/tile-collider'

export class Level extends Scene {
  static EVENT_TRIGGER = Symbol('trigger')

  name = ''

  entities = new Set<Entity>()
  entityCollider = new EntityCollider(this.entities)
  tileCollider = new TileCollider()
  camera = new Camera()

  gravity = 1500
  totalTime = 0

  update(gameContext: GameContext) {
    this.entities.forEach((entity) => {
      entity.update(gameContext, this)
    })

    this.entities.forEach((entity) => {
      this.entityCollider.check(entity)
    })

    // kör i två #forEach för att se till att kollisionen
    // checkas innan entitiesen färdigställs
    this.entities.forEach((entity) => {
      entity.finalize()
    })

    this.totalTime += gameContext.deltaTime

    // flytta kameran till spelaren
    focusPlayer(this)
  }

  draw(gameContext: GameContext) {
    this.comp.draw(gameContext.graphicsContext, this.camera)
  }

  pause() {}
}

function focusPlayer(level: Level) {
  for (const player of findPlayers(level.entities)) {
    /* 
      flytta kameran till spelaren, men om spelaren är mellan 0 och 100 i x-kordinaten, stå stilla.
      Gör så att spelaren "springer in" i banan
    */
    level.camera.pos.x = Math.max(0, player.pos.x - 100)
  }
}
