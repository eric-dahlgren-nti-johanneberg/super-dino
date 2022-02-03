import { RefObject, useEffect, useState } from 'react';

const useMousePosition = (
  ref: RefObject<HTMLElement>
): [number, number, boolean] => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isInComponent, setIsInComponent] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.offsetX, y: event.offsetY });
    };

    if (ref.current) {
      ref.current.onmousemove = (event) => handleMouseMove(event);
      ref.current.onmouseenter = () => setIsInComponent(true);
      ref.current.onmouseleave = () => setIsInComponent(false);
    }
  }, [ref]);

  return [position.x, position.y, isInComponent];
};

export { useMousePosition };
