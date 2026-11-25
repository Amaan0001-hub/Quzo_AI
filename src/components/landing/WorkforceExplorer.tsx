"use client";

import { useState, ReactNode, CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Network } from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */
type Agent = {
  id: string;
  name: string;
  codename: string;
  category: string;
  accent: string;
  image: string;
  alt: string;
  description: string;
  capabilities: string[];
  sample: string;
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
};

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
};

/* ============================================================
   AGENTS DATA (Inlined)
   ============================================================ */
const AGENTS: Agent[] = [
  { id: "support", name: "Customer Support AI", codename: "NEXUS", category: "Productivity", accent: "#65E7FF", image: "/assets/agents/support.webp", alt: "NEXUS customer support humanoid AI", description: "Assists with customer responses, knowledge retrieval, and clear support workflows.", capabilities: ["Customer response drafting", "Knowledge retrieval", "Ticket summaries", "Support workflow assistance"], sample: "Summarize this support conversation and draft a clear follow-up." },
  { id: "marketing", name: "Marketing AI", codename: "VECTOR", category: "Business", accent: "#C65DFF", image: "/assets/agents/marketing.webp", alt: "VECTOR marketing humanoid AI", description: "Helps shape campaign strategy, audience thinking, and channel-ready content.", capabilities: ["Campaign strategy", "Audience research", "Marketing content", "Channel planning"], sample: "Create a launch strategy for a new consumer technology product." },
  { id: "coding", name: "Coding AI", codename: "COMPILER", category: "Development", accent: "#38BDF8", image: "/assets/agents/coding.webp", alt: "COMPILER engineering humanoid AI", description: "Assists with code generation, debugging, documentation, and development workflows.", capabilities: ["Code generation", "Debugging assistance", "Technical documentation", "Development workflows"], sample: "Review this API workflow and suggest a debugging plan." },
  { id: "design", name: "Creative Design AI", codename: "PRISM", category: "Creative", accent: "#F43F5E", image: "/assets/agents/design.webp", alt: "PRISM creative humanoid AI", description: "Develops visual concepts, interface ideas, creative direction, and design starting points.", capabilities: ["Visual concepts", "Design assistance", "Creative direction", "Brand assets"], sample: "Develop three visual directions for a premium product launch." },
  { id: "finance", name: "Finance AI", codename: "LEDGER", category: "Business", accent: "#34D399", image: "/assets/agents/finance.webp", alt: "LEDGER finance humanoid AI", description: "Supports financial analysis, reporting, budget exploration, and data organization.", capabilities: ["Financial analysis", "Report preparation", "Budget insights", "Financial data organization"], sample: "Create a scenario outline for next quarter’s operating budget." },
  { id: "research", name: "Research AI", codename: "ORACLE", category: "Research", accent: "#76A7FF", image: "/assets/agents/research.webp", alt: "ORACLE research humanoid AI", description: "Turns scattered information into structured research, summaries, and useful reports.", capabilities: ["Information research", "Data summarization", "Knowledge discovery", "Research reports"], sample: "Research the competitive landscape for a new productivity product." },
  { id: "sales", name: "Sales AI", codename: "PULSE", category: "Business", accent: "#FB923C", image: "/assets/agents/sales.webp", alt: "PULSE sales humanoid AI", description: "Supports prospect research, outreach drafts, account preparation, and sales intelligence.", capabilities: ["Lead research", "Outreach drafts", "Account briefs", "Sales intelligence"], sample: "Prepare an account brief and discovery questions for a prospect." },
  { id: "video", name: "Video Creation AI", codename: "MOTION", category: "Creative", accent: "#E879F9", image: "/assets/agents/video.webp", alt: "MOTION video humanoid AI", description: "Helps move video ideas through concepts, scripts, storyboards, and multimedia planning.", capabilities: ["Video concepts", "Script assistance", "Storyboards", "Multimedia planning"], sample: "Turn this product idea into a six-scene launch storyboard." },
  { id: "writing", name: "Content Writing AI", codename: "QUILL", category: "Creative", accent: "#A78BFA", image: "/assets/agents/writing.webp", alt: "QUILL writing humanoid AI", description: "Assists with content drafting, editing, copywriting, and content structuring.", capabilities: ["Content drafting", "Editing assistance", "Copywriting", "Content structuring"], sample: "Turn these research notes into a concise executive article." },
  { id: "bi", name: "Business Intelligence AI", codename: "INSIGHT", category: "Research", accent: "#38BDF8", image: "/assets/agents/bi.webp", alt: "INSIGHT business humanoid AI", description: "Supports business analytics, data interpretation, performance summaries, and decision context.", capabilities: ["Business analytics", "Data interpretation", "Performance summaries", "Decision support"], sample: "Compare three market segments and summarize the trade-offs." },
  { id: "hr", name: "HR AI", codename: "TALENT", category: "Productivity", accent: "#F472B6", image: "/assets/agents/hr.webp", alt: "TALENT HR humanoid AI", description: "Helps organize recruitment, candidate information, HR documentation, and talent insights.", capabilities: ["Recruitment assistance", "Candidate organization", "HR documentation", "Talent insights"], sample: "Create an onboarding outline for a new design team member." },
  { id: "productivity", name: "Productivity AI", codename: "FLOW", category: "Productivity", accent: "#818CF8", image: "/assets/agents/productivity.webp", alt: "FLOW productivity humanoid AI", description: "Helps structure tasks, plan workflows, organize priorities, and coordinate processes.", capabilities: ["Task organization", "Workflow planning", "Productivity assistance", "Process coordination"], sample: "Organize these project notes into a prioritized weekly plan." },
];

const LINKS = {
  marketplace: "/#marketplace",
};

/* ============================================================
   Helper Components (Reveal & SectionHeader)
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

function SectionHeader({ eyebrow, title, copy, align = "left" }: SectionHeaderProps) {
  const isCenter = align === "center";
  return (
    <Reveal className={`max-w-[850px] ${isCenter ? "mx-auto text-center" : ""}`}>
      <div className={`flex items-center gap-2.5 text-[#65e7ff] font-mono text-[9px] sm:text-[10px] font-medium tracking-[0.19em] uppercase ${isCenter ? "justify-center" : ""}`}>
        <span className="w-[22px] h-[1px] bg-current shadow-[0_0_10px_currentColor]" />
        {eyebrow}
      </div>
      <h2 className="mt-[14px] sm:mt-[18px] mb-4 text-[#f5f7ff] font-semibold text-[clamp(1.75rem,5vw,3rem)] leading-[1.12] tracking-[-0.045em]">
        {title}
      </h2>
      {copy && <p className={`max-w-[610px] m-0 text-[#9aa8bc] text-[12px] sm:text-[14px] leading-[1.7] ${isCenter ? "mx-auto" : ""}`}>{copy}</p>}
    </Reveal>
  );
}

/* ============================================================
   Positions Calculation
   ============================================================ */
const POSITIONS = AGENTS.map((agent, i) => {
  const angle = (i / AGENTS.length) * Math.PI * 2 - Math.PI / 2;
  return { 
    agent, 
    x: 50 + Math.cos(angle) * 42, 
    y: 50 + Math.sin(angle) * 39, 
    sx: 300 + Math.cos(angle) * 252, 
    sy: 280 + Math.sin(angle) * 218 
  };
});

/* ============================================================
   Main Component: WorkforceExplorer
   ============================================================ */
export default function WorkforceExplorer() {
  const [selected, setSelected] = useState<string>(AGENTS[0]!.id);
  const reduce = useReducedMotion();
  const agent = AGENTS.find((item) => item.id === selected)!;

  return (
    <section className="relative py-16 sm:py-[72px] lg:py-[92px] bg-[#070910]" id="workforce" data-testid="workforce-explorer-section">
      <div className="w-[min(1240px,calc(100%-32px))] sm:w-[min(1240px,calc(100%-48px))] lg:w-[min(1240px,calc(100%-64px))] mx-auto">
        <SectionHeader 
          eyebrow="SYNTHETIC WORKFORCE NETWORK" 
          title="Your Entire Digital Workforce. Connected." 
          copy="Explore a conceptual network of specialized digital intelligence. Select any entity to inspect its role, capabilities, and a sample task." 
        />

        <Reveal className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] lg:min-h-[590px] mt-6 sm:mt-[38px] overflow-hidden border border-white/[0.08] rounded-lg sm:rounded-[11px] bg-[#0d1119] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          
          {/* Network Stage */}
          <div 
            className="relative min-w-0 h-[380px] sm:h-[480px] lg:h-auto lg:min-h-[590px] overflow-hidden border-b lg:border-b-0 lg:border-r border-white/[0.08]" 
            style={{ 
              "--selected-accent": agent.accent, 
              background: `radial-gradient(circle at 50% 48%, color-mix(in srgb, ${agent.accent} 8%, transparent), transparent 43%), #0a0e16` 
            } as CSSProperties}
          >
            {/* Outer Circle Ring */}
            <div className="absolute inset-[8%] border border-white/[0.08] rounded-full pointer-events-none" />
            
            {/* Central Core Image */}
            <div className="absolute z-[2] top-1/2 left-1/2 w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] lg:w-[320px] lg:h-[320px] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_35px_color-mix(in_srgb,var(--selected-accent)_20%,transparent)]">
              <img 
                className="w-full h-full rounded-full object-cover" 
                src={reduce ? "/assets/network.webp" : "/assets/core.webp"} 
                alt={reduce ? "Velvora central humanoid intelligence connected to specialists" : "Velvora central humanoid intelligence"} 
              />
              <span className="absolute bottom-[10%] sm:bottom-[12%] left-1/2 flex items-center gap-1 sm:gap-[7px] px-2 sm:px-2.5 py-1 sm:py-[7px] border border-white/[0.14] rounded-full bg-[rgba(7,9,16,0.72)] text-white font-mono text-[5px] sm:text-[7px] tracking-[0.12em] -translate-x-1/2 whitespace-nowrap backdrop-blur-md">
                <Network size={9} className="sm:hidden" />
                <Network size={13} className="hidden sm:block" /> 
                VELVORA CORE
              </span>
            </div>

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 560" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              {POSITIONS.map(({ agent: item, sx, sy }, i) => {
                const nextNode = POSITIONS[(i + 1) % POSITIONS.length]!;
                return (
                  <g key={item.id}>
                    <line 
                      x1="300" y1="280" x2={sx} y2={sy} 
                      className="animate-[dash_12s_linear_infinite]"
                      style={{ 
                        stroke: item.accent, 
                        strokeWidth: 1, 
                        strokeDasharray: "4 8", 
                        opacity: 0.25, 
                        animationDelay: `${i * -0.4}s` 
                      }} 
                    />
                    {i % 2 === 0 && (
                      <line 
                        className="agent-to-agent" 
                        x1={sx} y1={sy} 
                        x2={nextNode.sx} 
                        y2={nextNode.sy} 
                        style={{ stroke: "#9575ff", strokeWidth: 1, strokeDasharray: "4 8", opacity: 0.12 }}
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Agent Nodes */}
            {POSITIONS.map(({ agent: item, x, y }, i) => (
              <motion.button 
                key={item.id} 
                className={`absolute z-[4] w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] lg:w-[62px] lg:h-[62px] p-0 border rounded-lg sm:rounded-xl lg:rounded-[14px] bg-[#070910] cursor-pointer -translate-x-1/2 -translate-y-1/2 transition-all hover:border-[var(--agent-accent)] hover:shadow-[0_0_0_4px_color-mix(in_srgb,var(--agent-accent)_10%,transparent),0_0_25px_color-mix(in_srgb,var(--agent-accent)_25%,transparent)] ${selected === item.id ? "border-[var(--agent-accent)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--agent-accent)_10%,transparent),0_0_20px_color-mix(in_srgb,var(--agent-accent)_25%,transparent)] sm:shadow-[0_0_0_4px_color-mix(in_srgb,var(--agent-accent)_10%,transparent),0_0_25px_color-mix(in_srgb,var(--agent-accent)_25%,transparent)]" : "border-white/[0.14]"}`} 
                style={{ left: `${x}%`, top: `${y}%`, "--agent-accent": item.accent } as CSSProperties} 
                onFocus={() => setSelected(item.id)} 
                onClick={() => setSelected(item.id)} 
                aria-pressed={selected === item.id} 
                aria-label={`Select ${item.name}`} 
                data-testid={`workforce-agent-node-${item.id}`}
                animate={reduce ? undefined : { y: [0, -5, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              >
                <img src={item.image} alt="" loading="lazy" decoding="async" className="w-full h-full rounded-md sm:rounded-lg lg:rounded-[13px] object-cover object-[center_15%]" />
                <span className={`absolute top-[calc(100%+4px)] sm:top-[calc(100%+6px)] left-1/2 font-mono text-[4px] sm:text-[5px] lg:text-[6px] tracking-[0.08em] -translate-x-1/2 whitespace-nowrap ${selected === item.id ? "text-[var(--agent-accent)]" : "text-[#6b7889]"}`}>
                  {item.codename}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Inspector Card */}
          <div className="flex items-center p-4 sm:p-6 lg:p-[22px] bg-[#0d1119]" data-testid="workforce-inspector-card">
            <AnimatePresence mode="wait">
              <motion.div 
                key={agent.id} 
                initial={reduce ? false : { opacity: 0, x: 22 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -15 }} 
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="relative h-[160px] sm:h-[200px] lg:h-[220px] overflow-hidden rounded-lg lg:rounded-[10px] bg-[#070910]" style={{ "--agent-accent": agent.accent } as CSSProperties}>
                  <img src={agent.image} alt={agent.alt} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070910]/85 via-transparent to-transparent" />
                  <span className="absolute z-[2] top-3 sm:top-[15px] left-3 sm:left-[15px] px-2 sm:px-2.5 py-1 sm:py-[7px] rounded-full bg-[rgba(8,10,16,0.75)] text-white font-mono text-[6px] sm:text-[8px] uppercase">
                    {agent.codename} / {agent.category}
                  </span>
                </div>
                
                <div className="pt-3 sm:pt-4 lg:pt-[17px]">
                  <span className="text-[#6b7889] font-mono text-[7px] sm:text-[8px] lg:text-[9px] tracking-[0.16em]">SELECTED DIGITAL INTELLIGENCE</span>
                  <h3 className="my-1.5 sm:my-2 font-semibold text-[18px] sm:text-[22px] lg:text-[24px] leading-[1.1] tracking-[-0.03em] text-white">{agent.name}</h3>
                  <p className="m-0 text-[#9aa8bc] text-[10px] sm:text-[11px] leading-[1.6] lg:leading-[1.7]">{agent.description}</p>
                  
                  <div className="flex flex-wrap gap-x-2.5 sm:gap-x-[15px] gap-y-1.5 sm:gap-y-2.5 my-2.5 sm:my-3.5">
                    {agent.capabilities.map((capability) => (
                      <span key={capability} className="flex items-center gap-1 sm:gap-[7px] text-[#9aa8bc] text-[8px] sm:text-[9px]">
                        <Check size={10} className="sm:hidden text-[#65e7ff]" />
                        <Check size={13} className="hidden sm:block text-[#65e7ff]" />
                        {capability}
                      </span>
                    ))}
                  </div>
                  
                  <div className="my-2.5 sm:my-3.5 p-2 sm:p-3 border-l-2 border-[#65e7ff] bg-[#121722]">
                    <span className="text-[#65e7ff] font-mono text-[6px] sm:text-[7px] tracking-[0.13em]">SAMPLE TASK</span>
                    <p className="mt-1 sm:mt-2 mb-0 text-[#9aa8bc] text-[9px] sm:text-[10px] leading-[1.5] sm:leading-[1.6]">“{agent.sample}”</p>
                  </div>
                  
                  <a className="inline-flex items-center gap-1.5 sm:gap-[9px] text-white text-[11px] sm:text-[13px] font-semibold group" href={LINKS.marketplace} data-testid={`workforce-explore-${agent.id}`}>
                    Explore this agent 
                    <ArrowUpRight size={13} className="sm:hidden text-[#65e7ff] transition-transform group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
                    <ArrowUpRight size={16} className="hidden sm:block text-[#65e7ff] transition-transform group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}