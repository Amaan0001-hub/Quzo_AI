"use client";

import { useRef, useState, ReactNode, CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Cpu, Network, Play, Sparkles } from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */
type Agent = {
  id: string;
  name: string;
  codename: string;
  category: string;
  specialization: string;
  accent: string;
  image: string;
  alt: string;
  tagline: string;
  description: string;
  capabilities: string[];
  tasks: string[];
  sample: string;
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
  style?: CSSProperties;
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
  {
    id: "support",
    name: "Customer Support AI",
    codename: "NEXUS",
    category: "Productivity",
    specialization: "Customer communication and support automation",
    accent: "#65E7FF",
    image: "/assets/agents/support.webp",
    alt: "NEXUS customer support humanoid AI with cyan communication interfaces",
    tagline: "A responsive intelligence for every customer conversation.",
    description: "Assists with customer responses, knowledge retrieval, and clear support workflows.",
    capabilities: ["Customer response drafting", "Knowledge retrieval", "Ticket summaries", "Support workflow assistance"],
    tasks: ["Draft a thoughtful customer follow-up", "Summarize a complex support conversation", "Find relevant knowledge-base guidance"],
    sample: "Summarize this support conversation and draft a clear follow-up.",
  },
  {
    id: "marketing",
    name: "Marketing AI",
    codename: "VECTOR",
    category: "Business",
    specialization: "Marketing strategy and campaign intelligence",
    accent: "#C65DFF",
    image: "/assets/agents/marketing.webp",
    alt: "VECTOR marketing humanoid AI with violet campaign analytics",
    tagline: "Turn audience insight into a campaign with a point of view.",
    description: "Helps shape campaign strategy, audience thinking, and channel-ready content.",
    capabilities: ["Campaign strategy", "Audience research", "Marketing content", "Channel planning"],
    tasks: ["Build a product launch campaign outline", "Explore a new audience segment", "Develop channel-specific content angles"],
    sample: "Create a launch strategy for a new consumer technology product.",
  },
  {
    id: "coding",
    name: "Coding AI",
    codename: "COMPILER",
    category: "Development",
    specialization: "Software development and engineering",
    accent: "#38BDF8",
    image: "/assets/agents/coding.webp",
    alt: "COMPILER engineering humanoid AI with electric-blue circuitry",
    tagline: "Precision engineering intelligence for technical work.",
    description: "Assists with code generation, debugging, documentation, and development workflows.",
    capabilities: ["Code generation", "Debugging assistance", "Technical documentation", "Development workflows"],
    tasks: ["Review an API debugging plan", "Draft technical documentation", "Generate a focused code starting point"],
    sample: "Review this API workflow and suggest a debugging plan.",
  },
  {
    id: "design",
    name: "Creative Design AI",
    codename: "PRISM",
    category: "Creative",
    specialization: "Visual creativity and design production",
    accent: "#F43F5E",
    image: "/assets/agents/design.webp",
    alt: "PRISM creative humanoid AI with violet and turquoise design interfaces",
    tagline: "A visual imagination engine for original design directions.",
    description: "Develops visual concepts, interface ideas, creative direction, and design starting points.",
    capabilities: ["Visual concepts", "Design assistance", "Creative direction", "Brand assets"],
    tasks: ["Develop three visual directions", "Create an interface concept brief", "Explore a coherent brand asset system"],
    sample: "Develop three visual directions for a premium product launch.",
  },
  {
    id: "finance",
    name: "Finance AI",
    codename: "LEDGER",
    category: "Business",
    specialization: "Financial analysis and reporting",
    accent: "#34D399",
    image: "/assets/agents/finance.webp",
    alt: "LEDGER finance humanoid AI with emerald analytical interfaces",
    tagline: "Structured financial thinking for better-informed decisions.",
    description: "Supports financial analysis, reporting, budget exploration, and data organization.",
    capabilities: ["Financial analysis", "Report preparation", "Budget insights", "Financial data organization"],
    tasks: ["Compare budget scenarios", "Prepare a financial report outline", "Organize quarterly financial information"],
    sample: "Create a scenario outline for next quarter’s operating budget.",
  },
  {
    id: "research",
    name: "Research AI",
    codename: "ORACLE",
    category: "Research",
    specialization: "Research and knowledge discovery",
    accent: "#76A7FF",
    image: "/assets/agents/research.webp",
    alt: "ORACLE research humanoid AI with blue and violet knowledge nodes",
    tagline: "Discover the knowledge that moves a question forward.",
    description: "Turns scattered information into structured research, summaries, and useful reports.",
    capabilities: ["Information research", "Data summarization", "Knowledge discovery", "Research reports"],
    tasks: ["Map a competitive landscape", "Synthesize a collection of sources", "Prepare a concise research report"],
    sample: "Research the competitive landscape for a new productivity product.",
  },
  {
    id: "sales",
    name: "Sales AI",
    codename: "PULSE",
    category: "Business",
    specialization: "Sales intelligence and business growth",
    accent: "#FB923C",
    image: "/assets/agents/sales.webp",
    alt: "PULSE sales humanoid AI with orange and blue opportunity networks",
    tagline: "Confident preparation for every growth conversation.",
    description: "Supports prospect research, outreach drafts, account preparation, and sales intelligence.",
    capabilities: ["Lead research", "Outreach drafts", "Account briefs", "Sales intelligence"],
    tasks: ["Prepare a prospect account brief", "Draft a personalized outreach message", "Create discovery-call questions"],
    sample: "Prepare an account brief and discovery questions for a prospect.",
  },
  {
    id: "video",
    name: "Video Creation AI",
    codename: "MOTION",
    category: "Creative",
    specialization: "Video and multimedia production",
    accent: "#E879F9",
    image: "/assets/agents/video.webp",
    alt: "MOTION video humanoid AI with magenta cinematic interfaces",
    tagline: "Cinematic intelligence from first concept to final scene plan.",
    description: "Helps move video ideas through concepts, scripts, storyboards, and multimedia planning.",
    capabilities: ["Video concepts", "Script assistance", "Storyboards", "Multimedia planning"],
    tasks: ["Develop a six-scene launch storyboard", "Draft a short product video script", "Plan a multimedia content sequence"],
    sample: "Turn this product idea into a six-scene launch storyboard.",
  },
  {
    id: "writing",
    name: "Content Writing AI",
    codename: "QUILL",
    category: "Creative",
    specialization: "Writing and language intelligence",
    accent: "#A78BFA",
    image: "/assets/agents/writing.webp",
    alt: "QUILL writing humanoid AI with lavender language interfaces",
    tagline: "Language intelligence with clarity, structure, and voice.",
    description: "Assists with content drafting, editing, copywriting, and content structuring.",
    capabilities: ["Content drafting", "Editing assistance", "Copywriting", "Content structuring"],
    tasks: ["Turn research into an executive article", "Refine the voice of a draft", "Structure a long-form content outline"],
    sample: "Turn these research notes into a concise executive article.",
  },
  {
    id: "bi",
    name: "Business Intelligence AI",
    codename: "INSIGHT",
    category: "Research",
    specialization: "Business analytics and decision support",
    accent: "#38BDF8",
    image: "/assets/agents/bi.webp",
    alt: "INSIGHT business humanoid AI with blue and emerald dashboards",
    tagline: "Connected analysis for the decisions that matter.",
    description: "Supports business analytics, data interpretation, performance summaries, and decision context.",
    capabilities: ["Business analytics", "Data interpretation", "Performance summaries", "Decision support"],
    tasks: ["Compare three market segments", "Summarize business performance signals", "Prepare a decision-support brief"],
    sample: "Compare three market segments and summarize the trade-offs.",
  },
  {
    id: "hr",
    name: "HR AI",
    codename: "TALENT",
    category: "Productivity",
    specialization: "Human resources and recruitment support",
    accent: "#F472B6",
    image: "/assets/agents/hr.webp",
    alt: "TALENT HR humanoid AI with pink and blue talent networks",
    tagline: "Organized intelligence for people and talent workflows.",
    description: "Helps organize recruitment, candidate information, HR documentation, and talent insights.",
    capabilities: ["Recruitment assistance", "Candidate organization", "HR documentation", "Talent insights"],
    tasks: ["Draft an inclusive role description", "Organize candidate review notes", "Create an onboarding document outline"],
    sample: "Create an onboarding outline for a new design team member.",
  },
  {
    id: "productivity",
    name: "Productivity AI",
    codename: "FLOW",
    category: "Productivity",
    specialization: "Productivity and workflow automation",
    accent: "#818CF8",
    image: "/assets/agents/productivity.webp",
    alt: "FLOW productivity humanoid AI with cyan and violet workflow rings",
    tagline: "Adaptive intelligence for work that moves more smoothly.",
    description: "Helps structure tasks, plan workflows, organize priorities, and coordinate processes.",
    capabilities: ["Task organization", "Workflow planning", "Productivity assistance", "Process coordination"],
    tasks: ["Turn project notes into a weekly plan", "Map a recurring team workflow", "Organize priorities for a complex goal"],
    sample: "Organize these project notes into a prioritized weekly plan.",
  },
];

const LINKS = {
  marketplace: "/#marketplace",
};

/* ============================================================
   Helper Components (Reveal & SectionHeader)
   ============================================================ */
function Reveal({ children, className = "", delay = 0, amount = 0.2, style }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
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
        <span className="h-[1px] w-[22px] bg-current shadow-[0_0_10px_currentColor]" />
        {eyebrow}
      </div>
      <h2 className="mb-4 mt-[14px] sm:mt-[18px] text-[clamp(1.75rem,5vw,3rem)] font-semibold leading-[1.12] tracking-[-0.045em] text-[#f5f7ff]">
        {title}
      </h2>
      {copy && <p className={`m-0 max-w-[610px] text-[12px] sm:text-[14px] leading-[1.7] text-[#9aa8bc] ${isCenter ? "mx-auto" : ""}`}>{copy}</p>}
    </Reveal>
  );
}

/* ============================================================
   Main Component: AgentMarketplace
   ============================================================ */
export default function AgentMarketplace() {
  const [selected, setSelected] = useState<string>(AGENTS[0]!.id);
  const reduce = useReducedMotion();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const agent = AGENTS.find((item) => item.id === selected)!;

  const activate = (index: number, focus = false) => {
    const next = (index + AGENTS.length) % AGENTS.length;
    setSelected(AGENTS[next]!.id);
    if (focus) window.requestAnimationFrame(() => buttons.current[next]?.focus());
  };

  const keyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") { event.preventDefault(); activate(index + 1, true); }
    if (event.key === "ArrowLeft") { event.preventDefault(); activate(index - 1, true); }
    if (event.key === "Home") { event.preventDefault(); activate(0, true); }
    if (event.key === "End") { event.preventDefault(); activate(AGENTS.length - 1, true); }
  };

  const customStyle = { "--agent-accent": agent.accent } as CSSProperties;

  return (
    <section className="relative overflow-clip bg-[#070910] py-16 sm:py-[72px] lg:py-[92px]" id="agents" data-testid="agent-marketplace-section">
      <div className="mx-auto w-[min(1240px,calc(100%-32px))] sm:w-[min(1240px,calc(100%-48px))] lg:w-[min(1240px,calc(100%-64px))]">
        
        {/* Top Header */}
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:gap-10 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="YOUR DIGITAL WORKFORCE"
            title="Meet Your AI Specialists."
            copy="Twelve specialized AI minds. One connected intelligence ecosystem. Discover the digital workforce built to help you think, create, analyse and execute."
          />
          <div className="grid flex-none gap-2 sm:gap-2.5 pb-1">
            <span className="flex items-center gap-2.5 text-[9px] sm:text-[10px] text-[#6b7889]" data-testid="marketplace-agent-count">
              <strong className="text-[18px] sm:text-[22px] font-semibold leading-none text-[#65e7ff]">12</strong>
              Specialized AI Agents
            </span>
            <span className="flex items-center gap-2.5 text-[9px] sm:text-[10px] text-[#6b7889]">
              <Cpu size={14} className="text-[#65e7ff]" /> Distinct AI capabilities
            </span>
            <span className="flex items-center gap-2.5 text-[9px] sm:text-[10px] text-[#6b7889]">
              <Network size={14} className="text-[#65e7ff]" /> One connected intelligence ecosystem
            </span>
          </div>
        </Reveal>

        {/* Main Showcase */}
        <Reveal
          className="mt-8 sm:mt-[40px] lg:mt-[45px] grid min-h-[auto] lg:min-h-[610px] grid-cols-1 overflow-hidden rounded-[14px] sm:rounded-[18px] border border-white/[0.08] bg-[#0d1119] shadow-[0_20px_60px_rgba(0,0,0,0.35)] lg:grid-cols-[1.06fr_0.94fr]"
          style={customStyle}
        >
          <AnimatePresence mode="wait">
            <motion.div
              className="relative min-h-[340px] sm:min-h-[480px] lg:min-h-[610px] min-w-0 overflow-hidden border-b border-white/[0.08] lg:border-b-0 lg:border-r"
              style={{
                background: `radial-gradient(circle at 50% 42%, color-mix(in srgb, ${agent.accent} 16%, transparent), transparent 45%), #070910`,
              }}
              key={`${agent.id}-visual`}
              initial={reduce ? false : { opacity: 0, x: -25, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.98 }}
              transition={{ duration: 0.45 }}
              data-testid="featured-agent-visual"
            >
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:48px_48px] [mask-image:linear-gradient(black,transparent_90%)]" />

              {/* Rotating Rings - Smaller on mobile */}
              <motion.div
                className="absolute left-1/2 top-[48%] z-[1] h-[240px] sm:h-[350px] lg:h-[420px] w-[240px] sm:w-[350px] lg:w-[420px] rounded-full border"
                style={{
                  borderColor: `color-mix(in srgb, ${agent.accent} 35%, transparent)`,
                  transform: "translate(-50%, -50%) rotateX(65deg)",
                }}
                animate={reduce ? undefined : { rotateZ: 360 }}
                transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute left-1/2 top-[48%] z-[1] h-[320px] sm:h-[440px] lg:h-[520px] w-[320px] sm:w-[440px] lg:w-[520px] rounded-full border border-dashed opacity-40"
                style={{
                  borderColor: `color-mix(in srgb, ${agent.accent} 35%, transparent)`,
                  transform: "translate(-50%, -50%) rotateX(65deg)",
                }}
                animate={reduce ? undefined : { rotateZ: -360 }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              />

              {/* Agent Image */}
              <motion.img
                className="absolute inset-x-0 top-3 z-[2] h-[calc(100%-24px)] w-full object-contain object-top drop-shadow-[0_25px_40px_rgba(0,0,0,0.4)]"
                src={agent.image}
                alt={agent.alt}
                width={928}
                height={1152}
                animate={reduce ? undefined : { y: [0, -7, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Top Left HUD */}
              <div className="absolute left-3 sm:left-5 top-3 sm:top-5 z-[4] rounded-md sm:rounded-lg border border-[color-mix(in_srgb,var(--agent-accent)_25%,rgba(255,255,255,0.08))] bg-[#070910]/65 p-1.5 sm:p-2.5 text-white backdrop-blur-md">
                <span className="block font-mono text-[7px] sm:text-[9px] font-medium tracking-[0.14em] text-[var(--agent-accent)]">
                  {agent.codename}
                </span>
                <small className="mt-0.5 sm:mt-1 block text-[5px] sm:text-[6px] text-[#9aa8bc]">IDENTITY ACTIVE</small>
              </div>

              {/* Right HUD */}
              <div className="absolute right-2 sm:right-[15px] top-[42%] z-[4] flex max-w-[90px] sm:max-w-[135px] items-center gap-1 sm:gap-2 rounded-md sm:rounded-lg border border-[color-mix(in_srgb,var(--agent-accent)_25%,rgba(255,255,255,0.08))] bg-[#070910]/65 p-1.5 sm:p-2.5 backdrop-blur-md">
                <Sparkles size={10} className="sm:hidden text-[var(--agent-accent)]" />
                <Sparkles size={14} className="hidden sm:block text-[var(--agent-accent)]" />
                <span className="text-[6px] sm:text-[7px] leading-[1.4] text-[#c4ccda]">{agent.specialization}</span>
              </div>

              {/* Bottom HUD */}
              <div className="absolute inset-x-3 sm:inset-x-5 bottom-3 sm:bottom-5 z-[4] flex items-center justify-between rounded sm:rounded-md border border-[color-mix(in_srgb,var(--agent-accent)_25%,rgba(255,255,255,0.08))] bg-[#070910]/65 p-1.5 sm:p-2 font-mono text-[6px] sm:text-[7px] tracking-[0.12em] text-[#9aa8bc] backdrop-blur-md">
                <span>VELVORA / {String(AGENTS.indexOf(agent) + 1).padStart(2, "0")}</span>
                <i className="h-1 sm:h-1.5 w-1 sm:w-1.5 rounded-full bg-[var(--agent-accent)] shadow-[0_0_12px_var(--agent-accent)]" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Info Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              className="flex min-w-0 flex-col justify-center p-4 sm:p-6 lg:p-[34px]"
              key={`${agent.id}-info`}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, delay: 0.06 }}
              data-testid="featured-agent-information"
            >
              <div className="flex items-center justify-between gap-[15px]">
                <span className="font-mono text-[7px] sm:text-[8px] font-medium tracking-[0.13em] text-[var(--agent-accent)]">
                  {agent.codename} / {agent.category}
                </span>
                <small className="flex items-center gap-1.5 font-mono text-[5px] sm:text-[6px] text-[#6b7889]">
                  <i className="h-[4px] sm:h-[5px] w-[4px] sm:w-[5px] rounded-full bg-[var(--agent-accent)]" />
                  DIGITAL INTELLIGENCE
                </small>
              </div>
              <h3 className="mb-2 sm:mb-[9px] mt-3 sm:mt-[18px] text-[24px] sm:text-[30px] lg:text-[36px] font-semibold leading-[1.08] tracking-[-0.04em]">
                {agent.name}
              </h3>
              <h4 className="mb-2 sm:mb-3 text-[13px] sm:text-[15px] lg:text-[16px] font-medium leading-[1.45] text-[#f5f7ff]">
                {agent.tagline}
              </h4>
              <p className="m-0 text-[11px] sm:text-[12px] leading-[1.6] sm:leading-[1.7] text-[#9aa8bc]">{agent.description}</p>

              <div className="mt-4 sm:mt-[22px]" id="agent-capabilities">
                <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.16em] text-[#6b7889]">
                  CORE CAPABILITIES
                </span>
                <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-1.5 sm:gap-[9px]">
                  {agent.capabilities.map((capability) => (
                    <span key={capability} className="flex items-center gap-[5px] sm:gap-[7px] text-[8px] sm:text-[9px] text-[#9aa8bc]">
                      <Check size={10} className="sm:hidden shrink-0 text-[var(--agent-accent)]" />
                      <Check size={13} className="hidden sm:block shrink-0 text-[var(--agent-accent)]" />
                      {capability}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 sm:mt-[22px] grid gap-1 sm:gap-1.5">
                <span className="mb-0.5 sm:mb-1 font-mono text-[8px] sm:text-[9px] tracking-[0.16em] text-[#6b7889]">
                  EXAMPLE TASKS
                </span>
                {agent.tasks.map((task, i) => (
                  <div key={task} className="grid grid-cols-[18px_1fr_12px] sm:grid-cols-[23px_1fr_14px] items-center gap-1.5 sm:gap-[7px] border-b border-white/[0.08] py-1.5 sm:py-2 text-[8px] sm:text-[9px] text-[#9aa8bc]">
                    <span className="font-mono text-[6px] sm:text-[7px] text-[var(--agent-accent)]">0{i + 1}</span>
                    {task}
                    <ArrowUpRight size={10} className="sm:hidden text-[#6b7889]" />
                    <ArrowUpRight size={12} className="hidden sm:block text-[#6b7889]" />
                  </div>
                ))}
              </div>

              <div className="mt-3 sm:mt-[18px] border-l-2 border-[var(--agent-accent)] bg-[#0a0e16] px-2.5 sm:px-3.5 py-2 sm:py-3">
                <span className="flex items-center gap-1 sm:gap-1.5 font-mono text-[5px] sm:text-[6px] tracking-[0.12em] text-[var(--agent-accent)]">
                  <Play size={10} className="sm:hidden" /> <Play size={12} className="hidden sm:block" /> CONCEPTUAL TASK PREVIEW
                </span>
                <p className="mb-0 mt-1 sm:mt-2 text-[8px] sm:text-[9px] leading-[1.4] sm:leading-[1.5] text-[#9aa8bc]">
                  “{agent.sample}”
                </p>
              </div>

              <div className="mt-4 sm:mt-[22px] flex flex-wrap gap-2 sm:gap-[9px]">
                <a className="inline-flex min-h-[36px] sm:min-h-[43px] items-center justify-center gap-1.5 sm:gap-2.5 rounded-full bg-[#e8f4f8] px-3 sm:px-5 text-[10px] sm:text-[11px] font-semibold text-[#070910] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#65e7ff] hover:text-[#071015]" href={LINKS.marketplace} data-testid={`agent-explore-${agent.id}`}>
                  Explore Agent <ArrowRight size={14} className="sm:hidden" /> <ArrowRight size={16} className="hidden sm:block" />
                </a>
                <a className="inline-flex min-h-[36px] sm:min-h-[43px] items-center justify-center gap-1.5 sm:gap-2.5 rounded-full border border-white/[0.14] bg-[rgba(7,9,16,0.72)] px-3 sm:px-5 text-[10px] sm:text-[11px] font-semibold text-[#f5f7ff] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#65e7ff] hover:bg-[#171d2a]" href="#agent-capabilities" data-testid="view-agent-capabilities">
                  View Capabilities
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </Reveal>

        {/* Agent Selector Strip */}
        <Reveal className="mt-5 sm:mt-[22px]">
          <div className="mb-2 sm:mb-3 flex items-center justify-between font-mono text-[7px] sm:text-[8px] tracking-[0.12em] text-[#6b7889]">
            <span>SELECT AN INTELLIGENCE</span>
            <small className="text-[6px] sm:text-[7px] tracking-normal">Arrow keys · Touch · Click</small>
          </div>
          <div className="flex snap-x snap-proximity gap-2 sm:gap-[9px] overflow-x-auto px-1 pb-3 pt-1 [scrollbar-color:rgba(255,255,255,0.14)_transparent] [scrollbar-width:thin]" role="tablist" aria-label="Choose an AI specialist">
            {AGENTS.map((item, index) => (
              <button
                ref={(node) => { buttons.current[index] = node; }}
                key={item.id}
                role="tab"
                aria-selected={selected === item.id}
                className={`relative flex min-h-[70px] sm:min-h-[82px] min-w-[140px] sm:min-w-[174px] cursor-pointer snap-start items-center gap-2 sm:gap-2.5 rounded-lg sm:rounded-xl border p-[5px_8px_5px_5px] sm:p-[7px_11px_7px_7px] text-left transition-all duration-250 hover:-translate-y-[2px] sm:hover:-translate-y-[3px] ${selected === item.id ? "border-[var(--agent-accent)] bg-[color-mix(in_srgb,var(--agent-accent)_6%,#0d1119)] text-[#f5f7ff]" : "border-white/[0.08] bg-[#0d1119] text-[#9aa8bc] hover:border-[var(--agent-accent)]"}`}
                style={{ "--agent-accent": item.accent } as CSSProperties}
                onClick={() => activate(index)}
                onKeyDown={(event) => keyDown(event, index)}
                data-testid={`agent-card-${item.id}`}
              >
                <div className="relative h-[52px] sm:h-[66px] w-[46px] sm:w-[58px] flex-none">
                  <img src={item.image} alt="" width={928} height={1152} loading="lazy" decoding="async" className="h-full w-full rounded-md sm:rounded-lg object-cover object-[center_15%]" />
                  {selected === item.id && (
                    <motion.span className="absolute -inset-[2px] sm:-inset-[3px] rounded-lg sm:rounded-xl border border-[var(--agent-accent)] shadow-[0_0_18px_color-mix(in_srgb,var(--agent-accent)_22%,transparent)]" layoutId="active-agent" />
                  )}
                </div>
                <span className="min-w-0">
                  <strong className="block font-mono text-[7px] sm:text-[8px] font-medium tracking-[0.1em] text-[var(--agent-accent)]">
                    {item.codename}
                  </strong>
                  <small className="mt-0.5 sm:mt-1.5 block whitespace-nowrap text-[8px] sm:text-[9px]">
                    {item.name.replace(" AI", "")}
                  </small>
                </span>
                <i className={`absolute right-1.5 sm:right-2.5 top-1.5 sm:top-2.5 h-[4px] sm:h-[5px] w-[4px] sm:w-[5px] rounded-full ${selected === item.id ? "bg-[var(--agent-accent)] shadow-[0_0_10px_var(--agent-accent)]" : "bg-[rgba(255,255,255,0.14)]"}`} />
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}