import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, ThreeElements, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, Stars, PerspectiveCamera, Trail, CameraControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, X, ChevronLeft, ChevronRight, Minus, Plus, 
  LayoutGrid, RefreshCw, Zap, Maximize2, Box, Circle,
  Settings2, Activity, Palette, Compass, MousePointer2
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ElementData } from '../../types';
import { cn } from '../../lib/utils';
import { translations } from '../../translations';
import { bnNames } from '../../constants/elements';
import { GlobalSearch } from '../../components/common/GlobalSearch';

// ... (JSX namespace declaration remains same) ...

// --- SUB-COMPONENTS ---

// Nucleus and Electron components remain same
const Nucleus = ({ count }: { count: number }) => {
  const particles = useMemo(() => {
    const temp = [];
    const size = Math.max(1.2, count * 0.02);
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
        <Sphere key={i} args={[0.35, 16, 16]} position={p.position}>
          <meshPhongMaterial 
            color={p.isProton ? "#ff3333" : "#3333ff"} 
            emissive={p.isProton ? "#880000" : "#000088"}
            emissiveIntensity={2}
            shininess={100}
          />
        </Sphere>
      ))}
      <Sphere args={[1.5, 32, 32]}>
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.05} />
      </Sphere>
    </group>
  );
};

const Electron = ({ radius, speed, angleOffset, color, globalSpeed }: { radius: number, speed: number, angleOffset: number, color: string, globalSpeed: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const angle = time * speed * globalSpeed + angleOffset;
    if (meshRef.current) {
        meshRef.current.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle * 0.4) * (radius * 0.15), 
            Math.sin(angle) * radius
        );
    }
  });

  return (
    <Trail width={0.4} length={8} color={new THREE.Color(color)} attenuation={(t) => t * t}>
      <Sphere ref={meshRef} args={[0.2, 16, 16]}>
        <meshPhongMaterial color={color} emissive={color} emissiveIntensity={4} />
      </Sphere>
    </Trail>
  );
};

const QuantumOrbital = ({ type, radius, color }: { type: 's' | 'p', radius: number, color: string }) => {
  return (
    <group>
      {type === 's' ? (
        <Sphere args={[radius * 0.8, 32, 32]}>
          <meshPhongMaterial color={color} transparent opacity={0.08} wireframe emissive={color} emissiveIntensity={0.5} />
        </Sphere>
      ) : (
        <group>
          <Sphere args={[radius * 0.6, 24, 24]} position={[0, radius * 0.7, 0]}>
            <meshPhongMaterial color={color} transparent opacity={0.08} wireframe emissive={color} emissiveIntensity={0.5} />
          </Sphere>
          <Sphere args={[radius * 0.6, 24, 24]} position={[0, -radius * 0.7, 0]}>
            <meshPhongMaterial color={color} transparent opacity={0.08} wireframe emissive={color} emissiveIntensity={0.5} />
          </Sphere>
        </group>
      )}
    </group>
  );
};

const Shell = ({ radius, count, color, index, speed, mode }: { radius: number, count: number, color: string, index: number, speed: number, mode: 'bohr' | 'quantum' }) => {
  const orbitLine = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
    const points = curve.getPoints(128).map(p => new THREE.Vector3(p.x, 0, p.y));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: "#22d3ee", transparent: true, opacity: 0.1 });
    const line = new THREE.Line(geometry, material);
    line.rotation.x = Math.PI / 2;
    return line;
  }, [radius]);

  return (
    <group rotation={[Math.PI / 4 * index, index % 2 ? Math.PI / 4 : 0, 0]}>
      {mode === 'bohr' ? (
        <>
          <primitive object={orbitLine} />
          {Array.from({ length: count }).map((_, i) => (
            <Electron 
                key={i} 
                radius={radius} 
                speed={1 / (radius * 0.35)} 
                globalSpeed={speed}
                angleOffset={(i / count) * Math.PI * 2} 
                color={color} 
            />
          ))}
        </>
      ) : (
        <QuantumOrbital type={index === 0 ? 's' : 'p'} radius={radius} color={color} />
      )}
    </group>
  );
};

// --- MAIN SCENE ---

const AtomScene = ({ element, speed, background, zoom, mode, resetTrigger }: { 
  element: ElementData | null, 
  speed: number, 
  background: 'grid' | 'black', 
  zoom: number,
  mode: 'bohr' | 'quantum',
  resetTrigger: number
}) => {
  const controlsRef = useRef<CameraControls>(null);

  // Auto-reset or zoom adjustment
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.setLookAt(0, 8, zoom, 0, 0, 0, true);
    }
  }, [resetTrigger, zoom]);

  // Smooth focus on element change
  useEffect(() => {
    if (element && controlsRef.current) {
      const targetHeight = 6 + (element.shells.length * 2);
      controlsRef.current.setLookAt(0, targetHeight, zoom, 0, 0, 0, true);
    }
  }, [element, zoom]);

  if (!element) return null;

  return (
    <>
      <CameraControls 
        ref={controlsRef} 
        makeDefault 
        minDistance={5} 
        maxDistance={60}
        smoothTime={0.4}
      />
      
      <ambientLight intensity={0.6} />
      <pointLight position={[15, 15, 15]} intensity={2} color="#22d3ee" />
      <pointLight position={[-15, -15, -15]} intensity={1} color="#3b82f6" />
      <spotLight position={[0, 20, 0]} intensity={1} angle={0.3} penumbra={1} castShadow />

      <Stars radius={120} depth={60} count={6000} factor={4} saturation={0.5} fade speed={1.5} />
      
      <Float speed={2 * speed} rotationIntensity={0.6} floatIntensity={0.6}>
        <Nucleus count={element.atomicNumber} />
        {element.shells.map((count, i) => (
          <Shell 
            key={i} 
            index={i}
            radius={(i + 2) * 3} 
            count={count} 
            color={element.color} 
            speed={speed}
            mode={mode}
          />
        ))}
      </Float>

      {background === 'grid' && (
        <group position={[0, -12, 0]}>
          <gridHelper args={[80, 40, 0x22d3ee, 0x0f172a]} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
             <planeGeometry args={[80, 80]} />
             <meshBasicMaterial color="#050608" transparent opacity={0.5} />
          </mesh>
        </group>
      )}
    </>
  );
};

// --- VIEWPORT WRAPPER ---

export const AtomViewer: React.FC = () => {
  const { 
    selectedElement, 
    setSelectedElement, 
    elements, 
    electronSpeed, 
    setElectronSpeed, 
    backgroundType, 
    setBackgroundType,
    zoomLevel,
    setZoomLevel,
    visualizationMode,
    setVisualizationMode,
    language 
  } = useStore();
  
  const [resetTrigger, setResetTrigger] = useState(0);
  const t = translations[language].ui;

  const handlePrev = () => {
    if (!selectedElement) return;
    const currentIndex = elements.findIndex(el => el.symbol === selectedElement.symbol);
    const prevIndex = (currentIndex - 1 + elements.length) % elements.length;
    setSelectedElement(elements[prevIndex]);
  };

  const handleNext = () => {
    if (!selectedElement) return;
    const currentIndex = elements.findIndex(el => el.symbol === selectedElement.symbol);
    const nextIndex = (currentIndex + 1) % elements.length;
    setSelectedElement(elements[nextIndex]);
  };

  const handleReset = () => {
    setResetTrigger(prev => prev + 1);
    setZoomLevel(30);
  };

  return (
    <div className="flex flex-col w-full h-full rounded-2xl border border-white/5 overflow-hidden shadow-2xl bg-[#050608]">
      {/* 3D Visualization Area */}
      <div className={cn(
        "relative w-full h-[45vh] md:h-[55vh] lg:h-[65vh] flex-shrink-0 transition-colors duration-700",
        backgroundType === 'black' ? "bg-black" : "bg-[#050608]"
      )}>
        {backgroundType === 'grid' && (
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
        )}
        
        <Canvas shadows dpr={[1, 2]}>
          <AtomScene 
            element={selectedElement} 
            speed={electronSpeed} 
            background={backgroundType} 
            zoom={zoomLevel} 
            mode={visualizationMode}
            resetTrigger={resetTrigger}
          />
        </Canvas>

        {/* Top Overlay Controls */}
        <div className="absolute top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 z-20 flex flex-col md:flex-row justify-between gap-4 pointer-events-none">
          <div className="w-full max-w-xs pointer-events-auto">
            <GlobalSearch className="shadow-2xl" theme="dark" />
          </div>

          <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             key={selectedElement?.symbol}
             className="text-right pointer-events-auto"
          >
              <h2 className="font-light text-2xl md:text-5xl tracking-tighter leading-none mb-1 text-white flex items-center justify-end gap-3">
                  <span className="opacity-20 text-lg md:text-2xl mt-2">{selectedElement?.atomicNumber}</span>
                  {selectedElement?.name}
              </h2>
              <div className="flex items-center justify-end gap-3">
                  <span className="text-cyan-400 font-mono text-sm md:text-lg tracking-[0.3em] uppercase">{selectedElement?.symbol}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  <span className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">
                    {selectedElement?.category}
                  </span>
              </div>
          </motion.div>
        </div>
      </div>

      {/* PRO Control Panel (Below Canvas) */}
      <div className="w-full p-4 md:p-6 lg:p-8 flex items-start justify-center border-t border-white/5 bg-[#0c0e14]">
         <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-start">
                
                {/* 1. Navigation & State */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Compass size={14} className="text-cyan-500" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Navigation</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-2">
                        <button 
                          onClick={handlePrev} 
                          className="p-3 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                          title="Previous Element"
                        >
                           <ChevronLeft size={20} />
                        </button>
                        <div className="text-center">
                            <span className="text-2xl font-bold font-mono tracking-wider text-cyan-400">
                              {selectedElement?.symbol}
                            </span>
                        </div>
                        <button 
                          onClick={handleNext} 
                          className="p-3 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                          title="Next Element"
                        >
                           <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* 2. Visual & Camera Controls */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Maximize2 size={14} className="text-cyan-500" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em]">View Controls</span>
                    </div>
                    <div className="flex flex-col gap-3">
                         <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 px-3">
                                <button 
                                    onClick={() => setZoomLevel(Math.min(60, zoomLevel + 5))}
                                    className="p-2 hover:bg-white/10 rounded-lg text-slate-400"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="text-[10px] font-mono flex-1 text-center text-white">{Math.round(zoomLevel)}</span>
                                <button 
                                    onClick={() => setZoomLevel(Math.max(5, zoomLevel - 5))}
                                    className="p-2 hover:bg-white/10 rounded-lg text-slate-400"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                            <button 
                                onClick={handleReset}
                                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest"
                            >
                                <RefreshCw size={14} />
                                Reset
                            </button>
                         </div>
                         
                         {/* Mode Toggle for all screens */}
                         <div className="flex bg-white/5 border border-white/10 rounded-full p-1">
                            <button 
                                onClick={() => setVisualizationMode('bohr')}
                                className={cn(
                                "flex-1 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all",
                                visualizationMode === 'bohr' ? "bg-cyan-500 text-white" : "text-slate-500 hover:text-white"
                                )}
                            >
                                Bohr
                            </button>
                            <button 
                                onClick={() => setVisualizationMode('quantum')}
                                className={cn(
                                "flex-1 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all",
                                visualizationMode === 'quantum' ? "bg-cyan-500 text-white" : "text-slate-500 hover:text-white"
                                )}
                            >
                                Quantum
                            </button>
                         </div>
                    </div>
                </div>

                {/* 3. Animation & Physics */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Zap size={14} className="text-cyan-500" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Kinematics</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center text-[9px] uppercase font-bold tracking-[0.2em]">
                           <span className="text-slate-500">Atomic Velocity</span>
                           <span className="text-cyan-400 font-mono">{Math.round(electronSpeed * 100)}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="3" 
                            step="0.1" 
                            value={electronSpeed}
                            onChange={(e) => setElectronSpeed(parseFloat(e.target.value))}
                            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-cyan-500 bg-white/10"
                        />
                    </div>
                </div>

                {/* 4. Scene Customization */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Palette size={14} className="text-cyan-500" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Atmosphere</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setBackgroundType('grid')}
                            className={cn(
                                "flex-1 h-12 rounded-2xl border flex items-center justify-center gap-3 transition-all",
                                backgroundType === 'grid' 
                                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]" 
                                  : "border-white/10 text-slate-500 hover:border-white/20 hover:bg-white/5"
                            )}
                        >
                            <LayoutGrid size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Grid</span>
                        </button>
                        <button 
                            onClick={() => setBackgroundType('black')}
                            className={cn(
                                "flex-1 h-12 rounded-2xl border flex items-center justify-center gap-3 transition-all",
                                backgroundType === 'black' 
                                  ? "border-cyan-500 bg-black text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]" 
                                  : "border-white/10 text-slate-500 hover:border-white/20 hover:bg-white/5"
                            )}
                        >
                            <Box size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Flat</span>
                        </button>
                    </div>
                </div>

            </div>
         </div>
      </div>
    </div>
  );
};

