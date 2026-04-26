import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { ElementData } from '../../types';

const Nucleus = ({ count }: { count: number }) => {
  const particles = useMemo(() => {
    const temp = [];
    const size = Math.max(1, count * 0.015);
    for (let i = 0; i < count; i++) {
        temp.push({
            position: [
                (Math.random() - 0.5) * size,
                (Math.random() - 0.5) * size,
                (Math.random() - 0.5) * size
            ] as [number, number, number],
            isProton: i % 2 === 0
        });
    }
    return temp;
  }, [count]);

  return (
    <group>
      {particles.map((p, i) => (
        <Sphere key={i} args={[0.3, 12, 12]} position={p.position}>
          <meshPhongMaterial 
            color={p.isProton ? "#ff3333" : "#3333ff"} 
            transparent
            opacity={0.4}
            emissive={p.isProton ? "#440000" : "#000044"}
            emissiveIntensity={1}
          />
        </Sphere>
      ))}
    </group>
  );
};

const Electron = ({ radius, speed, angleOffset, color }: { radius: number, speed: number, angleOffset: number, color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const angle = time * speed + angleOffset;
    if (meshRef.current) {
        meshRef.current.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle * 0.3) * (radius * 0.1), 
            Math.sin(angle) * radius
        );
    }
  });

  return (
    <Sphere ref={meshRef} args={[0.15, 12, 12]}>
      <meshPhongMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.6} />
    </Sphere>
  );
};

const Shell = ({ radius, count, color, index }: { radius: number, count: number, color: string, index: number }) => {
  return (
    <group rotation={[Math.PI / 6 * index, index % 2 ? Math.PI / 6 : 0, 0]}>
      {Array.from({ length: count }).map((_, i) => (
        <Electron 
            key={i} 
            radius={radius} 
            speed={0.5 / (radius * 0.5)} 
            angleOffset={(i / count) * Math.PI * 2} 
            color={color} 
        />
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const BackgroundScene = ({ element }: { element: ElementData }) => {
    const groupRef = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.002;
            groupRef.current.rotation.z += 0.001;
        }
    });

    return (
        <>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#22d3ee" />
            
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
            
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <group ref={groupRef} scale={0.8}>
                    <Nucleus count={element.atomicNumber} />
                    {element.shells.map((count, i) => (
                        <Shell 
                            key={i} 
                            index={i}
                            radius={(i + 2) * 2.5} 
                            count={count} 
                            color={element.color} 
                        />
                    ))}
                </group>
            </Float>
        </>
    );
};

export const AtomHeroBackground: React.FC = () => {
  const { elements } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Elements to showcase in hero
  const showcaseSymbols = ['H', 'C', 'O', 'Fe', 'Au'];
  const showcaseElements = useMemo(() => {
    return showcaseSymbols.map(s => elements.find(el => el.symbol === s)).filter(Boolean) as ElementData[];
  }, [elements]);

  useEffect(() => {
    if (showcaseElements.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % showcaseElements.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [showcaseElements]);

  if (showcaseElements.length === 0) return <div className="absolute inset-0 bg-[#050608]" />;

  return (
    <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050608]/50 via-transparent to-[#050608] z-10 pointer-events-none" />
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
            {showcaseElements[currentIndex] && (
                <BackgroundScene element={showcaseElements[currentIndex]} />
            )}
        </Canvas>
    </div>
  );
};
