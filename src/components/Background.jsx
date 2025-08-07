import { Environment, Sphere } from "@react-three/drei";
import { Gradient, LayerMaterial } from "lamina";
import * as THREE from "three";

export const Background = () => {
  const start = 0.2;
  const end = -0.5;

  return (
    <>
      <Sphere scale={[500, 500, 500]} rotation-y={Math.PI / 2}>
        <LayerMaterial color={"#ffffff"} side={THREE.BackSide}>
          <Gradient
            axes="y"
            start={start}
            end={end}
            colorA={new THREE.Color("#00b5ab")}
            colorB={new THREE.Color("#454242")}
          />
        </LayerMaterial>
      </Sphere>
      <Environment resolution={256} frames={Infinity}>
        <Sphere
          scale={[100, 100, 100]}
          rotation-y={Math.PI / 2}
          rotation-x={Math.PI}
        >
          <LayerMaterial color={"#ffffff"} side={THREE.BackSide}>
            <Gradient
              axes="y"
              start={start}
              end={end}
              colorA={new THREE.Color("#00b5ab")}
              colorB={new THREE.Color("#454242")}
            />
          </LayerMaterial>
        </Sphere>
      </Environment>
    </>
  );
};