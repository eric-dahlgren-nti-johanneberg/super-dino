import { animated as a, useSpring } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh } from "three";

interface CircleProps {
  animated: boolean;
}

export const Circle = ({ animated }: CircleProps) => {
  const [hovered, setHovered] = useState(false);

  const { scale, color } = useSpring({
    scale: hovered ? 1.5 : 1,
    color: hovered ? "hotpink" : "red",
  });

  const circleRef = useRef<Mesh>();
  useFrame((state) => {
    if (animated) {
      circleRef.current?.position.set(
        Math.sin(state.clock.getElapsedTime()) * 5 + 5,
        5,
        0
      );
    }
  });

  return (
    <a.mesh
      ref={circleRef}
      scale={scale}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <sphereBufferGeometry />
      {/*
         // @ts-expect-error this works */}
      <a.meshStandardMaterial color={color} />
    </a.mesh>
  );
};
