import React, { useEffect, useRef, useMemo } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

export function Owl(props) {
  const group = useRef()
  const { scene, animations } = useGLTF('./models/owl/owl.glb')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions, names } = useAnimations(animations, group)

  useEffect(() => {
    // Play the first animation (usually the flying animation)
    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]].reset().play()
    }
    // Optional: Clean up on unmount
    return () => {
      if (names.length > 0 && actions[names[0]]) {
        actions[names[0]].stop()
      }
    }
  }, [actions, names])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="root">
            <group name="GLTF_SceneRootNode" rotation={[Math.PI / 2, 0, 0]}>
              <group name="Sketchfab_model_0" rotation={[-Math.PI / 2, 0, 0]}>
                <group name="Owl_Flyfbx_1" rotation={[Math.PI / 2, 0, 0]}>
                  <group name="Object_2_2">
                    <group name="RootNode_3">
                      <group name="Object_4_4">
                        <group name="GLTF_created_0">
                          <primitive object={nodes.GLTF_created_0_rootJoint} />
                          <group name="Object_7_7_correction">
                            <group name="Object_7_7" />
                          </group>
                          <skinnedMesh name="Object_69" geometry={nodes.Object_69.geometry} material={materials.Owl_MI} skeleton={nodes.Object_69.skeleton} />
                        </group>
                      </group>
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('./models/owl/owl.glb')