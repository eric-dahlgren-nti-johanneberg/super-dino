import { extend, useLoader } from '@react-three/fiber';
import React, { FC, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Mesh } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import boldUrl from '@/assets/fonts/bold.json';

extend({ TextGeometry });

export const Text: FC<{
  vAlign: string;
  hAlign: string;
  size: number;
  color: string;
}> = ({ children, vAlign = 'center', hAlign = 'center', size = 1.5 }) => {
  const font = useLoader(FontLoader, JSON.stringify(boldUrl));
  const config = useMemo(
    () => ({
      font,
      size: 40,
      height: 30,
      curveSegments: 32,
      bevelEnabled: true,
      bevelThickness: 6,
      bevelSize: 2.5,
      bevelOffset: 0,
      bevelSegments: 8,
    }),
    [font]
  );
  const mesh = useRef<Mesh>();
  useLayoutEffect(() => {
    const size = new THREE.Vector3();
    if (mesh.current) {
      mesh.current.geometry.computeBoundingBox();
      mesh.current.geometry.boundingBox?.getSize(size);
      mesh.current.position.x =
        hAlign === 'center' ? -size.x / 2 : hAlign === 'right' ? 0 : -size.x;
      mesh.current.position.y =
        vAlign === 'center' ? -size.y / 2 : vAlign === 'top' ? 0 : -size.y;
    }
  }, [children, hAlign, vAlign]);
  return (
    <group scale={[0.1 * size, 0.1 * size, 0.1]}>
      <mesh ref={mesh}>
        <textGeometry args={[children, config]} />
        <meshNormalMaterial />
      </mesh>
    </group>
  );
};
