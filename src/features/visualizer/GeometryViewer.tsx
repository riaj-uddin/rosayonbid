import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars, Text, Float, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

const Bond = ({ start, end }: { start: [number, number, number], end: [number, number, number] }) => {
    const vStart = new THREE.Vector3(...start);
    const vEnd = new THREE.Vector3(...end);
    const distance = vStart.distanceTo(vEnd);
    const position = vStart.clone().add(vEnd).divideScalar(2);
    
    const direction = new THREE.Vector3().subVectors(vEnd, vStart).normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

    return (
        <mesh position={position} quaternion={quaternion}>
            <cylinderGeometry args={[0.1, 0.1, distance]} />
            <meshPhongMaterial color="#64748b" />
        </mesh>
    );
};

const MolecularShape = ({ type }: { type: string }) => {
    const centralAtom: [number, number, number] = [0, 0, 0];
    
    const geometries: Record<string, { positions: [number, number, number][], label: string }> = {
        linear: {
            label: "Linear (180°)",
            positions: [[-3, 0, 0], [3, 0, 0]]
        },
        trigonal: {
            label: "Trigonal Planar (120°)",
            positions: [
                [0, 3, 0],
                [-2.6, -1.5, 0],
                [2.6, -1.5, 0]
            ]
        },
        tetrahedral: {
            label: "Tetrahedral (109.5°)",
            positions: [
                [0, 3, 0],
                [2.8, -1, 0],
                [-1.4, -1, 2.45],
                [-1.4, -1, -2.45]
            ]
        },
        octahedral: {
            label: "Octahedral (90°)",
            positions: [
                [0, 3, 0], [0, -3, 0],
                [3, 0, 0], [-3, 0, 0],
                [0, 0, 3], [0, 0, -3]
            ]
        }
    };

    const current = geometries[type] || geometries.linear;

    return (
        <group>
            {/* Central Atom */}
            <Sphere args={[0.8, 32, 32]}>
                <meshPhongMaterial color="#ef4444" />
            </Sphere>
            
            {/* Surrounding Atoms & Bonds */}
            {current.positions.map((pos, i) => (
                <group key={i}>
                    <Sphere args={[0.6, 32, 32]} position={pos}>
                        <meshPhongMaterial color="#22d3ee" />
                    </Sphere>
                    <Bond start={centralAtom} end={pos} />
                </group>
            ))}

            <Text
                position={[0, 4.5, 0]}
                fontSize={0.6}
                color="white"
            >
                {current.label}
            </Text>
        </group>
    );
};

export const GeometryViewer: React.FC = () => {
  const { language } = useStore();
  const [shape, setShape] = useState('tetrahedral');

  const shapes = [
    { id: 'linear', label: language === 'bn' ? 'সরলরৈখিক' : 'Linear' },
    { id: 'trigonal', label: language === 'bn' ? 'ত্রিকোণীয়' : 'Trigonal' },
    { id: 'tetrahedral', label: language === 'bn' ? 'চতুষ্তলকীয়' : 'Tetrahedral' },
    { id: 'octahedral', label: language === 'bn' ? 'অষ্টতলকীয়' : 'Octahedral' },
  ];

  return (
    <div className="w-full h-full relative">
       <Canvas camera={{ position: [0, 8, 15], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
          
          <MolecularShape type={shape} />
          
          <OrbitControls makeDefault autoRotate autoRotateSpeed={1} />
       </Canvas>

       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 flex-wrap justify-center bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl z-10 max-w-[90vw]">
          {shapes.map((s) => (
            <button 
                key={s.id}
                onClick={() => setShape(s.id)}
                className={`px-4 lg:px-6 py-3 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest whitespace-nowrap ${shape === s.id ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
                {s.label}
            </button>
          ))}
       </div>
    </div>
  );
};
