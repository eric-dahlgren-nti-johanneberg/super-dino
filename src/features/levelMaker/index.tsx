import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useElementSize } from './useElementSize';
import { useMousePosition } from './useMousePosition';

type WorldPosition = { x: number; y: number };

const drawBlockAt = (gl: CanvasRenderingContext2D, position: WorldPosition) => {
  gl.fillStyle = '#e3e';
  gl.fillRect(position.x, position.y, 10, 10);
};

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

const LevelMaker: FC = () => {
  const [canvasRef, { width, height }] = useElementSize<HTMLCanvasElement>();
  const [mouseX, mouseY, mouseInCanvas] = useMousePosition(canvasRef);

  const gameLoop = () => {
    const gl = canvasRef.current?.getContext('2d');

    if (gl) {
      gl.canvas.width = gl.canvas.offsetWidth;
      gl.canvas.height = gl.canvas.offsetHeight;

      gl.clearRect(0, 0, gl.canvas.width, gl.canvas.height);
      drawBlockAt(gl, { x: mouseX, y: mouseY });
    }
  };

  useCanvasEngine(gameLoop);

  return (
    <section className='m-auto max-w-screen-lg'>
      <h1>Level Creator</h1>
      <span>
        x: {mouseX}, y: {mouseY}
      </span>
      <p>
        {width}x{height}
      </p>
      <p>mouse in canvas: {mouseInCanvas.toString()}</p>
      <canvas className='aspect-video bg-amber-600/10 w-full' ref={canvasRef} />
    </section>
  );
};

export default LevelMaker;
