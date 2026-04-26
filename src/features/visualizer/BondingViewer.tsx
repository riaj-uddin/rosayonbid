import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

const Atom = ({ position, color, label }: { position: [number, number, number], color: string, label: string }) => {
  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere args={[1, 32, 32]}>
          <meshPhongMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.8} />
        </Sphere>
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </Float>
    </group>
  );
};

const IonicBond = () => {
    const electronRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        // Oscillation between -3 and 3
        const x = Math.sin(time * 2) * 3;
        if (electronRef.current) {
            electronRef.current.position.x = x;
            // Electron is only "visible" when moving towards the right (receiving atom)? 
            // Or just continuous flow. Let's make it a transfer animation.
            electronRef.current.scale.setScalar(x > 0 ? 1 : 0.8);
        }
    });

    return (
        <group>
            <Atom position={[-4, 0, 0]} color="#ef4444" label="Na+" />
            <Atom position={[4, 0, 0]} color="#22d3ee" label="Cl-" />
            
            {/* Transferring Electron */}
            <Sphere ref={electronRef} args={[0.2, 16, 16]} position={[0, 0, 0]}>
                <meshBasicMaterial color="#fff" />
            </Sphere>

            {/* Static attraction line */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.02, 0.02, 8]} />
                <meshBasicMaterial color="#ffffff11" />
            </mesh>
        </group>
    );
};

const CovalentBond = () => {
    const electron1Ref = useRef<THREE.Mesh>(null);
    const electron2Ref = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const angle = time * 3;
        // Infinity loop or figure 8 sharing
        if (electron1Ref.current) {
            electron1Ref.current.position.x = Math.sin(angle) * 2;
            electron1Ref.current.position.y = Math.cos(angle * 0.5) * 1;
        }
        if (electron2Ref.current) {
            electron2Ref.current.position.x = Math.sin(angle + Math.PI) * 2;
            electron2Ref.current.position.y = Math.cos((angle + Math.PI) * 0.5) * 1;
        }
    });

    return (
        <group>
            <Atom position={[-2, 0, 0]} color="#3b82f6" label="H" />
            <Atom position={[2, 0, 0]} color="#3b82f6" label="H" />
            
            <Sphere ref={electron1Ref} args={[0.15, 16, 16]}>
                <meshBasicMaterial color="#fff" />
            </Sphere>
            <Sphere ref={electron2Ref} args={[0.15, 16, 16]}>
                <meshBasicMaterial color="#fff" />
            </Sphere>
        </group>
    );
};

export const BondingViewer: React.FC = () => {
  const { language } = useStore();
  const [bondType, setBondType] = useState<'ionic' | 'covalent'>('ionic');

  return (
    <div className="w-full h-full relative">
       <Canvas camera={{ position: [0, 5, 12], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
          
          {bondType === 'ionic' ? <IonicBond /> : <CovalentBond />}
          
          <OrbitControls enableZoom={false} makeDefault />
       </Canvas>

       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl z-10">
          <button 
             onClick={() => setBondType('ionic')}
             className={`px-6 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${bondType === 'ionic' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
             {language === 'bn' ? 'আয়নিক বন্ধন' : 'Ionic Bond'}
          </button>
          <button 
             onClick={() => setBondType('covalent')}
             className={`px-6 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${bondType === 'covalent' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
             {language === 'bn' ? 'সমযোজী বন্ধন' : 'Covalent Bond'}
          </button>
       </div>

       <div className="absolute top-24 left-8 max-w-xs text-xs text-slate-400 leading-relaxed bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/5">
          <h4 className="text-white font-bold mb-2 uppercase tracking-widest">
            {bondType === 'ionic' ? (language === 'bn' ? 'আয়নিক বন্ধন পর্যবেক্ষণ' : 'Ionic Interaction') : (language === 'bn' ? 'সমযোজী বন্ধন পর্যবেক্ষণ' : 'Covalent Interaction')}
          </h4>
          {bondType === 'ionic' ? (
              language === 'bn' ? 
              'এখানে সোডিয়াম ক্লোরাইড (NaCl) এর উদাহরণ দেখানো হয়েছে। সোডিয়াম একটি ইলেকট্রন বর্জন করে (Na+) এবং ক্লোরিন তা গ্রহণ করে (Cl-) আধান সৃষ্টি করে, যা বল দিয়ে একে অপরকে আকর্ষণ করে।' :
              'In this NaCl example, sodium donates an electron to chlorine, creating opposing charges that result in strong electrostatic attraction.'
          ) : (
              language === 'bn' ? 
              'এখানে দুটি হাইড্রোজেন পরমাণু (H2) একটি সাধারণ স্থানে দুটি ইলেকট্রন শেয়ার করছে। এই শেয়ারিং উভয় পরমাণুর জন্য স্থিতিশীল ইলেকট্রন বিন্যাস নিশ্চিত করে।' :
              'Two hydrogen atoms share a pair of electrons in a common orbital space to achieve a stable electronic configuration.'
          )}
       </div>
    </div>
  );
};
