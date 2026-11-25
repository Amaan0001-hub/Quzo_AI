"use client";

import { useState, ReactNode, CSSProperties } from "react";
import { Info } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

/* ============================================================
   TYPES
   ============================================================ */
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

type CalculatorInputProps = {
  id: string;
  label: string;
  value: number;
  setValue: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
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
   Calculator Utilities
   ============================================================ */
const money = (value: number, decimals = 0) => 
  new Intl.NumberFormat("en-US", { 
    style: "currency", 
    currency: "USD", 
    maximumFractionDigits: decimals, 
    minimumFractionDigits: decimals 
  }).format(value);

function CalculatorInput({ id, label, value, setValue, min, max, step = 1, prefix = "" }: CalculatorInputProps) {
  const update = (next: string | number) => setValue(Math.max(min, Math.min(max, Number(next))));
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <label htmlFor={`${id}-number`} className="text-[#9aa8bc] text-[9px] sm:text-[10px] leading-[1.4] pr-2">{label}</label>
        <span className="flex items-center gap-[2px] sm:gap-[3px] p-1 sm:p-[7px_9px] border border-white/[0.08] rounded-[5px] bg-[#0f131c] flex-none">
          {prefix && <small className="text-[#6b7889] text-[8px] sm:text-[10px]">{prefix}</small>}
          <input 
            id={`${id}-number`} 
            type="number" 
            min={min} 
            max={max} 
            step={step} 
            value={value} 
            onChange={(e) => update(e.target.value)} 
            className="w-[50px] sm:w-[65px] p-0 border-0 outline-none bg-transparent text-[#f5f7ff] font-mono text-[10px] sm:text-[11px] font-medium text-right [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            data-testid={`${id}-number`}
          />
        </span>
      </div>
      
      <input 
        aria-label={`${label} slider`} 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={(e) => update(e.target.value)} 
        style={{ "--range-progress": `${((value - min) / (max - min)) * 100}%` } as CSSProperties} 
        className="w-full h-[2px] mt-[16px] sm:mt-[22px] rounded-none outline-none appearance-none cursor-pointer bg-[linear-gradient(90deg,#65e7ff_var(--range-progress),rgba(255,255,255,0.14)_var(--range-progress))] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0f131c] [&::-webkit-slider-thumb]:bg-[#65e7ff] [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_#65e7ff] [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#0f131c] [&::-moz-range-thumb]:bg-[#65e7ff]"
        data-testid={id} 
      />
      
      <div className="flex justify-between mt-[6px] sm:mt-[9px] text-[#6b7889] font-mono text-[6px] sm:text-[7px] leading-none">
        <span>{prefix}{min.toLocaleString()}</span>
        <span>{prefix}{max.toLocaleString()}</span>
      </div>
    </div>
  );
}

/* ============================================================
   Main Component: ValueCalculator
   ============================================================ */
export default function ValueCalculator() {
  const [team, setTeam] = useState<number>(8);
  const [employeeCost, setEmployeeCost] = useState<number>(6500);
  const [tasks, setTasks] = useState<number>(240);
  const [aiCost, setAiCost] = useState<number>(1200);
  
  const humanCost = team * employeeCost;
  const monthlyDifference = humanCost - aiCost;

  return (
    <section className="relative py-16 sm:py-[72px] lg:py-[92px] bg-[#070910] border-t border-white/[0.08]" id="calculator">
      <div className="w-[min(1240px,calc(100%-32px))] sm:w-[min(1240px,calc(100%-48px))] lg:w-[min(1240px,calc(100%-64px))] mx-auto grid grid-cols-1 lg:grid-cols-[0.68fr_1.32fr] items-start gap-8 sm:gap-12 lg:gap-[55px]">
        
        {/* Intro Side */}
        <div className="lg:sticky lg:top-[120px]">
          <SectionHeader 
            eyebrow="INTERACTIVE VALUE MODEL" 
            title="What Could You Accomplish With AI?" 
            copy="Explore a simple cost comparison using your own assumptions. Adjust every input to model a scenario relevant to your team." 
          />
          <div className="flex gap-2 sm:gap-3 mt-5 sm:mt-8 pt-4 sm:pt-[22px] border-t border-white/[0.08] text-[#6b7889]">
            <Info size={14} className="sm:hidden flex-none text-[#65e7ff] mt-0.5" />
            <Info size={17} className="hidden sm:block flex-none text-[#65e7ff] mt-0.5" />
            <p className="m-0 text-[9px] sm:text-[10px] leading-[1.6] sm:leading-[1.7]">All figures are user-adjustable estimates in USD. This is not a savings guarantee, platform quote, or representation of actual Velvora pricing.</p>
          </div>
        </div>

        {/* Calculator Frame */}
        <Reveal className="grid grid-cols-1 md:grid-cols-2 overflow-hidden border border-white/[0.08] rounded-lg sm:rounded-[11px] bg-[#0d1119] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          
          {/* Controls */}
          <div className="grid gap-5 sm:gap-7 p-4 sm:p-[25px] border-b md:border-b-0 md:border-r border-white/[0.08]">
            <CalculatorInput 
              id="calc-input-team-size" 
              label="Number of team members" 
              value={team} 
              setValue={setTeam} 
              min={1} 
              max={100} 
            />
            <CalculatorInput 
              id="calc-input-avg-salary" 
              label="Average monthly cost per employee" 
              value={employeeCost} 
              setValue={setEmployeeCost} 
              min={2000} 
              max={15000} 
              step={250} 
              prefix="$" 
            />
            <CalculatorInput 
              id="calc-input-monthly-tasks" 
              label="Estimated monthly tasks" 
              value={tasks} 
              setValue={setTasks} 
              min={20} 
              max={1000} 
              step={10} 
            />
            <CalculatorInput 
              id="calc-input-ai-cost" 
              label="Estimated monthly AI operating cost" 
              value={aiCost} 
              setValue={setAiCost} 
              min={100} 
              max={20000} 
              step={100} 
              prefix="$" 
            />
          </div>

          {/* Results */}
          <div className="flex flex-col min-w-0 p-4 sm:p-[25px] bg-[#0a0e16]">
            <div className="flex items-center justify-between gap-2 sm:gap-3 py-2 sm:py-2.5 text-[#6b7889] text-[8px] sm:text-[9px]">
              <span>Human labor cost assumption</span>
              <strong className="text-[#f5f7ff] font-semibold text-[11px] sm:text-[13px] leading-none" data-testid="calc-output-human-cost">
                {money(humanCost)}<small className="ml-[2px] sm:ml-[3px] text-[#6b7889] font-sans font-normal text-[6px] sm:text-[7px]">/month</small>
              </strong>
            </div>
            <div className="flex items-center justify-between gap-2 sm:gap-3 py-2 sm:py-2.5 text-[#6b7889] text-[8px] sm:text-[9px]">
              <span>AI operating cost assumption</span>
              <strong className="text-[#f5f7ff] font-semibold text-[11px] sm:text-[13px] leading-none" data-testid="calc-output-ai-cost">
                {money(aiCost)}<small className="ml-[2px] sm:ml-[3px] text-[#6b7889] font-sans font-normal text-[6px] sm:text-[7px]">/month</small>
              </strong>
            </div>
            
            <div className="relative h-[3px] sm:h-[4px] my-3 sm:my-4 mb-[20px] sm:mb-[30px] bg-white/[0.08]" aria-hidden="true">
              <span 
                className="block h-full bg-[#65e7ff] transition-[width] duration-[350ms] ease-out" 
                style={{ width: `${Math.min(100, (aiCost / Math.max(humanCost, aiCost)) * 100)}%` }} 
              />
            </div>
            
            <div className="py-4 sm:py-[25px] border-y border-white/[0.08]">
              <span className="text-[#9aa8bc] text-[9px] sm:text-[10px]">Estimated monthly cost difference</span>
              <strong className="block my-2 sm:my-3 mb-1.5 sm:mb-2 text-[#f5f7ff] font-semibold text-[clamp(1.6rem,5vw,3.4rem)] leading-none tracking-[-0.04em]" data-testid="calc-output-monthly-diff">
                {money(monthlyDifference)}
              </strong>
              <small className="text-[#6b7889] text-[7px] sm:text-[8px] leading-[1.4]">Human cost assumption minus AI cost assumption</small>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-[15px] mt-auto pt-4 sm:pt-[25px]">
              <div>
                <span className="block min-h-[20px] sm:min-h-[25px] text-[#6b7889] text-[7px] sm:text-[8px] leading-[1.4] sm:leading-[1.5]">Estimated annual difference</span>
                <strong className="block mt-1.5 sm:mt-[9px] font-semibold text-[14px] sm:text-[18px] leading-none text-[#f5f7ff]" data-testid="calc-output-annual-diff">
                  {money(monthlyDifference * 12)}
                </strong>
              </div>
              <div className="pl-3 sm:pl-[15px] border-l border-white/[0.08]">
                <span className="block min-h-[20px] sm:min-h-[25px] text-[#6b7889] text-[7px] sm:text-[8px] leading-[1.4] sm:leading-[1.5]">Estimated AI cost per task</span>
                <strong className="block mt-1.5 sm:mt-[9px] font-semibold text-[14px] sm:text-[18px] leading-none text-[#f5f7ff]" data-testid="calc-output-cost-per-task">
                  {money(aiCost / tasks, 2)}
                </strong>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}