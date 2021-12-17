import { FC, useCallback, useEffect, useRef } from 'react';

import { useMousePosition } from './useMousePosition';
import { useWindowSize } from './useWindowSize';

type WorldPosition = { x: number; y: number };

const drawBlockAt = (gl: CanvasRenderingContext2D, position: WorldPosition) => {
  gl.fillStyle = '#e3e';
  gl.fillRect(position.x, position.y, 10, 10);
};

const showBlockAt = (
  gl: CanvasRenderingContext2D,
  position: WorldPosition
) => {};

const LevelMaker: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, height] = useWindowSize();

  const [mouseX, mouseY, mouseInCanvas] = useMousePosition(canvasRef);

  const gameLoop = useCallback(() => {
    const gl = canvasRef.current?.getContext('2d');

    if (gl) {
      gl.clearRect(0, 0, gl.canvas.width, gl.canvas.height);

      drawBlockAt(gl, { x: mouseX, y: mouseY });
    }
    requestAnimationFrame(gameLoop);
  }, [mouseX, mouseY]);

  useEffect(() => {
    requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  return (
    <section className='m-auto max-w-screen-lg'>
      <h1>Level Creator</h1>
      <span>
        {mouseX}, {mouseY}
      </span>
      <p>mouse in canvas: {mouseInCanvas.toString()}</p>
      <canvas
        className='aspect-video bg-amber-600/10 w-full'
        width={width < 1024 ? width : 1024}
        ref={canvasRef}
      />
    </section>
  );
};

export default LevelMaker;
