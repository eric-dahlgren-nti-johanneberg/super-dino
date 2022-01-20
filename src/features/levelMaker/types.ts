export type Point = { x: number; y: number };
export type Vec2 = [number, number];

export type CanvasDrawFn = (
  gl: WebGL2RenderingContext,
  frameCount: number,
  mouse: Vec2
) => void;

export interface ResizeObserverEntry {
  readonly borderBoxSize: ReadonlyArray<ResizeObserverSize>;
  readonly contentBoxSize: ReadonlyArray<ResizeObserverSize>;
  readonly devicePixelContentBoxSize: ReadonlyArray<ResizeObserverSize>;
  readonly contentRect: DOMRectReadOnly;
  readonly target: Element;
}

export interface ResizeObserverCallback {
  (entries: ResizeObserverEntry[], observer: ResizeObserver): void;
}
