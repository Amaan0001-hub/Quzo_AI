"use client";

import { useMemo, useRef, ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { ArrowRight, ArrowUpRight } from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */
type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
};

type AgentGeometryProps = {
  index: number;
};

/* ============================================================
   AGENTS DATA (Inlined)
   ============================================================ */
const AGENTS = [
  { id: "support", accent: "#65E7FF" },
  { id: "marketing", accent: "#C65DFF" },
  { id: "coding", accent: "#38BDF8" },
  { id: "design", accent: "#F43F5E" },
  { id: "finance", accent: "#34D399" },
  { id: "research", accent: "#76A7FF" },
  { id: "sales", accent: "#FB923C" },
  { id: "video", accent: "#E879F9" },
  { id: "writing", accent: "#A78BFA" },
  { id: "bi", accent: "#38BDF8" },
  { id: "hr", accent: "#F472B6" },
  { id: "productivity", accent: "#818CF8" },
];

const LINKS = {
  getStarted: "/register",
  marketplace: "/#marketplace",
};

/* ============================================================
   Helper Component (Reveal)
   ============================================================ */
function Reveal({ children, className = "", delay = 0, amount = 0.2 }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   3D Core Components
   ============================================================ */
function AgentGeometry({ index }: AgentGeometryProps) {
  if (index % 4 === 0) return <octahedronGeometry args={[0.12, 0]} />;
  if (index % 4 === 1) return <boxGeometry args={[0.16, 0.16, 0.16]} />;
  if (index % 4 === 2) return <torusGeometry args={[0.11, 0.032, 8, 20]} />;
  return <tetrahedronGeometry args={[0.14, 0]} />;
}

function Consciousness() {
  const ref = useRef<THREE.Group>(null!);
  
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y -= delta * 0.055;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.22) * 0.08;
  });
  
  return (
    <group ref={ref}>
      <mesh rotation={[0.2, 0.3, 0]}>
        <dodecahedronGeometry args={[1.03, 1]} />
        <meshPhysicalMaterial color="#102A36" emissive="#0B7083" emissiveIntensity={0.42} metalness={0.72} roughness={0.16} transparent opacity={0.9} />
      </mesh>
      <mesh scale={1.03} rotation={[0.2, 0.3, 0]}>
        <icosahedronGeometry args={[1.12, 1]} />
        <meshBasicMaterial color="#BDF5FF" wireframe transparent opacity={0.32} />
      </mesh>
      <mesh rotation={[1.1, 0.25, 0.4]}>
        <torusKnotGeometry args={[0.55, 0.065, 128, 12, 2, 3]} />
        <meshPhysicalMaterial color="#65E7FF" emissive="#65E7FF" emissiveIntensity={1.1} metalness={0.25} roughness={0.12} transparent opacity={0.72} />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.38, 1]} />
        <meshBasicMaterial color="#E6FBFF" transparent opacity={0.72} />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => {
        const a = i * Math.PI / 4;
        return (
          <mesh key={i} position={[Math.cos(a) * 1.32, Math.sin(a) * 1.32, Math.sin(a * 2) * .25]} rotation={[a, a * .5, a]} scale={[.48, 1.25, .48]}>
            <octahedronGeometry args={[0.24, 0]} />
            <meshPhysicalMaterial color={i % 2 ? "#9575FF" : "#65E7FF"} emissive={i % 2 ? "#9575FF" : "#65E7FF"} emissiveIntensity={.45} metalness={.55} roughness={.18} transparent opacity={.68} />
          </mesh>
        );
      })}
      <mesh rotation={[1.2, 0.2, 0.4]}>
        <torusGeometry args={[1.68, 0.012, 8, 128]} />
        <meshBasicMaterial color="#65E7FF" transparent opacity={0.42} />
      </mesh>
      <mesh rotation={[0.3, 1.1, 0.2]}>
        <torusGeometry args={[1.9, 0.009, 8, 128]} />
        <meshBasicMaterial color="#9575FF" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function Network() {
  const group = useRef<THREE.Group>(null!);
  const packetRefs = useRef<(THREE.Mesh | null)[]>([]);
  
  const nodes = useMemo(() => AGENTS.map((agent, i) => {
    const a = (i / AGENTS.length) * Math.PI * 2;
    const r = 2.2 + (i % 3) * 0.16;
    return { 
      ...agent, 
      position: [Math.cos(a) * r, Math.sin(a * 2) * 1.35, Math.sin(a) * r * 0.72] as [number, number, number] 
    };
  }), []);

  const lines = useMemo(() => 
    new THREE.BufferGeometry().setFromPoints(
      nodes.flatMap((node) => [
        new THREE.Vector3(0, 0, 0), 
        new THREE.Vector3(node.position[0], node.position[1], node.position[2])
      ])
    ), [nodes]);

  const particles = useMemo(() => {
    const values = new Float32Array(360 * 3);
    for (let i = 0; i < 360; i += 1) {
      const a = i * 2.39996; 
      const r = 2.4 + ((i * 37) % 100) / 42;
      values[i * 3] = Math.cos(a) * r; 
      values[i * 3 + 1] = Math.sin(a * 1.7) * 2.7; 
      values[i * 3 + 2] = Math.sin(a) * r;
    }
    return values;
  }, []);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.055;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * 0.14, 0.025);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -state.pointer.x * 0.09, 0.025);
    }
    packetRefs.current.forEach((packet, i) => {
      if (!packet) return;
      const node = nodes[i];
      if (!node) return;
      
      const t = (state.clock.elapsedTime * .16 + i / nodes.length) % 1;
      packet.position.set(node.position[0], node.position[1], node.position[2]).multiplyScalar(t);
      packet.scale.setScalar(.65 + Math.sin(t * Math.PI) * .7);
    });
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#9BEFFF" size={0.018} transparent opacity={0.5} sizeAttenuation />
      </points>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color="#8ADFFF" transparent opacity={0.2} />
      </lineSegments>
      <Consciousness />
      {nodes.map((node, i) => (
        <group position={node.position} key={node.id} rotation={[i * 0.2, i * 0.35, 0]}>
          <mesh>
            <AgentGeometry index={i} />
            <meshStandardMaterial color={node.accent} emissive={node.accent} emissiveIntensity={0.65} metalness={0.55} roughness={0.25} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.22, 12, 12]} />
            <meshBasicMaterial color={node.accent} transparent opacity={0.07} />
          </mesh>
        </group>
      ))}
      {nodes.map((node, i) => (
        <mesh key={`packet-${node.id}`} ref={(mesh) => { packetRefs.current[i] = mesh; }}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color={node.accent} transparent opacity={.9} />
        </mesh>
      ))}
    </group>
  );
}

export function CoreFallback() {
  return <img className="w-full h-full object-contain" src="/assets/core.webp" alt="Velvora crystalline artificial intelligence consciousness" />;
}

function webGLAvailable() {
  try { 
    const canvas = document.createElement("canvas"); 
    return Boolean(window.WebGLRenderingContext && (canvas.getContext("webgl2") || canvas.getContext("webgl"))); 
  } catch { 
    return false; 
  }
}

function IntelligenceCore() {
  const reduce = useReducedMotion();
  const supported = useMemo(webGLAvailable, []);
  
  if (reduce || !supported) return <CoreFallback />;
  
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 7.4], fov: 48 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
      <ambientLight intensity={0.65} />
      <pointLight position={[3, 3, 4]} color="#65E7FF" intensity={25} />
      <pointLight position={[-4, -2, 2]} color="#9575FF" intensity={20} />
      <pointLight position={[0, 4, -2]} color="#F43F5E" intensity={7} />
      <Network />
    </Canvas>
  );
}

/* ============================================================
   Main Component: FinalCtaSection
   ============================================================ */
export default function FinalCtaSection() {
  return (
    <section className="relative flex min-h-[440px] sm:min-h-[500px] lg:min-h-[540px] items-center overflow-hidden border-t border-white/[0.08] isolate" data-testid="final-cta-section">
      
      {/* Background Grid */}
      <div 
        className="absolute inset-0 -z-[2] opacity-[0.42] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:48px_48px] sm:bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" 
        aria-hidden="true" 
      />
      
      {/* Huge Watermark Text - Smaller on mobile */}
      <div 
        className="absolute z-[-1] top-1/2 left-1/2 text-transparent font-bold text-[clamp(5rem,18vw,20rem)] leading-none tracking-[-0.07em] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none [-webkit-text-stroke:1px_rgba(255,255,255,0.08)]" 
        aria-hidden="true"
      >
        VELVORA
      </div>
      
      {/* 3D Core Graphic (Fallback Image) - Smaller on mobile */}
      <div className="absolute z-[-1] top-1/2 left-1/2 w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] lg:w-[680px] lg:h-[680px] opacity-[0.32] sm:opacity-[0.38] lg:opacity-[0.42] -translate-x-1/2 -translate-y-1/2 animate-[breathe_8s_ease-in-out_infinite]" aria-hidden="true">
        <CoreFallback />
      </div>
      
      <div className="relative w-[min(1240px,calc(100%-32px))] sm:w-[min(1240px,calc(100%-48px))] lg:w-[min(1240px,calc(100%-64px))] mx-auto z-[2] max-w-[980px] text-center py-12 sm:py-16 lg:py-0">
        <Reveal>
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 text-[#65e7ff] font-mono text-[8px] sm:text-[9px] lg:text-[10px] font-medium tracking-[0.16em] sm:tracking-[0.19em] uppercase">
            <span className="w-[16px] sm:w-[22px] h-[1px] bg-current shadow-[0_0_10px_currentColor]" />
            ONE INTELLIGENCE. INFINITE POSSIBILITIES.
          </div>
          <h2 className="mt-4 sm:mt-[23px] mb-3 sm:mb-[19px] text-[#f5f7ff] font-semibold text-[clamp(1.9rem,7vw,4.25rem)] leading-[1.05] sm:leading-[1.02] tracking-[-0.055em]">
            Accelerate Your Work with <em className="text-[#65e7ff] not-italic">Autonomous Intelligence.</em>
          </h2>
          <p className="max-w-[320px] sm:max-w-[450px] lg:max-w-[600px] mx-auto m-0 text-[#9aa8bc] text-[12px] sm:text-[13px] lg:text-[14px] leading-[1.7] sm:leading-[1.75]">
            Your ideas deserve more than ordinary tools. Discover a smarter way to create, analyze, and get things done with Velvora AI.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2.5 sm:gap-3 mt-6 sm:mt-8 lg:mt-[35px]">
            <a 
              className="inline-flex min-h-[42px] sm:min-h-[46px] items-center justify-center gap-2 sm:gap-2.5 px-4 sm:px-[21px] rounded-full bg-[#e8f4f8] text-[#070910] text-[12px] sm:text-[13px] font-semibold shadow-[0_8px_30px_rgba(101,231,255,0.08)] hover:bg-[#65e7ff] hover:text-[#071015] hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(101,231,255,0.18)] transition-all duration-300" 
              href={LINKS.getStarted} 
              data-testid="final-cta-get-started-button"
            >
              Get Started with Velvora <ArrowUpRight size={15} className="sm:hidden" /> <ArrowUpRight size={17} className="hidden sm:block" />
            </a>
            <a 
              className="inline-flex min-h-[42px] sm:min-h-[46px] items-center justify-center gap-2 sm:gap-2.5 px-4 sm:px-[21px] rounded-full border border-white/[0.14] bg-[rgba(7,9,16,0.72)] backdrop-blur-md text-[#f5f7ff] text-[12px] sm:text-[13px] font-semibold hover:border-[#65e7ff] hover:bg-[#171d2a] hover:-translate-y-0.5 transition-all duration-300" 
              href={LINKS.marketplace} 
              data-testid="final-cta-explore-agents-button"
            >
              Explore AI Agents <ArrowRight size={15} className="sm:hidden" /> <ArrowRight size={17} className="hidden sm:block" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}