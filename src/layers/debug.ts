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
        entity.bounds.left - camera.pos.x,
        entity.bounds.top - camera.pos.y,
        entity.size.x,
        entity.size.y,
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
  const drawTileCandidates = level.tileCollider.resolvers.map(
    createTileCandidateLayer,
  )

  const drawBoundingBoxes = createEntityLayer(level.entities)

  return function drawCollision(
    context: CanvasRenderingContext2D,
    camera: Camera,
  ) {
    for (const draw of drawTileCandidates) {
      draw(context, camera)
    }
    drawBoundingBoxes(context, camera)
  }
}

export function createCameraLayer(cameraToDraw: Camera) {
  return function drawCameraRect(
    context: CanvasRenderingContext2D,
    fromCamera: Camera,
  ) {
    context.strokeStyle = 'purple'
    context.strokeRect(
      cameraToDraw.pos.x - fromCamera.pos.x,
      cameraToDraw.pos.y - fromCamera.pos.y,
      cameraToDraw.size.x,
      cameraToDraw.size.y,
    )
  }
}

export const createDebugLayer = () => {}
