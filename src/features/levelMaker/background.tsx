import niceColors from 'nice-color-palettes';

export const Background = () => {
  const data = new Array(16 * 256).fill(0).map((d, id) => ({ id }));
  const colors = niceColors[17];

  return (
    <group>
      {data.map((d, i) => {
        const x = (i % 256) * 1.05 - 6.3;
        const y = Math.floor(i / 256) * 1.05 - 3.3;
        return (
          <mesh key={d.id} position={[x, y, 0]}>
            <boxBufferGeometry attach='geometry' args={[1, 1, 0, 32]} />
            <meshStandardMaterial
              attach='material'
              color={colors[Math.floor(Math.random() * colors.length)]}
            />
          </mesh>
        );
      })}
    </group>
  );
};
