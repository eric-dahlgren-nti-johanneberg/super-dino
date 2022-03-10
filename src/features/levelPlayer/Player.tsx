import { animated } from "@react-spring/three";
import { OrthographicCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";
import { Group, Vector3 } from "three";

export const Player = (): JSX.Element => {
  const MOVEMENT_VECTOR = useRef(new Vector3(0, 0, 0));
  const checkKey = useCallback((event) => {
    switch (event.key) {
      case "w":
        if (MOVEMENT_VECTOR.current.y == 0) {
          MOVEMENT_VECTOR.current.y = 0.5;
        }
        break;
      case "a":
        MOVEMENT_VECTOR.current = new Vector3(
          -0.1,
          MOVEMENT_VECTOR.current.y,
          0
        );
        break;
      case "s":
        //crouch
        break;
      case "d":
        MOVEMENT_VECTOR.current = new Vector3(
          0.1,
          MOVEMENT_VECTOR.current.y,
          0
        );
        break;
    }
  }, []);

  const checkKeyUp = useCallback((event) => {
    switch (event.key) {
      case "a":
        MOVEMENT_VECTOR.current = new Vector3(0, MOVEMENT_VECTOR.current.y, 0);
        break;
      case "s":
        //crouch
        break;
      case "d":
        MOVEMENT_VECTOR.current = new Vector3(0, MOVEMENT_VECTOR.current.y, 0);
        break;
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", checkKey, false);
    document.addEventListener("keyup", checkKeyUp, false);

    return () => {
      document.removeEventListener("keydown", checkKey, false);
      document.removeEventListener("keyup", checkKeyUp, false);
    };
  });

  const playerRef = useRef<Group>();
  useFrame(({ clock }) => {
    playerRef.current?.position.add(MOVEMENT_VECTOR.current);

    //Jump
    if (playerRef.current?.position.y > 0) {
      MOVEMENT_VECTOR.current.y -= 0.02;
    } else {
      MOVEMENT_VECTOR.current.y = 0;
    }

    //collision
    if (playerRef.current?.position.x < 0) {
      playerRef.current?.position.x = 0;
    } else if (playerRef.current?.position.x > 255) {
      playerRef.current?.position.x = 255;
    } else if (playerRef.current?.position.y < 0) {
      playerRef.current?.position.y = 0;
    }
    console.log(playerRef.current?.position.x);
  });

  return (
    <animated.group ref={playerRef}>
      <OrthographicCamera position={[0, 0.5, 10]} zoom={40} makeDefault />
      <mesh position={[0, 0.5, 0]}>
        <planeBufferGeometry args={[1, 2]} />
        <meshStandardMaterial color={"blue"} />
      </mesh>
    </animated.group>
  );
};
