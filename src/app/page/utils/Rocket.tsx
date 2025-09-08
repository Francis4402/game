"use client"

import { useFrame } from '@react-three/fiber'
import React, { forwardRef, useRef, useImperativeHandle, useState } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei';
import { RocketModel } from '@/app/load3dmodels/3dmodel';
import Fire from './Fire';
import Smoke from './Smoke';
import Stars from './Stars';

type RocketProps = {
    launched: boolean;
    exploded: boolean;
    multiplier: number;
}

const Rocket = forwardRef<THREE.Mesh, RocketProps>(({ launched, exploded, multiplier }, ref) => {
    const mesh = useRef<THREE.Mesh | null>(null);
    const [rocketY, setRocketY] = useState(0);

    useImperativeHandle(ref, () => mesh.current as THREE.Mesh, []);

    useFrame((state, delta) => {
        if (mesh.current && launched && !exploded) {
            mesh.current.position.y += delta * 2;
            setRocketY(mesh.current.position.y);
        }
    });
    
    return (
        <>
            <Stars rocketY={rocketY} />
            <mesh ref={mesh} position={[0, 0, 0]}>
                <RocketModel position={[0, -10, -10]} rotation={[0, 5.5, 0]} />

                
                <group position={[0, -1.2, 0]}>
                    <Fire launched={launched} exploded={exploded} />
                    <Smoke launched={launched} exploded={exploded} />
                </group>

                {launched && !exploded && (
                    <Text
                        position={[0, 2.5, 0]}
                        fontSize={0.5}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {multiplier.toFixed(2)}x
                    </Text>
                )}
            </mesh>
        </>
    );
});

Rocket.displayName = 'Rocket';

export default Rocket;