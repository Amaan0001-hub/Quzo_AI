"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  type LucideIcon,
  ChartNoAxesCombined,
  Coins,
  ArrowDownToLine,
  Plus,
  Gift,
  Gauge,
  BadgeCheck,
  ShieldCheck,
  Wallet,
  Users,
  TrendingUp,
  TrendingDown,
  LayoutGrid,
  Bell,
  CircleDollarSign,
  Settings,
  Briefcase,
  Layers,
  Sparkles,
  Globe,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

/* ============================================================
   DUMMY DATA & CONSTANTS
   ============================================================ */

// Global AI Market Data
const MARKET_VIEWS = {
  spending: {
    tab: "AI spending",
    note: "Worldwide AI spending, US$ trillion. 2026 and 2027 are forecasts. Source: Gartner, Sep 2026.",
    unit: "T",
    data: [
      { year: "2025", v: 1.79 },
      { year: "2026", v: 2.67 },
      { year: "2027", v: 3.64 },
    ],
  },
  market: {
    tab: "AI market size",
    note: "Global AI market size, US$ trillion. 2033 is a projection; only these two points are shown. Source: UNCTAD.",
    unit: "T",
    data: [
      { year: "2023", v: 0.189 },
      { year: "2033", v: 4.8 },
    ],
  },
  jobs: {
    tab: "Jobs by 2030",
    note: "Projected jobs by 2030, millions, all industries and all drivers. Source: WEF Future of Jobs 2025.",
    unit: "M",
    data: [
      { year: "Created", v: 170 },
      { year: "Displaced", v: 92 },
      { year: "Net", v: 78 },
    ],
  },
};

const MARKET_STATS = [
  {
    value: "$2.67T",
    label: "Projected worldwide AI spending",
    type: "Spending",
    year: "2026",
    source: "Gartner, Sep 2026",
  },
  {
    value: "$4.8T",
    label: "Projected global AI market size",
    type: "Market size",
    year: "2033",
    source: "UNCTAD, 2025",
  },
  {
    value: "78M",
    label: "Net new jobs, all industries",
    type: "Employment",
    year: "By 2030",
    source: "WEF Future of Jobs 2025",
  },
  {
    value: "170M",
    label: "New jobs created, all industries",
    type: "Employment",
    year: "By 2030",
    source: "WEF Future of Jobs 2025",
  },
];
function parseMarketValue(v: string) {
  const prefix = v.startsWith("$") ? "$" : "";
  const suffix = v.includes("T") ? "T" : v.includes("M") ? "M" : "";
  const num = Number(v.replace(/[^0-9.]/g, ""));
  return { num, prefix, suffix };
}

/* ---------- INCOME: ---------- */
const INCOME_SERIES = [
  ["yield", "Yield", "var(--c1)"],
  ["performance", "Performance", "var(--c2)"],
  ["affiliate", "Affiliate", "var(--c3)"],
] as const;

type IncomeRangeKey = "7D" | "30D" | "90D" | "1Y";

const INCOME_RANGES: Record<
  IncomeRangeKey,
  {
    label: string;
    total: string;
    growth: number;
    data: { label: string; yield: number; performance: number; affiliate: number }[];
  }
> = {
  "7D": {
    label: "7 Days",
    total: "$320.50",
    growth: 5.2,
    data: [
      { label: "Day 1", yield: 25, performance: 10, affiliate: 5 },
      { label: "Day 2", yield: 30, performance: 15, affiliate: 5 },
      { label: "Day 3", yield: 20, performance: 12, affiliate: 8 },
      { label: "Day 4", yield: 35, performance: 18, affiliate: 10 },
      { label: "Day 5", yield: 40, performance: 20, affiliate: 12 },
      { label: "Day 6", yield: 30, performance: 15, affiliate: 8 },
      { label: "Day 7", yield: 45, performance: 22, affiliate: 15 },
    ],
  },
  "30D": {
    label: "30 Days",
    total: "$1,328.00",
    growth: 11.8,
    data: [
      { label: "Wk 1", yield: 125, performance: 50, affiliate: 30 },
      { label: "Wk 2", yield: 150, performance: 65, affiliate: 35 },
      { label: "Wk 3", yield: 140, performance: 60, affiliate: 40 },
      { label: "Wk 4", yield: 160, performance: 70, affiliate: 35 },
      { label: "Wk 5", yield: 180, performance: 80, affiliate: 45 },
    ],
  },
  "90D": {
    label: "90 Days",
    total: "$4,150.00",
    growth: 24.5,
    data: [
      { label: "Mo 1", yield: 450, performance: 200, affiliate: 120 },
      { label: "Mo 2", yield: 520, performance: 250, affiliate: 150 },
      { label: "Mo 3", yield: 600, performance: 300, affiliate: 180 },
    ],
  },
  "1Y": {
    label: "1 Year",
    total: "$18,500.00",
    growth: 45.2,
    data: [
      { label: "Q1", yield: 1500, performance: 800, affiliate: 400 },
      { label: "Q2", yield: 1800, performance: 900, affiliate: 500 },
      { label: "Q3", yield: 2200, performance: 1100, affiliate: 600 },
      { label: "Q4", yield: 2500, performance: 1200, affiliate: 700 },
    ],
  },
};

const INCOME_RANGE_TABS: [IncomeRangeKey, string][] = [
  ["7D", "7 Days"],
  ["30D", "30 Days"],
  ["90D", "90 Days"],
  ["1Y", "1 Year"],
];

// Recharts shared config 
const TIP = {
  contentStyle: {
    background: "var(--card)",
    border: "1px solid var(--line)",
    borderRadius: 12,
    fontSize: 12,
  },
  itemStyle: { color: "var(--ink)" },
  labelStyle: { color: "var(--ink)" },
};
const AXIS = {
  stroke: "var(--muted)",
  tickLine: false,
  axisLine: false,
  fontSize: 11,
};
const money = (v: unknown) => `$${Number(v).toLocaleString("en-US")}`;

const RECENT_TX = [
  { type: "Performance income", date: "24 Nov · Credited", amount: "+$42.60" },
  { type: "Affiliate income", date: "23 Nov · Credited", amount: "+$60.00" },
  { type: "Yield income", date: "22 Nov · Pending", amount: "+$28.40" },
  { type: "Affiliate income", date: "20 Nov · Credited", amount: "+$35.00" },
];

const LEVEL_INCOME = [
  { level: "Level 1", members: "14 members", value: "$48,200", percent: 100 },
  { level: "Level 2", members: "21 members", value: "$32,100", percent: 75 },
  { level: "Level 3", members: "13 members", value: "$16,100", percent: 40 },
];

const AFFILIATE_STATS = [
  { label: "Direct Referrals", value: "14" },
  { label: "Total Team Members", value: "48" },
  { label: "Active Members", value: "36" },
  { label: "Team Business Volume", value: "$96,400" },
];

const RECENT_JOINED = [
  { name: "Sample Member A", level: 1, joined: "Today", status: "Active" },
  { name: "Sample Member B", level: 2, joined: "Yesterday", status: "Active" },
  { name: "Sample Member C", level: 1, joined: "3 days ago", status: "Inactive" },
  { name: "Sample Member D", level: 3, joined: "5 days ago", status: "Active" },
];

const OPPORTUNITIES = [
  {
    title: "AI Agents License",
    desc: "Access curated AI services using x402 payments and earn commissions.",
    icon: Bot,
  },
  {
    title: "Vendor Deployment",
    desc: "Deploy your AI tools on the marketplace, list services and receive payments.",
    icon: LayoutGrid,
  },
  {
    title: "Affiliate Program",
    desc: "Earn rewards by inviting new users to join the ecosystem.",
    icon: Users,
  },
  {
    title: "AI Agent Services",
    desc: "Launch AI service requests and connect with enterprise users.",
    icon: Sparkles,
  },
];

const QUICK_LINKS = [
  { label: "My OTC", icon: CircleDollarSign },
  { label: "My Coins", icon: Coins },
  { label: "My Customers", icon: Users },
  { label: "My Payouts", icon: Wallet },
  { label: "My Team", icon: Users },
  { label: "My Vendors", icon: Briefcase },
  { label: "My Plans", icon: Layers },
  { label: "My Assets", icon: Settings },
];

const NOTIFICATIONS = [
  {
    title: "Income credited",
    desc: "A yield deposit has been added",
    time: "2 min ago",
    icon: "plus",
  },
  {
    title: "Your team has completed a business milestone",
    desc: "New tier unlocked for your team",
    time: "1 hr ago",
    icon: "trophy",
  },
  {
    title: "Your AI agent deployment has been approved.",
    desc: "Ready to start accepting service requests",
    time: "3 hrs ago",
    icon: "bot",
  },
];

/* ---------- Inline Reveal + Counter ---------- */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function Counter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setN(value);
      return;
    }
    const controls = animate(from.current, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => {
        from.current = v;
        setN(v);
      },
    });
    return () => controls.stop();
  }, [inView, value, reduced]);

  return (
    <span ref={ref}>
      {prefix}
      {n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ============================================================
   SUB-COMPONENT: Income Range Tabs
   ============================================================ */
function IncomeRangeTabs({
  value,
  onChange,
}: {
  value: IncomeRangeKey;
  onChange: (r: IncomeRangeKey) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Income time range">
      {INCOME_RANGE_TABS.map(([key, text]) => (
        <button
          key={key}
          type="button"
          aria-pressed={value === key}
          onClick={() => onChange(key)}
          className={`rounded-full border px-4 py-1.5 text-[11px] font-semibold transition active:scale-95 ${
            value === key
              ? "border-[#6b4eff] bg-[#6b4eff] text-white"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#07242e] dark:text-slate-300"
          }`}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

/* ============================================================
   SECTION: Income Overview 
   ============================================================ */
function IncomeOverviewSection() {
  const [range, setRange] = useState<IncomeRangeKey>("30D");
  const reduced = useReducedMotion();
  const r = INCOME_RANGES[range];

  const totals = INCOME_SERIES.map(([key, name, color]) => ({
    name,
    color,
    value: r.data.reduce((s, p) => s + p[key], 0),
  }));
  const total = totals.reduce((s, t) => s + t.value, 0);
  const up = r.growth >= 0;
  const Trend = up ? TrendingUp : TrendingDown;

  return (
    <section>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#35d6c0]">
        Income Statistics
      </div>

      <div className="flex flex-col gap-6">
        {/* Header & Time Filters */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Your Income Overview
          </h2>
          <IncomeRangeTabs value={range} onChange={setRange} />
        </div>

        {/* Main Chart Card — Recharts stacked bars */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-[#153747] dark:bg-[#07242e]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="mb-1 text-[11px] text-slate-500">Income in selected period</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                <Counter value={Number(r.total.replace(/[^0-9.]/g, ""))} prefix="$" decimals={2} />
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold ${
                  up ? "text-[#12a594]" : "text-rose-500"
                }`}
                style={{
                  background: "color-mix(in srgb, currentColor 12%, transparent)",
                }}
              >
                <Trend className="h-3.5 w-3.5" />
                {up ? "+" : ""}
                {r.growth}%
              </span>
              <span className="text-[11px] text-slate-500">vs previous period</span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={r.data} margin={{ left: -8, right: 8 }}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" {...AXIS} />
                <YAxis {...AXIS} tickFormatter={money} />
                <Tooltip
                  {...TIP}
                  cursor={{ fill: "rgba(148,163,184,0.08)" }}
                  formatter={(v) => money(v)}
                />
                {INCOME_SERIES.map(([key, name, color], idx) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    name={name}
                    stackId="income"
                    fill={color}
                    stroke="var(--card)"
                    strokeWidth={2}
                    maxBarSize={36}
                    radius={idx === INCOME_SERIES.length - 1 ? [4, 4, 0, 0] : 0}
                    isAnimationActive={!reduced}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Custom legend: Affiliate · Performance · */}
          <div className="mt-3 flex justify-center gap-6">
            {[...INCOME_SERIES].reverse().map(([key, name, color]) => (
              <div
                key={key}
                className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300"
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                {name}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row: Income by source + Recent transactions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-[#153747] dark:bg-[#07242e]">
            <h3 className="mb-6 text-sm font-bold text-slate-900 dark:text-white">
              Income by source
            </h3>
            <div className="space-y-5">
              {totals.map((src) => {
                const pct = total ? Math.round((src.value / total) * 100) : 0;
                return (
                  <div key={src.name}>
                    <div className="mb-2 flex justify-between text-[11px]">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {src.name}
                      </span>
                      <span className="text-slate-500">
                        $<Counter value={src.value} decimals={2} /> · {pct}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: src.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-[#153747] dark:bg-[#07242e]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent transactions
              </h3>
              <a href="#" className="text-[11px] text-blue-600 hover:underline dark:text-blue-400">
                View all
              </a>
            </div>
            <div className="space-y-4">
              {RECENT_TX.map((tx, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0 dark:border-slate-800/50"
                >
                  <div>
                    <div className="mb-0.5 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                      {tx.type}
                    </div>
                    <div className="text-[10px] text-slate-400">{tx.date}</div>
                  </div>
                  <span
                    className={`text-[11px] font-bold ${
                      tx.date.includes("Pending")
                        ? "text-slate-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export function MemberHomeDashboard() {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/register?ref=DEMO1234`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const cards: [string, number, boolean, string, LucideIcon][] = [
    ["Total Income", 8420.75, true, "/reports", CircleDollarSign],
    ["Yield Wallet", 1240.5, true, "/wallet", Wallet],
    ["Performance Wallet", 386.2, true, "/wallet", Gauge],
    ["Deposit Wallet", 5000, true, "/wallet", ArrowDownToLine],
    ["Active Licenses", 3, false, "/agents", BadgeCheck],
    ["Total Team", 48, false, "/team", Users],
  ];
  const availableCredits = 31200;
  const totalCredits = 50000;
  const credits = Math.round((availableCredits / totalCredits) * 100);

  // State for Global AI Market Chart Tabs
  const [marketView, setMarketView] = useState<keyof typeof MARKET_VIEWS>("spending");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full bg-[#f4f7f9] font-sans text-[#06262f] selection:bg-[#12a594]/30 dark:bg-[#03161f] dark:text-[#e6f7f9]">
      {/* ================= HERO SECTION (COMPACT) ================= */}
      <div className="relative w-full overflow-hidden rounded-b-[2rem] bg-[#03161f] px-4 pb-12 pt-6 sm:px-6 md:px-8 lg:px-12">
        {/* Background Glow Effects */}
        <div className="pointer-events-none absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/4 rounded-full bg-[#12a594]/10 blur-[100px]" />
        <div className="pointer-events-none absolute right-1/4 top-0 h-[300px] w-[300px] rounded-full bg-[#35d6c0]/10 blur-[80px]" />

        {/* Subtle Grid Pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 mx-auto grid max-w-[1300px] grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* ================= LEFT CONTENT ================= */}
          <div className="relative z-20 flex flex-col items-start pt-4 lg:pt-0">
            {/* Top Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#12a594]/30 bg-[#12a594]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#35d6c0] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#35d6c0] shadow-[0_0_10px_#35d6c0]" />
              YOUR AI BUSINESS PANEL
            </div>

            {/* Heading */}
            <h1 className="mb-3 text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[3.2rem]">
              THE FUTURE IS NO LONGER COMING. <br />
              <span className="bg-gradient-to-r from-[#12a594] to-[#35d6c0] bg-clip-text text-transparent">
                {"IT'S HERE."}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mb-6 max-w-[480px] text-[13px] leading-relaxed text-slate-400 sm:text-[14px]">
              Discover the next generation of AI agents, autonomous robotics, intelligent automation
              and global business opportunities.
            </p>

            {/* Buttons */}
            <div className="relative z-20 flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#12a594] to-[#35d6c0] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(18,165,148,0.3)] transition-all hover:opacity-90">
                <Bot className="h-4 w-4" /> Explore AI Marketplace{" "}
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
              <button className="flex items-center gap-2 rounded-xl border border-[#12a594]/30 bg-white/5 px-5 py-2.5 text-[13px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10">
                <Globe className="h-4 w-4 text-[#35d6c0]" /> Discover Opportunities
              </button>
              <button className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-[13px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 sm:mt-0">
                <Sparkles className="h-4 w-4 text-[#12a594]" /> Deploy Agents
              </button>
            </div>
          </div>

          {/* ================= RIGHT ILLUSTRATION ================= */}
          <div className="relative z-10 flex h-[300px] items-center justify-center lg:h-[380px]">
            {/* Central Glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(18,165,148,0.15)_0%,transparent_60%)]" />

            {/* Floating Glassmorphism Cards */}
            <div className="absolute left-[0%] top-[5%] z-20 flex items-center gap-2.5 rounded-xl border border-[#12a594]/20 bg-[#03161f]/80 p-2.5 pr-4 shadow-lg backdrop-blur-xl lg:-left-[5%]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#12a594]/30 bg-[#0a2a33]">
                <Bot className="h-4 w-4 text-[#35d6c0]" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">AI Agents</div>
                <div className="text-[9px] text-[#84a2ad]">Digital workforce</div>
              </div>
            </div>

            <div className="absolute right-[0%] top-[0%] z-20 flex items-center gap-2.5 rounded-xl border border-[#12a594]/20 bg-[#03161f]/80 p-2.5 pr-4 shadow-lg backdrop-blur-xl lg:-right-[5%]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#12a594]/30 bg-[#0a2a33]">
                <Globe className="h-4 w-4 text-[#35d6c0]" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">Global Network</div>
                <div className="text-[9px] text-[#84a2ad]">Connected intelligence</div>
              </div>
            </div>

            <div className="absolute bottom-[15%] right-[0%] z-20 flex items-center gap-2.5 rounded-xl border border-[#12a594]/20 bg-[#03161f]/80 p-2.5 pr-4 shadow-lg backdrop-blur-xl lg:-right-[2%]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#12a594]/30 bg-[#0a2a33]">
                <LayoutGrid className="h-4 w-4 text-[#35d6c0]" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">Smart Factories</div>
                <div className="text-[9px] text-[#84a2ad]">Robotic production</div>
              </div>
            </div>

            <div className="absolute bottom-[5%] left-[0%] z-20 flex items-center gap-2.5 rounded-xl border border-[#12a594]/20 bg-[#03161f]/80 p-2.5 pr-4 shadow-lg backdrop-blur-xl lg:left-[2%]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#12a594]/30 bg-[#0a2a33]">
                <Globe className="h-4 w-4 text-[#35d6c0]" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">Autonomous Mobility</div>
                <div className="text-[9px] text-[#84a2ad]">Robo taxi and drones</div>
              </div>
            </div>

            <Image
              src="/quzo-hero-robot.webp"
              alt="QUZO AI Robot"
              width={400}
              height={400}
              priority
              className="relative z-10 h-auto w-[200px] animate-[float_6s_ease-in-out_infinite] object-contain drop-shadow-[0_0_40px_rgba(18,165,148,0.2)] lg:w-[300px]"
            />
          </div>
        </div>
      </div>

      {/* ================= OVERLAPPING STATS CARDS ================= */}
      <div className="w-full bg-[#f4f7f9] pb-8 dark:bg-[#03161f]">
        <div className="relative z-20 mx-auto -mt-10 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {/* Card 1: Total Income */}
            <Reveal delay={0}>
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-[#153747] dark:bg-[#07242e]">
                <div>
                  <p className="mb-1 text-[13px] font-medium text-slate-500 dark:text-slate-400">
                    Total Income
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    <Counter value={8420.75} prefix="$" decimals={2} />
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#12a594]/10">
                  <CircleDollarSign className="h-6 w-6 text-[#12a594]" />
                </div>
              </div>
            </Reveal>

            {/* Card 2: Yield Wallet */}
            <Reveal delay={0.05}>
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-[#153747] dark:bg-[#07242e]">
                <div>
                  <p className="mb-1 text-[13px] font-medium text-slate-500 dark:text-slate-400">
                    Yield Wallet
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    <Counter value={1240.5} prefix="$" decimals={2} />
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#12a594]/10">
                  <Wallet className="h-6 w-6 text-[#12a594]" />
                </div>
              </div>
            </Reveal>

            {/* Card 3: Performance Wallet */}
            <Reveal delay={0.1}>
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-[#153747] dark:bg-[#07242e]">
                <div>
                  <p className="mb-1 text-[13px] font-medium text-slate-500 dark:text-slate-400">
                    Performance Wallet
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    <Counter value={386.2} prefix="$" decimals={2} />
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#12a594]/10">
                  <TrendingUp className="h-6 w-6 text-[#12a594]" />
                </div>
              </div>
            </Reveal>

            {/* Card 4: Deposit Wallet */}
            <Reveal delay={0.15}>
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-[#153747] dark:bg-[#07242e]">
                <div>
                  <p className="mb-1 text-[13px] font-medium text-slate-500 dark:text-slate-400">
                    Deposit Wallet
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    <Counter value={5000} prefix="$" decimals={2} />
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#12a594]/10">
                  <ArrowDownToLine className="h-6 w-6 text-[#12a594]" />
                </div>
              </div>
            </Reveal>

            {/* Card 5: Active Licenses */}
            <Reveal delay={0.2}>
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-[#153747] dark:bg-[#07242e]">
                <div>
                  <p className="mb-1 text-[13px] font-medium text-slate-500 dark:text-slate-400">
                    Active Licenses
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    <Counter value={3} />
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#12a594]/10">
                  <ShieldCheck className="h-6 w-6 text-[#12a594]" />
                </div>
              </div>
            </Reveal>

            {/* Card 6: Total Team */}
            <Reveal delay={0.25}>
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-[#153747] dark:bg-[#07242e]">
                <div>
                  <p className="mb-1 text-[13px] font-medium text-slate-500 dark:text-slate-400">
                    Total Team
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    <Counter value={48} />
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#12a594]/10">
                  <Users className="h-6 w-6 text-[#12a594]" />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Bottom Bar: AI Credits Progress & Actions */}
          <div className="mt-4 flex flex-col items-center gap-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-[#153747] dark:bg-[#07242e] xl:flex-row">
            <div className="w-full flex-1">
              <div className="mb-3 flex justify-between text-[13px] font-medium text-slate-600 dark:text-slate-300">
                <span>AI credits available</span>
                <span className="text-slate-400">31,200 of 50,000</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-[#12a594] to-[#35d6c0]" />
              </div>
            </div>

            <div className="flex w-full shrink-0 items-center gap-3 xl:w-auto">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#12a594] to-[#35d6c0] px-6 py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(18,165,148,0.3)] transition-opacity hover:opacity-90 xl:flex-none">
                <Plus className="h-4 w-4" /> Add Funds
              </button>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 px-6 py-2.5 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 xl:flex-none">
                <ArrowDownToLine className="h-4 w-4" /> Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT GRID ================= */}
      <div className="mx-auto max-w-[1200px] space-y-6 px-4 py-8 sm:px-6 md:px-8 lg:px-12">
        {/* --- SECTION: INCOME STATISTICS  --- */}
        <IncomeOverviewSection />

        {/* --- SECTION: AFFILIATE TEAM GROWTH --- */}
        <section>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#35d6c0]">
            Affiliate
          </div>
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
            Affiliate Team Growth
          </h2>

          <div className="flex flex-col gap-6">
            {/* Referral Link Bar */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-[#153747] dark:bg-[#07242e] md:flex-row md:items-center">
              <div>
                <p className="mb-1 text-[11px] text-slate-500">Your referral link</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                http://localhost:3001/register?ref=DEMO1234
                </p>
              </div>
              <div className="flex w-full items-center gap-2 md:w-auto">
                <button
                  onClick={copyLink}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#35d6c0] px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#12a594] md:flex-none"
                >
                  {copied ? (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      Copy link
                    </>
                  )}
                </button>
                <button className="flex-1 rounded-xl bg-slate-100 px-4 py-2 text-[12px] font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 md:flex-none">
                  Affiliate dashboard
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {AFFILIATE_STATS.map((stat, i) => {
                const isMoney = stat.value.includes("$");
                const num = Number(stat.value.replace(/[^0-9.]/g, ""));
                return (
                  <Reveal key={i} delay={i * 0.05}>
                    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-[#153747] dark:bg-[#07242e]">
                      <p className="mb-1 text-[11px] text-slate-500">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        <Counter value={num} prefix={isMoney ? "$" : ""} />
                      </h3>
                    </div>
                  </Reveal>
                );
              })}
            </div>
            {/* Time Filters */}
            <div className="flex gap-2">
              {["7 Days", "30 Days", "90 Days", "1 Year"].map((t, i) => (
                <button
                  key={t}
                  className={`rounded-full border px-4 py-1.5 text-[11px] font-medium transition-colors ${
                    i === 1
                      ? "border-[#6b4eff] bg-[#6b4eff] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#07242e] dark:text-slate-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-[#153747] dark:bg-[#07242e]">
                <h4 className="mb-6 text-sm font-bold text-slate-900 dark:text-white">
                  Team members over time
                </h4>
                <div className="relative h-[220px] w-full">
                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-6">
                    {[60, 45, 30, 15, 0].map((val) => (
                      <div key={val} className="flex w-full items-center">
                        <span className="w-6 text-[10px] text-slate-400">{val}</span>
                        <div className="ml-2 flex-1 border-t border-slate-100 dark:border-slate-800"></div>
                      </div>
                    ))}
                  </div>

                  <div className="absolute inset-0 ml-8 pb-6">
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="h-full w-full overflow-visible"
                    >
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,50 L25,45 L50,40 L75,35 L100,30 L100,100 L0,100 Z"
                        fill="url(#chartGradient)"
                      />
                      <path
                        d="M0,50 L25,45 L50,40 L75,35 L100,30"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 flex justify-between pl-8">
                    {["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5"].map((label) => (
                      <span key={label} className="text-[10px] text-slate-400">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-[#153747] dark:bg-[#07242e]">
                <h4 className="mb-6 text-sm font-bold text-slate-900 dark:text-white">
                  Level-wise team
                </h4>
                <div className="space-y-6">
                  {LEVEL_INCOME.map((lvl, i) => (
                    <div key={i}>
                      <div className="mb-2 flex items-center justify-between text-[12px]">
                        <span className="text-slate-700 dark:text-slate-300">
                          {lvl.level} <span className="text-slate-400">· {lvl.members}</span>
                        </span>
                        <span className="font-semibold text-slate-600 dark:text-slate-400">
                          $<Counter value={Number(lvl.value.replace(/[^0-9.]/g, ""))} />
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-[#3b82f6]"
                          style={{ width: `${lvl.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Table: Recently joined */}
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-[#153747] dark:bg-[#07242e]">
              <div className="border-b border-slate-100 p-5 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recently joined
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 dark:border-slate-800 dark:bg-slate-800/20">
                      <th className="px-5 py-3 font-medium">Member</th>
                      <th className="w-24 px-5 py-3 text-center font-medium">Level</th>
                      <th className="px-5 py-3 font-medium">Joined</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {RECENT_JOINED.map((row, i) => (
                      <tr
                        key={i}
                        className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30"
                      >
                        <td className="px-5 py-4 font-semibold text-slate-800 dark:text-slate-200">
                          {row.name}
                        </td>
                        <td className="px-5 py-4 text-center text-slate-500">{row.level}</td>
                        <td className="px-5 py-4 text-slate-500">{row.joined}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                row.status === "Active" ? "bg-[#10b981]" : "bg-slate-400"
                              }`}
                            />
                            <span
                              className={`font-medium ${
                                row.status === "Active"
                                  ? "text-slate-700 dark:text-slate-300"
                                  : "text-slate-500"
                              }`}
                            >
                              {row.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION: BUSINESS OPPORTUNITIES --- */}
        <section>
          <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.15em] text-[#35d6c0]">
            Business Opportunities
          </div>
          <h2 className="mb-4 text-xl font-bold">Grow Your Business With Quzo</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {OPPORTUNITIES.map((opp, i) => (
              <div
                key={i}
                className="group cursor-pointer rounded-2xl border border-[#d9e8ec] bg-white p-5 shadow-sm transition-transform hover:-translate-y-1 dark:border-[#153747] dark:bg-[#07242e]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#3b82f6]/10 transition-colors group-hover:bg-[#3b82f6]/20">
                  <opp.icon className="h-5 w-5 text-[#3b82f6]" />
                </div>
                <h3 className="mb-2 text-sm font-bold">{opp.title}</h3>
                <p className="mb-4 text-[11px] leading-relaxed text-slate-500">{opp.desc}</p>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-[#12a594] transition-all group-hover:gap-2">
                  Explore <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION: QUICK LINKS --- */}
        <section>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#35d6c0]">
            Quick Links
          </div>
          <h2 className="mb-4 text-xl font-bold">Your Business Command Center</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
            {QUICK_LINKS.map((link, i) => (
              <button
                key={i}
                className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-[#d9e8ec] bg-white p-3 transition-colors hover:border-[#3b82f6] dark:border-[#153747] dark:bg-[#07242e] dark:hover:border-[#3b82f6]"
              >
                <link.icon className="h-5 w-5 text-slate-400 transition-colors group-hover:text-[#3b82f6]" />
                <span className="text-center text-[10px] font-medium leading-tight text-slate-600 dark:text-slate-300">
                  {link.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* --- SECTION: NOTIFICATIONS & UPDATES --- */}
        <section>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
            Notifications & Updates
          </div>
          <div className="rounded-2xl border border-[#d9e8ec] bg-white p-5 shadow-sm dark:border-[#153747] dark:bg-[#07242e] sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold">What&apos;s Happening</h2>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-700">
                  <Bell className="h-3.5 w-3.5" /> Unread
                </button>
                <button className="text-[11px] font-semibold text-[#3b82f6]">Mark all read</button>
                <button className="text-[11px] text-slate-400 hover:text-slate-600">
                  View All Notifications
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {NOTIFICATIONS.map((note, i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-[#051c25]"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#07242e]">
                    {note.icon === "plus" && (
                      <CircleDollarSign className="h-4 w-4 text-[#12a594]" />
                    )}
                    {note.icon === "trophy" && <ShieldCheck className="h-4 w-4 text-[#d9a441]" />}
                    {note.icon === "bot" && <Bot className="h-4 w-4 text-[#3b82f6]" />}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold leading-tight">{note.title}</h4>
                    <p className="mt-1 line-clamp-2 text-[10px] text-slate-500">{note.desc}</p>
                    <span className="mt-2 block text-[9px] text-slate-400">{note.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- SECTION: AI ECONOMY (PURE TAILWIND CHART) --- */}
        <section>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#35d6c0]">
            Global AI Market Snapshot
          </div>
          <h2 className="mb-6 text-xl font-bold leading-tight text-slate-900 dark:text-white sm:text-2xl">
            THE AI ECONOMY IS ENTERING ITS TRILLION-DOLLAR ERA.
          </h2>

          {/* Top 4 Stat Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MARKET_STATS.map((s, i) => {
              const { num, prefix, suffix } = parseMarketValue(s.value);
              return (
                <Reveal key={i} delay={i * 0.05}>
                  <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-[#153747] dark:bg-[#07242e]">
                    <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-[#6b4eff] to-transparent opacity-50" />
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#6b4eff] dark:text-[#8b6cf0]">
                      {s.type} · {s.year}
                    </p>
                    <p className="mb-1 text-3xl font-bold text-slate-900 dark:text-white">
                      <Counter value={num} prefix={prefix} suffix={suffix} />
                    </p>
                    <p className="mb-3 text-[11px] leading-tight text-slate-500">{s.label}</p>
                    <a
                      href="#"
                      className="text-[10px] text-slate-400 underline underline-offset-2 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {s.source}
                    </a>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Interactive Chart Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-[#153747] dark:bg-[#07242e] sm:p-6">
            <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Chart measure">
              {(Object.keys(MARKET_VIEWS) as (keyof typeof MARKET_VIEWS)[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setMarketView(k)}
                  className={`rounded-full px-4 py-1.5 text-[11px] font-semibold transition-colors ${
                    marketView === k
                      ? "bg-[#35d6c0] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {MARKET_VIEWS[k].tab}
                </button>
              ))}
            </div>

            {/* Custom Tailwind Bar Chart */}
            <div className="relative flex h-64 w-full items-end justify-around border-b border-slate-100 pb-2 dark:border-slate-800">
              {/* Y-Axis Grid Lines */}
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-8">
                {[1, 0.75, 0.5, 0.25, 0].map((pct, idx) => (
                  <div
                    key={idx}
                    className="relative w-full border-t border-slate-100 dark:border-slate-800/50"
                  >
                    <span className="absolute -left-2 -top-2.5 text-[9px] text-slate-400">
                      {marketView === "spending"
                        ? (pct * 4).toFixed(1)
                        : marketView === "market"
                          ? (pct * 5).toFixed(1)
                          : (pct * 200).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bars */}
              <div className="absolute inset-0 z-10 flex items-end justify-around pb-8 pl-8">
                {MARKET_VIEWS[marketView].data.map((item, i) => {
                  const maxVal = Math.max(...MARKET_VIEWS[marketView].data.map((d) => d.v));
                  const heightPct = (item.v / maxVal) * 100;

                  return (
                    <div
                      key={i}
                      className="group flex h-full w-16 flex-col items-center justify-end"
                    >
                      <span className="mb-1 text-[11px] font-bold text-slate-700 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-300">
                        {item.v}
                        {MARKET_VIEWS[marketView].unit}
                      </span>
                      <div
                        className="w-10 rounded-t-sm bg-[#35d6c0] transition-all duration-500 hover:bg-[#12a594] sm:w-14"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* X-Axis Labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-around pl-8">
                {MARKET_VIEWS[marketView].data.map((item, i) => (
                  <div key={i} className="flex w-16 justify-center">
                    <span className="text-[11px] font-semibold text-slate-500">{item.year}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart Note */}
            <p className="mt-6 text-[10px] text-slate-500 dark:text-slate-400">
              {MARKET_VIEWS[marketView].note} These measures use different methods and should not be
              compared with each other.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
