import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, ContactShadows, Environment } from '@react-three/drei';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import * as THREE from 'three';

// --- CAMÉRA INTELLIGENTE ---
function CameraController({ isFocused }) {
    useFrame((state) => {
        const currentPos = state.camera.position;
        const targetDist = isFocused ? 3.5 : 6;
        const currentDist = currentPos.length();
        
        if (Math.abs(currentDist - targetDist) > 0.01) {
            const newDist = THREE.MathUtils.lerp(currentDist, targetDist, 0.05);
            currentPos.setLength(newDist);
        }
    });
    return null;
}

function HandleModel({ isFocused }) {
    return (
        <Float 
            speed={isFocused ? 0 : 2} 
            rotationIntensity={isFocused ? 0 : 0.5} 
            floatIntensity={isFocused ? 0 : 1}
        >
            <mesh rotation={[0, 0, Math.PI / 4]}>
                <cylinderGeometry args={[0.3, 0.3, 2.5, 32]} />
                <MeshDistortMaterial 
                    color="#333333" 
                    envMapIntensity={3} 
                    roughness={0.05} 
                    metalness={1} 
                    distort={isFocused ? 0 : 0.2} 
                    speed={1.5}
                />
            </mesh>
            
            <mesh rotation={[0, 0, Math.PI / 4]} position={[0, 0, 0]}>
                <torusGeometry args={[0.41, 0.02, 16, 100]} />
                <meshStandardMaterial 
                    color="#ff2222" 
                    emissive="#ff0000" 
                    emissiveIntensity={3} 
                    toneMapped={false} 
                />
            </mesh>
        </Float>
    );
}

export default function Product3D({ t }) {
    const [isFocused, setIsFocused] = useState(false);
    const clickStart = useRef({ x: 0, y: 0, time: 0 });

    const handlePointerDown = (e) => {
        clickStart.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    };

    const handlePointerUp = (e) => {
        if (isFocused) return;
        const dx = e.clientX - clickStart.current.x;
        const dy = e.clientY - clickStart.current.y;
        const dt = Date.now() - clickStart.current.time;
        if (Math.sqrt(dx * dx + dy * dy) < 5 && dt < 200) {
            setIsFocused(true);
        }
    };

    return (
        <LayoutGroup>
            <AnimatePresence>
                {isFocused && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-40 pointer-events-none"
                    />
                )}
            </AnimatePresence>

            <div className="h-[80vh] w-full relative">
                
                <motion.section 
                    layout
                    className={`flex items-center justify-center overflow-hidden transition-all duration-700 ease-in-out ${isFocused ? 'fixed inset-0 z-50' : 'absolute inset-0 z-10'}`}
                    style={{ borderRadius: isFocused ? 0 : 0 }}
                >
                    
                    {/* COLONNE TEXTE */}
                    <motion.div 
                        layout="position"
                        className="z-10 flex flex-col justify-center h-full"
                        animate={{ 
                            // ✅ MODIFICATION : On passe de 33% à 45% pour donner plus de place au texte
                            width: isFocused ? 0 : "45%", 
                            opacity: isFocused ? 0 : 1,
                            paddingLeft: isFocused ? 0 : "5rem",
                        }}
                        transition={{ 
                            opacity: { duration: 0.2 },
                            width: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
                        }}
                        style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                    >
                        <div className="w-full max-w-xl"> {/* Plus large que 400px */}
                            <h3 className="text-brand-accent font-bold tracking-[0.2em] mb-4 text-sm uppercase">
                                {t.product3d.subtitle}
                            </h3>
                            
                            {/* Titre responsive : s'adapte si l'écran est petit */}
                            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-6 uppercase italic leading-none">
                                {t.product3d.titleStart} <br/> {t.product3d.titleEnd}
                            </h2>
                            
                            <p className="text-gray-400 text-lg leading-relaxed whitespace-normal max-w-md">
                                {t.product3d.desc}
                            </p>
                            
                            <div className="mt-8 pointer-events-auto">
                                <button onClick={(e) => { e.stopPropagation(); setIsFocused(true); }} className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-brand-accent group-hover:bg-brand-accent/10 transition-all"><span className="text-xl">3D</span></div>
                                    <span className="text-sm text-white font-bold uppercase tracking-widest group-hover:text-brand-accent transition-colors">
                                        {t.product3d.btn}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* COLONNE 3D */}
                    <motion.div 
                        layout="position"
                        className="relative h-full flex items-center justify-center"
                        // ✅ MODIFICATION : Si focus 100%, sinon 55% (le reste de 45%)
                        animate={{ width: isFocused ? "100%" : "55%" }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        onPointerDown={handlePointerDown}
                        onPointerUp={handlePointerUp}
                    >
                        <AnimatePresence>
                            {isFocused && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0, rotate: -90 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0, rotate: 90 }}
                                    transition={{ delay: 0.1 }}
                                    onClick={(e) => { e.stopPropagation(); setIsFocused(false); }}
                                    className="absolute top-8 right-8 z-[60] w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-brand-accent transition-colors backdrop-blur-md border border-white/10 shadow-lg cursor-pointer"
                                >
                                    ✕
                                </motion.button>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {isFocused && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 50 }} 
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ delay: 0.3 }}
                                    className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 flex gap-4 pointer-events-none"
                                >
                                    <span className="px-4 py-2 bg-black/50 backdrop-blur rounded-full text-xs uppercase tracking-widest text-white border border-white/10">
                                        {t.product3d.instructions.rotate}
                                    </span>
                                    <span className="px-4 py-2 bg-black/50 backdrop-blur rounded-full text-xs uppercase tracking-widest text-white border border-white/10">
                                        {t.product3d.instructions.zoom}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Canvas 
                            className={!isFocused ? "cursor-pointer" : "cursor-move"}
                            resize={{ scroll: false, offsetSize: true }}
                            dpr={[1, 2]}
                        >
                            <CameraController isFocused={isFocused} />
                            
                            <Environment preset="city" />
                            <ambientLight intensity={0.5} />
                            <spotLight position={[-5, 5, -5]} intensity={15} color="#ff2222" angle={0.5} penumbra={1} />
                            <pointLight position={[10, 10, 10]} intensity={2} color="white" />

                            <HandleModel isFocused={isFocused} />

                            <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={10} blur={2} far={4} color="#000000" />

                            <OrbitControls 
                                enableZoom={isFocused}
                                enablePan={false}
                                autoRotate={!isFocused}
                                autoRotateSpeed={1.5}
                                minPolarAngle={0}
                                maxPolarAngle={Math.PI}
                                enableDamping={true}
                                dampingFactor={0.05}
                            />
                        </Canvas>
                    </motion.div>
                </motion.section>
            </div>
        </LayoutGroup>
    );
}