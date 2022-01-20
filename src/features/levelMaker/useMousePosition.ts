import { MutableRefObject, RefObject, useEffect, useRef } from 'react';

import { Vec2 } from './types';

const useMousePosition = (
  ref: RefObject<HTMLElement>
): MutableRefObject<Vec2> => {
  const position = useRef<Vec2>([0, 0]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      position.current = [event.offsetX, event.offsetY];
    };

    if (ref.current) {
      ref.current.onmousemove = (event) => handleMouseMove(event);
    }
  }, [ref]);

  return position;
};

export { useMousePosition };
