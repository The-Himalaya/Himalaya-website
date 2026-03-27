import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ThreeDViewerProps {
  productName: string;
  fallbackImage: string;
  className?: string;
  autoRotate?: boolean;
}

function ManholeModel() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle breathing animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group>
      {/* Main manhole cover body */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[2, 2, 0.3, 32]} />
        <meshStandardMaterial
          color={hovered ? '#1a1a2e' : '#0d0d0d'}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Top texture ring */}
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 0.05, 32]} />
        <meshStandardMaterial
          color="#2a2a3e"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Center logo indentation */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.02, 32]} />
        <meshStandardMaterial
          color="#e84545"
          metalness={0.9}
          roughness={0.1}
          emissive="#e84545"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Anti-skid pattern elements */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 1.2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              0.16,
              Math.sin(angle) * radius,
            ]}
          >
            <boxGeometry args={[0.2, 0.05, 0.2]} />
            <meshStandardMaterial
              color="#1a1a2e"
              metalness={0.5}
              roughness={0.6}
            />
          </mesh>
        );
      })}

      {/* Ground plane for shadow */}
      <mesh position={[0, -0.5, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </group>
  );
}

export function ThreeDViewer({ productName, fallbackImage, className = '', autoRotate = true }: ThreeDViewerProps) {
  const [webGLSupported, setWebGLSupported] = useState(true);

  // Check WebGL support
  const checkWebGL = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  };

  if (!checkWebGL() || !webGLSupported) {
    return (
      <div className={`relative ${className}`}>
        <ImageWithFallback
          src={fallbackImage}
          alt={productName}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 text-xs text-[var(--himalaya-smoke)]">
          WebGL not supported. Showing static image.
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-[var(--himalaya-card)]">
            <div className="text-[var(--himalaya-smoke)]">Loading 3D Model...</div>
          </div>
        }
      >
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[5, 3, 5]} />
          
          {/* Lighting setup */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <spotLight
            position={[-5, 5, 2]}
            intensity={0.5}
            angle={0.3}
            penumbra={1}
            castShadow
          />
          
          {/* Environment for reflections */}
          <Environment preset="warehouse" />
          
          {/* 3D Model */}
          <ManholeModel />
          
          {/* Camera controls */}
          <OrbitControls
            autoRotate={autoRotate}
            autoRotateSpeed={2}
            enableZoom={true}
            enablePan={false}
            minDistance={4}
            maxDistance={10}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </Suspense>

      {/* Interaction hint */}
      <div className="absolute bottom-4 right-4 text-xs text-[var(--himalaya-smoke)] bg-[var(--himalaya-card)]/80 px-3 py-1.5 rounded">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}
