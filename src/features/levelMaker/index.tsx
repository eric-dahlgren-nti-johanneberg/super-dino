import React, { FC, RefObject, useLayoutEffect, useRef } from 'react';

import { CameraFunctions } from './types';
import { useCamera } from './useCamera';
import { useCanvasEngine } from './useCanvasEngine';
import { useElementSize } from './useElementSize';
import { useMousePosition } from './useMousePosition';

type Position = { x: number; y: number };

type CanvasState = {
  scale: number;
  offset: Position;
};

const BLOCK_SIDE = 50;

const translateToCenter = (
  ctx: CanvasRenderingContext2D,
  w = BLOCK_SIDE,
  h = BLOCK_SIDE
) => {
  ctx.translate(-w / 2, -h / 2);
};

const drawBlockAt = (gl: CanvasRenderingContext2D, position: Position) => {
  gl.fillStyle = '#e3e';
  gl.beginPath();
  gl.arc(position.x, position.y, 8, 0, 360);
  gl.fill();
};

type CanvasUtils = CameraFunctions;

type UseCanvasType = {
  canvas: RefObject<HTMLCanvasElement>;
  state: CanvasState;
  utils: CanvasUtils;
};

const useCanvas = (): UseCanvasType => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [state, camutils] = useCamera(ref);

  const utils = {
    ...camutils,
  };

  return { canvas: ref, state, utils };
};

const LevelMaker: FC = () => {
  const {
    canvas,
    state,
    utils: { apply, startPan, toWorld },
  } = useCanvas();

  const [width, height] = useElementSize(canvas);
  const [mouseX, mouseY, mouseInCanvas] = useMousePosition(canvas);

  useLayoutEffect(() => {
    const gl = canvas.current?.getContext('2d');

    if (gl) {
      gl.canvas.width = gl.canvas.offsetWidth;
      gl.canvas.height = gl.canvas.offsetHeight;
    }
  }, [width, height, canvas]);

  const drawGrid = (gl: CanvasRenderingContext2D) => {
    const adaptive = false;
    let scale: number, gridScale: number, size: number, x: number, y: number;
    const gridScreenSize = 128;

    if (adaptive) {
      scale = 1 / state.scale;
      gridScale = 2 ** (Math.log2(gridScreenSize * scale) | 0);
      size = Math.max(width, height) * scale + gridScale * 2;
      x = (((-state.offset.x * scale - gridScale) / gridScale) | 0) * gridScale;
      y = (((-state.offset.y * scale - gridScale) / gridScale) | 0) * gridScale;
    } else {
      gridScale = gridScreenSize;
      size = Math.max(width, height) / state.scale + gridScale * 2;
      toWorld(0, 0);
      x = Math.floor(0 / gridScale) * gridScale;
      y = Math.floor(0 / gridScale) * gridScale;
      if (size / gridScale > 64) {
        size = gridScale * 64;
      }
    }

    apply(gl);
    gl.lineWidth = 1;
    gl.strokeStyle = '#000';
    gl.beginPath();
    for (let i = 0; i < size; i += gridScale) {
      gl.moveTo(x + i, y);
      gl.lineTo(x + i, y + size);
      gl.moveTo(x, y + i);
      gl.lineTo(x + size, y + i);
    }
    gl.setTransform(1, 0, 0, 1, 0, 0); // reset the transform so the lineWidth is 1
    gl.stroke();
  };

  const gameLoop = () => {
    const gl = canvas.current?.getContext('2d');

    if (gl) {
      gl.clearRect(0, 0, width, height);

      drawGrid(gl);
      //drawGrid(gl);

      const pos = toWorld(0, 0);
      apply(gl);
      drawBlockAt(gl, pos);
      gl.setTransform(1, 0, 0, 1, 0, 0);

      if (mouseInCanvas) {
        translateToCenter(gl);
        drawBlockAt(gl, { x: mouseX, y: mouseY });
        gl.setTransform(1, 0, 0, 1, 0, 0);
      }
    }
  };

  useCanvasEngine(gameLoop);

  const { offset, scale } = state;

  return (
    <section className='m-auto max-w-screen-lg'>
      <h1 className='text-xl font-bold'>Level Creator</h1>

      <p>
        canvas size: {width}x{height}
      </p>
      <p>
        mouse position: x: {mouseX}, y: {mouseY}
      </p>
      <p>offset: {JSON.stringify(offset)}</p>
      <p>scale: {scale}</p>
      <p>mouse in canvas: {mouseInCanvas.toString()}</p>
      <section
        onMouseDown={startPan}
        onContextMenu={(e) => e.preventDefault()}
        className='relative'
      >
        <canvas
          className='aspect-video border-[1px] border-slate-600 cursor-none w-full border-solid'
          ref={canvas}
        />
      </section>
    </section>
  );
};

export default LevelMaker;
