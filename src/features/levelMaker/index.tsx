import { Canvas } from '@react-three/fiber';
import React, { FC, Suspense, useRef } from 'react';

import { Background } from './background';
import { Circle } from './Circle';
import { GUI } from './gui';

const LevelMaker: FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  return (
    <section className='m-auto max-w-screen-lg'>
      <h1 className='text-xl font-bold'>Level Creator</h1>

      <Canvas
        className='aspect-video border-[1px] border-slate-600 max-h-[80vh] m-auto w-full border-solid'
        ref={canvas}
      >
        <Suspense fallback={null}>
          <Background />
          <GUI />
          <hemisphereLight position={[10, 0, 0]} />
          <Circle />
        </Suspense>
      </Canvas>
    </section>
  );
};

export default LevelMaker;
