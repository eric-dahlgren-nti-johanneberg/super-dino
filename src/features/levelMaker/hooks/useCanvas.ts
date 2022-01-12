import { useEffect, useRef } from 'react';

export const useCanvas = (
  draw: (gl: WebGL2RenderingContext, frameCount: number) => void
) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frameCount = useRef(0);

  useEffect(() => {
    const gl = ref.current?.getContext('webgl2');
    let lastUpdate: number;
    if (gl) {
      lastUpdate = requestAnimationFrame(() => draw(gl, frameCount.current));
    }
    return () => cancelAnimationFrame(lastUpdate);
  }, [draw]);

  return { ref };
};
