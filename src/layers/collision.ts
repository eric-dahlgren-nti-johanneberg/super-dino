import { Camera } from '../contols/camera'
import { Entity } from '../entity/entity'
import { Level } from '../level/level'
import { TileResolver } from '../tiles/tile-resolver'

function createEntityLayer(entities: Set<Entity>) {
  return function drawBoundingBox(
    context: CanvasRenderingContext2D,
    camera: Camera,
  ) {
    context.strokeStyle = 'red'
    context.lineWidth = 1
    entities.forEach((entity) => {
      context.strokeRect(
        entity.bounds.left - camera.pos.x - 5,
        entity.bounds.top - camera.pos.y - 5,
        entity.size.x + 10,
        entity.size.y + 10,
      )
    })
  }
}

function createTileCandidateLayer(tileResolver: TileResolver) {
  const tileSize = tileResolver.tileSize
  const resolvedTiles = [] as Array<{ x: number; y: number }>

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const getByIndexOriginal = tileResolver.getByIndex

  tileResolver.getByIndex = function getByIndexFake(x: number, y: number) {
    resolvedTiles.push({ x, y })
    return getByIndexOriginal.call(tileResolver, x, y)
  }

  return function drawTileCandidates(
    context: CanvasRenderingContext2D,
    camera: Camera,
  ) {
    context.strokeStyle = 'blue'
    resolvedTiles.forEach(({ x, y }) => {
      context.strokeRect(
        x * tileSize - camera.pos.x,
        y * tileSize - camera.pos.y,
        tileSize,
        tileSize,
      )
    })

    resolvedTiles.length = 0
  }
}

export function createCollisionLayer(level: Level) {
  /* const drawTileCandidates = level.tileCollider.resolvers.map(
    createTileCandidateLayer,
  ) */

  const drawBoundingBoxes = createEntityLayer(level.entities)

  return function drawCollision(
    context: CanvasRenderingContext2D,
    camera: Camera,
  ) {
    /* for (const draw of drawTileCandidates) {
      draw(context, camera)
    } */
    drawBoundingBoxes(context, camera)
  }
}
