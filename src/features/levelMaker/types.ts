import { RefObject } from 'react';

export type Point = { x: number; y: number };

export type CanvasState = {
  scale: number;
  offset: Point;
  mouse: [number, number, boolean];
};

export type CameraFunctions = {
  toWorld: (x: number, y: number, point?: Point) => Point;
  scaleAt: (sc: number, point?: Point) => void;
  apply: (gl: CanvasRenderingContext2D) => void;
  startPan: (e: React.MouseEvent) => void;
};
export type UseCameraType = [CanvasState, CameraFunctions];

export type Camera = (ref: RefObject<HTMLCanvasElement>) => UseCameraType;
