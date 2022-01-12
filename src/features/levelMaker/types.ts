export type Point = { x: number; y: number };

export type CanvasDrawFn = (
  gl: WebGL2RenderingContext,
  frameCount: number
) => void;
