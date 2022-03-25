import { Camera } from '../contols/camera'
import { Level } from '../level/level'
import { raise } from '../raise'
import { SpriteSheet } from '../sprite-sheet'
import { TileResolver, TileResolverMatrix } from '../tiles/tile-resolver'

export function createBackgroundLayer(
  level: Level,
  tiles: TileResolverMatrix,
  sprites: SpriteSheet,
) {
  const tileResolver = new TileResolver(tiles)

  const buffer = document.createElement('canvas')
  buffer.width = 256 + 16
  buffer.height = 240

  const context = buffer.getContext('2d') || raise('Canvas not supported')

  function drawTiles(startIndex: number, endIndex: number) {
    context.clearRect(0, 0, buffer.width, buffer.height)

    const items = tiles.itemsInRange(
      startIndex,
      0,
      endIndex,
      buffer.height / 16,
    )

    for (const [tile, x, y] of items) {
      if (!tile.name) continue
      sprites.drawTile(tile.name, context, x - startIndex, y)
    }
  }

  return function drawBackgroundLayer(
    context: CanvasRenderingContext2D,
    camera: Camera,
  ) {
    const drawWidth = tileResolver.toIndex(camera.size.x)
    const drawFrom = tileResolver.toIndex(camera.pos.x)
    const drawTo = drawFrom + drawWidth
    drawTiles(drawFrom, drawTo)

    context.drawImage(buffer, -camera.pos.x % 16, -camera.pos.y)
  }
}
