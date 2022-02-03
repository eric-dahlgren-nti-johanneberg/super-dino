import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const useCanvasEngine = (
  drawFn: () => void
): [() => void, () => void, number] => {
  const lastFrame = useRef(performance.now());
  const [counter, setCounter] = useState(0);
  const [shouldStop, setShouldStop] = useState(true);

  useLayoutEffect(() => {
    if (!shouldStop) {
      let timerId: number;

      const animate = () => {
        setCounter((c) => c + 1);
        lastFrame.current = performance.now() - lastFrame.current;
        timerId = requestAnimationFrame(animate);
      };
      timerId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(timerId);
    }
  }, [shouldStop]);

  useEffect(drawFn, [counter, drawFn]);

  const start = () => setShouldStop(false);
  const stop = () => setShouldStop(true);

  return [start, stop, 1 / lastFrame.current];
};

export { useCanvasEngine };
