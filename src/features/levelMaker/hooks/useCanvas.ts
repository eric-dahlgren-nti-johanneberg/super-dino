import { useEffect, useRef } from 'react';

import { CanvasDrawFn, ResizeObserverCallback } from '../types';
import { useMousePosition } from '../useMousePosition';

function resizeCanvasToDisplaySize(
  canvas: HTMLCanvasElement,
  size: Map<Element | null, number[]>
) {
  // Get the size the browser is displaying the canvas in device pixels.
  const [displayWidth, displayHeight] = size.get(canvas) as number[];

  // Check if the canvas is not the same size.
  const needResize =
    canvas.width !== displayWidth || canvas.height !== displayHeight;

  if (needResize) {
    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
}

export const useCanvas = (draw: CanvasDrawFn) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const sizeMap = useRef<Map<Element | null, number[]> | null>(null);
  const mouse = useMousePosition(ref);

  const onResize: ResizeObserverCallback = (entries) => {
    for (const entry of entries) {
      let width = 0;
      let height = 0;
      let dpr = window.devicePixelRatio;
      if (entry.devicePixelContentBoxSize) {
        // NOTE: Only this path gives the correct answer
        // The other 2 paths are an imperfect fallback
        // for browsers that don't provide anyway to do this
        width = entry.devicePixelContentBoxSize[0].inlineSize;
        height = entry.devicePixelContentBoxSize[0].blockSize;
        dpr = 1; // it's already in width and height
      } else if (entry.contentBoxSize) {
        if (entry.contentBoxSize[0]) {
          width = entry.contentBoxSize[0].inlineSize;
          height = entry.contentBoxSize[0].blockSize;
        }
      } else {
        // legacy
        width = entry.contentRect.width;
        height = entry.contentRect.height;
      }

      const displayWidth = Math.round(width * dpr);
      const displayHeight = Math.round(height * dpr);
      if (sizeMap.current) {
        sizeMap.current.set(entry.target, [displayWidth, displayHeight]);
      }
    }
  };

  useEffect(() => {
    const gl = ref.current?.getContext('webgl2');
    let lastUpdate: number;
    const resizeObserver = new ResizeObserver(
      onResize as globalThis.ResizeObserverCallback
    );

    if (ref.current) {
      try {
        resizeObserver.observe(ref.current, {
          box: 'device-pixel-content-box',
        });
      } catch (ex) {
        resizeObserver.observe(ref.current, {
          box: 'content-box',
        });
      }
    }

    if (gl) {
      sizeMap.current = new Map([[ref.current, [300, 150]]]);

      const render = (now: number) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        resizeCanvasToDisplaySize(gl.canvas, sizeMap.current!);
        draw(gl, now, mouse.current);
        requestAnimationFrame(render);
      };

      lastUpdate = requestAnimationFrame(render);
    }
    return () => cancelAnimationFrame(lastUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draw, ref]);

  return { ref };
};
