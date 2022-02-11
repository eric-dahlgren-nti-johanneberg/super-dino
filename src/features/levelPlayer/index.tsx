import { animated, useSpring } from "@react-spring/three";
import { FlyControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, {
  FC,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Background } from "./background";
import { GUI } from "./gui";

const LevelPlayer: FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  const [hovered, setHovered] = useState(false);

  const { scale, color } = useSpring({
    scale: hovered ? 1.5 : 1,
    color: hovered ? "hotpink" : "red",
  });

  const escFunction = useCallback((event) => {
    console.log(event.key);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  });

  return (
    <section className="m-auto max-w-screen-lg">
      <h1 className="text-xl font-bold">Level Creator</h1>

      <Canvas
        className="aspect-video border-[1px] border-slate-600 max-h-[80vh] m-auto w-full border-solid"
        ref={canvas}
      >
        <PerspectiveCamera>
          <animated.mesh
            scale={scale}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            position={[5, 5, 0]}
          >
            <sphereBufferGeometry />
            {/*
         // @ts-expect-error this works */}
            <animated.meshStandardMaterial color={color} />
          </animated.mesh>
        </PerspectiveCamera>
        <Suspense fallback={null}>
          <Background />
          <GUI />

          <hemisphereLight position={[0, 0, 0]} />
        </Suspense>
        <FlyControls
          autoForward={false}
          dragToLook={false}
          movementSpeed={100}
        />
      </Canvas>
    </section>
  );
};

export default LevelPlayer;
