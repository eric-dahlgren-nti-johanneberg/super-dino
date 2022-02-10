import { animated, useSpring } from '@react-spring/three';
import { useState } from 'react';

export const Circle = () => {
  const [hovered, setHovered] = useState(false);

  const { scale, color } = useSpring({
    scale: hovered ? 1.5 : 1,
    color: hovered ? 'hotpink' : 'red',
  });

  return (
    <animated.mesh
      scale={scale}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <sphereBufferGeometry />
      {/*
         // @ts-expect-error this works */}
      <animated.meshStandardMaterial color={color} />
    </animated.mesh>
  );
};
