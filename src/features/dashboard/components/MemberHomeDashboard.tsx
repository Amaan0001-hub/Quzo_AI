"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  ChartNoAxesCombined,
  Coins,
  Gift,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { homePageData } from "@/features/dashboard/constants/home-page";
import { useDashboardSummary } from "@/features/dashboard/hooks/useDashboardSummary";
import { useNotifications } from "@/features/dashboard/hooks/useNotifications";
import Qurobot from "@/components/common/Qurobot";

function formatNotificationDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getNotificationColor(remarks: string): string {
  const lower = remarks.toLowerCase();
  if (lower.includes("credit") || lower.includes("deposit") || lower.includes("roi")) {
    return "#12a594";
  }
  if (lower.includes("debit") || lower.includes("withdrawal")) {
    return "#e94f4f";
  }
  if (lower.includes("ai") || lower.includes("strategy")) {
    return "#3b8df0";
  }
  if (lower.includes("reply") || lower.includes("query") || lower.includes("ticket")) {
    return "#d9a441";
  }
  return "#8b6cf0";
}

const coinPeriods = ["1D", "7D", "30D", "90D", "1Y"] as const;
const performancePeriods = ["7D", "30D", "90D", "1Y"] as const;
const earningsPeriods = ["Week", "Month", "Year"] as const;

const incomeItems = [
  { label: "Direct Referral Income", amount: 2184.5, color: "#12a594", change: "8.4%" },
  { label: "Daily Profit Income", amount: 1245.6, color: "#3aa3c4", change: "2.1%" },
  { label: "Level Income", amount: 968.2, color: "#1f5f7a", change: "5.7%" },
  { label: "Booster Income", amount: 312.4, color: "#d9a441", change: "0.5%" },
  { label: "DAO Income", amount: 540, color: "#4a7f8f", change: "12%" },
  { label: "Rewards Income", amount: 250, color: "#8fc9cf", change: "New" },
  { label: "Salary Income", amount: 183.33, color: "#1fa88a", change: "1%" },
];

const partners = [
  { initials: "AM", name: "Alex M.", amount: "$2,500", volume: "$125,000 vol." },
  { initials: "SR", name: "Sophia R.", amount: "$1,850", volume: "$98,400 vol." },
  { initials: "DK", name: "Daniel K.", amount: "$1,420", volume: "$76,200 vol." },
  { initials: "PS", name: "Priya S.", amount: "$1,180", volume: "$61,800 vol." },
  { initials: "ML", name: "Marco L.", amount: "$960", volume: "$54,300 vol." },
];

const achievers = [
  { initials: "NT", name: "Nina T.", rank: "Elite", time: "2h ago", reward: "+$2,000" },
  { initials: "OF", name: "Omar F.", rank: "Navigator", time: "5h ago", reward: "+$1,000" },
  { initials: "LW", name: "Lena W.", rank: "Trader", time: "Yesterday", reward: "+$500" },
  { initials: "RK", name: "Ravi K.", rank: "Pioneer", time: "Yesterday", reward: "+$250" },
  { initials: "CY", name: "Chen Y.", rank: "Nova", time: "2 days ago", reward: "+$100" },
];

const promotions = [
  {
    title: "Expand your investment in QUZO",
    detail: "Add more investment, run advanced AI bots and maximise your returns.",
    action: "Invest more",
    href: "/investment-amount",
    color: "#12a594",
  },
  {
    title: "Daily Booster is live",
    detail: "Add 3 directs in 24 hours for +0.3%, or 5 directs for +0.5% on daily rewards.",
    action: "View offers",
    href: "/booster",
    color: "#3aa3c4",
  },
  {
    title: "DAO Partner: 280 seats",
    detail: "Generate $3,000 direct business in 15 days and share 5% of company deposits.",
    action: "See how it works",
    href: "/ai-business-hub",
    color: "#1f5f7a",
  },
] as const;

function formatMoney(value: number, digits = 2) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`min-w-0 rounded-[18px] border border-[#d9e8ec] bg-white p-4 shadow-[0_10px_30px_-14px_rgba(10,60,80,0.2)] dark:border-[#153747] dark:bg-[#07242e] ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-wide text-[#06262f] before:h-4 before:w-1 before:rounded-full before:bg-gradient-to-b before:from-[#12a594] before:to-[#35d6c0] dark:text-[#e6f7f9]">
      {children}
    </h2>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="whitespace-nowrap rounded-full bg-[#12a594]/[0.12] px-2.5 py-1 text-[11px] font-semibold text-[#118b7d] dark:text-[#6be2d2]">
      {children}
    </span>
  );
}

function CoinChart() {
  const [period, setPeriod] = useState<(typeof coinPeriods)[number]>("30D");
  const [currency, setCurrency] = useState<"BTC" | "USD">("BTC");
  const price = currency === "BTC" ? "1" : "$0.3684";

  const utilities = [
    { icon: Coins, name: "Trading", text: "Trade QUZO on supported exchanges" },
    { icon: Bot, name: "AI Services", text: "Access AI-powered trading tools" },
    { icon: Gift, name: "Rewards", text: "Earn QUZO through activities" },
    { icon: ChartNoAxesCombined, name: "Analytics", text: "Track performance metrics" },
  ];

  return (
    <Panel className="overflow-hidden p-0">
      <div className="grid overflow-hidden rounded-[28px] border border-[#d9e8ec] bg-[#f8fbfc] lg:grid-cols-[1fr_2fr] dark:border-[#153747] dark:bg-[#031B23]">
        <div className="relative flex flex-col justify-between gap-10 bg-white p-8 md:p-10 dark:bg-[#052832]">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#5b7885] dark:text-slate-400">
            Token utility
          </p>
          <div className="flex justify-center">
            <div className="relative h-32 w-32">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#10a67b] to-[#35d6c0] shadow-2xl" />
              <div className="absolute inset-2 flex items-center justify-center rounded-full bg-gradient-to-br from-[#0a6b4f] to-[#19a885]">
                <img src="/logos/quzo-logo-light.png" alt="QUZO" className="h-16 w-16 object-contain" />
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[#06262f] dark:text-white">{price} USDT</p>
            <p className="mt-1 text-xs text-[#5b7885] dark:text-slate-300">QUZO Coin Pre Allocation Price 1 USDT</p>
            
          </div>
        </div>
        <div className="grid gap-px bg-[#d9e8ec] sm:grid-cols-2 lg:grid-cols-2 dark:bg-white/10">
          {utilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="min-h-[150px] bg-white p-5 dark:bg-[#031B23]">
                <div className="flex gap-4">
                  <span className="font-mono text-[10px] text-[#5b7885] pt-0.5 dark:text-slate-400 shrink-0">0{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <Icon
                      size={18}
                      className="text-[#12a594] dark:text-[#19D8D0]"
                      aria-hidden="true"
                    />
                    <h3 className="mt-3 font-display text-sm font-semibold text-[#06262f] dark:text-white">{item.name}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#5b7885] dark:text-slate-300">{item.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}

function PerformancePanel() {
  const [period, setPeriod] = useState<(typeof performancePeriods)[number]>("30D");
  const percentages = { "7D": "+6.00%", "30D": "+29.92%", "90D": "+72.00%", "1Y": "+124.56%" };
  const heights = {
    "7D": [24, 40, 35, 54, 68, 61, 85],
    "30D": [30, 42, 37, 58, 52, 74, 65, 92, 83, 100],
    "90D": [22, 38, 35, 52, 48, 65, 59, 81, 76, 100],
    "1Y": [18, 30, 34, 45, 50, 62, 70, 68, 85, 100],
  } satisfies Record<(typeof performancePeriods)[number], number[]>;

  return (
    <Panel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionHeading>
          <ChartNoAxesCombined className="h-4 w-4 text-[#12a594]" aria-hidden />
          Investment performance
        </SectionHeading>
        <div className="flex gap-1 rounded-full bg-[#12a594]/[0.08] p-1">
          {performancePeriods.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPeriod(item)}
              className={`rounded-full px-2.5 py-1 text-[11px] ${item === period ? "bg-[#12a594] text-white" : "text-[#5b7885] dark:text-[#84a2ad]"
                }`}
              aria-pressed={item === period}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-3 text-xl font-bold text-[#12a594]">▲ {percentages[period]}</p>
      <div className="mt-4 flex h-[150px] items-end gap-2 rounded-xl bg-[#edf4f5] px-3 pt-3 dark:bg-[#031B23]">
        {heights[period].map((height, index) => (
          <span
            key={`${period}-${index}`}
            className="member-bar-fill flex-1 rounded-t-md bg-gradient-to-t from-[#1f5f7a] to-[#35d6c0] transition-all duration-500"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </Panel>
  );
}



export function MemberHomeDashboard() {
  const [promotionIndex, setPromotionIndex] = useState(0);

  const {
    data: dashboardSummary,
    isLoading: isDashboardLoading,
  } = useDashboardSummary();
  const walletData = dashboardSummary?.data?.[0];

  const {
    data: notificationsData,
    isLoading: isNotificationsLoading,
  } = useNotifications();
  const notifications = notificationsData?.data || [];

  const wallets = [
    {
      name: "USDT Funding Wallet",
      amount: walletData?.DepositWallet
        ? `$${Number(walletData.DepositWallet).toFixed(2)}`
        : "$0.00",
      detail: "Available Balance",
      color: "#12a594",
      tab: "deposit",
    },
    {
      name: "Working Reward Wallet",
      amount: (walletData?.WorkingWallet ?? walletData?.IncomeWallet)
        ? `$${Number(walletData.WorkingWallet ?? walletData.IncomeWallet).toFixed(2)}`
        : "$0.00",
      detail: "Available Balance",
      color: "#3aa3c4",
      tab: "income",
    },
    {
      name: "Trading Reward Wallet",
      amount: walletData?.YieldWallet
        ? `$${Number(walletData.YieldWallet).toFixed(2)}`
        : "$0.00",
      detail: "Available Balance",
      color: "#1f5f7a",
      tab: "yield",
    },
    {
      name: "QUZO Coin Wallet",
      amount: walletData?.QuzoWallet
        ? `${Number(walletData.QuzoWallet).toFixed(4)} `
        : "0.0000",
      detail: "Available QUZO",
      color: "#d9a441",
      tab: "quzo",
    },
  ];

  const totalWalletBalance = (walletData?.DepositWallet || 0) +
    (walletData?.WorkingWallet ?? walletData?.IncomeWallet ?? 0) +
    (walletData?.YieldWallet || 0) +
    (walletData?.QuzoWallet ? Number(walletData.QuzoWallet) : 0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setPromotionIndex((current) => (current + 1) % promotions.length),
      5000,
    );
    return () => window.clearInterval(timer);
  }, []);

  const currentPromotion = promotions[promotionIndex] ?? promotions[0];

  return (
    <div className="member-home space-y-4 pb-8">
      <style jsx global>{`
        @keyframes member-rise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes member-draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes member-pulse {
          0% {
            filter: drop-shadow(0 0 0 rgba(25, 227, 208, 0.75));
          }
          100% {
            filter: drop-shadow(0 0 8px rgba(25, 227, 208, 0));
          }
        }

        @keyframes member-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes member-grow {
          from {
            opacity: 0.6;
            transform: scaleY(0);
          }
          to {
            opacity: 1;
            transform: scaleY(1);
          }
        }

        .member-home > * {
          animation: member-rise 0.6s both;
        }

        .member-home > :nth-child(2) {
          animation-delay: 60ms;
        }

        .member-home > :nth-child(3) {
          animation-delay: 120ms;
        }

        .member-home > :nth-child(4) {
          animation-delay: 180ms;
        }

        .member-home > :nth-child(5) {
          animation-delay: 240ms;
        }

        .member-home > :nth-child(6) {
          animation-delay: 300ms;
        }

        .member-chart-line {
          stroke-dasharray: 1400;
          stroke-dashoffset: 1400;
          animation: member-draw 1.8s 180ms ease-out forwards;
        }

        .member-pulse {
          animation: member-pulse 1.4s ease-out infinite;
        }

        .member-bar-fill {
          transform-origin: bottom;
          animation: member-grow 0.8s ease-out both;
        }

        .member-orbit {
          transform-box: fill-box;
          transform-origin: center;
          animation: member-spin 24s linear infinite;
        }

        .member-promotion {
          animation: member-rise 0.45s both;
        }

        @media (prefers-reduced-motion: reduce) {
          .member-home *,
          .member-home *::before,
          .member-home *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
      <div className="grid gap-4 xl:grid-cols-[1.05fr_1fr]">
        <section className="relative grid min-h-[280px] overflow-hidden rounded-[22px] bg-gradient-to-br from-[#e9fbf4] via-[#c8f2e2] to-[#9fe5cf] p-6 shadow-[0_10px_30px_-14px_rgba(10,60,80,0.28)] dark:from-[#062b33] dark:via-[#08413f] dark:to-[#0a4a47] sm:grid-cols-[1.2fr_0.8fr] sm:items-center sm:p-7">
          <div className="relative z-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0b8d73] dark:text-[#7ff5e6]">
              QUZO decentralised AI platform
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-[#06262f] dark:text-white sm:text-[34px]">
              Invest. Automate.
              <span className="block">
                Grow with <span className="text-[#10a67b] dark:text-[#3fd9a9]">AI.</span>
              </span>
            </h1>
            <p className="mt-3 max-w-md text-[13px] leading-6 text-[#5b7885] dark:text-[#b9e3ea]">
              Invest in AI-powered trading bots and earn consistent, automated profits with QUZO.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/investment-amount"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#12a594] to-[#35d6c0] px-4 py-2.5 text-xs font-semibold text-white shadow-md transition hover:-translate-y-0.5"
              >
                Invest now <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
              <Link
                href="/ai-engine"
                className="rounded-xl border border-[#12a594]/30 bg-white/40 px-4 py-2.5 text-xs font-semibold text-[#087f73] transition hover:bg-white/70 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                How it works
              </Link>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-4 top-1/2 hidden w-[45%] -translate-y-1/2 place-items-center sm:grid">
            <svg viewBox="0 0 240 220" className="w-full max-w-[250px]" aria-hidden="true">
              <defs>
                <radialGradient id="home-quzo-orb" cx=".4" cy=".35">
                  <stop offset="0" stopColor="#7ff0cf" />
                  <stop offset="1" stopColor="#0a8f6a" />
                </radialGradient>
              </defs>
              <circle
                className="member-orbit"
                cx="120"
                cy="115"
                r="92"
                fill="none"
                stroke="#12a594"
                strokeOpacity=".35"
                strokeDasharray="4 8"
              />
              <circle
                className="member-orbit"
                cx="120"
                cy="115"
                r="74"
                fill="none"
                stroke="#12a594"
                strokeOpacity=".55"
                strokeDasharray="60 20"
              />
              <circle cx="120" cy="115" r="54" fill="url(#home-quzo-orb)" />
              <text x="120" y="136" textAnchor="middle" fontSize="62" fontWeight="700" fill="#fff">
                Q
              </text>
              <path
                d="m196 78 14-18 14 18m-28 12 14-18 14 18"
                fill="none"
                stroke="#12a594"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="38" cy="60" r="9" fill="#e9b949" />
              <circle cx="32" cy="165" r="6" fill="#e9b949" />
              <circle cx="205" cy="175" r="7" fill="#e9b949" />
            </svg>
          </div>
        </section>
        <CoinChart />
      </div>

      <section>
        <SectionHeading>Quick actions</SectionHeading>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-12">
          {homePageData.quickActions.map((action, index) => (
            <Link
              key={action.label}
              href={action.href}
              className="group flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-[#d9e8ec] bg-white px-2 py-3 text-center text-[11px] font-medium text-[#5b7885] shadow-sm transition hover:-translate-y-1 hover:border-[#12a594]/50 hover:shadow-lg dark:border-[#153747] dark:bg-[#07242e] dark:text-[#b9d1d8]"
            >
              <span
                className="grid h-10 w-10 place-items-center rounded-[14px] text-white shadow-md transition group-hover:scale-105"
                style={{
                  background: [
                    "linear-gradient(135deg,#12a594,#35d6c0)",
                    "linear-gradient(135deg,#1f5f7a,#3aa3c4)",
                    "linear-gradient(135deg,#3aa3c4,#8fc9cf)",
                  ][index % 3],
                }}
              >
                {action.icon}
              </span>
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      <Panel>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <SectionHeading>
              <Wallet className="h-4 w-4 text-[#12a594]" aria-hidden />
              My wallets
            </SectionHeading>
            <p className="mt-1 text-[11px] text-[#5b7885] dark:text-[#84a2ad]">
              Your balances across the QUZO ecosystem
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[10px] text-[#5b7885] dark:text-[#84a2ad]">Total balance (USD)</p>
            <p className="mt-1 text-xl font-bold text-[#06262f] dark:text-white">
              ${formatMoney(totalWalletBalance)}
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {wallets.map((wallet, index) => (
            <Link
              key={wallet.name}
              href={`/reports?tab=${wallet.tab}`}
              className="group flex items-center gap-3 rounded-2xl border p-3.5 transition hover:-translate-y-0.5 hover:shadow-md"
              style={{
                borderColor: `${wallet.color}3d`,
                backgroundColor: `${wallet.color}12`,
                animationDelay: `${index * 60}ms`,
              }}
            >
              <span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white shadow-md"
                style={{ background: `linear-gradient(135deg, ${wallet.color}, #35d6c0)` }}
              >
                <Wallet className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] text-[#5b7885] dark:text-[#84a2ad]">
                  {wallet.name}
                </span>
                <span className="block truncate text-[17px] font-semibold text-[#06262f] dark:text-white">
                  {wallet.amount}
                </span>
                <span className="block truncate text-[10px] text-[#5b7885] dark:text-[#84a2ad]">
                  {wallet.detail}
                </span>
              </span>
              <ArrowUpRight
                className="ml-auto h-4 w-4 shrink-0 text-[#5b7885] transition group-hover:text-[#12a594]"
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-3">
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
                ["Invested amount", walletData?.TradingPackage ? `$${Number(walletData.TradingPackage).toFixed(2)}` : "$0"],
                ["Booster Status", walletData?.BoosterPackage ?? "N/A"],
                ["Booster Left Time", (walletData?.Boostertype ?? "00:00:00") + " Hrs"],
                ["Rank", walletData?.UserRank ?? "N/A"],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  className="flex justify-between gap-2 border-b border-[#d9e8ec] py-2 text-[11px] last:border-0 dark:border-[#153747]"
                >
                  <span className="text-[#5b7885] dark:text-[#84a2ad]">{label}</span>
                  <strong className={index ? "text-[#12a594]" : "text-[#06262f] dark:text-white"}>
                    {value}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <PerformancePanel />

        <Panel>
          <div className="flex items-center justify-between gap-2">
            <SectionHeading>
              <Bot className="h-4 w-4 text-[#12a594]" aria-hidden />
              Rank progress
            </SectionHeading>
            <Pill>
              {walletData?.UserRank ?? "N/A"}
            </Pill>
          </div>
          <div className="mt-4 flex items-end justify-between gap-2">
            <strong className="text-2xl text-[#06262f] dark:text-white">
              {walletData?.RewardTotal && walletData?.RewardAmtQualify !== undefined
                ? `${((walletData.RewardAmtQualify / walletData.RewardTotal) * 100).toFixed(1)}`
                : "0"}%
            </strong>
            <span className="text-right text-[11px] text-[#5b7885] dark:text-[#84a2ad]">
              ${formatMoney(walletData?.RewardAmtQualify ?? 0, 0)} / $
              {formatMoney(walletData?.RewardTotal ?? 0, 0)}
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#12a594]/[0.12]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#12a594] to-[#35d6c0]"
              style={{
                width: `${walletData?.RewardTotal && walletData?.RewardAmtQualify !== undefined
                  ? (walletData.RewardAmtQualify / walletData.RewardTotal) * 100
                  : 0}%`
              }}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              ["Current Salary", `$${formatMoney(walletData?.CurrentSalary ?? 0, 0)}`],
              ["Next Rank", `${walletData?.NextRank ?? "N/A"}`],
              ["Next Salary", `$${formatMoney(walletData?.NextSalary ?? 0, 0)}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-[#edf4f5] p-2.5 dark:bg-[#031B23]">
                <span className="block text-[9px] text-[#5b7885] dark:text-[#84a2ad]">{label}</span>
                <strong className="mt-1 block text-xs text-[#06262f] dark:text-white">
                  {value}
                </strong>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Qurobot />

        <Panel>
          <div className="flex items-center justify-between gap-2">
            <SectionHeading>
              <Wallet className="h-4 w-4 text-[#12a594]" aria-hidden />
              Recent activity
            </SectionHeading>
            <Pill>● Live</Pill>
          </div>
          <div className={`mt-2 divide-y divide-dashed divide-[#d9e8ec] dark:divide-[#153747] ${notifications.length > 10 ? 'max-h-[320px] overflow-y-auto' : ''}`}>
            {isNotificationsLoading ? (
              <div className="py-4 text-center text-[11px] text-[#5b7885] dark:text-[#84a2ad]">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-4 text-center text-[11px] text-[#5b7885] dark:text-[#84a2ad]">
                No recent activity
              </div>
            ) : (
              notifications.slice(0, 8).map((item, index) => (
                <div key={index} className="flex items-center gap-2.5 py-2.5 first:pt-1">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: getNotificationColor(item.AdminRemarks) }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] font-medium text-[#06262f] dark:text-white">
                      {item.AdminRemarks}
                    </span>
                    <span className="block text-[10px] text-[#5b7885] dark:text-[#84a2ad]">
                      {formatNotificationDate(item.NotificationDate)}
                    </span>
                  </span>
                  {item.Amount && (
                    <strong className="shrink-0 text-[11px] text-[#06262f] dark:text-white">
                      {item.Amount}
                    </strong>
                  )}
                </div>
              ))
            )}
          </div>
        </Panel>

        <section
          key={currentPromotion.title}
          className="member-promotion relative min-h-[220px] overflow-hidden rounded-[20px] bg-[radial-gradient(260px_200px_at_90%_85%,#3fd9a966,transparent),linear-gradient(135deg,#06222d,#0b5260)] p-5 text-white shadow-[0_10px_30px_-14px_rgba(10,60,80,0.28)]"
        >
          <div className="relative z-10">
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold tracking-wide">
              PROMOTION {promotionIndex + 1}/{promotions.length}
            </span>
            <h2 className="mt-4 text-xl font-semibold leading-tight">{currentPromotion.title}</h2>
            <p className="mt-2 min-h-10 text-xs leading-5 text-white/80">
              {currentPromotion.detail}
            </p>
            <Link
              href={currentPromotion.href}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#12a594] to-[#35d6c0] px-3.5 py-2 text-xs font-semibold text-white"
            >
              {currentPromotion.action} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          <div className="absolute bottom-3 right-4 flex gap-1.5">
            {promotions.map((promo, index) => (
              <button
                key={promo.title}
                type="button"
                aria-label={`Show promotion ${index + 1}`}
                onClick={() => setPromotionIndex(index)}
                className={`h-1.5 rounded-full transition-all ${promotionIndex === index ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
              />
            ))}
          </div>
        </section>
      </div>


      <div className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <div className="flex items-center justify-between gap-2">
            <SectionHeading>
              <ShieldCheck className="h-4 w-4 text-[#4a7f8f]" aria-hidden />
              Top DAO partners
            </SectionHeading>
            <span className="text-[10px] text-[#5b7885] dark:text-[#84a2ad]">This week</span>
          </div>
          <div className="mt-2">
            {partners.map((partner, index) => (
              <div
                key={partner.initials}
                className="flex items-center gap-3 border-b border-dashed border-[#d9e8ec] py-2.5 last:border-0 dark:border-[#153747]"
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-semibold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${["#12a594", "#1f5f7a", "#4a7f8f", "#3aa3c4", "#d9a441"][index]}, #35d6c0)`,
                  }}
                >
                  {partner.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-xs text-[#06262f] dark:text-white">
                    {partner.name}
                  </strong>
                  <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[#12a594]/10">
                    <span
                      className="block h-full rounded-full bg-[#12a594]"
                      style={{ width: `${100 - index * 12}%` }}
                    />
                  </span>
                </span>
                <span className="text-right">
                  <strong className="block text-xs text-[#06262f] dark:text-white">
                    {partner.amount}
                  </strong>
                  <span className="text-[10px] text-[#5b7885] dark:text-[#84a2ad]">
                    {partner.volume}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center justify-between gap-2">
            <SectionHeading>
              <Gift className="h-4 w-4 text-[#d9a441]" aria-hidden />
              Reward achievers
            </SectionHeading>
            <span className="text-[10px] text-[#5b7885] dark:text-[#84a2ad]">Latest</span>
          </div>
          <div className="mt-2">
            {achievers.map((person) => (
              <div
                key={person.initials}
                className="flex items-center gap-3 border-b border-dashed border-[#d9e8ec] py-2 last:border-0 dark:border-[#153747]"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#12a594]/10 text-[10px] font-semibold text-[#118b7d] dark:text-[#6be2d2]">
                  {person.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-xs text-[#06262f] dark:text-white">
                    {person.name}
                  </strong>
                  <span className="text-[10px] text-[#5b7885] dark:text-[#84a2ad]">
                    {person.rank} · {person.time}
                  </span>
                </span>
                <span className="text-xs font-semibold text-[#12a594]">{person.reward}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
