import { loadImage } from './image'
import { loadJSON } from './json'
import { SpriteSheet } from '../sprite-sheet'
import { SpriteSheetSpec } from './types'
import { createAnimation } from '../animation'

export async function loadSpriteSheet(name: string) {
  const url = `sprites/${name}.json`
  const sheetSpec = await loadJSON<SpriteSheetSpec>(url)
  const image = await loadImage(sheetSpec.imageURL)

  const sprites = new SpriteSheet(image, sheetSpec.tileW, sheetSpec.tileH)

  if (sheetSpec.tiles) {
    sheetSpec.tiles.forEach((tileSpec) => {
      const [x, y] = tileSpec.index
      sprites.defineraTile(tileSpec.name, x, y)
    })
  }

  if (sheetSpec.frames) {
    sheetSpec.frames.forEach((frameSpec) => {
      const [x, y, width, height] = frameSpec.rect
      sprites.definera(frameSpec.name, x, y, width, height)
    })
  }

  if (sheetSpec.animations) {
    sheetSpec.animations.forEach((animSpec) => {
      const animation = createAnimation(animSpec.frames, animSpec.frameLength)
      sprites.defineraAnimation(animSpec.name, animation)
    })
  }

  return sprites
}
