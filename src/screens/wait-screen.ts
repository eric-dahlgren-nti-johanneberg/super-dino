import { createPlayerProgressLayer } from '../layers/player-progress'
import { createColorLayer } from '../layers/text'
import { Level } from '../level/level'
import { SceneRunner } from '../level/scene-runner'
import { TimedScene } from '../level/timed-scene'
import { Font } from '../loaders/font'

export const addProgressScreen = (
  sceneRunner: SceneRunner,
  font: Font,
  level: Level,
) => {
  const progressLayer = createPlayerProgressLayer(font, level)

  const waitScreen = new TimedScene()
  waitScreen.comp.layers.push(createColorLayer('black'))
  waitScreen.comp.layers.push(progressLayer)
  sceneRunner.addScene(waitScreen)
}
