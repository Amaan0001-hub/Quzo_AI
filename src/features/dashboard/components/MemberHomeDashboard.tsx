"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Cpu,
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
  CheckCircle2,
  Target,
  CalendarDays,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboardSummary } from "@/features/dashboard/hooks/useDashboardSummary";


interface WalletData {
  FullName?: string;
  AuthLogin?: string;
  AIAgentLicense?: number;
  PurchaseCredit?: number;
  DeployedCredit?: number;
  UserRank?: string;
  CurrentSalary?: number;
  RewardAmtQualify?: number;
  RewardTotal?: number;
  NextRank?: string;
  NextSalary?: number;
  TeamBusiness?: number;
  TotalTeam?: number;
  ActiveTeam?: number;
  BoosterPackage?: string;
  Boostertype?: string;
  DepositWallet?: number;
  IncomeWallet?: number;
  YieldWallet?: number;
  QuzoWallet?: number;
  TradingPackage?: number; // may not exist in API — treated as optional
  [key: string]: unknown;
}

/* ============================================================
   CONSTANTS
   ============================================================ */

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

const PENDING = "$0.00";

function parseMarketValue(v: string) {
  const prefix = v.startsWith("$") ? "$" : "";
  const suffix = v.includes("T") ? "T" : v.includes("M") ? "M" : "";
  const num = Number(v.replace(/[^0-9.]/g, ""));
  return { num, prefix, suffix };
}

/* ---------- INCOME (kept for reference, unused after refactor) ---------- */
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

interface QuickLink {
  label: string;
  icon: LucideIcon;
  href?: string;
}

const QUICK_LINKS: QuickLink[] = [
  { label: "My OTC", icon: CircleDollarSign },
  { label: "My Coins", icon: Coins },
  { label: "My Customers", icon: Users },
  { label: "My Payouts", icon: Wallet },
  { label: "My Team", icon: Users, href: "/direct-partners" },
  { label: "My Vendors", icon: Briefcase },
  { label: "My Plans", icon: Layers, href: "/investment-amount" },
  { label: "My Assets", icon: Settings, href: "/fund-director" },
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

/* ============================================================
   HELPERS
   ============================================================ */

function formatMoney(n: number, decimals = 2): string {
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-bold text-[#06262f] dark:text-white">
      {children}
    </h3>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#12a594]/30 bg-[#12a594]/10 px-3 py-1 text-[10px] font-bold text-[#12a594] dark:text-[#35d6c0]">
      {children}
    </span>
  );
}

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
   SUB-COMPONENTS
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
          className={`rounded-full border px-4 py-1.5 text-[11px] font-semibold transition active:scale-95 ${value === key
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
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Your Income Overview
          </h2>
          <IncomeRangeTabs value={range} onChange={setRange} />
        </div>

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
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold ${up ? "text-[#12a594]" : "text-rose-500"
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
                    className={`text-[11px] font-bold ${tx.date.includes("Pending")
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

/* ---------------------------------------------------------------
   LicenseCredits — now API-driven via walletData
   --------------------------------------------------------------- */
function LicenseCredits({ walletData }: { walletData: WalletData }) {
  const licenseValue = Number(walletData.AIAgentLicense ?? 0);
  const creditsPurchased = Number(walletData.PurchaseCredit ?? 0);
  const creditsUtilized = Number(walletData.DeployedCredit ?? 0);
  const serviceRevenue = Number(walletData.IncomeWallet ?? 0);
  const vendorRevenue = Number(walletData.TeamBusiness ?? 0);

  const steps: [string, string, number | null, boolean, number, LucideIcon][] = [
    ["AI License Value", "Your agent license", licenseValue, true, 0, BadgeCheck],
    ["Total Credits Purchased", "AI compute credits", creditsPurchased, false, 0, Coins],
    ["Total Credits Utilized", "Consumed or deployed", creditsUtilized, false, 0, Cpu],
    [
      "Total Revenue Generated",
      "Revenue, not net profit",
      serviceRevenue + vendorRevenue,
      true,
      2,
      TrendingUp,
    ],
  ];

  const used =
    creditsPurchased === 0
      ? null
      : Math.min(100, Math.round((creditsUtilized / creditsPurchased) * 100));

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#070b18] p-3 text-white sm:p-4 lg:p-5">
      <div className="absolute -left-24 -top-24 h-52 w-52 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-16 h-56 w-56 rounded-full bg-violet-600/30 blur-3xl" />

      <div className="relative">
        <h3 className="text-base font-bold sm:text-lg">AI License &amp; Credits</h3>
        <p className="mb-3 text-[11px] text-slate-400 sm:text-xs">
          License → Credits → Utilization → Revenue
        </p>

        {/* Mobile: 2 columns | Tablet/Laptop (md+): 4 columns in one row */}
        <ol className="grid grid-cols-2 gap-2 sm:gap-2.5 md:grid-cols-4">
          {steps.map(([label, sub, value, isMoney, decimals, Icon], i) => (
            <li
              key={label}
              className="relative min-w-0 rounded-xl border border-white/10 bg-white/[0.05] p-2.5 backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-300/60 sm:p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 p-1.5 shadow-[0_0_18px_-4px_#22d3ee] sm:p-2">
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </span>
                {i < steps.length - 1 ? (
                  <ArrowRight className="h-3.5 w-3.5 text-cyan-300" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                )}
              </div>

              <p className="truncate text-[11px] text-slate-300 sm:text-xs">{label}</p>
              <p className="my-0.5 flex min-h-[1.75rem] items-center break-all text-lg font-bold leading-tight sm:text-xl lg:text-2xl">
                {value === null ? (
                  <span className="text-sm font-semibold text-slate-400">{PENDING}</span>
                ) : (
                  <Counter value={value} prefix={isMoney ? "$" : ""} decimals={decimals} />
                )}
              </p>
              <p className="truncate text-[10px] text-slate-500">{sub}</p>
            </li>
          ))}
        </ol>

        <div className="mt-3 flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="min-w-0 flex-[1_1_200px]">
            <div className="mb-1.5 flex justify-between text-[11px] text-slate-300 sm:text-xs">
              <span>Credit utilization</span>
              <span>{used === null ? PENDING : `${used}%`}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-1000"
                style={{ width: `${used ?? 0}%` }}
              />
            </div>
          </div>

          <div className="flex w-full gap-2 sm:w-auto">
            <Link
              href="/investment-amount"
              className="flex-1 rounded-lg bg-gradient-to-r from-[#12a594] to-[#35d6c0] px-3.5 py-2 text-center text-xs font-semibold text-white shadow-[0_4px_14px_rgba(18,165,148,0.3)] transition-opacity hover:opacity-90 sm:flex-none sm:text-[13px]"
            >
              Buy License
            </Link>
            <Link
              href="/deploy-agents"
              className="flex-1 rounded-lg border border-white/20 bg-white/5 px-3.5 py-2 text-center text-xs font-semibold transition-colors hover:bg-white/10 sm:flex-none sm:text-[13px]"
            >
              Deploy Credits
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   RevenueProfit — now API-driven
   --------------------------------------------------------------- */
function RevenueProfit({ walletData }: { walletData: WalletData }) {
  const serviceRevenue = Number(walletData.IncomeWallet ?? 0);
  const vendorRevenue = Number(walletData.TeamBusiness ?? 0);
  // const total = serviceRevenue + vendorRevenue;
  const total = 0;

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm dark:border-[#153747] dark:bg-[#07242e] sm:p-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
        Revenue &amp; Profit Overview
      </h3>
      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 sm:text-5xl">
            <Counter value={total} prefix="$" decimals={2} />
          </p>
          <p className="mt-1 text-sm text-slate-500">Total Revenue Generated</p>
          <div
            className="mt-5 flex h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            aria-hidden="true"
          >
            <span
              className="h-full bg-[#3b82f6] transition-all duration-1000"
              style={{
                width: `${total > 0 ? Math.round((serviceRevenue / total) * 100) : 0
                  }%`,
              }}
            />
            <span
              className="h-full bg-[#6366f1] transition-all duration-1000"
              style={{
                width: `${total > 0 ? Math.round((vendorRevenue / total) * 100) : 0
                  }%`,
              }}
            />
          </div>
          <ul className="mt-4 space-y-3">
            <li className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#3b82f6]" />
                AI Service Revenue
              </span>
              {/* <span className="font-bold text-slate-900 dark:text-white">
                ${formatMoney(serviceRevenue)}
              </span> */}
              <span className="font-bold text-slate-900 dark:text-white">
                $0.00
              </span>
            </li>
            <li className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#6366f1]" />
                Vendor Deployment Revenue
              </span>
              {/* <span className="font-bold text-slate-900 dark:text-white">
                  ${formatMoney(vendorRevenue)}
                </span> */}
              <span className="font-bold text-slate-900 dark:text-white">
                $0.00
              </span>

            </li>
          </ul>
        </div>
        <div className="grid content-center gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-[#051c25]">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Net Profit
            </span>
            <span className="text-xl font-bold text-slate-400">{PENDING}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-[#051c25]">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Pending Payout
            </span>
            <span className="text-xl font-bold text-slate-400">{PENDING}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl border border-slate-100 bg-white p-5 shadow-sm dark:border-[#153747] dark:bg-[#07242e] ${className}`}
    >
      {children}
    </div>
  );
}

function CoinChart({ children }: { children?: ReactNode }) {
  const price = "1 USDT";

  const utilities = [
    { icon: Coins, name: "Trading", text: "Trade QUZO on supported exchanges" },
    { icon: Bot, name: "AI Services", text: "Access AI-powered trading tools" },
    { icon: Gift, name: "Rewards", text: "Earn QUZO through activities" },
    { icon: ChartNoAxesCombined, name: "Analytics", text: "Track performance metrics" },
  ];

  return (
    <div className="space-y-4">
      <Panel className="overflow-hidden p-0">
        <div className="grid overflow-hidden rounded-[28px] border border-[#d9e8ec] bg-[#f8fbfc] dark:border-[#153747] dark:bg-[#031B23] lg:grid-cols-[1fr_2fr]">
          <div className="relative flex flex-col justify-between gap-10 bg-white p-8 dark:bg-[#052832] md:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#5b7885] dark:text-slate-400">
              Token utility
            </p>
            <div className="flex justify-center">
              <div className="relative h-32 w-32">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#10a67b] to-[#35d6c0] shadow-2xl" />
                <div className="absolute inset-2 flex items-center justify-center rounded-full bg-gradient-to-br from-[#0a6b4f] to-[#19a885]">
                  <img
                    src="/logos/quzo-logo-light.png"
                    alt="QUZO"
                    className="h-16 w-16 object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-[#06262f] dark:text-white">{price}</p>
              <p className="mt-1 text-xs text-[#5b7885] dark:text-slate-300">
                QUZO Coin Pre Allocation Price 1 USDT
              </p>
            </div>
          </div>
          <div className="grid gap-px bg-[#d9e8ec] dark:bg-white/10 sm:grid-cols-2 lg:grid-cols-2">
            {utilities.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="min-h-[150px] bg-white p-5 dark:bg-[#031B23]">
                  <div className="flex gap-4">
                    <span className="shrink-0 pt-0.5 font-mono text-[10px] text-[#5b7885] dark:text-slate-400">
                      0{index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Icon
                        size={18}
                        className="text-[#12a594] dark:text-[#19D8D0]"
                        aria-hidden="true"
                      />
                      <h3 className="font-display mt-3 text-sm font-semibold text-[#06262f] dark:text-white">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-[#5b7885] dark:text-slate-300">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Panel>

      {children}
    </div>
  );
}


const STAT_STYLES = [
  {
    // mint - improved visibility in both modes
    icon: Layers,
    card: "border-emerald-300/80 bg-gradient-to-br from-[#d1fae5] to-[#ecfdf5] dark:border-emerald-500/40 dark:from-emerald-500/25 dark:to-[#064e3b]",
    tile: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/40",
    label: "text-emerald-800 dark:text-emerald-200",
    mini: "text-emerald-600 dark:text-emerald-400",
    chip: "text-emerald-800 dark:text-emerald-100",
  },
  {
    // teal - MARKET SIZE card
    icon: ChartNoAxesCombined,
    card: "border-teal-200/80 bg-gradient-to-br from-[#ccfbf1] to-[#f0fdfa] dark:border-teal-400/40 dark:from-teal-500/15 dark:to-[#115e59]",
    tile: "bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg shadow-teal-400/30",
    label: "text-teal-700 dark:text-teal-200",
    mini: "text-teal-500 dark:text-teal-300",
    chip: "text-teal-800 dark:text-teal-100",
  },
  {
    // green - EMPLOYMENT card - lighter
    icon: Users,
    card: "border-green-200/80 bg-gradient-to-br from-[#ecfdf5] to-[#f0fdf4] dark:border-green-400/40 dark:from-green-500/15 dark:to-[#065f46]",
    tile: "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-400/30",
    label: "text-green-700 dark:text-green-200",
    mini: "text-green-500 dark:text-green-300",
    chip: "text-green-800 dark:text-green-100",
  },
  {
    // peach
    icon: Briefcase,
    card: "border-amber-200/70 bg-gradient-to-br from-[#ffeed9] to-[#fff8ee] dark:border-amber-400/20 dark:from-amber-500/15 dark:to-[#07242e]",
    tile: "bg-gradient-to-br from-amber-300 to-orange-400 text-white shadow-lg shadow-amber-500/30",
    label: "text-amber-700 dark:text-amber-300",
    mini: "text-amber-500",
    chip: "text-amber-900 dark:text-amber-200",
  },
];

/** Top value of each chart's Y axis */
const AXIS_MAX: Record<keyof typeof MARKET_VIEWS, number> = {
  spending: 4,
  market: 5,
  jobs: 200,
};

const RANGE_LABEL: Record<keyof typeof MARKET_VIEWS, string> = {
  spending: "2025 – 2027",
  market: "2023 – 2033",
  jobs: "By 2030",
};

const decimalsOf = (n: number) => String(n).split(".")[1]?.length ?? 0;

function MarketSnapshotSection() {
  const [marketView, setMarketView] =
    useState<keyof typeof MARKET_VIEWS>("spending");

  const view = MARKET_VIEWS[marketView];
  const axisMax = AXIS_MAX[marketView];
  const count = view.data.length;
  const showLine = marketView !== "jobs"; // line only makes sense over time

  const points = view.data.map((d, i) => ({
    ...d,
    x: ((i + 0.5) / count) * 100,
    y: 100 - Math.min(100, (d.v / axisMax) * 100),
  }));
  const linePath = points.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");
  const first = points[0];
  const last = points[count - 1];
  const areaPath =
    first && last ? `${linePath} L${last.x},100 L${first.x},100 Z` : "";

  const ticks = [1, 0.75, 0.5, 0.25, 0].map((p) => p * axisMax);
  const tickText = (t: number) =>
    t === 0 ? "0" : view.unit === "T" ? `${t.toFixed(1)}T` : `${t}M`;

  return (
    <section className="space-y-3">
      {/* ---------- HERO (image banner) ---------- */}
      <div className="relative isolate min-h-[190px] overflow-hidden rounded-2xl bg-[#03161f] sm:min-h-[210px] lg:min-h-[240px]">

        {/* <Image
          src="/ai-market-banner.webp"
          alt=""
          fill
          priority
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="-z-20 object-cover object-[80%_top] md:object-[90%_top]"
        /> */}
        <Image
          src="/ai-market-banner.webp"
          alt=""
          fill
          priority
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="-z-20 object-cover object-[75%_center] md:object-[80%_center]"
        />
        {/* left fade keeps the text readable on small screens */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#03161f]/90 via-[#03161f]/55 to-transparent md:from-[#03161f]/70 md:via-[#03161f]/20" />

        <div className="relative flex h-full min-h-[inherit] items-center px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          <div className="min-w-0 max-w-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#35d6c0] backdrop-blur sm:text-[11px]">
              <ChartNoAxesCombined className="h-3.5 w-3.5" />
              Global AI Market Snapshot
            </div>
            <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
              The AI Economy Is Entering Its{" "}
              <span className="block text-[#35f0c0]">Trillion-Dollar Era.</span>
            </h2>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-300 sm:text-sm">
              Massive growth in AI spending, market size and global employment is
              creating unprecedented opportunities for AI solutions.
            </p>
          </div>
        </div>
      </div>

      {/* ---------- STAT CARDS ---------- */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {MARKET_STATS.map((s, i) => {
          const st = STAT_STYLES[i % STAT_STYLES.length] ?? STAT_STYLES[0]!;
          const Icon = st.icon;
          const { num, prefix, suffix } = parseMarketValue(s.value);
          return (
            <Reveal key={i} delay={i * 0.05} className="h-full">
              <div
                className={`relative h-full overflow-visible rounded-2xl border p-3 shadow-sm sm:p-4 ${st.card}`}
              >
                <span
                  className={`absolute right-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-xl sm:right-3 sm:top-3 sm:h-12 sm:w-12 ${st.tile}`}
                >
                  <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
                </span>

                <p
                  className={`flex items-center gap-1.5 pr-10 text-[9px] font-bold uppercase tracking-wider sm:pr-14 sm:text-[10px] ${st.label}`}
                >
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${st.mini}`} />
                  <span className="truncate">
                    {s.type} · {s.year}
                  </span>
                </p>
                <p className="mt-1.5 text-2xl font-extrabold leading-none text-slate-900 dark:text-white sm:text-3xl">
                  <Counter
                    value={num}
                    prefix={prefix}
                    suffix={suffix}
                    decimals={decimalsOf(num)}
                  />
                </p>
                <p className="mt-1.5 min-h-[2.2em] text-[10px] leading-relaxed text-slate-500 dark:text-slate-400 sm:text-[11px]">
                  {s.label}
                </p>
                <a
                  href="#"
                  className={`mt-2.5 inline-flex max-w-full items-center gap-1 rounded-lg bg-white/60 px-2 py-1 text-[9px] font-semibold ring-1 ring-black/5 transition hover:bg-white/90 dark:bg-white/5 dark:ring-white/10 sm:text-[10px] ${st.chip}`}
                >
                  <span className="truncate">{s.source}</span>
                  <ArrowUpRight className="h-3 w-3 shrink-0" />
                </a>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* ---------- CHART + TAKEAWAYS ---------- */}
      <div className="grid gap-3 lg:grid-cols-[1.9fr_1fr]">
        {/* Chart */}
        <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-[#153747] dark:bg-[#07242e] sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white sm:text-base">
              <ChartNoAxesCombined className="h-4 w-4 text-emerald-500" />
              AI Industry Outlook
            </h3>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
              <CalendarDays className="h-3.5 w-3.5" />
              {RANGE_LABEL[marketView]}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Chart measure">
            {(Object.keys(MARKET_VIEWS) as (keyof typeof MARKET_VIEWS)[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={marketView === k}
                onClick={() => setMarketView(k)}
                className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-colors ${marketView === k
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
              >
                {MARKET_VIEWS[k].tab}
              </button>
            ))}
          </div>

          <div className="mt-8 flex gap-2">
            {/* Y axis */}
            <div className="relative h-44 w-9 shrink-0 sm:h-56">
              {ticks.map((t, i) => (
                <span
                  key={i}
                  className="absolute right-0 -translate-y-1/2 text-[10px] text-slate-400"
                  style={{ top: `${i * 25}%` }}
                >
                  {tickText(t)}
                </span>
              ))}
            </div>

            {/* Plot */}
            <div className="min-w-0 flex-1">
              <div className="relative h-44 border-b border-slate-200 dark:border-slate-700 sm:h-56">
                {[0, 25, 50, 75].map((p) => (
                  <div
                    key={p}
                    className="absolute left-0 right-0 border-t border-dashed border-slate-100 dark:border-slate-800"
                    style={{ top: `${p}%` }}
                  />
                ))}

                {/* Bars */}
                <div className="absolute inset-0 flex items-end">
                  {points.map((p, i) => (
                    <div
                      key={`${marketView}-${i}`}
                      className="flex h-full items-end justify-center"
                      style={{ width: `${100 / count}%` }}
                    >
                      <div
                        className="w-[42%] max-w-[64px] rounded-t-lg bg-gradient-to-t from-[#10b981] to-[#34e0a1] shadow-[0_6px_16px_-6px_rgba(16,185,129,0.6)] transition-[height] duration-700"
                        style={{ height: `${100 - p.y}%`, minHeight: 4 }}
                      />
                    </div>
                  ))}
                </div>

                {/* Trend line + area */}
                {showLine && count > 1 && (
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="mktArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={areaPath} fill="url(#mktArea)" />
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                )}

                {/* Dots + value bubbles */}
                {points.map((p, i) => (
                  <div
                    key={`b-${marketView}-${i}`}
                    className="pointer-events-none absolute transition-all duration-700"
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  >
                    {showLine && (
                      <span className="absolute left-0 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-500 bg-white" />
                    )}
                    <span className="absolute left-0 top-0 -translate-x-1/2 -translate-y-[170%] whitespace-nowrap rounded-lg bg-white px-2 py-0.5 text-[10px] font-bold text-slate-800 shadow-md ring-1 ring-black/5 dark:bg-[#0b2f3b] dark:text-white dark:ring-white/10 sm:text-xs">
                      {p.v}
                      {view.unit}
                    </span>
                  </div>
                ))}
              </div>

              {/* X labels */}
              <div className="mt-2 flex">
                {points.map((p, i) => (
                  <span
                    key={i}
                    className="text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400"
                    style={{ width: `${100 / count}%` }}
                  >
                    {p.year}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-4 flex gap-1.5 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
            <span className="mt-[1px] inline-block h-3 w-3 shrink-0 rounded-full border border-slate-300 text-center text-[8px] leading-[10px] dark:border-slate-600">
              i
            </span>
            <span>
              {view.note} These measures use different methods and should not be
              compared with each other.
            </span>
          </p>
        </div>

        {/* Key takeaways */}
        <div className="relative min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-[#153747] dark:bg-[#07242e] sm:p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white sm:text-base">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500/15 text-emerald-500">
              <Target className="h-4 w-4" />
            </span>
            Key Takeaways
          </h3>

          <ul className="relative z-10 mt-4 space-y-3.5 pb-16 text-xs text-slate-700 dark:text-slate-200 sm:text-[13px]">
            {[
              ["AI spending to reach ", "$2.67 trillion", " in 2026."],
              ["Global AI market size projected at ", "$4.8 trillion", " by 2033."],
              ["", "78 million", " net new jobs across industries by 2030."],
              ["", "170 million", " new jobs created by 2030."],
            ].map(([a, b, c], i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>
                  {a}
                  <strong className="font-bold text-slate-900 dark:text-white">{b}</strong>
                  {c}
                </span>
              </li>
            ))}
          </ul>

          {/* Decorative wave */}
          <svg
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="mktWave" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34e0a1" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#34e0a1" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path
              d="M0,70 C60,90 110,30 180,50 C250,70 300,10 400,40 L400,100 L0,100 Z"
              fill="url(#mktWave)"
            />
            <path
              d="M0,78 C70,95 120,45 190,62 C260,80 320,28 400,52 L400,100 L0,100 Z"
              fill="#10b981"
              fillOpacity="0.12"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------
   In MemberHomeDashboard: replace the whole old
   <section> ... Global AI Market Snapshot ... </section>
   block with:

        <MarketSnapshotSection />

   (You can also delete the `marketView` useState from
    MemberHomeDashboard — it is no longer used there.)
   ------------------------------------------------------------ */
export function MemberHomeDashboard() {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/register?ref=DEMO1234`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { data: dashboardSummary, isLoading: isDashboardLoading } =
    useDashboardSummary();

  // Real API data — no more hardcoded object
  const walletData: WalletData = (dashboardSummary?.data?.[0] ?? {}) as WalletData;

  const [marketView, setMarketView] =
    useState<keyof typeof MARKET_VIEWS>("spending");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const rewardPct =
    walletData.RewardTotal && walletData.RewardAmtQualify !== undefined
      ? (walletData.RewardAmtQualify / walletData.RewardTotal) * 100
      : 0;

  // Derived values (used in stats cards below)
  const totalTeam = Number(walletData.TotalTeam ?? 0);
  const activeTeam = Number(walletData.ActiveTeam ?? 0);
  const teamBusiness = Number(walletData.TeamBusiness ?? 0);
  const depositWallet = Number(walletData.DepositWallet ?? 0);
  const incomeWallet = Number(walletData.IncomeWallet ?? 0);
  const yieldWallet = Number(walletData.YieldWallet ?? 0);

  return (
    <div className="min-h-screen w-full  font-sans text-[#06262f] selection:bg-[#12a594]/30 dark:text-[#e6f7f9]">
      {/* HERO */}

      <section className="relative w-full overflow-hidden rounded-b-2xl bg-[#03161f] px-4 py-4 sm:px-6 sm:py-5 lg:px-12 lg:py-6">
        {/* Background glow + grid */}
        <div className="pointer-events-none absolute -right-20 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-[#12a594]/15 blur-[80px]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse at 75% 50%, black 25%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 75% 50%, black 25%, transparent 75%)",
          }}
        />

        <div className="relative z-10 mx-auto flex max-w-[1300px] items-center justify-between gap-4 lg:gap-8">
          {/* Text */}
          <div className="flex min-w-0 flex-1 flex-col items-start">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#12a594]/30 bg-[#12a594]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#35d6c0]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#35d6c0] shadow-[0_0_8px_#35d6c0]" />
              Your AI business panel
            </div>

            <h1 className="mb-1.5 text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl lg:text-3xl">
              The future is no longer coming.{" "}
              <span className="bg-gradient-to-r from-[#12a594] to-[#35d6c0] bg-clip-text text-transparent">
                It&apos;s here.
              </span>
            </h1>

            <p className="mb-3 hidden max-w-[460px] text-[13px] leading-snug text-slate-400 sm:block">
              AI agents, robotics, automation and global business opportunities.
            </p>

            <div className="mt-1 flex w-full flex-wrap items-center gap-2 sm:mt-0">
              <button className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#12a594] to-[#35d6c0] px-3.5 py-2 text-xs font-semibold text-white shadow-[0_0_16px_rgba(18,165,148,0.3)] transition hover:opacity-90 sm:text-[13px]">
                <Bot className="h-3.5 w-3.5" />
                Explore AI Marketplace
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-[#12a594]/30 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 sm:text-[13px]">
                <Globe className="h-3.5 w-3.5 text-[#35d6c0]" />
                Opportunities
              </button>
              <Link
                href="/deploy-agents"
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 sm:text-[13px]"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#12a594]" />
                Deploy Agents
              </Link>
            </div>
          </div>

          {/* Robot: small, hidden on mobile */}
          <div className="relative hidden shrink-0 items-center justify-center sm:flex">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(18,165,148,0.18)_0%,transparent_65%)]" />
            <Image
              src="/quzo-hero-robot.webp"
              alt="QUZO AI Robot"
              width={200}
              height={200}
              priority
              className="relative z-10 h-auto w-[100px] animate-[float_6s_ease-in-out_infinite] object-contain drop-shadow-[0_0_24px_rgba(18,165,148,0.25)] md:w-[120px] lg:w-[150px]"
            />
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="mx-auto space-y-6 px-4 py-8">
        {/* Overview */}
        <section>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#35d6c0]">
            My AI economy
          </div>
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
            Your Licenses, Credits &amp; Revenue
          </h2>
          <div className="space-y-4">
            <Reveal>
              <LicenseCredits walletData={walletData} />
            </Reveal>
            <Reveal delay={0.1}>
              <RevenueProfit walletData={walletData} />
            </Reveal>

            {/* 4 Cards — now dynamic */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
              {(
                [
                  ["Yield Wallet", `$${formatMoney(yieldWallet)}`, Wallet],
                  ["Performance Wallet", `$${formatMoney(incomeWallet)}`, Gauge],
                  ["Deposit Wallet", `$${formatMoney(depositWallet)}`, ArrowDownToLine],
                  ["Total Team", `${totalTeam}`, Users],
                ] as [string, string, LucideIcon][]
              ).map(([label, val, Icon], i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-[#153747] dark:bg-[#07242e]"
                >
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {label}
                    </p>
                    <p className="mt-2 flex min-h-[2rem] items-center text-2xl font-bold text-slate-900 dark:text-white">
                      {val}
                    </p>
                  </div>
                  <div className="shrink-0 rounded-xl bg-slate-50 p-2.5 text-[#3b82f6] dark:bg-slate-800">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/fund-director"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#12a594] to-[#35d6c0] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> Add Funds
              </Link>
              <Link
                href="/fund-director"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-[#07242e] dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <ArrowDownToLine className="h-4 w-4" /> Withdraw
              </Link>
            </div>
          </div>
        </section>

        {/* CoinChart + panels */}
        <CoinChart>
          <div className="grid gap-4 xl:grid-cols-2">
            {/* My AI bot investment */}
            <Panel>
              <div className="flex items-center justify-between gap-2">
                <SectionHeading>
                  <Bot className="h-4 w-4 text-[#12a594]" aria-hidden />
                  My AI bot investment
                </SectionHeading>
                <Pill>● Active</Pill>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#3fd9a9] to-[#0a8f6a] text-3xl font-bold text-white shadow-lg">
                  Q
                </div>
                <div className="min-w-0 flex-1">
                  {[
                    [
                      "Licensed amount",
                      `$${formatMoney(Number(walletData.AIAgentLicense ?? 0))}`,
                    ],
                    ["Booster Status", walletData.BoosterPackage ?? "N/A"],
                    [
                      "Booster Left Time",
                      walletData.Boostertype
                        ? `${walletData.Boostertype} Hrs`
                        : "00:00:00 Hrs",
                    ],
                    ["Rank", walletData.UserRank ?? "N/A"],
                  ].map(([label, value], index) => (
                    <div
                      key={label}
                      className="flex justify-between gap-2 border-b border-[#d9e8ec] py-2 text-[11px] last:border-0 dark:border-[#153747]"
                    >
                      <span className="text-[#5b7885] dark:text-[#84a2ad]">
                        {label}
                      </span>
                      <strong
                        className={
                          index
                            ? "text-[#12a594]"
                            : "text-[#06262f] dark:text-white"
                        }
                      >
                        {value}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>

            {/* Rank progress — dynamic */}
            <Panel>
              <div className="flex items-center justify-between gap-2">
                <SectionHeading>
                  <Bot className="h-4 w-4 text-[#12a594]" aria-hidden />
                  Rank progress
                </SectionHeading>
                <Pill>{walletData.UserRank ?? "N/A"}</Pill>
              </div>
              <div className="mt-4 flex items-end justify-between gap-2">
                <strong className="text-2xl text-[#06262f] dark:text-white">
                  {walletData.RewardTotal !== undefined &&
                    walletData.RewardAmtQualify !== undefined
                    ? rewardPct.toFixed(1)
                    : "0"}
                  %
                </strong>
                <span className="text-right text-[11px] text-[#5b7885] dark:text-[#84a2ad]">
                  ${formatMoney(walletData.RewardAmtQualify ?? 0, 0)} / $
                  {formatMoney(walletData.RewardTotal ?? 0, 0)}
                </span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#12a594]/[0.12]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#12a594] to-[#35d6c0]"
                  style={{ width: `${rewardPct}%` }}
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  [
                    "Current Salary",
                    `$${formatMoney(walletData.CurrentSalary ?? 0, 0)}`,
                  ],
                  ["Next Rank", `${walletData.NextRank ?? "N/A"}`],
                  [
                    "Next Salary",
                    `$${formatMoney(walletData.NextSalary ?? 0, 0)}`,
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl bg-[#edf4f5] p-2.5 dark:bg-[#031B23]"
                  >
                    <span className="block text-[9px] text-[#5b7885] dark:text-[#84a2ad]">
                      {label}
                    </span>
                    <strong className="mt-1 block text-xs text-[#06262f] dark:text-white">
                      {value}
                    </strong>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </CoinChart>

        {/* Affiliate — now dynamic */}
        <section>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#35d6c0]">
            Affiliate
          </div>
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
            Affiliate Team Growth
          </h2>

          <div className="flex flex-col gap-6">
            {/* Referral link */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-[#153747] dark:bg-[#07242e] md:flex-row md:items-center">
              <div>
                <p className="mb-1 text-[11px] text-slate-500">
                  Your referral link
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {walletData.AuthLogin
                    ? `${typeof window !== "undefined" ? window.location.origin : ""}/register?ref=${walletData.AuthLogin}`
                    : "http://localhost:3001/register?ref=DEMO1234"}
                </p>
              </div>
              <div className="flex w-full items-center gap-2 md:w-auto">
                <button
                  onClick={copyLink}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#35d6c0] px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#12a594] md:flex-none"
                >
                  {copied ? "Copied!" : "Copy link"}
                </button>
                <button className="flex-1 rounded-xl bg-slate-100 px-4 py-2 text-[12px] font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 md:flex-none">
                  Affiliate dashboard
                </button>
              </div>
            </div>

            {/* Stats — dynamic */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Direct Referrals", value: totalTeam }, // best proxy since API doesn't split
                { label: "Total Team Members", value: totalTeam },
                { label: "Active Members", value: activeTeam },
                { label: "Team Business Volume", value: teamBusiness, money: true },
              ].map((stat, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-[#153747] dark:bg-[#07242e]">
                    <p className="mb-1 text-[11px] text-slate-500">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      <Counter
                        value={Number(stat.value)}
                        prefix={stat.money ? "$" : ""}
                      />
                    </h3>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Time filters */}
            <div className="flex gap-2">
              {["7 Days", "30 Days", "90 Days", "1 Year"].map((t, i) => (
                <button
                  key={t}
                  className={`rounded-full border px-4 py-1.5 text-[11px] font-medium transition-colors ${i === 1
                    ? "border-[#6b4eff] bg-[#6b4eff] text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#07242e] dark:text-slate-300"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-[#153747] dark:bg-[#07242e]">
                <h4 className="mb-6 text-sm font-bold text-slate-900 dark:text-white">
                  Team members over time
                </h4>
                <div className="relative h-[220px] w-full">
                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-6">
                    {[60, 45, 30, 15, 0].map((val) => (
                      <div key={val} className="flex w-full items-center">
                        <span className="w-6 text-[10px] text-slate-400">
                          {val}
                        </span>
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
                        <linearGradient
                          id="chartGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#3b82f6"
                            stopOpacity="0.2"
                          />
                          <stop
                            offset="100%"
                            stopColor="#3b82f6"
                            stopOpacity="0"
                          />
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
                          {lvl.level}{" "}
                          <span className="text-slate-400">· {lvl.members}</span>
                        </span>
                        <span className="font-semibold text-slate-600 dark:text-slate-400">
                          $
                          <Counter
                            value={Number(lvl.value.replace(/[^0-9.]/g, ""))}
                          />
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

            {/* Recently joined */}
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
                      <th className="w-24 px-5 py-3 text-center font-medium">
                        Level
                      </th>
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
                        <td className="px-5 py-4 text-center text-slate-500">
                          {row.level}
                        </td>
                        <td className="px-5 py-4 text-slate-500">
                          {row.joined}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${row.status === "Active"
                                ? "bg-[#10b981]"
                                : "bg-slate-400"
                                }`}
                            />
                            <span
                              className={`font-medium ${row.status === "Active"
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

        {/* OPPORTUNITIES */}
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
                <p className="mb-4 text-[11px] leading-relaxed text-slate-500">
                  {opp.desc}
                </p>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-[#12a594] transition-all group-hover:gap-2">
                  Explore <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* QUICK LINKS */}
        <section>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#35d6c0]">
            Quick Links
          </div>
          <h2 className="mb-4 text-xl font-bold">Your Business Command Center</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
            {QUICK_LINKS.map((link, i) => {
              if (link.href) {
                return (
                  <Link
                    key={i}
                    href={link.href}
                    className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-[#d9e8ec] bg-white p-3 transition-colors hover:border-[#3b82f6] dark:border-[#153747] dark:bg-[#07242e] dark:hover:border-[#3b82f6]"
                  >
                    <link.icon className="h-5 w-5 text-slate-400 transition-colors group-hover:text-[#3b82f6]" />
                    <span className="text-center text-[10px] font-medium leading-tight text-slate-600 dark:text-slate-300">
                      {link.label}
                    </span>
                  </Link>
                );
              }
              return (
                <button
                  key={i}
                  className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-[#d9e8ec] bg-white p-3 transition-colors hover:border-[#3b82f6] dark:border-[#153747] dark:bg-[#07242e] dark:hover:border-[#3b82f6]"
                >
                  <link.icon className="h-5 w-5 text-slate-400 transition-colors group-hover:text-[#3b82f6]" />
                  <span className="text-center text-[10px] font-medium leading-tight text-slate-600 dark:text-slate-300">
                    {link.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* NOTIFICATIONS */}
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
                <button className="text-[11px] font-semibold text-[#3b82f6]">
                  Mark all read
                </button>
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
                    {note.icon === "trophy" && (
                      <ShieldCheck className="h-4 w-4 text-[#d9a441]" />
                    )}
                    {note.icon === "bot" && (
                      <Bot className="h-4 w-4 text-[#3b82f6]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold leading-tight">
                      {note.title}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-[10px] text-slate-500">
                      {note.desc}
                    </p>
                    <span className="mt-2 block text-[9px] text-slate-400">
                      {note.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI ECONOMY */}
        {/* <section>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#35d6c0]">
            Global AI Market Snapshot
          </div>
          <h2 className="mb-6 text-xl font-bold leading-tight text-slate-900 dark:text-white sm:text-2xl">
            THE AI ECONOMY IS ENTERING ITS TRILLION-DOLLAR ERA.
          </h2>

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
                    <p className="mb-3 text-[11px] leading-tight text-slate-500">
                      {s.label}
                    </p>
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

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-[#153747] dark:bg-[#07242e] sm:p-6">
            <div
              className="mb-8 flex flex-wrap gap-2"
              role="group"
              aria-label="Chart measure"
            >
              {(Object.keys(MARKET_VIEWS) as (keyof typeof MARKET_VIEWS)[]).map(
                (k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setMarketView(k)}
                    className={`rounded-full px-4 py-1.5 text-[11px] font-semibold transition-colors ${marketView === k
                      ? "bg-[#35d6c0] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      }`}
                  >
                    {MARKET_VIEWS[k].tab}
                  </button>
                )
              )}
            </div>

            <div className="relative flex h-64 w-full items-end justify-around border-b border-slate-100 pb-2 dark:border-slate-800">
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

              <div className="absolute inset-0 z-10 flex items-end justify-around pb-8 pl-8">
                {MARKET_VIEWS[marketView].data.map((item, i) => {
                  const maxVal = Math.max(
                    ...MARKET_VIEWS[marketView].data.map((d) => d.v)
                  );
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

              <div className="absolute bottom-0 left-0 right-0 flex justify-around pl-8">
                {MARKET_VIEWS[marketView].data.map((item, i) => (
                  <div key={i} className="flex w-16 justify-center">
                    <span className="text-[11px] font-semibold text-slate-500">
                      {item.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-6 text-[10px] text-slate-500 dark:text-slate-400">
              {MARKET_VIEWS[marketView].note} These measures use different
              methods and should not be compared with each other.
            </p>
          </div>
        </section> */}
        <MarketSnapshotSection />
      </div>
    </div>
  );
}