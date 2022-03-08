import { animated } from '@react-spring/three';
import { OrthographicCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useReducer, useRef } from 'react';
import { Group, Vector2 } from 'three';

enum Actions {
  JUMP,
  DOWN,
  LEFT,
  RIGHT,
}

type MovementState = {
  acceleration: Vector2;
};

const JUMP_VECTOR = new Vector2(0, 10);

const movementReducer = (
  state: MovementState,
  action: Actions
): MovementState => {
  switch (action) {
    case Actions.JUMP:
      state.acceleration.add(JUMP_VECTOR);
      break;

    default:
      break;
  }
  return state;
};

/**
 * Player character
 * Camera controls
 * Movement code
 * Player physics
 */
export const Player = (): JSX.Element => {
  const [position, dispatch] = useReducer(movementReducer);

  const playerRef = useRef<Group>();
  useFrame(({ clock }) => {
    playerRef.current?.position.set(
      Math.sin(clock.getElapsedTime()) * 5 + 5,
      5,
      0
    );
  });

  return (
    <animated.group ref={playerRef}>
      <OrthographicCamera position={[0, 0, 10]} zoom={16} makeDefault />
    </animated.group>
  );
};
