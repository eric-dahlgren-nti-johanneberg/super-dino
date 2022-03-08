import { OrthographicCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { FC, Suspense, useCallback, useEffect, useRef } from 'react';

import { Background } from './background';
import { GUI } from './gui';
import { Circle } from '../levelMaker/Circle';

const LevelPlayer: FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  const escFunction = useCallback((event) => {
    console.log(event.key);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  });

  return (
    <section className='m-auto max-w-screen-lg'>
      <h1 className='text-xl font-bold'>Level Creator</h1>

      <Canvas
        className='aspect-video border-[1px] border-slate-600 max-h-[80vh] m-auto w-full border-solid'
        ref={canvas}
        camera={{ position: [0, 0, 4], fov: 50 }}
      >
        <Suspense fallback={null}>
          <Background />
          <GUI />
          <hemisphereLight position={[0, 0, 0]} />
        </Suspense>
        <OrthographicCamera makeDefault></OrthographicCamera>
      </Canvas>
    </section>
  );
};

export default LevelPlayer;
