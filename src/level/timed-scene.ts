import { GameContext } from '../game-context'
import { Scene } from './scene'

// scen som försvinner efter `countDown` sekunder
export class TimedScene extends Scene {
  countDown = 2

  update(gameContext: GameContext) {
    this.countDown -= gameContext.deltaTime
    if (this.countDown <= 0) {
      this.events.emit(Scene.EVENT_COMPLETE)
    }
  }
}