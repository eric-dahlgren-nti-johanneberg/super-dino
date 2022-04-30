import { Camera } from '../contols/camera'
import { Compositor } from './compositor'
import { EventEmitter } from '../event/emitter'
import { GameContext } from '../game-context'

/* 
 * Abstrakt klass för scener  
 */
export class Scene {
  static EVENT_COMPLETE = Symbol('scene complete')

  comp = new Compositor()
  events = new EventEmitter()

  draw(gameContext: GameContext) {
    // egentligen behövs inte `new Camera()` här, men det behövs för typescript
    this.comp.draw(gameContext.graphicsContext, new Camera())
  }

  update(gameContext: GameContext) {}

  pause() {}
}
