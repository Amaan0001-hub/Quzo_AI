"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bot, Brain, Check, Clock, Command, Copy, Download, Eye, FileText, History, Loader2, Lock, Play, Radio, RotateCcw, Search, Send, Sparkles, Square, ThumbsDown, ThumbsUp, WifiOff, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AGENTS, type Block } from "./components/agents";
import { BlockView, toMarkdown, toText } from "./components/Result";

// Custom CSS lives here (keyframes, pseudo-elements). Variables hataye gaye hain taaki dark: tailwind classes control karein.
const CSS = `
.qz button:focus-visible,.qz a:focus-visible,.qz input:focus-visible{outline:2px solid #22d3ee;outline-offset:2px}
.qz input{outline:none}
.qz button:disabled{cursor:not-allowed;opacity:.55}
.qz-spot:hover{background-image:radial-gradient(260px circle at var(--mx,50%) var(--my,50%),color-mix(in srgb,var(--glow,#22d3ee) 16%,transparent),transparent 70%)}
.qz-grid-bg{background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:36px 36px;-webkit-mask-image:radial-gradient(ellipse at 30% 20%,#000 20%,transparent 75%);mask-image:radial-gradient(ellipse at 30% 20%,#000 20%,transparent 75%)}
.qz-scroll{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.12) transparent}
.qz-skel{position:relative;overflow:hidden;background:rgba(255,255,255,.06);border-radius:1rem}
.qz-skel::after{content:"";position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent,rgba(255,255,255,.1),transparent);animation:qz-shimmer 1.4s infinite}
.qz-caret::after{content:"";display:inline-block;width:7px;height:1em;margin-left:3px;vertical-align:-2px;background:currentColor;animation:qz-blink 1s steps(2) infinite}

@keyframes qz-grow{from{width:0}}
.qz-grow{animation:qz-grow .9s cubic-bezier(.2,.8,.2,1)}
@keyframes qz-scan{from{transform:translateX(-100%)}to{transform:translateX(400%)}}
.qz-scan{animation:qz-scan 1.4s linear infinite}
@keyframes qz-drift{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(30px,20px,0) scale(1.08)}}
.qz-drift{animation:qz-drift 14s ease-in-out infinite}
@keyframes qz-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.12);opacity:.75}}
.qz-pulse{animation:qz-pulse 1.4s ease-in-out infinite}
@keyframes qz-shimmer{to{transform:translateX(100%)}}
@keyframes qz-blink{50%{opacity:0}}
@keyframes qz-pop{0%{transform:scale(.6);opacity:0}100%{transform:scale(1);opacity:1}}
.qz-pop{animation:qz-pop .25s ease-out}
@media (prefers-reduced-motion:reduce){
  .qz-grow,.qz-scan,.qz-drift,.qz-pulse,.qz-skel::after,.qz-caret::after,.qz-pop{animation:none}
}
`;

type Theme = "light" | "dark";
type Phase = "idle" | "thinking" | "writing" | "done" | "stopped";
type View = "preview" | "raw";
type Rating = "up" | "down" | null;
type Mode = "offline" | "live";
type Run = { id: number; agentId: string; taskIndex: number; secs: number; prompt?: string };
type LiveRun = { agentId: string; prompt: string; result: Block[]; notes: string[] };

const STATUS: Record<Phase, string> = {
  idle: "Waiting to run",
  thinking: "Thinking…",
  writing: "Writing the result…",
  done: "Complete · sample output",
  stopped: "Stopped",
};

/* ---------- Live mode: resolves any prompt against the demo data (no real AI call) ---------- */

const STOP = new Set(["the", "for", "and", "with", "from", "this", "that", "can", "you", "how", "what", "about", "please", "write", "make", "create", "build", "give", "show", "tell", "need", "want", "mujhe", "ek", "ka", "ki", "ke", "hai", "kar", "karo", "do"]);

const HINTS: Record<string, string> = {
  coding: "code api endpoint component react nextjs typescript function bug backend frontend database login website app script tailwind program developer",
  video: "video reel storyboard script scene film youtube shorts clip animation voiceover trailer",
  content: "blog article email post caption copy writing newsletter seo story headline intro essay",
  support: "customer support reply refund complaint ticket order delay helpdesk chat query issue",
  marketing: "campaign marketing ads advert promotion launch social budget audience brand growth",
  design: "design logo brand color palette layout ui ux screen mockup typography visual poster",
  finance: "budget finance cash flow expense profit revenue invoice accounting money cost tax",
  research: "research compare comparison study analysis market survey outline sources",
  sales: "sales lead pipeline follow-up outreach demo proposal deal client prospect crm",
  hr: "hr hiring job description interview onboarding recruit employee candidate resume",
  bi: "data analytics kpi dashboard region trend metrics churn insights intelligence",
  productivity: "plan schedule day meeting notes action items todo task productivity time focus",
};

const norm = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9ऀ-ॿ\s]/g, " ").split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map((t) => (t.length > 4 ? t.replace(/(ing|ed|es|s)$/, "") : t));

const overlap = (words: string[], text: string[]) =>
  words.filter((w) => text.some((t) => t === w || (w.length >= 4 && t.length >= 4 && (t.startsWith(w) || w.startsWith(t))))).length;

function resolveLive(raw: string, currentId: string): LiveRun {
  const prompt = raw.trim().slice(0, 500);
  const words = norm(prompt);
  const rank = AGENTS.map((a) => {
    const hint = overlap(words, norm(`${a.name} ${a.tagline} ${HINTS[a.id] ?? ""}`));
    const best = a.tasks
      .map((t, i) => ({ i, s: overlap(words, norm(t.prompt)) * 2 + overlap(words, norm(t.result.map((b) => (b.type === "heading" ? b.text : "")).join(" "))) }))
      .reduce((m, x) => (x.s > m.s ? x : m), { i: 0, s: 0 });
    return { a, total: hint + best.s, taskIdx: best.i, taskScore: best.s };
  });
  let pick = rank.find((r) => r.a.id === currentId) ?? rank[0];
  if (!pick) return { agentId: currentId, prompt, result: [], notes: [] };
  const top = rank.reduce((m, r) => (r.total > m.total ? r : m), pick);
  const routed = pick.total === 0 && top.total > 0;
  if (routed) pick = top;

  const task = pick.a.tasks[pick.taskIdx] ?? pick.a.tasks[0];
  const keywords = words.slice(0, 4).join(", ") || "none";
  const notes = [
    `Prompt received · keywords: ${keywords}`,
    routed ? `Smart routing → ${pick.a.name}` : `Using ${pick.a.name}`,
    pick.taskScore > 0 && task ? `Matched demo task: “${task.prompt}”` : "No exact demo match · building a general answer",
  ];

  const request: Block = { type: "text", text: `Your request: “${prompt}”` };
  const result: Block[] =
    pick.taskScore > 0 && task
      ? [request, ...task.result]
      : [
        { type: "heading", text: `${pick.a.name}: first draft` },
        request,
        { type: "text", text: "No demo task matches this request exactly, so this is the closest sample output from this agent. A production agent would work directly from your prompt." },
        { type: "list", items: pick.a.steps.map((s, i) => `Step ${i + 1}: ${s}`) },
        ...(task?.result ?? []),
      ];
  return { agentId: pick.a.id, prompt, result, notes };
}

/** Circular progress indicator. */
function Ring({ value, color }: { value: number; color: string }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" role="img" aria-label={`${value}% complete`}>
      <circle cx="20" cy="20" r={r} fill="none" stroke="currentColor" className="text-slate-200 dark:text-white/10" strokeWidth="3.5" />
      <circle
        cx="20" cy="20" r={r} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} transform="rotate(-90 20 20)"
        style={{ transition: "stroke-dashoffset .5s ease" }}
      />
      <text x="20" y="24" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor">{value}</text>
    </svg>
  );
}

export default function AiToolDemo() { // <-- data-theme prop hata diya taaki global dark mode control kare
  const reduced = useReducedMotion();

  const [agentId, setAgentId] = useState(AGENTS[0]?.id ?? "");
  const [taskIndex, setTaskIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0); // completed thinking steps
  const [stepTimes, setStepTimes] = useState<number[]>([]);
  const [shown, setShown] = useState(0); // visible result blocks
  const [seconds, setSeconds] = useState(0);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<View>("preview");
  const [rating, setRating] = useState<Rating>(null);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<Run[]>([]);
  const [mode, setMode] = useState<Mode>("offline");
  const [liveModalOpen, setLiveModalOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [liveRun, setLiveRun] = useState<LiveRun | null>(null);

  const consoleRef = useRef<HTMLDivElement>(null);
  const startRef = useRef(0);

  // All hooks run before any early return (Rules of Hooks).
  const agent = AGENTS.find((a) => a.id === agentId) ?? AGENTS[0];
  const task = agent?.tasks[taskIndex] ?? agent?.tasks[0];
  const stepCount = agent?.steps.length ?? 0;
  const live = mode === "live" ? liveRun : null;
  const activeResult: Block[] = live?.result ?? task?.result ?? [];
  const blockCount = activeResult.length;
  const busy = phase === "thinking" || phase === "writing";

  const elapsed = () => (performance.now() - startRef.current) / 1000;

  // One timer drives the whole run; changing phase, agent or task cancels it.
  useEffect(() => {
    if (phase === "thinking") {
      const id = setTimeout(() => {
        if (step < stepCount) {
          setStepTimes((t) => [...t, elapsed()]);
          setStep(step + 1);
        } else setPhase("writing");
      }, step < stepCount ? 850 : 200);
      return () => clearTimeout(id);
    }
    if (phase === "writing") {
      const id = setTimeout(() => {
        if (shown < blockCount) setShown(shown + 1);
        else setPhase("done");
      }, 550);
      return () => clearTimeout(id);
    }
  }, [phase, step, shown, stepCount, blockCount]);

  useEffect(() => {
    if (!busy) return;
    const id = setInterval(() => setSeconds(elapsed()), 100);
    return () => clearInterval(id);
  }, [busy]);

  // Record finished runs in the session history.
  useEffect(() => {
    if (phase !== "done") return;
    setHistory((h) => [{ id: Date.now(), agentId, taskIndex, secs: elapsed(), prompt: mode === "live" ? live?.prompt : undefined }, ...h].slice(0, 6));
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(() => {
    setPhase("idle");
    setStep(0);
    setStepTimes([]);
    setShown(0);
    setSeconds(0);
    setCopied(false);
    setRating(null);
    setView("preview");
    setLiveRun(null);
  }, []);

  const run = useCallback(() => {
    if (mode === "live") {
      if (!prompt.trim()) return;
      const res = resolveLive(prompt, agentId);
      reset();
      setAgentId(res.agentId);
      setTaskIndex(0);
      setLiveRun(res);
    } else reset();
    startRef.current = performance.now();
    setPhase("thinking");
  }, [reset, mode, prompt, agentId]);

  const closeLiveMode = useCallback(() => {
    setLiveModalOpen(false);
  }, []);

  // Shortcuts: Ctrl/Cmd + Enter runs, Esc stops.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !busy && !liveModalOpen) {
        e.preventDefault();
        run();
      } else if (e.key === "Escape") {
        if (liveModalOpen) closeLiveMode();
        else if (busy) setPhase("stopped");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, run, liveModalOpen, closeLiveMode]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return AGENTS;
    return AGENTS.filter((a) => `${a.name} ${a.tagline} ${a.code}`.toLowerCase().includes(q));
  }, [query]);

  const stats = useMemo(
    () => [
      { label: "AI agents", value: AGENTS.length },
      { label: "Ready tasks", value: AGENTS.reduce((n, a) => n + a.tasks.length, 0) },
      { label: "Workflow steps", value: AGENTS.reduce((n, a) => n + a.steps.length, 0) },
    ],
    [],
  );

  if (!agent || !task) return <div className="p-6 text-center text-sm">No agents available.</div>;

  const pickAgent = (id: string, idx = 0) => {
    reset();
    setAgentId(id);
    setTaskIndex(idx);
    consoleRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
  };
  const switchMode = (m: Mode) => {
    if (m === "live") {
      setLiveModalOpen(true);
      return;
    }

    if (mode !== "offline") reset();
    setMode("offline");
    setLiveModalOpen(false);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toText(activeResult));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([toMarkdown(activeResult)], { type: "text/markdown" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `quzo-${mode}-${agent.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const spot = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const progress = phase === "idle" ? 0 : phase === "done" ? 100 : Math.round(((step + shown) / (stepCount + blockCount)) * 100);
  // Ghost button ko bhi tailwind dark classes diye hain
  const ghost = "bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 transition active:scale-95 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200";

  return (
    // Wrapper se data-theme hata diya aur direct Tailwind bg classes lagayi
    <div className="w-full min-w-0 overflow-hidden rounded-[2rem]  p-3 sm:p-6 ">
      <style>{CSS}</style>
      <div className="mx-auto max-w-6xl space-y-5">
        {/* ---------- hero ---------- */}
        <header className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-white p-6 text-black sm:p-10 dark:border-white/10 dark:bg-[#05070f] dark:text-white">
          <div className="qz-grid-bg pointer-events-none absolute inset-0 opacity-50 dark:opacity-100" />
          <div className="qz-drift absolute -left-20 -top-24 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl dark:bg-cyan-500/25" />
          <div className="qz-drift absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-violet-600/15 blur-3xl dark:bg-violet-600/35" style={{ animationDelay: "-6s" }} />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-800 backdrop-blur dark:border-white/15 dark:bg-white/5 dark:text-gray-100">
                <Sparkles className="h-3.5 w-3.5" /> AI Tool Demo
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
                Meet your <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent dark:from-cyan-400 dark:via-blue-400 dark:to-fuchsia-300">digital workforce.</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm text-slate-600 sm:text-base dark:text-slate-300">Choose an agent, pick a task and watch how it works from first step to finished result.</p>
              <p className="mt-4 inline-flex items-center gap-2 text-xs text-amber-600 dark:text-amber-300">
                <span className="qz-pulse h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-300" />
                {mode === "live" ? "Live mode: type any request. Steps are simulated and the answer is built from demo data, no real AI call." : "Interactive demo: steps are simulated and results are pre-written samples."}
              </p>
            </div>
            <div role="group" aria-label="Demo mode" className="inline-flex rounded-xl border border-black/10 bg-black/5 p-1 backdrop-blur dark:border-white/15 dark:bg-white/10">
              {(["offline", "live"] as const).map((m) => {
                const on = mode === m;
                const isLive = m === "live";
                return (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={isLive ? undefined : on}
                    aria-haspopup={isLive ? "dialog" : undefined}
                    onClick={() => switchMode(m)}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${on ? (isLive ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "bg-slate-900 text-white dark:bg-white dark:text-slate-900") : "text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"}`}
                  >
                    {isLive ? <Radio className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                    {isLive ? "Live mode" : "Offline mode"}
                    {isLive && on && <span className="qz-pulse h-1.5 w-1.5 rounded-full bg-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          <dl className="relative mt-8 grid grid-cols-3 gap-3 sm:max-w-lg">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-black/10 bg-black/5 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-white/5">
                <dd className="text-2xl font-extrabold tabular-nums">{s.value}</dd>
                <dt className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400">{s.label}</dt>
              </div>
            ))}
          </dl>
        </header>

        {/* ---------- agent picker ---------- */}
        <section aria-label="Choose an agent" className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-bold">Choose an agent <span className="text-slate-500 dark:text-slate-400 font-medium">· {filtered.length} of {AGENTS.length}</span></p>
            <label className="rounded-[1.25rem] border border-slate-200 bg-white shadow-sm transition-all duration-200 relative flex w-full items-center gap-2 px-3 py-2 sm:w-72 dark:border-white/12 dark:bg-[#0b1020]/90">
              <Search className="text-slate-400 h-4 w-4 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search agents…"
                aria-label="Search agents"
                className="w-full bg-transparent text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="text-slate-400">
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-[1.25rem] border border-slate-200 bg-white shadow-sm transition-all duration-200 text-slate-500 p-8 text-center text-sm dark:border-white/12 dark:bg-[#0b1020]/90 dark:text-slate-400">No agent matches “{query}”.</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 lg:grid-cols-4" role="group" aria-label="AI agents">
              {filtered.map((a) => {
                const active = a.id === agentId;
                return (
                  <button
                    key={a.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => pickAgent(a.id)}
                    onMouseMove={spot}
                    className="rounded-[1.25rem] border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-[3px] motion-reduce:hover:translate-y-0 qz-spot relative overflow-hidden p-4 text-left dark:border-white/12 dark:bg-[#0b1020]/90"
                    style={{ ["--glow" as string]: a.color, ...(active ? { borderColor: a.color, boxShadow: `0 0 0 1px ${a.color}, 0 14px 40px -16px ${a.color}` } : {}) }}
                  >
                    <span className="mb-3 inline-flex rounded-xl p-2.5 text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${a.color}, #4338ca)` }}>
                      <a.Icon className="h-5 w-5" />
                    </span>
                    <span className="text-slate-400 absolute right-3 top-3 text-[10px] font-semibold tracking-widest">{a.code}</span>
                    {active && <span className="qz-pop absolute bottom-3 right-3 flex h-5 w-5 items-center justify-center rounded-full text-white" style={{ background: a.color }}><Check className="h-3 w-3" /></span>}
                    <span className="block text-sm font-bold">{a.name}</span>
                    <span className="text-slate-500 block text-xs dark:text-slate-400">{a.tagline}</span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* ---------- console ---------- */}
        <div ref={consoleRef} className="rounded-[1.25rem] border border-slate-200 bg-white shadow-sm transition-all duration-200 p-4 sm:p-6 dark:border-white/12 dark:bg-[#0b1020]/90 dark:backdrop-blur-md">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-xl p-2.5 text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${agent.color}, #4338ca)` }}>
              <agent.Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold">{agent.name}</p>
              <p className="text-slate-500 text-xs dark:text-slate-400">{mode === "live" ? "Describe what you need in your own words" : "Select a task to run"}</p>
            </div>
          </div>
          {mode === "live" ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 transition focus-within:border-cyan-500 dark:border-white/12 dark:bg-white/5">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      if (!busy) run();
                    }
                  }}
                  rows={3}
                  maxLength={500}
                  placeholder={`Ask ${agent.name} anything… e.g. ${agent.tasks[0]?.prompt ?? ""}`}
                  aria-label="Your prompt"
                  className="w-full resize-none bg-transparent text-sm leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-slate-500 text-xs tabular-nums dark:text-slate-400">{prompt.length}/500 · Enter to send, Shift+Enter for a new line</span>
                  {busy ? (
                    <button type="button" onClick={() => setPhase("stopped")} className="rounded-[1.25rem] border border-slate-200 bg-white shadow-sm transition-all duration-200 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold dark:border-white/12 dark:bg-[#0b1020]/90 dark:text-white">
                      <Square className="h-4 w-4" /> Stop <span className="rounded-md border border-current px-1.5 py-[3px] font-mono text-[10px] font-semibold leading-none opacity-70">Esc</span>
                    </button>
                  ) : (
                    <button type="button" onClick={run} disabled={!prompt.trim()} className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30 transition hover:brightness-110 active:scale-95 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold">
                      {phase === "idle" ? <Send className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                      {phase === "idle" ? "Run live" : "Run again"}
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-500 text-xs font-semibold dark:text-slate-400">Try:</span>
                {agent.tasks.map((t) => (
                  <button key={t.prompt} type="button" onClick={() => setPrompt(t.prompt)} className="bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 transition active:scale-95 rounded-full px-3 py-1.5 text-left text-xs font-medium">
                    {t.prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-3 grid gap-2 sm:grid-cols-2">
                {agent.tasks.map((t, i) => {
                  const on = i === taskIndex;
                  return (
                    <button
                      key={t.prompt}
                      type="button"
                      aria-pressed={on}
                      onClick={() => { reset(); setTaskIndex(i); }}
                      className="border-slate-200 dark:border-white/12 flex items-start gap-3 rounded-2xl border p-3 text-left text-sm transition hover:-translate-y-0.5"
                      style={on ? { borderColor: agent.color, background: "color-mix(in srgb, var(--tw-shadow-color, currentColor) 5%, transparent)", boxShadow: `0 0 0 1px ${agent.color}` } : undefined}
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold" style={on ? { background: agent.color, borderColor: agent.color, color: "#fff" } : { borderColor: "var(--tw-border-opacity, currentColor)" }}>
                        {on ? <Check className="h-3 w-3" /> : i + 1}
                      </span>
                      {t.prompt}
                    </button>
                  );
                })}
              </div>
              <div className="bg-slate-50 dark:bg-white/5 flex flex-wrap items-center gap-3 rounded-2xl p-3">
                <p className="min-w-0 flex-[1_1_220px] text-sm font-medium">{task.prompt}</p>
                {busy ? (
                  <button type="button" onClick={() => setPhase("stopped")} className="rounded-[1.25rem] border border-slate-200 bg-white shadow-sm transition-all duration-200 inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold dark:border-white/12 dark:bg-[#0b1020]/90 dark:text-white">
                    <Square className="h-4 w-4" /> Stop <span className="rounded-md border border-current px-1.5 py-[3px] font-mono text-[10px] font-semibold leading-none opacity-70">Esc</span>
                  </button>
                ) : (
                  <button type="button" onClick={run} className="bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110 active:scale-95 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold">
                    {phase === "idle" ? <Play className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                    {phase === "idle" ? "Run agent" : "Run again"}
                    <span className="rounded-md border border-current px-1.5 py-[3px] font-mono text-[10px] font-semibold leading-none opacity-70 hidden items-center gap-0.5 sm:inline-flex"><Command className="h-2.5 w-2.5" />↵</span>
                  </button>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="border-slate-300 dark:border-white/12 flex min-w-0 flex-[1_1_260px] items-center gap-2 rounded-xl border border-dashed px-3 py-2">
                  <Lock className="text-slate-400 h-4 w-4 shrink-0" />
                  <input disabled placeholder="Write your own prompt…" aria-label="Custom prompt (locked)" className="w-full bg-transparent text-sm placeholder:text-slate-400" />
                </div>
                <p className="text-slate-500 text-xs dark:text-slate-400">
                  To write your own prompts, <Link href="#" className="text-cyan-600 dark:text-cyan-400 font-semibold underline">buy an agent license</Link>
                </p>
              </div>

            </>
          )}

          {history.length > 0 && (
            <div className="border-slate-200 dark:border-white/12 mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
              <span className="text-slate-500 inline-flex items-center gap-1.5 text-xs font-semibold dark:text-slate-400"><History className="h-3.5 w-3.5" /> Recent runs</span>
              {history.map((h) => {
                const a = AGENTS.find((x) => x.id === h.agentId);
                if (!a) return null;
                return (
                  <button key={h.id} type="button" onClick={() => { pickAgent(h.agentId, h.taskIndex); setMode(h.prompt ? "live" : "offline"); if (h.prompt) setPrompt(h.prompt); }} className="bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 transition active:scale-95 inline-flex items-center gap-1.5 rounded-full py-1 pl-2 pr-3 text-xs font-medium" title={h.prompt ?? a.tasks[h.taskIndex]?.prompt}>
                    <span className="h-2 w-2 rounded-full" style={{ background: a.color }} />
                    {a.name}
                    <span className="text-slate-500 tabular-nums dark:text-slate-400">{h.secs.toFixed(1)}s</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ---------- thinking + results ---------- */}
        <div className="flex flex-wrap items-start gap-5">
          <section className="rounded-[1.25rem] border border-slate-200 bg-white shadow-sm transition-all duration-200 min-w-0 flex-[1_1_300px] overflow-hidden dark:border-white/12 dark:bg-[#0b1020]/90 dark:backdrop-blur-md" aria-label="Thinking process">
            <div className="border-slate-200 dark:border-white/12 flex items-center justify-between gap-3 border-b p-4">
              <div className="flex items-center gap-3">
                <Ring value={progress} color={agent.color} />
                <div>
                  <p className="flex items-center gap-2 text-sm font-bold">
                    <Brain className="h-4 w-4" style={{ color: agent.color }} /> AI Thinking Process
                  </p>
                  <p className="text-slate-500 text-xs dark:text-slate-400">{step}/{stepCount} steps · {shown}/{blockCount} blocks</p>
                </div>
              </div>
              <p className="text-slate-500 inline-flex items-center gap-1 text-xs tabular-nums dark:text-slate-400"><Clock className="h-3.5 w-3.5" />{seconds.toFixed(1)}s</p>
            </div>
            <div className="bg-slate-100 dark:bg-white/5 relative h-1 overflow-hidden">
              <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, background: agent.color }} />
              {busy && <div className="qz-scan absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/70 to-transparent" />}
            </div>
            {live && (
              <div className="border-slate-200 dark:border-white/12 border-b p-4">
                <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest dark:text-slate-400">Your prompt</p>
                <p className="mt-1 break-words text-sm">{live.prompt}</p>
              </div>
            )}
            <ol className="p-3">
              {agent.steps.map((s, i) => {
                const done = i < step;
                const now = phase === "thinking" && i === step;
                return (
                  <li key={s} className="relative">
                    {i < stepCount - 1 && <span className="absolute bottom-[-4px] left-[21px] top-9 w-px" style={{ background: done ? "#059669" : "currentColor", opacity: done ? 1 : 0.2 }} aria-hidden />}
                    <div className={`flex items-center gap-3 rounded-xl p-2 text-sm transition-colors ${now ? "bg-slate-100 dark:bg-white/5 font-semibold" : done ? "" : "text-slate-500 dark:text-slate-400"}`}>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs" style={done ? { background: "#059669", borderColor: "#059669", color: "#fff" } : now ? { borderColor: agent.color, color: agent.color } : { borderColor: "currentColor", opacity: 0.2 }}>
                        {done ? <Check className="h-4 w-4" /> : now ? <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" /> : i + 1}
                      </span>
                      <span className="flex-1">{s}</span>
                      {done && stepTimes[i] !== undefined && <span className="text-slate-500 text-[11px] tabular-nums dark:text-slate-400">{stepTimes[i].toFixed(1)}s</span>}
                    </div>
                  </li>
                );
              })}
            </ol>
            {(stepTimes.length > 0 || live) && (
              <div className="border-slate-200 dark:border-white/12 border-t p-3">
                <div className="qz-scroll max-h-36 overflow-y-auto rounded-xl bg-slate-900 p-3 font-mono text-[11px] leading-relaxed text-slate-300 dark:bg-[#050813]" aria-label="Activity log">
                  {live?.notes.map((n, i) => (
                    <p key={`n${i}`}><span className="text-slate-500">[0.0s]</span> <span className="text-cyan-400">›</span> {n}</p>
                  ))}
                  {stepTimes.map((t, i) => (
                    <p key={i}><span className="text-slate-500">[{t.toFixed(1)}s]</span> <span className="text-emerald-400">✓</span> {agent.steps[i]}</p>
                  ))}
                  {phase === "writing" && <p className="qz-caret"><span className="text-slate-500">[{seconds.toFixed(1)}s]</span> composing output</p>}
                  {phase === "done" && <p><span className="text-slate-500">[{seconds.toFixed(1)}s]</span> <span className="text-cyan-400">done</span></p>}
                </div>
              </div>
            )}
          </section>

          <section className="rounded-[1.25rem] border border-slate-200 bg-white shadow-sm transition-all duration-200 min-w-0 flex-[2_1_420px] overflow-hidden dark:border-white/12 dark:bg-[#0b1020]/90 dark:backdrop-blur-md" aria-label="Generated results">
            <div className="border-slate-200 dark:border-white/12 flex flex-wrap items-center justify-between gap-2 border-b p-4">
              <div>
                <p className="text-sm font-bold">Generated Results</p>
                <p className="text-slate-500 flex items-center gap-1.5 text-xs dark:text-slate-400" aria-live="polite">
                  <span className={`h-1.5 w-1.5 rounded-full ${busy ? "qz-pulse" : ""}`} style={{ background: phase === "done" ? "#10b981" : phase === "stopped" ? "#f43f5e" : busy ? agent.color : "currentColor" }} />
                  {phase === "done" && mode === "live" ? "Complete · generated from demo data" : STATUS[phase]}
                </p>
              </div>
              {phase === "done" && (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="bg-slate-100 dark:bg-white/5 flex rounded-lg p-0.5" role="tablist" aria-label="Result view">
                    {([["preview", Eye, "Preview"], ["raw", FileText, "Text"]] as const).map(([id, Icon, label]) => (
                      <button key={id} type="button" role="tab" aria-selected={view === id} onClick={() => setView(id)} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold" style={view === id ? { background: "white", color: agent.color } : undefined}>
                        <Icon className="h-3.5 w-3.5" /> {label}
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={copy} className={ghost}>
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy"}
                  </button>
                  <button type="button" onClick={download} className={ghost}>
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                </div>
              )}
            </div>

            <div className="min-h-[320px] space-y-4 p-4 sm:p-6">
              {shown === 0 && (
                <div className="text-slate-500 flex min-h-[270px] flex-col items-center justify-center gap-3 text-center text-sm dark:text-slate-400">
                  <span className={`rounded-2xl p-4 ${busy ? "qz-pulse" : ""}`} style={{ background: `color-mix(in srgb, ${agent.color} 14%, transparent)` }}>
                    <agent.Icon className="h-10 w-10" style={{ color: agent.color }} />
                  </span>
                  {busy ? `${agent.name} is working on your task` : phase === "stopped" ? "Run stopped. Press Run again to restart." : (mode === "live" ? "Type your prompt above and press Run live to see the result here." : "Press Run agent to see the result here.")}
                  {phase === "idle" && <span className="rounded-md border border-current px-1.5 py-[3px] font-mono text-[10px] font-semibold leading-none opacity-70">Ctrl / ⌘ + Enter</span>}
                </div>
              )}

              {view === "raw" && phase === "done" ? (
                <pre className="bg-slate-50 dark:bg-white/5 qz-scroll overflow-x-auto whitespace-pre-wrap rounded-2xl p-4 font-mono text-xs leading-relaxed">{toText(activeResult)}</pre>
              ) : (
                <>
                  <AnimatePresence initial={false}>
                    {activeResult.slice(0, shown).map((block, i) => (
                      <motion.div key={`${agent.id}-${taskIndex}-${i}`} initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }}>
                        <BlockView block={block} color={agent.color} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {phase === "writing" && shown > 0 && shown < blockCount && <div className="qz-skel h-20" aria-hidden />}
                </>
              )}
            </div>

            {phase === "done" && (
              <div className="border-slate-200 dark:border-white/12 flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-xs sm:px-6">
                <p className="text-slate-500 dark:text-slate-400">Sample output · finished in {seconds.toFixed(1)}s</p>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Was this useful?</span>
                  {(["up", "down"] as const).map((r) => (
                    <button key={r} type="button" aria-pressed={rating === r} aria-label={r === "up" ? "Helpful" : "Not helpful"} onClick={() => setRating(rating === r ? null : r)} className="bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 transition active:scale-95 rounded-lg p-2" style={rating === r ? { background: agent.color, color: "#fff" } : undefined}>
                      {r === "up" ? <ThumbsUp className="h-3.5 w-3.5" /> : <ThumbsDown className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                  {rating && <span className="qz-pop text-slate-500 dark:text-slate-400">Thanks for the feedback</span>}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
      {liveModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeLiveMode();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="live-mode-dialog-title"
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_24px_80px_rgba(2,8,23,0.35)] dark:border-white/10 dark:bg-[#0b1020]"
          >
            <div
              className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full opacity-20 blur-3xl"
              style={{ backgroundColor: agent.color }}
              aria-hidden="true"
            />
            <div className="relative">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${agent.color}, #4338ca)` }}
                  >
                    <Bot className="h-7 w-7" />
                  </span>
                  <div>
                    <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300">
                      <Radio className="h-3 w-3" />
                      Live Mode
                    </span>
                    <h2 id="live-mode-dialog-title" className="text-2xl font-extrabold tracking-tight">Coming Soon</h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeLiveMode}
                  aria-label="Close"
                  className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Live Mode is coming soon. We&apos;re working on a smarter, real-time AI experience.
              </p>
              <button
                type="button"
                onClick={closeLiveMode}
                className="mt-7 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110 active:scale-[0.99]"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}