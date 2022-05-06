import { createPlayerProgressLayer } from '../layers/player-progress'
import { createColorLayer } from '../layers/color'
import { Level } from '../level/level'
import { TimedScene } from '../level/timed-scene'
import { Font } from '../loaders/font'

export const createProgressScreen = (
  font: Font,
  level: Level,
  lives: number,
) => {
  const progressLayer = createPlayerProgressLayer(font, level, lives)

  const waitScreen = new TimedScene()
  waitScreen.comp.layers.push(createColorLayer('black'))
  lives > 0 && waitScreen.comp.layers.push(progressLayer)
  return waitScreen
}
