import { Camera } from '../contols/camera'

export type LayerFunction = (
  context: CanvasRenderingContext2D,
  camera: Camera,
) => void

/**
 * Håller koll på olika lager, vad som ska målas över vad
 */
export class Compositor {
  layers = [] as LayerFunction[]

  draw(context: CanvasRenderingContext2D, camera: Camera) {
    this.layers.forEach((layer) => {
      layer(context, camera)
    })
  }
}
