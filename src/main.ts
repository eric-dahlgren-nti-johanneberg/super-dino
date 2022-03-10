import { loadImage } from './loaders'
import { raise } from './raise'
import { SpriteSheet } from './sprite-sheet'

const main = async (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext('2d') || raise('Canvas not supported')

  const spriteImage = await loadImage('./public/images/tiles.png')
  const tiles = new SpriteSheet(spriteImage, 16, 16)

  tiles.define('sky', 3, 23, 16, 16)

  for (let x = 0; x < 25; x++) {
    for (let y = 0; y < 10; y++) {
      tiles.drawTile('sky', context, x, y)
    }
  }
}

const canvas = document.getElementById('screen')
if (canvas instanceof HTMLCanvasElement) {
  main(canvas).catch(console.error)
} else {
  console.warn('Canvas not found')
}
