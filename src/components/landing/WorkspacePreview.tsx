"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { 
  BarChart3, 
  Check, 
  ChevronDown, 
  CircleUserRound, 
  Clock3, 
  FileText, 
  Folder, 
  LayoutGrid, 
  MessageSquare, 
  Plus, 
  Search, 
  Settings, 
  Sparkles,
  LucideIcon
} from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */
type Agent = {
  id: string;
  name: string;
  category: string;
  image: string;
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

type LibraryAgent = {
  name: string;
  status: string;
  icon: LucideIcon;
};

/* ============================================================
   AGENTS DATA
   ============================================================ */
const AGENTS: Agent[] = [
  { id: "support", name: "Customer Support AI", category: "Productivity", image: "/assets/agents/support.webp" },
  { id: "marketing", name: "Marketing AI", category: "Business", image: "/assets/agents/marketing.webp" },
  { id: "coding", name: "Coding AI", category: "Development", image: "/assets/agents/coding.webp" },
];

const RECENT = ["Market-entry research", "Launch narrative", "Competitor summary"];

const LIBRARY_AGENTS: LibraryAgent[] = [
  { name: "Research Agent", status: "Active", icon: Search },
  { name: "Marketing Agent", status: "Available", icon: BarChart3 },
  { name: "Content Writing", status: "Available", icon: FileText },
];

/* ============================================================
   Helper Components
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
   Main Component: WorkspacePreview
   ============================================================ */
export default function WorkspacePreview() {
  return (
    <section className="relative py-16 sm:py-[72px] lg:py-[110px] bg-[#070910]" id="workspace">
      <div className="w-[min(1240px,calc(100%-32px))] sm:w-[min(1240px,calc(100%-48px))] lg:w-[min(1240px,calc(100%-64px))] mx-auto">
        <SectionHeader 
          eyebrow="THE VELVORA WORKSPACE" 
          title="Powerful Intelligence. Beautifully Connected." 
          copy="Explore an illustrative product environment for choosing agents, shaping tasks, and turning goals into structured work." 
          align="center"
        />
        
        <Reveal className="relative mt-8 sm:mt-[38px] lg:mt-[52px]">
          {/* Ambient Glow */}
          <div className="absolute -bottom-[50px] left-[10%] right-[10%] h-[100px] bg-[#65e7ff] opacity-10 blur-[80px]" />
          
          {/* Floating Agents Preview - Only XL+ */}
          <div className="hidden xl:block absolute z-[4] w-[220px] p-[15px] border border-white/[0.14] rounded-[10px] bg-[rgba(7,9,16,0.72)] backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.35)] top-[70px] -left-[45px]">
            <span className="block mb-3 text-[#6b7889] font-mono text-[7px] tracking-[0.13em]">AGENT LIBRARY</span>
            {AGENTS.map((agent) => (
              <div key={agent.id} className="flex items-center gap-2.5 py-[7px] border-t border-white/[0.08]">
                <img src={agent.image} alt="" loading="lazy" className="w-[34px] h-[34px] rounded-[5px] object-cover" />
                <span>
                  <strong className="block text-[8px] text-white">{agent.name}</strong>
                  <small className="block mt-1 text-[#6b7889] text-[7px]">{agent.category}</small>
                </span>
              </div>
            ))}
          </div>

          {/* Floating Output Preview - Only XL+ */}
          <div className="hidden xl:block absolute z-[4] w-[220px] p-[15px] border border-white/[0.14] rounded-[10px] bg-[rgba(7,9,16,0.72)] backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.35)] right-[-45px] bottom-[60px]">
            <span className="block mb-3 text-[#6b7889] font-mono text-[7px] tracking-[0.13em]">GENERATED OUTPUT</span>
            <FileText size={22} className="text-[#65e7ff]" />
            <strong className="block mt-3 font-semibold text-[14px] leading-none text-white">Market-entry brief</strong>
            <p className="text-[#9aa8bc] text-[8px] leading-[1.6] mt-2 mb-4">Research, audience context, and competitive framing brought into one structured view.</p>
            <div className="grid gap-[5px]">
              <i className="h-[2px] bg-white/[0.14]" />
              <i className="h-[2px] w-[75%] bg-white/[0.14]" />
              <i className="h-[2px] w-[45%] bg-white/[0.14]" />
            </div>
          </div>

          {/* Main Workspace Window */}
          <div className="relative overflow-hidden border border-white/[0.14] rounded-lg sm:rounded-[14px] bg-[#0d1119] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            
            {/* Window Bar */}
            <div className="grid h-[36px] sm:h-[45px] grid-cols-3 items-center px-2.5 sm:px-4 border-b border-white/[0.08] bg-[#171d2a] text-[#6b7889] font-mono text-[5px] sm:text-[6px] lg:text-[7px] tracking-[0.08em] sm:tracking-[0.13em]">
              <div className="flex gap-1 sm:gap-[5px]">
                <i className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#6b7889] opacity-45" />
                <i className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#6b7889] opacity-45" />
                <i className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#65e7ff] opacity-80" />
              </div>
              <span className="text-center truncate px-1">VELVORA / WORKSPACE</span>
              <span className="justify-self-end truncate text-right hidden sm:block">ILLUSTRATIVE PRODUCT PREVIEW</span>
            </div>
            
            <div className="grid min-h-[450px] grid-cols-1 md:grid-cols-[180px_1fr] lg:grid-cols-[190px_1fr_215px]">
              
              {/* Sidebar - HIDDEN on mobile, visible md+ */}
              <aside className="hidden md:flex flex-col min-w-0 p-3 sm:p-[18px_12px_12px] border-r border-white/[0.08] bg-[#0a0e16]">
                <div className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 pb-3 sm:pb-5 text-[#65e7ff]">
                  <Sparkles size={14} className="sm:hidden" />
                  <Sparkles size={17} className="hidden sm:block" />
                  <strong className="text-[#f5f7ff] font-semibold text-[9px] sm:text-[10px] tracking-[0.12em]">VELVORA</strong>
                </div>
                <div className="flex items-center gap-1 sm:gap-[7px] p-2 sm:p-2.5 border border-white/[0.14] rounded-md text-white text-[8px] sm:text-[9px]">
                  <Plus size={12} className="sm:hidden" />
                  <Plus size={14} className="hidden sm:block" />
                  New workspace
                </div>
                <nav className="grid gap-[2px] sm:gap-[3px] mt-3 sm:mt-[18px]" aria-label="Preview navigation">
                  <span className="flex items-center gap-1.5 sm:gap-[9px] p-2 sm:p-[9px] rounded-[5px] bg-[#171d2a] text-white text-[8px] sm:text-[9px]">
                    <LayoutGrid size={11} className="sm:hidden" />
                    <LayoutGrid size={13} className="hidden sm:block" />
                    Workspace
                  </span>
                  <span className="flex items-center gap-1.5 sm:gap-[9px] p-2 sm:p-[9px] rounded-[5px] text-[#6b7889] text-[8px] sm:text-[9px]">
                    <MessageSquare size={11} className="sm:hidden" />
                    <MessageSquare size={13} className="hidden sm:block" />
                    Conversations
                  </span>
                  <span className="flex items-center gap-1.5 sm:gap-[9px] p-2 sm:p-[9px] rounded-[5px] text-[#6b7889] text-[8px] sm:text-[9px]">
                    <Folder size={11} className="sm:hidden" />
                    <Folder size={13} className="hidden sm:block" />
                    Agent library
                  </span>
                  <span className="flex items-center gap-1.5 sm:gap-[9px] p-2 sm:p-[9px] rounded-[5px] text-[#6b7889] text-[8px] sm:text-[9px]">
                    <Clock3 size={11} className="sm:hidden" />
                    <Clock3 size={13} className="hidden sm:block" />
                    Task history
                  </span>
                </nav>
                <div className="mx-1.5 sm:mx-2 mt-4 sm:mt-[25px] mb-2 sm:mb-2.5 text-[#6b7889] font-mono text-[6px] sm:text-[7px] tracking-[0.12em]">RECENT ACTIVITY</div>
                {RECENT.map((item) => (
                  <div className="flex items-center gap-1.5 sm:gap-[7px] p-1.5 sm:p-[7px_8px] overflow-hidden text-[#6b7889] text-[7px] sm:text-[8px] whitespace-nowrap" key={item}>
                    <FileText size={10} className="sm:hidden flex-none" />
                    <FileText size={13} className="hidden sm:block flex-none" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 sm:gap-2 mt-auto p-[8px_4px_0] sm:p-[12px_5px_0] border-t border-white/[0.08]">
                  <CircleUserRound size={20} className="sm:hidden text-[#6b7889]" />
                  <CircleUserRound size={25} className="hidden sm:block text-[#6b7889]" />
                  <span className="min-w-0">
                    <strong className="block text-[7px] sm:text-[8px] text-white truncate">Alex Morgan</strong>
                    <small className="block mt-0.5 sm:mt-1 text-[#6b7889] text-[6px] sm:text-[7px] truncate">Personal workspace</small>
                  </span>
                  <Settings size={12} className="sm:hidden ml-auto text-[#6b7889]" />
                  <Settings size={14} className="hidden sm:block ml-auto text-[#6b7889]" />
                </div>
              </aside>

              {/* Main Content */}
              <div className="min-w-0 flex flex-col">
                <div className="flex min-h-[60px] sm:min-h-[80px] items-center justify-between gap-2 sm:gap-[15px] p-3 sm:p-[15px_22px] border-b border-white/[0.08]">
                  <div className="min-w-0">
                    <span className="text-[#6b7889] font-mono text-[6px] sm:text-[7px] tracking-[0.1em]">WORKSPACE / RESEARCH</span>
                    <h3 className="mt-1 sm:mt-2 m-0 font-semibold text-[13px] sm:text-[17px] leading-tight sm:leading-none text-white truncate">Market-entry research</h3>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-[7px] p-1.5 sm:p-[9px_10px] border border-white/[0.08] rounded-md bg-[#121722] text-[#9aa8bc] text-[6px] sm:text-[8px] whitespace-nowrap flex-none">
                    <Search size={11} className="sm:hidden text-[#65e7ff]" />
                    <Search size={14} className="hidden sm:block text-[#65e7ff]" />
                    <span className="hidden xs:inline">Research Agent</span>
                    <ChevronDown size={10} className="sm:hidden text-[#6b7889]" />
                    <ChevronDown size={13} className="hidden sm:block text-[#6b7889]" />
                  </div>
                </div>
                
                <div className="p-3 sm:p-[20px_24px]">
                  <div className="max-w-[95%] sm:max-w-[90%] ml-auto p-2.5 sm:p-[15px_17px] border border-white/[0.08] rounded-md sm:rounded-lg bg-[#171d2a]">
                    <span className="text-[#9575ff] font-mono text-[6px] sm:text-[7px] tracking-[0.12em]">YOU</span>
                    <p className="mt-1 sm:mt-2 mb-0 text-[#9aa8bc] text-[8px] sm:text-[10px] leading-[1.5] sm:leading-[1.6]">Prepare a market-entry research report for a new technology product.</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 sm:gap-[7px] my-3 sm:my-5">
                    {["Task received", "Analysis in progress", "Output generated"].map((status, i) => (
                      <span key={status} className={`flex items-center gap-1 sm:gap-[5px] px-1.5 sm:px-2 py-1 sm:py-1.5 border border-white/[0.08] rounded-full text-[6px] sm:text-[7px] ${i === 2 ? "text-[#65e7ff]" : "text-[#6b7889]"}`}>
                        <Check size={9} className="sm:hidden" />
                        <Check size={12} className="hidden sm:block" />
                        {status}
                      </span>
                    ))}
                  </div>
                  
                  <div className="p-3 sm:p-5 border border-white/[0.08] rounded-md sm:rounded-lg bg-[#0a0e16]">
                    <div className="flex items-center gap-2 sm:gap-[9px]">
                      <span className="flex w-[24px] h-[24px] sm:w-[30px] sm:h-[30px] items-center justify-center border border-white/[0.14] rounded-md text-[#65e7ff]">
                        <Sparkles size={12} className="sm:hidden" />
                        <Sparkles size={15} className="hidden sm:block" />
                      </span>
                      <div>
                        <strong className="block font-semibold text-[8px] sm:text-[10px] text-white">Research Agent</strong>
                        <small className="block mt-0.5 sm:mt-1 text-[#6b7889] text-[6px] sm:text-[7px]">Structured research output</small>
                      </div>
                    </div>
                    <h4 className="mt-3 sm:mt-[22px] mb-1.5 sm:mb-2 font-semibold text-[14px] sm:text-[20px] leading-tight sm:leading-none text-white">Market-entry research brief</h4>
                    <p className="m-0 text-[#9aa8bc] text-[8px] sm:text-[9px] leading-[1.5] sm:leading-[1.6]">A structured starting point for evaluating the opportunity, audience, and competitive landscape.</p>
                    
                    <div className="grid gap-1.5 sm:gap-[7px] mt-3 sm:mt-[18px]">
                      {[
                        ["01", "Market context", "Category definition, demand signals, and relevant trends."],
                        ["02", "Audience landscape", "Priority segments, needs, and adoption considerations."],
                        ["03", "Competitive view", "Alternative solutions and positioning dimensions."]
                      ].map(([n, title, copy]) => (
                        <div key={n} className="grid grid-cols-[20px_1fr] sm:grid-cols-[25px_1fr] p-2 sm:p-3 border border-white/[0.08] rounded-[5px]">
                          <span className="row-span-2 text-[#65e7ff] font-mono text-[6px] sm:text-[7px] leading-[1.5]">{n}</span>
                          <strong className="text-[7px] sm:text-[8px] text-white">{title}</strong>
                          <p className="col-span-1 col-start-2 mt-0.5 sm:mt-1 mb-0 text-[#6b7889] text-[6px] sm:text-[7px] leading-[1.4] sm:leading-[1.5]">{copy}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Inspector - HIDDEN on mobile/tablet, visible lg+ */}
              <aside className="hidden lg:block min-w-0 p-[10px_13px] border-l border-white/[0.08] bg-[#0a0e16]">
                <div className="mx-2 mt-[25px] mb-2.5 text-[#6b7889] font-mono text-[7px] tracking-[0.12em]">AGENT LIBRARY</div>
                {LIBRARY_AGENTS.map(({ name, status, icon: Icon }, i) => (
                  <div key={name} className={`flex items-center gap-2 p-[9px] border rounded-md ${i === 0 ? "border-white/[0.14] bg-[#171d2a]" : "border-transparent"}`}>
                    <span className={`flex w-[27px] h-[27px] items-center justify-center bg-[#121722] ${i === 0 ? "text-[#65e7ff]" : "text-[#6b7889]"}`}>
                      <Icon size={12} />
                    </span>
                    <span>
                      <strong className="block text-[8px] text-white">{name}</strong>
                      <small className="block mt-1 text-[#6b7889] text-[7px]">{status}</small>
                    </span>
                  </div>
                ))}
                
                <div className="mx-2 mt-[25px] mb-2.5 text-[#6b7889] font-mono text-[7px] tracking-[0.12em]">USAGE OVERVIEW</div>
                <div className="p-3 border border-white/[0.08] rounded-md">
                  <span className="flex items-end justify-between">
                    <small className="text-[#6b7889] text-[7px]">Illustrative credits</small>
                    <strong className="font-semibold text-[17px] text-white">1,250</strong>
                  </span>
                  <div className="h-[2px] mt-3 bg-white/[0.08]"><i className="block w-[62%] h-full bg-[#65e7ff]" /></div>
                  <p className="mt-2 mb-0 text-[#6b7889] text-[7px]">Sample interface data</p>
                </div>
                
                <div className="mx-2 mt-[25px] mb-2.5 text-[#6b7889] font-mono text-[7px] tracking-[0.12em]">TASK HISTORY</div>
                <div className="flex items-center gap-1.5 py-[9px] border-b border-white/[0.08] text-[#9aa8bc] text-[8px]">
                  <Check size={11} className="text-[#65e7ff]" />Research brief<small className="ml-auto text-[#6b7889] text-[7px]">Sample</small>
                </div>
                <div className="flex items-center gap-1.5 py-[9px] border-b border-white/[0.08] text-[#9aa8bc] text-[8px]">
                  <Check size={11} className="text-[#65e7ff]" />Audience summary<small className="ml-auto text-[#6b7889] text-[7px]">Sample</small>
                </div>
              </aside>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}