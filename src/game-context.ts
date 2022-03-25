import { EntityFactory } from './entity/entities'
import { Dict } from './types'

export type GameContext = {
  deltaTime: number
  entityFactory: Dict<EntityFactory>
  graphicsContext: CanvasRenderingContext2D
}
