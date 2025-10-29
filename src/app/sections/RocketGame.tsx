"use client"

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react"
import Smoke from "./utils/RocketGameUtils/Smoke";
import { OrbitControls } from "@react-three/drei";
import * as THREE from 'three';
import Fire from "./utils/RocketGameUtils/Fire";
import RocketBetMenu from "./utils/RocketGameUtils/RocketBetMenu";
import { toast } from "sonner";
import Rocket from "./utils/RocketGameUtils/Rocket";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";

const CameraController = ({ rocketRef, launched }: { rocketRef: React.RefObject<THREE.Mesh | null>, launched: boolean }) => {
    useFrame((state) => {
        if (rocketRef.current) {
            if (launched) {
                state.camera.position.lerp(
                    new THREE.Vector3(
                        rocketRef.current.position.x,
                        rocketRef.current.position.y + 2,
                        rocketRef.current.position.z + 5
                    ),
                    0.1
                );
                state.camera.lookAt(rocketRef.current.position);
            }
        }
    });
    return null;
}

const RocketGame = () => {
    const [launched, setLaunched] = useState(false);
    const [exploded, setExploded] = useState(false);
    const [closedBet, setClosedBet] = useState(false);
    const [cash, setCash] = useState(100);
    const [betAmount, setBetAmount] = useState(10);
    const [multiplier, setMultiplier] = useState(0.2);
    const rocketRef = useRef<THREE.Mesh | null>(null);
    const [gameId, setGameId] = useState(0);

    useEffect(() => {
        if (launched && !exploded) {
            const interval = setInterval(() => {
                setMultiplier((m) => parseFloat((m + 0.01).toFixed(2)));
            }, 100);
            return () => clearInterval(interval);
        }
    }, [launched, exploded]);

    useEffect(() => {
        if (launched && !exploded) {
          const delay = Math.random() * 5000 + 3000
          const timer = setTimeout(() => {
            setExploded(true)
            if (!closedBet) {
              setCash((c) => Math.max(0, c - 20))
              toast.error("\uD83D\uDCA5 You lost! Rocket exploded.")
            }
          }, delay)
          return () => clearTimeout(timer)
        }
      }, [launched, closedBet, exploded]);

      useEffect(() => {
        if (exploded) {
            const timer = setTimeout(() => {
                setGameId(id => id + 1);
                setLaunched(false);
                setExploded(false);
                setClosedBet(false);
                setMultiplier(1.0);
                if(rocketRef.current) {
                    rocketRef.current.position.y = 0;
                }
            }, 2000);
            return () => clearTimeout(timer);
        }
      }, [exploded]);

      const handleBet = () => {
        if (betAmount > 0 && betAmount <= cash) {
          setLaunched(true)
          setClosedBet(false)
          setExploded(false)
          setMultiplier(1.0);
          setCash((c) => Math.max(0, c - betAmount))
        } else {
          toast.error("Invalid bet amount!");
        }
      }

      const handleCloseBet = () => {
        if (!exploded && !closedBet) {
          setClosedBet(true)
          setCash((c) => c + betAmount * multiplier)
          toast.success(`✅ You won! Cashed out at ${multiplier}x.`)
        }
      }

  return (
    <div className="w-full h-[90svh] bg-blue-950">
      <Link href={"/"} className="absolute p-10 z-10"><Button variant={"outline"}><ArrowBigLeft/></Button></Link>
      <Canvas key={gameId} camera={{ position: [0, 2, 5], fov: 70 }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Rocket ref={rocketRef} launched={launched} exploded={exploded} multiplier={multiplier} />
        <Smoke launched={launched} exploded={exploded} />
        <Fire launched={launched} exploded={exploded} />
        <OrbitControls enableRotate={false} enableZoom={false} enabled={!launched} />
        <CameraController rocketRef={rocketRef} launched={launched} />
      </Canvas>

      <RocketBetMenu cash={cash}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        launched={launched}
        exploded={exploded}
        multiplier={multiplier}
        onBet={handleBet}
        onCloseBet={handleCloseBet}
        closedBet={closedBet} />
    </div>
  )
}

export default RocketGame