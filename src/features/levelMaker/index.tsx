import { animated, useSpring } from '@react-spring/three';
import { Canvas } from '@react-three/fiber';
import React, { FC, useRef, useState } from 'react';

import { GUI } from './gui';

const LevelMaker: FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  const [hovered, setHovered] = useState(false);

  const { scale, color } = useSpring({
    scale: hovered ? 1.5 : 1,
    color: hovered ? 'hotpink' : 'red',
  });

  return (
    <section className='m-auto max-w-screen-lg'>
      <h1 className='font-bold text-xl'>Level Creator</h1>

      <Canvas
        className='aspect-video border-[1px] max-h-[80vh] m-auto border-slate-600 border-solid w-full'
        ref={canvas}
      >
        <GUI />

        <hemisphereLight position={[10, 0, 0]} />

        <animated.mesh
          scale={scale}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <sphereBufferGeometry />
          <animated.meshStandardMaterial color={color} />
        </animated.mesh>
      </Canvas>
    </section>
  );
};

export default LevelMaker;
