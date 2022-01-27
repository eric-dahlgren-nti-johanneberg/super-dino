import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

export const Background = () => {
  const path = 'images/grid-background.png';
  const texture = useLoader(TextureLoader, path);

  return (
    <group>
      <mesh>
        <planeBufferGeometry args={[10, 10]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </group>
  );
};
