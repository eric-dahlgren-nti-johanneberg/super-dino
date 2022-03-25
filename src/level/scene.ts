import { Camera } from '../contols/camera'
import { Compositor } from './compositor'
import { EventEmitter } from '../event/emitter'
import { GameContext } from '../game-context'

export class Scene {
  static EVENT_COMPLETE = Symbol('scene complete')

  comp = new Compositor()
  events = new EventEmitter()

  draw(gameContext: GameContext) {
    // the original code does not pass a new Camera() here,
    // but we need to pass one because our layers are typed
    // with the assumption that it'll always receive a camera.
    // hopefully this doesn't cause issues
    // (if anything this'll keep things from breaking)
    this.comp.draw(gameContext.graphicsContext, new Camera())
  }

  update(gameContext: GameContext) {}

  pause() {}
}
