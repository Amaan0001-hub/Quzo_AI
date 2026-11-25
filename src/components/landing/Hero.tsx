"use client";

import { type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowRight, Network, Scan } from "lucide-react";

/* ============================================================
   AGENTS
   ============================================================ */
const AGENTS = [
  { id: "support", name: "Customer Support AI", codename: "NEXUS", accent: "#65E7FF", image: "/assets/agents/support.webp" },
  { id: "marketing", name: "Marketing AI", codename: "VECTOR", accent: "#C65DFF", image: "/assets/agents/marketing.webp" },
  { id: "coding", name: "Coding AI", codename: "COMPILER", accent: "#38BDF8", image: "/assets/agents/coding.webp" },
  { id: "design", name: "Creative Design AI", codename: "PRISM", accent: "#F43F5E", image: "/assets/agents/design.webp" },
  { id: "finance", name: "Finance AI", codename: "LEDGER", accent: "#34D399", image: "/assets/agents/finance.webp" },
  { id: "research", name: "Research AI", codename: "ORACLE", accent: "#76A7FF", image: "/assets/agents/research.webp" },
];

const SITE = "https://velvoraai.vercel.app";
const LINKS = { marketplace: `${SITE}/#marketplace` };

const LINES = [
  <>Meet Your New</>,
  <>
    Digital <em className="not-italic text-[#65E7FF]">Workforce.</em>
  </>,
];

const FLOATING_IDS = ["support", "research", "coding", "marketing", "design", "finance"];
const FLOATING_AGENTS = FLOATING_IDS
  .map((id) => AGENTS.find((agent) => agent.id === id))
  .filter((agent): agent is (typeof AGENTS)[number] => Boolean(agent));

// Pixel positions are kept for tablet/desktop; mobile uses percentage-based safe positions
const CHIP_POS = {
  support:   "top-[110px] left-[2%]   sm:top-[145px] sm:left-[2%]",
  research:  "top-[10px]  left-[18%]  sm:top-[15px]  sm:left-[20%]",
  coding:    "top-[110px] right-[2%]  sm:top-[145px] sm:right-[2%]",
  marketing: "top-[280px] left-[4%]   sm:top-[365px] sm:left-[5%]",
  design:    "top-[280px] right-[4%]  sm:top-[365px] sm:right-[5%]",
  finance:   "top-[10px]  right-[18%] sm:top-[15px]  sm:right-[20%]",
};

export const Hero = () => {
  const reduce = useReducedMotion();

  const rx = useSpring(useMotionValue(0), { stiffness: 45, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 45, damping: 20 });

  const parallax = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - rect.left) / rect.width - 0.5) * 5);
    rx.set(-((e.clientY - rect.top) / rect.height - 0.5) * 4);
  };

  return (
    <section
      id="top"
      className="relative isolate min-h-[640px] sm:min-h-[700px] overflow-hidden bg-[#070910] pt-[84px] pb-12 sm:pt-[96px] lg:h-[min(740px,100svh)] lg:pt-[104px] lg:pb-[42px]"
    >
      {/* Background Grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.42]
        [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)]
        [background-size:48px_48px] sm:[background-size:72px_72px]
        [mask-image:radial-gradient(ellipse_78%_70%_at_50%_35%,black,transparent_82%)]"
      />

      {/* Background Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 top-[18%] left-1/2 h-[500px] sm:h-[700px] w-[600px] sm:w-[900px] -translate-x-1/2 rounded-full blur-[30px]
        bg-[radial-gradient(circle,rgba(101,231,255,0.10),rgba(149,117,255,0.045)_42%,transparent_70%)]"
      />

      {/* Center Beam */}
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 top-0 bottom-0 left-1/2 w-px
        bg-[linear-gradient(transparent,rgba(255,255,255,0.14),transparent)]"
      />

      <div className="mx-auto grid w-[min(1240px,calc(100%-32px))] min-h-[550px] grid-cols-1 items-center gap-8 sm:w-[min(1240px,calc(100%-48px))] lg:w-[min(1240px,calc(100%-64px))] lg:grid-cols-[0.92fr_1.08fr] lg:gap-[38px]">
        
        {/* ================= LEFT COPY ================= */}
        <div className="relative z-10 w-full max-w-[570px] text-left">
          <motion.div
            className="flex items-center gap-[10px] text-[#65E7FF] font-mono text-[8px] sm:text-[9px] lg:text-[10px] tracking-[0.16em] sm:tracking-[0.19em] uppercase"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="h-px w-[16px] sm:w-[22px] bg-current shadow-[0_0_10px_currentColor]" />
            THE FUTURE OF DIGITAL INTELLIGENCE
          </motion.div>

          <h1
            className="mt-[16px] sm:mt-[22px] mb-[14px] sm:mb-[20px] font-semibold text-white text-[clamp(1.9rem,7vw,3.65rem)] leading-[1.05] tracking-[-0.058em]"
            aria-label="Meet Your New Digital Workforce."
          >
            {LINES.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.16 + i * 0.13, ease: [0.16, 1, 0.3, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mb-[10px] sm:mb-[13px] text-[#f5f7ff] text-[14px] sm:text-[15px] lg:text-[17px] font-medium leading-[1.4] tracking-[-0.02em]"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            One Intelligence. Infinite Possibilities.
          </motion.p>

          <motion.p
            className="max-w-[540px] text-[12px] sm:text-[13px] lg:text-[14px] leading-[1.7] sm:leading-[1.75] text-[#9aa8bc]"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.68 }}
          >
            Discover a new generation of specialized AI agents designed to
            think, create, analyse and execute tasks across your business.
          </motion.p>

          <motion.div
            className="mt-[20px] sm:mt-[27px] flex flex-col sm:flex-row flex-wrap justify-start gap-2.5 sm:gap-3"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.82 }}
          >
            <a
              href={LINKS.marketplace}
              className="inline-flex min-h-[44px] sm:min-h-[46px] items-center justify-center gap-[8px] sm:gap-[10px] rounded-full px-4 sm:px-[21px] text-[12px] sm:text-[13px] font-semibold
              bg-[#e8f4f8] text-[#070910] shadow-[0_8px_30px_rgba(101,231,255,0.08)]
              transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#65E7FF] hover:text-[#071015] hover:shadow-[0_12px_35px_rgba(101,231,255,0.18)]"
            >
              Explore AI Agents <ArrowRight size={15} className="sm:hidden" /> <ArrowRight size={17} className="hidden sm:block" />
            </a>

            <a
              href="#workforce"
              className="inline-flex min-h-[44px] sm:min-h-[46px] items-center justify-center gap-[8px] sm:gap-[10px] rounded-full px-4 sm:px-[21px] text-[12px] sm:text-[13px] font-semibold
              border border-white/[0.14] bg-[rgba(7,9,16,0.72)] text-[#f5f7ff] backdrop-blur-[16px]
              transition-all duration-300 hover:-translate-y-0.5 hover:border-[#65E7FF] hover:bg-[#171d2a]"
            >
              <Scan size={14} className="sm:hidden" /> <Scan size={16} className="hidden sm:block" /> Discover the Ecosystem
            </a>
          </motion.div>
        </div>

        {/* ================= RIGHT ORCHESTRATION ================= */}
        <motion.div
          className="relative h-[340px] xs:h-[400px] sm:h-[480px] lg:h-[550px] w-full overflow-hidden rounded-[18px] sm:rounded-[24px] border border-white/10
          bg-[radial-gradient(circle_at_50%_38%,rgba(31,100,125,0.20),transparent_42%),radial-gradient(circle_at_80%_75%,rgba(149,117,255,0.08),transparent_38%),#070910]
          shadow-[0_35px_90px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.04)]
          [perspective:1200px] [transform-style:preserve-3d]"
          onMouseMove={parallax}
          onMouseLeave={() => { rx.set(0); ry.set(0); }}
          style={{ rotateX: rx, rotateY: ry }}
          initial={reduce ? false : { opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Particles */}
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            {Array.from({ length: 18 }, (_, i) => (
              <motion.i
                key={i}
                className="absolute h-0.5 w-0.5 rounded-full bg-[#65E7FF] shadow-[0_0_8px_#65E7FF]"
                style={{ left: `${(i * 37) % 96}%`, top: `${(i * 53) % 88}%` }}
                animate={reduce ? { opacity: 0.4 } : { opacity: [0.15, 0.8, 0.15], y: [0, -18, 0] }}
                transition={{ duration: 7, repeat: Infinity, delay: i * -0.42, ease: "easeInOut" }}
              />
            ))}
          </div>

          {/* Aura */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-[30px] sm:top-[70px] left-1/2 h-[220px] sm:h-[380px] w-[220px] sm:w-[380px] -translate-x-1/2 rounded-full blur-[20px]
            bg-[radial-gradient(circle,rgba(101,231,255,0.14),rgba(149,117,255,0.05)_45%,transparent_70%)]"
          />

          {/* Rotating Rings - Scaled for mobile */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-[120px] sm:top-[240px] left-1/2 h-[180px] sm:h-[390px] w-[180px] sm:w-[390px] rounded-full border border-[rgba(101,231,255,0.15)]"
            style={{ x: "-50%", y: "-50%", rotateX: 65 }}
            animate={reduce ? {} : { rotateZ: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-[120px] sm:top-[240px] left-1/2 h-[240px] sm:h-[470px] w-[240px] sm:w-[470px] rounded-full border border-dashed border-[rgba(101,231,255,0.15)] opacity-45"
            style={{ x: "-50%", y: "-50%", rotateX: 65 }}
            animate={reduce ? {} : { rotateZ: -360 }}
            transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          />

          {/* =====================================
              CORE HUMANOID
          ===================================== */}
          <motion.div
            className="absolute top-[10px] sm:top-[15px] inset-x-0 z-10 mx-auto
            h-[260px] w-[200px] xs:h-[300px] xs:w-[220px]
            sm:h-[400px] sm:w-[300px]
            lg:h-[440px] lg:w-[340px]"
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.35 }}
          >
            <motion.img
              src="/assets/core.webp"
              alt="Velvora central humanoid"
              width={928}
              height={1152}
              fetchPriority="high"
              className="block h-full w-full object-contain object-center
              [mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,#000_60%,transparent_100%)]"
              animate={reduce ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Activation Pulse */}
            <motion.span
              aria-hidden
              className="absolute top-[45%] left-1/2 h-[60px] sm:h-[120px] w-[60px] sm:w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#65E7FF]"
              animate={reduce ? { opacity: 0 } : { scale: [0.6, 2.1], opacity: [0.9, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
            />
          </motion.div>

          {/* Connections SVG */}
          <svg
            className="pointer-events-none absolute left-1/2 top-0 z-0 h-[280px] xs:h-[340px] sm:h-[460px] lg:h-[500px] w-full max-w-[1200px]"
            style={{ x: "-50%" }}
            viewBox="0 0 700 560"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            aria-hidden
          >
            {[
              "M100 180C230 170 240 210 350 260",
              "M600 180C470 170 460 210 350 260",
              "M220 65C260 150 300 170 350 230",
              "M510 65C460 150 410 170 350 230",
              "M125 440C230 390 260 340 350 300",
              "M575 440C470 390 440 340 350 300",
            ].map((d) => (
              <motion.path
                key={d}
                d={d}
                stroke="#65E7FF"
                strokeWidth={1}
                strokeDasharray="4 9"
                animate={reduce ? {} : { strokeDashoffset: [0, -150] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                opacity={0.22}
              />
            ))}
            <circle cx="100" cy="180" r="4" fill="#65E7FF" opacity="0.7" />
            <circle cx="600" cy="180" r="4" fill="#65E7FF" opacity="0.7" />
            <circle cx="350" cy="260" r="5" fill="#65E7FF" opacity="0.7" />
          </svg>

          {/* Floating Agent Chips */}
          {FLOATING_AGENTS.map((agent, index) => (
            <motion.div
              key={agent.id}
              className={`absolute z-20 flex w-[62px] xs:w-[74px] sm:w-[102px] flex-col gap-[3px] sm:gap-[7px] rounded-lg sm:rounded-[13px] p-[2px_2px_4px] sm:p-[5px_5px_9px]
              border bg-[rgba(7,9,16,0.76)] text-[#f5f7ff]
              shadow-[0_15px_35px_rgba(0,0,0,0.3)]
              ${CHIP_POS[agent.id as keyof typeof CHIP_POS]}`}
              style={{ borderColor: `color-mix(in srgb, ${agent.accent} 30%, rgba(255,255,255,0.1))` }}
              initial={reduce ? false : { opacity: 0, scale: 0.8, y: 20 }}
              animate={reduce ? { opacity: 1, scale: 1, y: 0 } : { opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { delay: 0.7 + index * 0.1, duration: 0.6 },
                scale: { delay: 0.7 + index * 0.1, duration: 0.6 },
                y: { duration: 6 + index * 0.4, repeat: reduce ? 0 : Infinity, ease: "easeInOut", delay: index * 0.2 },
              }}
              whileHover={reduce ? undefined : { scale: 1.08, zIndex: 50 }}
            >
              <div className="relative h-[52px] xs:h-[62px] sm:h-[92px] w-full overflow-hidden rounded-md sm:rounded-[9px] bg-[#070910]">
                <img
                  src={agent.image}
                  alt={agent.name}
                  loading="lazy"
                  className="h-full w-full object-cover object-[center_18%]"
                />
              </div>
              <span className="px-[1px] sm:px-[3px] font-mono text-[5px] xs:text-[6px] sm:text-[8px] font-medium leading-[1.2] tracking-[0.08em]">
                {agent.codename}
                <small className="mt-[1px] sm:mt-1 block font-sans text-[4px] xs:text-[5px] sm:text-[7px] font-normal text-[#8e9baf]">
                  {agent.name.replace(" AI", "")}
                </small>
              </span>
              <i
                className="absolute top-[4px] sm:top-[9px] right-[4px] sm:right-[9px] h-[3px] sm:h-[5px] w-[3px] sm:w-[5px] rounded-full"
                style={{ background: agent.accent, boxShadow: `0 0 10px ${agent.accent}` }}
              />
            </motion.div>
          ))}

          {/* Core Label */}
          <div
            className="absolute bottom-[16px] sm:bottom-[32px] left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 sm:gap-2 rounded-full
            border border-white/[0.14] bg-[rgba(7,9,16,0.76)] px-2 sm:px-3 py-[5px] sm:py-[9px] text-[#f5f7ff]
            shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-[16px] whitespace-nowrap scale-90 sm:scale-100"
          >
            <Network size={10} className="sm:hidden text-[#65E7FF]" />
            <Network size={12} className="hidden sm:block text-[#65E7FF]" />
            <span className="font-mono text-[5px] sm:text-[7px] font-medium leading-[1.3] tracking-[0.1em]">
              QUZO CENTRAL INTELLIGENCE
              <small className="mt-[2px] sm:mt-[3px] block text-[4px] sm:text-[5px] text-[#8e9baf]">
                CONNECTED DIGITAL ECOSYSTEM
              </small>
            </span>
          </div>

          {/* Telemetry Left - hidden on very small screens */}
          <div className="absolute bottom-[5px] left-0 z-30 hidden sm:block rounded-lg border border-white/10 bg-[rgba(7,9,16,0.72)] px-2 sm:px-3 py-[6px] sm:py-[10px] text-[#f5f7ff] backdrop-blur-[14px]">
            <span className="font-mono text-[5px] sm:text-[6px] tracking-[0.1em] text-[#6b7889]">NETWORK ACTIVITY</span>
            <div className="mt-1.5 sm:mt-2 flex h-[16px] sm:h-[25px] items-end gap-1">
              {[35, 80, 55, 100].map((h, i) => (
                <i key={i} className="w-1 bg-[#65E7FF]" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          {/* Telemetry Right */}
          <div className="absolute bottom-[5px] right-0 z-30 hidden sm:block rounded-lg border border-white/10 bg-[rgba(7,9,16,0.72)] px-2 sm:px-3 py-[6px] sm:py-[10px] text-[#f5f7ff] backdrop-blur-[14px]">
            <span className="font-mono text-[5px] sm:text-[6px] tracking-[0.1em] text-[#6b7889]">06 SPECIALISTS</span>
            <strong className="mt-[5px] sm:mt-[7px] block font-mono text-[6px] sm:text-[8px] font-medium text-[#65E7FF]">CONNECTED</strong>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;