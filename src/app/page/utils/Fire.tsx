import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type FireProps = {
    launched: boolean;
    exploded: boolean;
}

const Fire = ({ launched, exploded }: FireProps) => {
    const fireRef = useRef<THREE.Group>(null);
    
    // Create fire particles
    const fireParticles = Array.from({ length: 20 }, (_, i) => ({
        id: `fire-${i}`,
        position: [
            (Math.random() - 0.5) * 0.2,
            -1.1 + Math.random() * 0.1,
            (Math.random() - 0.5) * 0.2,
        ] as [number, number, number],
        scale: 0.05 + Math.random() * 0.08,
        color: new THREE.Color(
            0.8 + Math.random() * 0.2, // Red
            0.3 + Math.random() * 0.3, // Green
            0.0                        // Blue
        ),
        velocity: -0.02 - Math.random() * 0.03,
        lifespan: 0.5 + Math.random() * 0.5 // Random lifespan for each particle
    }));
    
    // Animation for fire particles
    useFrame(() => {
        if (fireRef.current && launched && !exploded) {
            fireRef.current.children.forEach((particle, i) => {
                // Move particle down
                particle.position.y += fireParticles[i].velocity;
                
                // Add some random movement
                particle.position.x += (Math.random() - 0.5) * 0.01;
                particle.position.z += (Math.random() - 0.5) * 0.01;
                
                // Reduce scale over time to simulate fire dissipating
                particle.scale.x -= 0.005;
                particle.scale.y -= 0.005;
                particle.scale.z -= 0.005;
                
                // Reset particle when it gets too small or goes too far down
                if (particle.scale.x <= 0.01 || particle.position.y < -1.5) {
                    particle.position.y = -1.1 + Math.random() * 0.1;
                    particle.position.x = (Math.random() - 0.5) * 0.2;
                    particle.position.z = (Math.random() - 0.5) * 0.2;
                    particle.scale.set(
                        0.05 + Math.random() * 0.08,
                        0.05 + Math.random() * 0.08,
                        0.05 + Math.random() * 0.08
                    );
                }
            });
        }
    });

    if (!launched || exploded) return null;

    return (
        <group ref={fireRef}>
            {fireParticles.map((p) => (
                <mesh key={p.id} position={p.position} scale={p.scale}>
                    <sphereGeometry args={[1, 8, 8]} />
                    <meshBasicMaterial color={p.color} transparent opacity={0.8} />
                </mesh>
            ))}
        </group>
    )
}

export default Fire