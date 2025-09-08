import * as THREE from 'three'
import React, { JSX } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    scifi_cartoon_rocket001: THREE.Mesh
    scifi_cartoon_rocket001_1: THREE.Mesh
    scifi_cartoon_rocket001_2: THREE.Mesh
  }
  materials: {
    basem: THREE.MeshStandardMaterial
    red: THREE.MeshStandardMaterial
    body: THREE.MeshStandardMaterial
  }
}

export function RocketModel(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/rocketmodel/rr.glb') as unknown as GLTFResult
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.scifi_cartoon_rocket001.geometry}
          material={materials.basem}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.scifi_cartoon_rocket001_1.geometry}
          material={materials.red}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.scifi_cartoon_rocket001_2.geometry}
          material={materials.body}
        />
      </group>
    </group>
  )
}

useGLTF.preload('/rocketmodel/rr.glb')