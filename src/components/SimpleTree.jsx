function SimpleTree({ position, scale = [1, 1, 1] }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
        <meshStandardMaterial color="#8B5A2B" />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.3, 0.8, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
    </group>
  );
}

export default SimpleTree