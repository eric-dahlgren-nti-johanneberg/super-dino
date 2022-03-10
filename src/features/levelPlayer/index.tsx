import { Canvas } from "@react-three/fiber";
import React, { FC, Suspense, useRef } from "react";

import { Background } from "./background";
import { GUI } from "./gui";
import { Player } from "./Player";

const LevelPlayer: FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  return (
    <section className="m-auto max-w-screen-lg select-none">
      <h1 className="text-xl font-bold">Level Player</h1>

      <Canvas
        className="aspect-video border-[1px] border-slate-600 max-h-[80vh] m-auto w-full border-solid"
        ref={canvas}
      >
        <Suspense fallback={null}>
          <Background />
          <GUI />
          <Player />
          <hemisphereLight position={[10, 0, 0]} />
        </Suspense>
      </Canvas>
    </section>
  );
};

export default LevelPlayer;
