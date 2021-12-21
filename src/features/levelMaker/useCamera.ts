import { useState } from 'react';

import { Camera, CanvasState } from './types';
import { usePan } from './useCanvasMovement';
import { useEventListener } from './useEventListener';
import { useMousePosition } from './useMousePosition';

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_RATIO = 1.02;

/**
 * Listen for `wheel` events on the given element ref and update the reported
 * scale state, accordingly.
 */

export const useCamera: Camera = (ref) => {
  const [mouseX, mouseY] = useMousePosition(ref);
  const [pan, startPan, overridePan] = usePan();

  const [scale, setScale] = useState(1);

  // Set up an event listener such that on `wheel`, we call `updateScale`.
  useEventListener<WheelEvent, HTMLElement>(
    'wheel',
    (e) => {
      const sc = e.deltaY < 0 ? 1 / SCALE_RATIO : SCALE_RATIO;
      setScale((s) => {
        const newScale = getScale(s, sc);

        if (newScale !== s) {
          scaleAt(mouseX, mouseY, sc);
        }
        return newScale;
      });
    },
    ref
  );

  const scaleAt = (x: number, y: number, sc: number) => {
    const point = { x: pan.x, y: pan.y };

    point.x = x - (x - point.x) * sc;
    point.y = y - (y - point.y) * sc;

    overridePan(point);
  };

  const state: CanvasState = {
    scale,
    offset: pan,
  };

  const toWorld = (x: number, y: number, point = { x: 0, y: 0 }) => {
    const inv = 1 / scale;
    point.x = (x + pan.x) * inv;
    point.y = (y + pan.y) * inv;
    return point;
  };

  const apply = (gl: CanvasRenderingContext2D) => {
    gl.setTransform(scale, 0, 0, scale, -pan.x, -pan.y);
  };

  return [state, { apply, scaleAt, toWorld, startPan }];
};

function getScale(scale: number, sc: number) {
  if (scale * sc > MAX_SCALE) {
    return MAX_SCALE;
  } else if (scale * sc < MIN_SCALE) {
    return MIN_SCALE;
  } else {
    return scale * sc;
  }
}
