import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const STAR_COUNT = 200;
const STAR_AREA = 50;
const STAR_HEIGHT = 40;

type StarsProps = {
    rocketY: number; // You can remove this prop if not needed elsewhere
};

function randomPosition() {
    return [
        (Math.random() - 0.5) * STAR_AREA,
        Math.random() * STAR_HEIGHT,
        (Math.random() - 0.5) * STAR_AREA,
    ];
}

const Stars: React.FC<StarsProps> = () => {
    const positions = useRef<[number, number, number][]>(
        Array.from({ length: STAR_COUNT }, () => randomPosition() as [number, number, number])
    );

    useFrame(() => {
        for (let i = 0; i < STAR_COUNT; i++) {
            positions.current[i][1] -= 0.02; // Animate stars downward
            if (positions.current[i][1] < -STAR_HEIGHT / 2) {
                positions.current[i][1] = STAR_HEIGHT / 2;
                positions.current[i][0] = (Math.random() - 0.5) * STAR_AREA;
                positions.current[i][2] = (Math.random() - 0.5) * STAR_AREA;
            }
        }
    });

    return (
        <>
            {positions.current.map((pos, i) => (
                <mesh key={i} position={pos}>
                    <sphereGeometry args={[0.05, 8, 8]} />
                    <meshBasicMaterial color="white" />
                </mesh>
            ))}
        </>
    );
};

export default Stars;