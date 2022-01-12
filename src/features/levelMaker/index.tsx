import React, { FC } from 'react';

import Canvas from './components/canvas';
import { CanvasDrawFn } from './types';

const LevelMaker: FC = () => {
  const draw: CanvasDrawFn = (/* gl, frame */) => null;

  return (
    <section className='m-auto max-w-screen-lg'>
      <h1>Canvas</h1>
      <Canvas
        draw={draw}
        className='aspect-video border-[1px] border-slate-600 border-solid w-full'
      />
    </section>
  );
};

export default LevelMaker;
