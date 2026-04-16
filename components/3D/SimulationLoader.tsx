"use client";

import { Environment, OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";

// Pre-load assets to avoid flickering when the component mounts
useGLTF.preload("/3d/roadsidetrees.glb");
useGLTF.preload("/3d/suv.glb");

function RoadLoop() {
  const { scene } = useGLTF("/3d/roadsidetrees.glb");
  
  const roadWidth = 10;
  const segmentCount = 3;
  const totalLength = roadWidth * segmentCount;
  
  const refs = useRef<THREE.Group[]>([]);
  
  useFrame((state, delta) => {
    const speed = 5;
    
    refs.current.forEach((ref) => {
      if (ref) {
        ref.position.x -= delta * speed;
        
        if (ref.position.x < -roadWidth) {
          ref.position.x += totalLength;
        }
      }
    });
  });

  return (
    <>
      {[...Array(segmentCount)].map((_, i) => (
        <primitive
          key={i}
          object={scene.clone()}
          position={[i * roadWidth, -0.9, -2.1]}
          rotation={[0, Math.PI / 2, 0]}
          ref={(el: THREE.Group) => (refs.current[i] = el)}
        />
      ))}
    </>
  );
}

function SUV() {
  const { scene } = useGLTF("/3d/suv.glb");
  const suvRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (suvRef.current) {
      // Gentle bounce/vibration effect - higher relative to road
      suvRef.current.position.y = 0.8 + Math.sin(state.clock.elapsedTime * 15) * 0.02;
    }
  });

  return (
    <primitive 
      ref={suvRef}
      object={scene} 
      position={[0, 0.8, 0]} 
      rotation={[0, Math.PI / 2, 0]}
      scale={1} // Made car bigger
    />
  );
}

export function SimulationLoader() {
  return (
    <div className="w-full h-48 bg-zinc-900/50 rounded-xl overflow-hidden border border-emerald-500/20 relative group">
      <div className="absolute inset-x-0 bottom-4 text-center z-10 pointer-events-none">
        <p className="text-[10px] font-black tracking-widest text-white uppercase animate-pulse">
          Simulating Transit Dynamics...
        </p>
      </div>
      
      <Canvas shadows gl={{ antialias: true }}>
        {/* Sky background */}
        <color attach="background" args={["#87ceeb"]} />
        
        <PerspectiveCamera makeDefault position={[5, 3, 6]} fov={35} />
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 10]} intensity={2.5} castShadow />
        <Environment preset="city" />
        
        <Suspense fallback={null}>
          <group position={[0, -1.2, 0]}> {/* Lowered roadside further */}
            <RoadLoop />
            <SUV />
          </group>
        </Suspense>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  );
}
