"use client";

import { useEffect, useState, ReactNode, CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, FileText, Pause, Play, Sparkles } from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */
type Agent = {
  id: string;
  name: string;
  codename: string;
  image: string;
  alt: string;
  accent?: string;
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

type StageVisualProps = {
  stage: number;
  prompt: string;
  setPrompt: (val: string) => void;
  onAdvance: () => void;
};

/* ============================================================
   AGENTS DATA (Inlined)
   ============================================================ */
const AGENTS: Agent[] = [
  { id: "support", name: "Customer Support AI", codename: "NEXUS", image: "/assets/agents/support.webp", alt: "NEXUS customer support humanoid AI" },
  { id: "marketing", name: "Marketing AI", codename: "VECTOR", accent: "#C65DFF", image: "/assets/agents/marketing.webp", alt: "VECTOR marketing humanoid AI" },
  { id: "coding", name: "Coding AI", codename: "COMPILER", image: "/assets/agents/coding.webp", alt: "COMPILER engineering humanoid AI" },
  { id: "design", name: "Creative Design AI", codename: "PRISM", accent: "#F43F5E", image: "/assets/agents/design.webp", alt: "PRISM creative humanoid AI" },
  { id: "finance", name: "Finance AI", codename: "LEDGER", image: "/assets/agents/finance.webp", alt: "LEDGER finance humanoid AI" },
  { id: "research", name: "Research AI", codename: "ORACLE", accent: "#76A7FF", image: "/assets/agents/research.webp", alt: "ORACLE research humanoid AI" },
  { id: "sales", name: "Sales AI", codename: "PULSE", image: "/assets/agents/sales.webp", alt: "PULSE sales humanoid AI" },
  { id: "video", name: "Video Creation AI", codename: "MOTION", image: "/assets/agents/video.webp", alt: "MOTION video humanoid AI" },
  { id: "writing", name: "Content Writing AI", codename: "QUILL", accent: "#A78BFA", image: "/assets/agents/writing.webp", alt: "QUILL writing humanoid AI" },
  { id: "bi", name: "Business Intelligence AI", codename: "INSIGHT", image: "/assets/agents/bi.webp", alt: "INSIGHT business humanoid AI" },
  { id: "hr", name: "HR AI", codename: "TALENT", image: "/assets/agents/hr.webp", alt: "TALENT HR humanoid AI" },
  { id: "productivity", name: "Productivity AI", codename: "FLOW", image: "/assets/agents/productivity.webp", alt: "FLOW productivity humanoid AI" },
];

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
   Main Workflow Data
   ============================================================ */
const STAGES: { id: string; short: string; title: string }[] = [
  { id: "01", short: "User Input", title: "One goal enters the intelligence network" },
  { id: "02", short: "AI Planning", title: "The objective becomes a coordinated plan" },
  { id: "03", short: "Specialized Agents", title: "Four digital specialists activate" },
  { id: "04", short: "Final Output", title: "The work comes together" }
];

const WORKFLOW_AGENTS = ["research", "marketing", "design", "writing"].map((id) =>
  AGENTS.find((agent) => agent.id === id)!
);

const DEFAULT_PROMPT = "Create a complete marketing strategy for my business.";

/* ============================================================
   Stage Visual Component
   ============================================================ */
function StageVisual({ stage, prompt, setPrompt, onAdvance }: StageVisualProps) {
  if (stage === 0) {
    return (
      <form 
        className="max-w-[850px] min-h-[240px] sm:min-h-[285px] mx-auto p-4 sm:p-5 border border-white/[0.08] rounded-lg sm:rounded-xl bg-[#0f131c]" 
        onSubmit={(event) => { event.preventDefault(); onAdvance(); }}
      >
        <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-3.5 border-b border-white/[0.08]">
          <span className="w-[34px] h-[34px] sm:w-[42px] sm:h-[42px] overflow-hidden rounded-md sm:rounded-lg flex-none">
            <img src="/assets/core.webp" alt="Velvora central intelligence" className="w-full h-full object-cover" />
          </span>
          <span className="flex-1 min-w-0">
            <strong className="block font-semibold text-[11px] sm:text-[13px] leading-none text-[#f5f7ff]">New intelligence task</strong>
            <small className="block mt-1 sm:mt-1.5 text-[#6b7889] text-[7px] sm:text-[9px]">Velvora conceptual agent workflow</small>
          </span>
          <Sparkles size={14} className="sm:hidden text-[#65e7ff] flex-none" />
          <Sparkles size={17} className="hidden sm:block text-[#65e7ff] flex-none" />
        </div>
        <label htmlFor="workflow-prompt" className="block mt-3 sm:mt-[15px] mb-1.5 sm:mb-2 text-[#6b7889] text-[8px] sm:text-[9px]">
          What would you like to accomplish?
        </label>
        <div className="flex items-end gap-2 sm:gap-[15px] p-2.5 sm:p-3 px-3 sm:px-3.5 border border-white/[0.14] rounded-md sm:rounded-lg bg-[#121722]">
          <textarea 
            id="workflow-prompt" 
            value={prompt} 
            onChange={(event) => setPrompt(event.target.value)} 
            rows={2}
            className="w-full bg-transparent border-0 outline-none resize-none text-[#f5f7ff] font-medium text-[12px] sm:text-[15px] leading-[1.45]"
            data-testid="workflow-prompt-input" 
          />
          <button 
            className="flex w-[34px] h-[34px] sm:w-[42px] sm:h-[42px] flex-none items-center justify-center border-0 rounded-full bg-[#65e7ff] text-[#071015] cursor-pointer transition-transform hover:translate-x-[3px]" 
            type="submit" 
            aria-label="Plan this sample task" 
            data-testid="workflow-prompt-submit"
          >
            <ArrowRight size={15} className="sm:hidden" />
            <ArrowRight size={18} className="hidden sm:block" />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-[7px] mt-3 sm:mt-[15px]">
          {["Research", "Strategy", "Creative", "Content"].map(tag => (
            <span key={tag} className="px-1.5 sm:px-2 py-1 sm:py-[7px] border border-white/[0.08] rounded-full text-[#6b7889] text-[7px] sm:text-[8px]">
              {tag}
            </span>
          ))}
        </div>
      </form>
    );
  }

  if (stage === 1) {
    return (
      <div className="grid min-h-[240px] sm:min-h-[285px] grid-cols-1 md:grid-cols-2 items-center gap-6 sm:gap-[45px]">
        <div className="relative h-[180px] sm:h-[275px] animate-pulse">
          <img src="/assets/core.webp" alt="Velvora crystalline intelligence core" className="block w-full h-full object-contain" />
          <span className="absolute top-1/2 left-1/2 w-[140px] h-[140px] sm:w-[220px] sm:h-[220px] border border-[#65e7ff] rounded-full opacity-25 -translate-x-1/2 -translate-y-1/2 animate-ping" />
        </div>
        <div className="grid gap-1.5">
          <span className="text-[#6b7889] font-mono text-[8px] sm:text-[9px] tracking-[0.16em] mb-1.5 sm:mb-2">CENTRAL INTELLIGENCE / CONCEPTUAL PLANNING</span>
          {["Interpret the requested outcome", "Divide the goal into four workstreams", "Match specialist agents to each task", "Organize a structured final handoff"].map((item, i) => (
            <motion.div 
              key={item} 
              className="grid grid-cols-[18px_14px_1fr] sm:grid-cols-[25px_18px_1fr] items-center gap-1.5 sm:gap-2.5 p-[8px_10px] sm:p-[10px_12px] border border-white/[0.08] rounded-md bg-[#121722] text-[#9aa8bc] text-[9px] sm:text-[10px]"
              initial={{ opacity: 0, x: 15 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-[#6b7889] font-mono text-[7px] sm:text-[8px]">0{i + 1}</span>
              <Check size={12} className="sm:hidden text-[#65e7ff]" />
              <Check size={15} className="hidden sm:block text-[#65e7ff]" />
              {item}
            </motion.div>
          ))}
          <div className="flex items-center gap-1 sm:gap-[7px] mt-1.5 sm:mt-2.5 text-[#6b7889] font-mono text-[6px] sm:text-[7px]">
            <span>GOAL</span><i className="h-[1px] flex-1 bg-white/[0.14]" />
            <span>PLAN</span><i className="h-[1px] flex-1 bg-white/[0.14]" />
            <span>AGENTS</span><i className="h-[1px] flex-1 bg-white/[0.14]" />
            <span>OUTPUT</span>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 2) {
    return (
      <div className="relative grid min-h-[240px] sm:min-h-[285px] grid-cols-1 xs:grid-cols-2 md:grid-cols-4 items-center gap-2.5 sm:gap-3.5">
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
          {[125, 375, 625, 875].map((x) => (
            <path key={x} d={`M500 20 C500 100 ${x} 80 ${x} 190`} fill="none" stroke="#65e7ff" strokeWidth="1" strokeDasharray="5 8" opacity="0.25" />
          ))}
        </svg>
        <div className="absolute top-[45%] left-[5%] right-[5%] h-[1px] bg-[#65e7ff] opacity-25" />
        
        {WORKFLOW_AGENTS.map((agent, i) => (
          <motion.div 
            className="relative z-[1] min-w-0 p-[8px_8px_10px] sm:p-[9px_9px_12px] border border-white/[0.08] rounded-lg sm:rounded-[10px] bg-[#121722] shadow-[0_20px_60px_rgba(0,0,0,0.35)]" 
            style={{ "--agent-accent": agent.accent } as CSSProperties} 
            key={agent.id} 
            initial={{ opacity: 0, y: 22 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.12 }}
          >
            <div className="h-[90px] sm:h-[125px] mb-2 sm:mb-[11px] overflow-hidden rounded-md bg-[#070910]">
              <img src={agent.image} alt={agent.alt} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </div>
            <span className="text-[var(--agent-accent)] font-mono text-[7px] sm:text-[8px]">0{i + 1} / {agent.codename}</span>
            <strong className="block mt-1 sm:mt-1.5 font-semibold text-[10px] sm:text-[11px] leading-[1.2] text-white">{agent.name}</strong>
            <small className="block mt-1 sm:mt-[7px] text-[#6b7889] text-[8px] sm:text-[9px]">{["Analyzes market information", "Develops campaign strategy", "Creates visual concepts", "Prepares campaign content"][i]}</small>
            <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2.5 text-[#6b7889] text-[6px] sm:text-[7px]">
              <i className="w-[4px] h-[4px] sm:w-[5px] sm:h-[5px] rounded-full bg-[var(--agent-accent)] shadow-[0_0_10px_var(--agent-accent)]" />
              Conceptual workstream
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-[240px] sm:min-h-[285px] p-3 sm:p-[18px] border border-white/[0.08] rounded-lg sm:rounded-[10px] bg-[#0f131c]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-[15px]">
        <span className="flex items-center gap-1.5 sm:gap-2 text-[#65e7ff] font-mono text-[7px] sm:text-[8px] tracking-[0.13em]">
          <Sparkles size={12} className="sm:hidden" />
          <Sparkles size={15} className="hidden sm:block" /> VELVORA / UNIFIED OUTPUT
        </span>
        <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-[7px] py-1 sm:py-[7px] sm:px-[9px] border border-white/[0.14] rounded-full text-[#65e7ff] text-[7px] sm:text-[8px] w-fit">
          <Check size={10} className="sm:hidden" />
          <Check size={13} className="hidden sm:block" /> Structured result
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] lg:grid-cols-[1fr_220px] gap-4 sm:gap-[25px] mt-3 sm:mt-4">
        <div>
          <span className="text-[#6b7889] font-mono text-[8px] sm:text-[9px] tracking-[0.16em]">MARKETING STRATEGY / SAMPLE OUTPUT</span>
          <h3 className="mt-2 sm:mt-3 mb-1.5 sm:mb-2 font-semibold text-[18px] sm:text-[23px] leading-[1.1] text-white">One organized campaign brief</h3>
          <p className="m-0 text-[#9aa8bc] text-[9px] sm:text-[10px]">Research, positioning, visual direction, and content brought into one clear deliverable.</p>
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-1.5 sm:gap-2 mt-3 sm:mt-[15px]">
            {[
              ["01", "Market intelligence", "Category signals and audience context"], 
              ["02", "Campaign strategy", "Positioning and channel direction"], 
              ["03", "Creative system", "Visual and editorial starting points"]
            ].map(([n, title, copy]) => (
              <div key={n} className="p-2.5 sm:p-3.5 border border-white/[0.08] rounded-md bg-[#121722]">
                <span className="text-[#65e7ff] font-mono text-[7px] sm:text-[8px]">{n}</span>
                <strong className="block mt-1.5 sm:mt-[9px] text-[9px] sm:text-[10px] text-white">{title}</strong>
                <p className="mt-1 sm:mt-1.5 mb-0 text-[#6b7889] text-[7px] sm:text-[8px] leading-[1.4] sm:leading-[1.5]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
        <aside className="p-3 sm:p-[18px] border border-white/[0.08] rounded-md bg-[#121722]">
          <FileText size={16} className="sm:hidden text-[#65e7ff]" />
          <FileText size={20} className="hidden sm:block text-[#65e7ff]" />
          <span className="block mt-2 sm:mt-3.5 mb-3 sm:mb-5 text-[#6b7889] font-mono text-[6px] sm:text-[7px]">WORKSTREAM VIEW</span>
          {["Research", "Strategy", "Creative", "Content"].map((item, i) => (
            <div key={item} className="my-2 sm:my-3.5">
              <small className="text-[#6b7889] text-[6px] sm:text-[7px]">{item}</small>
              <span className="block h-[2px] sm:h-[3px] mt-1 sm:mt-[7px] bg-white/[0.08]">
                <i className="block h-full bg-[#65e7ff]" style={{ width: `${[86, 74, 62, 80][i]}%` }} />
              </span>
            </div>
          ))}
          <small className="text-[#6b7889] text-[6px] sm:text-[7px]">Illustrative completion view</small>
        </aside>
      </div>
    </div>
  );
}

/* ============================================================
   Main Component: WorkflowSection
   ============================================================ */
export default function WorkflowSection() {
  const [active, setActive] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % 4), 3000);
    return () => window.clearInterval(timer);
  }, [playing]);

  const selectStage = (index: number) => {
    setActive(index);
    setPlaying(false);
  };

  const currentStage = STAGES[active] ?? STAGES[0]!;

  return (
    <section className="relative py-16 sm:py-[72px] lg:py-[92px] bg-[#0a0e16] border-y border-white/[0.08]" id="how-it-works" data-testid="workflow-section">
      <div className="w-[min(1240px,calc(100%-32px))] sm:w-[min(1240px,calc(100%-48px))] lg:w-[min(1240px,calc(100%-64px))] mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 sm:gap-[30px]">
          <SectionHeader 
            eyebrow="FROM INTENT TO OUTCOME" 
            title="One Goal. Multiple Intelligent Agents." 
            copy="A conceptual demonstration of how Research, Marketing, Creative Design, and Content Writing agents could contribute to one shared goal." 
          />
          <Reveal className="flex-none pb-1 w-full md:w-auto">
            <button 
              className="inline-flex w-full md:w-auto min-h-[40px] sm:min-h-[46px] items-center justify-center gap-2 sm:gap-2.5 px-4 sm:px-5 border border-white/[0.14] rounded-full bg-[rgba(7,9,16,0.72)] backdrop-blur-md text-white text-[11px] sm:text-[13px] font-semibold hover:border-[#65e7ff] hover:bg-[#171d2a] hover:-translate-y-0.5 transition-all duration-300" 
              onClick={() => setPlaying(!playing)} 
              data-testid="workflow-autoplay-toggle"
            >
              {playing ? <Pause size={13} className="sm:hidden" /> : <Play size={13} className="sm:hidden" />}
              {playing ? <Pause size={15} className="hidden sm:block" /> : <Play size={15} className="hidden sm:block" />}
              {playing ? "Pause Demonstration" : "Play Demonstration"}
            </button>
          </Reveal>
        </div>

        <Reveal className="relative mt-6 sm:mt-9 overflow-hidden border border-white/[0.08] rounded-lg sm:rounded-[11px] bg-[#0d1119] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-white/[0.08] z-[2]">
            <motion.span 
              className="block h-full bg-[#65e7ff] shadow-[0_0_12px_#65e7ff]"
              animate={{ width: `${(active + 1) * 25}%` }} 
              transition={{ duration: reduce ? 0 : 0.5 }} 
            />
          </div>
          
          {/* Stage Tabs - 2 cols on mobile, 4 on md+ */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/[0.08]" role="tablist" aria-label="Agent workflow stages">
            {STAGES.map((stage, i) => (
              <button 
                key={stage.id} 
                role="tab" 
                aria-selected={active === i} 
                className={`flex min-h-[50px] sm:min-h-[62px] items-center gap-2 sm:gap-3.5 px-3 sm:px-5 border-0 border-r border-b md:border-b-0 border-white/[0.08] last:border-r-0 text-left cursor-pointer transition-colors ${active === i ? "bg-[#171d2a] text-white" : "bg-transparent text-[#6b7889]"}`} 
                onClick={() => selectStage(i)} 
                data-testid={`workflow-stage-tab-${stage.id}`}
              >
                <span className={`font-mono text-[8px] sm:text-[10px] ${active === i ? "text-[#65e7ff]" : ""}`}>{stage.id}</span>
                <strong className="font-semibold text-[10px] sm:text-[13px] leading-[1.2]">{stage.short}</strong>
              </button>
            ))}
          </div>
          
          {/* Stage Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-[18px] pt-4 sm:pt-5 px-4 sm:px-[26px]">
            <div className="flex items-center gap-2 sm:gap-[18px] flex-wrap">
              <span className="text-[#65e7ff] font-mono text-[8px] sm:text-[9px] tracking-[0.15em]">STEP {currentStage.id}</span>
              <h3 className="m-0 font-semibold text-[13px] sm:text-[16px] leading-[1.2] text-white">{currentStage.title}</h3>
            </div>
            <span className="sm:ml-auto text-[#6b7889] font-mono text-[7px] sm:text-[8px] tracking-[0.13em]">CONCEPTUAL DEMONSTRATION</span>
          </div>
          
          {/* Stage Canvas */}
          <div className="min-h-[260px] sm:min-h-[330px] p-4 sm:p-[22px_26px_20px]">
            <AnimatePresence mode="wait">
              <motion.div 
                key={active} 
                initial={reduce ? false : { opacity: 0, y: 16 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                transition={{ duration: 0.35 }}
              >
                <StageVisual 
                  stage={active} 
                  prompt={prompt} 
                  setPrompt={setPrompt} 
                  onAdvance={() => selectStage(1)} 
                />
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Footer Note */}
          <p className="m-0 px-4 sm:px-[26px] py-2.5 sm:py-3 border-t border-white/[0.08] text-[#6b7889] text-[8px] sm:text-[9px] leading-[1.6]">
            This interactive visual explains a potential multi-agent workflow. It is not a claim of live autonomous execution inside the current platform.
          </p>
        </Reveal>
      </div>
    </section>
  );
}