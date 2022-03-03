import { useFrame } from '@react-three/fiber';
import niceColors from 'nice-color-palettes';
import { memo, useRef } from 'react';
import { Color, InstancedMesh, Matrix4 } from 'three';

const colors = niceColors[1];

const data = new Array(16 * 256).fill(0).map((d, id) => ({
  id,
  mat4: new Matrix4().setPosition(
    id % 256 /*  * 1.05 - 6.3 */,
    Math.floor(id / 256) /*  * 1.05 - 3.3 */,
    0
  ),
  col3: new Color().setHex(
    (parseInt(
      colors[Math.floor(Math.random() * (colors.length - 1))].substring(1),
      16
    ) <<
      8) /
      256
  ),
}));

export const Background = memo(() => {
  const cellMesh = useRef<InstancedMesh>(null);
  const active = useRef<number>(-1);

  useFrame(() => {
    data.forEach((d, i) => {
      cellMesh.current?.setMatrixAt(i, d.mat4);

      if (d.id === active.current) {
        cellMesh.current?.setColorAt(i, new Color().setColorName('red'));
      } else {
        cellMesh.current?.setColorAt(i, d.col3);
      }
    });
    if (cellMesh.current) {
      cellMesh.current.instanceMatrix.needsUpdate = true;
      if (cellMesh.current.instanceColor) {
        cellMesh.current.instanceColor.needsUpdate = true;
      }
    }
  });

  return (
    <instancedMesh
      ref={cellMesh}
      args={[undefined, undefined, data.length]}
      onPointerEnter={(ev) => (active.current = ev.instanceId ?? -1)}
    >
      <planeBufferGeometry attach='geometry' />
      <meshStandardMaterial attach='material' />
    </instancedMesh>
  );
});

Background.displayName = 'Background';
