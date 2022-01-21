import { Canvas } from '@react-three/fiber';
import React, { FC, useRef, useState } from 'react';

const LevelMaker: FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  const [hovered, setHovered] = useState(false);

  return (
    <section className='m-auto max-w-screen-lg'>
      <h1 className='font-bold text-xl'>Level Creator</h1>

      <Canvas
        className='aspect-video border-[1px] border-slate-600 border-solid w-full'
        ref={canvas}
      >
        <hemisphereLight position={[0, 0, 10]} />

        <mesh
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <sphereBufferGeometry />
          <meshStandardMaterial color={hovered ? 'hotpink' : 'red'} />
        </mesh>
      </Canvas>
    </section>
  );
};

export default LevelMaker;
