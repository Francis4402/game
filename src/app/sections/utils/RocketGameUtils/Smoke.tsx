import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type SmokeProps = {
    launched: boolean;
    exploded: boolean;
}

const Smoke = ({ launched, exploded }: SmokeProps) => {
    const particlesRef = useRef<THREE.Group>(null);
    
    // Create different particles for launch smoke and explosion smoke
    const launchParticles = Array.from({ length: 30 }, (_, i) => ({
        id: `launch-${i}`,
        position: [
            (Math.random() - 0.5) * 0.3,
            -1 + Math.random() * 0.2,
            (Math.random() - 0.5) * 0.3,
        ] as [number, number, number],
        scale: 0.05 + Math.random() * 0.05,
        velocity: -0.01 - Math.random() * 0.02
    }));
    
    const explosionParticles = Array.from({ length: 100 }, (_, i) => ({
        id: `explosion-${i}`,
        position: [
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 1.5,
        ] as [number, number, number],
        scale: 0.1 + Math.random() * 0.15,
        velocity: {
            x: (Math.random() - 0.5) * 0.05,
            y: (Math.random() - 0.5) * 0.05,
            z: (Math.random() - 0.5) * 0.05
        }
    }));
    
    // Animation for particles
    useFrame(() => {
        if (particlesRef.current) {
            // Animate launch smoke particles
            if (launched && !exploded) {
                particlesRef.current.children.forEach((particle, i) => {
                    if (i < launchParticles.length) {
                        particle.position.y += launchParticles[i].velocity;
                        // Reset particles that go too far down
                        if (particle.position.y < -2) {
                            particle.position.y = -1 + Math.random() * 0.2;
                            particle.position.x = (Math.random() - 0.5) * 0.3;
                            particle.position.z = (Math.random() - 0.5) * 0.3;
                        }
                    }
                });
            }
            
            // Animate explosion particles
            if (exploded) {
                particlesRef.current.children.forEach((particle, i) => {
                    if (i >= launchParticles.length) {
                        const idx = i - launchParticles.length;
                        particle.position.x += explosionParticles[idx].velocity.x;
                        particle.position.y += explosionParticles[idx].velocity.y;
                        particle.position.z += explosionParticles[idx].velocity.z;
                        
                        // Slowly reduce scale to make particles disappear
                        if (particle.scale.x > 0.01) {
                            particle.scale.x -= 0.005;
                            particle.scale.y -= 0.005;
                            particle.scale.z -= 0.005;
                        }
                    }
                });
            }
        }
    });

    if (!launched && !exploded) return null;

    return (
        <group ref={particlesRef}>
            {/* Launch smoke particles */}
            {launched && !exploded && launchParticles.map((p) => (
                <mesh key={p.id} position={p.position} scale={p.scale}>
                    <sphereGeometry args={[1, 8, 8]} />
                    <meshBasicMaterial color="gray" transparent opacity={0.7} />
                </mesh>
            ))}
            
            {/* Explosion smoke particles */}
            {exploded && explosionParticles.map((p) => (
                <mesh key={p.id} position={p.position} scale={p.scale}>
                    <sphereGeometry args={[1, 8, 8]} />
                    <meshBasicMaterial color="black" transparent opacity={0.8} />
                </mesh>
            ))}
        </group>
    )
}

export default Smoke