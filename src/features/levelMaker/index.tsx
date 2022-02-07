import { animated, useSpring } from '@react-spring/three';
import { Canvas } from '@react-three/fiber';
import React, { FC, Suspense, useEffect, useRef, useState } from 'react';
import { OrthographicCamera, Vector3 } from 'three';

import { Background } from './background';
import { GUI } from './gui';

const LevelMaker: FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const camera = useRef<OrthographicCamera>(null);

  const [hovered, setHovered] = useState(false);

  const { scale, color } = useSpring({
    scale: hovered ? 1.5 : 1,
    color: hovered ? 'hotpink' : 'red',
  });

  useEffect(() => {
    if (camera.current) {
      camera.current.position.set(100, 100, 100);
      camera.current.lookAt(0, 0, 0);
    }
  }, []);

  return (
    <section className='m-auto max-w-screen-lg'>
      <h1 className='font-bold text-xl'>Level Creator</h1>

      <Canvas
        className='aspect-video border-[1px] max-h-[80vh] m-auto border-slate-600 border-solid w-full'
        ref={canvas}
      >
        <Suspense fallback={null}>
          <Background />
          <GUI />

          <hemisphereLight position={[0, 0, 10]} />

          <orthographicCamera
            ref={camera}
            position={new Vector3(100, 100, 100)}
          />

          <animated.mesh
            scale={scale}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            <icosahedronGeometry args={[0.5, 3]} />
            {/* 
            // @ts-expect-error this works */}
            <animated.meshPhongMaterial color={color} />
          </animated.mesh>
        </Suspense>
      </Canvas>
    </section>
  );
};

export default LevelMaker;
