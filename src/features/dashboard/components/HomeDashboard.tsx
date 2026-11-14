"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Bell,
  Boxes,
  ChartNoAxesCombined,
  CircleDollarSign,
  Coins,
  Handshake,
  Newspaper,
  Package,
  Shield,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { homeDashboardData } from "@/features/dashboard/constants/home-dashboard";
import { useDashboardSummary } from "@/features/dashboard/hooks/useDashboardSummary";

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

function Panel({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#101c24] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.12)] sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold text-slate-100">
          {icon}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Sparkline({ path, color, id }: { path: string; color: string; id: string }) {
  return (
    <svg viewBox="0 0 100 38" preserveAspectRatio="none" className="h-10 w-full">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".3" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L100 38 L0 38 Z`} fill={`url(#${id})`} />
      <path
        className="dashboard-chart-line"
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

const marketVolatility: Record<string, number> = {
  "BTC/USDT": 0.0006,
  "ETH/USDT": 0.0009,
  "EUR/USD": 0.0002,
  "XAU/USD": 0.0004,
  "QUZO/BTC": 0.004,
};

function getMarketPrice(pair: string) {
  const price = homeDashboardData.market.pairs.find((item) => item.symbol === pair)?.price;
  return Number(price?.replaceAll(",", "")) || 1;
}

function formatMarketPrice(value: number) {
  if (value < 0.00001) return value.toFixed(8);
  if (value < 0.01) return value.toFixed(4);
  if (value < 10) return value.toFixed(4);
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function LiveMarketPanel() {
  const [activePair, setActivePair] = useState<string>(homeDashboardData.market.pairs[0]!.symbol);
  const [prices, setPrices] = useState<number[]>([]);
  const basePrice = getMarketPrice(activePair);
  const volatility = marketVolatility[activePair] ?? 0.0005;

  useEffect(() => {
    const openingPrice = getMarketPrice(activePair);
    const initialPrices = Array.from({ length: 50 }, (_, index) => {
      const progress = index / 49;
      const shape = 1 + progress * 0.006 + Math.sin(index * 0.72) * volatility * 2;
      return openingPrice * shape;
    });
    initialPrices[0] = openingPrice;
    setPrices(initialPrices);

    const timer = window.setInterval(() => {
      setPrices((currentPrices) => {
        if (currentPrices.length === 0) return currentPrices;
        const lastPrice = currentPrices[currentPrices.length - 1]!;
        const change = (Math.random() - 0.48) * volatility * 2;
        return [...currentPrices.slice(1), lastPrice * (1 + change)];
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activePair, volatility]);

  const latestPrice = prices[prices.length - 1] ?? basePrice;
  const openingPrice = prices[0] ?? basePrice;
  const changePercent = openingPrice ? (latestPrice / openingPrice - 1) * 100 : 0;
  const minimum = Math.min(...prices, basePrice);
  const maximum = Math.max(...prices, basePrice);
  const chartPath = prices
    .map((price, index) => {
      const x = index * (800 / Math.max(prices.length - 1, 1));
      const y = 186 - ((price - minimum) / (maximum - minimum || 1)) * 152;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const latestY = 186 - ((latestPrice - minimum) / (maximum - minimum || 1)) * 152;

  return (


    <section className="dashboard-market-hero relative overflow-hidden rounded-2xl border border-[#19e3d0]/15 bg-[radial-gradient(ellipse_at_top_right,rgba(25,227,208,0.12),transparent_38%),linear-gradient(135deg,#101c24,#0e2429_58%,#102b30)] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.2)] sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Market pair">
          {homeDashboardData.market.pairs.map((pair) => (
            <button
              key={pair.symbol}
              type="button"
              role="tab"
              aria-selected={activePair === pair.symbol}
              onClick={() => setActivePair(pair.symbol)}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${activePair === pair.symbol
                ? "border-[#19e3d0]/40 bg-[#19e3d0]/10 text-[#7af4e5]"
                : "border-white/[0.08] bg-white/[0.025] text-slate-400 hover:text-slate-100"
                }`}
            >
              {pair.symbol}
            </button>
          ))}
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-1.5 text-[11px] text-emerald-200/80">
          <span className="dashboard-live-dot h-1.5 w-1.5 rounded-full bg-emerald-300" />
          Simulated live market
        </span>
      </div>
      <div className="mt-5 flex flex-wrap items-baseline gap-3">
        <span className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {formatMarketPrice(latestPrice)}
        </span>
        <span
          className={`text-sm font-medium ${changePercent >= 0 ? "text-[#4ff3c9]" : "text-rose-300"}`}
        >
          {changePercent >= 0 ? "▲" : "▼"} {Math.abs(changePercent).toFixed(2)}%
        </span>
        <span className="text-xs text-slate-500">{activePair}</span>
      </div>
      <div className="mt-5 h-44 w-full overflow-hidden sm:h-52">
        <svg
          viewBox="0 0 800 200"
          preserveAspectRatio="none"
          className="h-full w-full"
          role="img"
          aria-label={`Simulated ${activePair} market price chart, updating every second`}
        >
          <defs>
            <linearGradient id="market-chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#19e3d0" stopOpacity=".45" />
              <stop offset="1" stopColor="#19e3d0" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[40, 80, 120, 160].map((y) => (
            <line
              key={y}
              x1="0"
              x2="800"
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="3 5"
            />
          ))}
          {prices.length > 1 && (
            <>
              <path d={`${chartPath} L800 200 L0 200 Z`} fill="url(#market-chart-fill)" />
              <path
                d={chartPath}
                fill="none"
                stroke="#19e3d0"
                strokeWidth="2.4"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              <circle className="dashboard-live-dot" cx="800" cy={latestY} r="4" fill="#6ff5e3" />
            </>
          )}
        </svg>
      </div>
      <p className="mt-2 text-[11px] text-slate-500">
        Simulated sample prices update every second; they are not exchange or live trading data.
      </p>
    </section>
  );
}

export function HomeDashboard() {
  const totalIncome = homeDashboardData.income.total;
  const packageInfo = homeDashboardData.package;
  const team = homeDashboardData.team;
  const quzoPrice = homeDashboardData.quzoPrice;
  const {
    data: dashboardSummary,
    isLoading: isDashboardLoading,
    isError: dashboardError,
  } = useDashboardSummary();
  const walletData = dashboardSummary?.data?.[0];
  const wallets = [
    {
      name: "Working Wallet",
      value: walletData?.WorkingWallet ?? walletData?.IncomeWallet,
      note: "Working balance",
    },
    {
      name: "Yield Wallet",
      value: walletData?.YieldWallet,
      note: "Yield balance",
    },
    { name: "USDT Wallet", value: walletData?.DepositWallet, note: "USDT balance" },
    { name: "QUZO Wallet", value: walletData?.QuzoWallet, note: "QUZO balance", },
  ];

  return (
    <div className="dashboard-page -mx-6 -my-6 min-h-full bg-[#0b1218] px-4 py-5 text-slate-100 sm:px-6 lg:px-7">
      <style jsx global>{`
        @keyframes dashboard-enter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes dashboard-draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes dashboard-pulse {
          0%,
          100% {
            opacity: 0.65;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .dashboard-page > .mx-auto > * {
          animation: dashboard-enter 0.55s both;
        }

        .dashboard-page > .mx-auto > :nth-child(2) {
          animation-delay: 60ms;
        }

        .dashboard-page > .mx-auto > :nth-child(3) {
          animation-delay: 120ms;
        }

        .dashboard-page > .mx-auto > :nth-child(4) {
          animation-delay: 180ms;
        }

        .dashboard-page > .mx-auto > :nth-child(5) {
          animation-delay: 240ms;
        }

        .dashboard-page > .mx-auto > :nth-child(6) {
          animation-delay: 300ms;
        }

        .dashboard-chart-line {
          stroke-dasharray: 1400;
          stroke-dashoffset: 1400;
          animation: dashboard-draw 1.8s 150ms ease-out forwards;
        }

        .dashboard-page .dashboard-ring {
          transition: stroke-dashoffset 1.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .dashboard-page .dashboard-live-dot {
          transform-box: fill-box;
          transform-origin: center;
          animation: dashboard-pulse 1.4s ease-in-out infinite;
        }

        .dashboard-page {
          background-color: #edf4f5;
          color: #06262f;
        }

        .dark .dashboard-page {
          background-color: #031b23;
          color: #e6f7f9;
        }

        .dashboard-page [class*="bg-[#101c24]"] {
          background-color: #fff;
        }

        .dark .dashboard-page [class*="bg-[#101c24]"] {
          background-color: #07242e;
        }

        .dashboard-page [class*="border-white/"] {
          border-color: #d9e8ec;
        }

        .dark .dashboard-page [class*="border-white/"] {
          border-color: #153747;
        }

        .dashboard-page [class*="bg-white/"] {
          background-color: rgb(18 165 148 / 4%);
        }

        .dark .dashboard-page [class*="bg-white/"] {
          background-color: rgb(255 255 255 / 4%);
        }

        .dashboard-page [class*="text-white"],
        .dashboard-page [class*="text-slate-100"],
        .dashboard-page [class*="text-slate-200"] {
          color: #06262f;
        }

        .dashboard-page [class*="text-slate-300"],
        .dashboard-page [class*="text-slate-400"],
        .dashboard-page [class*="text-slate-500"],
        .dashboard-page [class*="text-slate-600"] {
          color: #5b7885;
        }

        .dark .dashboard-page [class*="text-white"],
        .dark .dashboard-page [class*="text-slate-100"],
        .dark .dashboard-page [class*="text-slate-200"] {
          color: #e6f7f9;
        }

        .dark .dashboard-page [class*="text-slate-300"] {
          color: #b9d1d8;
        }

        .dark .dashboard-page [class*="text-slate-400"],
        .dark .dashboard-page [class*="text-slate-500"],
        .dark .dashboard-page [class*="text-slate-600"] {
          color: #84a2ad;
        }

        .dashboard-page [class*="text-[#66e8d8]"],
        .dashboard-page [class*="text-[#7af4e5]"] {
          color: #087f73;
        }

        .dark .dashboard-page [class*="text-[#66e8d8]"],
        .dark .dashboard-page [class*="text-[#7af4e5]"] {
          color: #7ff5e6;
        }

        .dashboard-page .dashboard-market-hero [class*="text-white"] {
          color: #e6f7f9;
        }

        .dashboard-page .dashboard-market-hero [class*="text-slate-"] {
          color: #9fb8c0;
        }

        .dashboard-page .dashboard-income-panel [class*="text-white"] {
          color: #fff;
        }

        .dashboard-page .dashboard-income-panel [class*="text-slate-"] {
          color: #9fd9e3;
        }

        @media (prefers-reduced-motion: reduce) {
          .dashboard-page *,
          .dashboard-page *::before,
          .dashboard-page *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
      <div className="mx-auto w-full max-w-[1500px] space-y-5 pb-8">
        <LiveMarketPanel />

        <section aria-labelledby="trading-package-heading">
          <h2 id="trading-package-heading" className="mb-3 text-lg font-semibold text-white">
            Trading package
          </h2>
          <div className="grid gap-4 xl:grid-cols-2">
            <article className="grid gap-5 rounded-2xl border border-white/[0.08] bg-[#101c24] p-4 sm:grid-cols-[150px_1fr] sm:items-center sm:p-5">
              <div className="relative mx-auto grid h-36 w-36 place-items-center">
                <svg viewBox="0 0 150 150" className="absolute inset-0 h-full w-full -rotate-90">
                  <defs>
                    <linearGradient id="package-ring-gradient">
                      <stop offset="0" stopColor="#12a594" />
                      <stop offset="1" stopColor="#1f5f7a" />
                    </linearGradient>
                  </defs>
                  <circle cx="75" cy="75" r="60" fill="none" stroke="#1c3138" strokeWidth="10" />
                  <circle
                    className="dashboard-ring"
                    cx="75"
                    cy="75"
                    r="60"
                    fill="none"
                    stroke="url(#package-ring-gradient)"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 60}`}
                    strokeDashoffset={`${2 * Math.PI * 60 * (1 - packageInfo.capUsedPercent / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-white">{packageInfo.capUsedPercent}%</p>
                  <p className="mt-1 text-[11px] text-slate-400">cap used</p>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#12a594]/10 text-[#53d9c6]">
                    <Boxes className="h-4 w-4" aria-hidden />
                  </span>
                  {packageInfo.name} · {packageInfo.multiplier}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { label: "Investment", value: money(packageInfo.investment) },
                    { label: "Total income cap", value: money(packageInfo.totalIncomeCap) },
                    { label: "Remaining cap", value: money(packageInfo.remainingCap) },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-white/[0.035] p-3">
                      <p className="text-[10px] leading-4 text-slate-500">{item.label}</p>
                      <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#12a594] to-[#3aa3c4]"
                    style={{ width: `${packageInfo.capUsedPercent}%` }}
                  />
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-white/[0.08] bg-[#101c24] p-4 sm:p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#d9a441]/10 text-[#e7bb67]">
                  <Coins className="h-4 w-4" aria-hidden />
                </span>
                QUZO / BTC sample price
              </div>
              <p className="mt-4 text-2xl font-semibold text-white">
                {quzoPrice.value}{" "}
                <span className="text-base font-medium text-slate-400">{quzoPrice.unit}</span>
              </p>
              <p className="mt-1 text-xs text-[#4ff3c9]">
                ▲ {quzoPrice.change} · {quzoPrice.period} sample
              </p>
              <div className="mt-5">
                <Sparkline
                  id="quzo-price-sparkline"
                  color="#d9a441"
                  path="M0 21 L8 23 L15 19 L23 20 L31 23 L38 18 L46 14 L54 16 L62 11 L69 6 L77 9 L85 11 L92 13 L100 12"
                />
              </div>
            </article>
          </div>
        </section>

        <section aria-labelledby="income-heading">
          <h2 id="income-heading" className="mb-3 text-lg font-semibold text-white">
            Income
          </h2>
          <div className="dashboard-income-panel rounded-2xl border border-white/[0.08] bg-[#122a32] p-4 sm:p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#9fd9e3]">Total income earned</p>
                <p className="mt-1 text-3xl font-semibold text-white">{money(totalIncome)}</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/[0.08] px-3 py-1.5 text-[11px] text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Sample data
              </span>
            </div>
            <div className="mt-5 flex h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
              {homeDashboardData.income.categories.map((category) => (
                <span
                  key={category.name}
                  className="h-full"
                  style={{ width: `${category.percent}%`, backgroundColor: category.color }}
                />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {homeDashboardData.income.categories.map((category) => (
                <span
                  key={category.name}
                  className="flex items-center gap-2 text-xs text-slate-400"
                >
                  <i
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="min-w-0 flex-1 truncate">{category.name}</span>
                  <b className="font-medium text-slate-200">{category.percent}%</b>
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {homeDashboardData.income.categories.map((category, index) => (
              <article
                key={category.name}
                className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101c24] p-4"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-xl"
                    style={{ color: category.color, backgroundColor: `${category.color}20` }}
                  >
                    {index === 0 ? (
                      <Users className="h-5 w-5" aria-hidden />
                    ) : index === 1 ? (
                      <ChartNoAxesCombined className="h-5 w-5" aria-hidden />
                    ) : index === 2 ? (
                      <Handshake className="h-5 w-5" aria-hidden />
                    ) : index === 3 ? (
                      <Zap className="h-5 w-5" aria-hidden />
                    ) : index === 4 ? (
                      <Shield className="h-5 w-5" aria-hidden />
                    ) : index === 5 ? (
                      <Package className="h-5 w-5" aria-hidden />
                    ) : (
                      <CircleDollarSign className="h-5 w-5" aria-hidden />
                    )}
                  </span>
                  <span className="rounded-full bg-white/[0.05] px-2 py-1 text-[10px] text-slate-300">
                    {category.change}
                  </span>
                </div>
                <h3 className="mt-3 text-xs font-medium text-slate-400">{category.name} Income</h3>
                <p className="mt-1 text-xl font-semibold text-white">{money(category.amount)}</p>
                <div className="mt-3">
                  <Sparkline
                    id={`income-sparkline-${index}`}
                    color={category.color}
                    path={category.chart}
                  />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-1 border-t border-white/[0.07] pt-3">
                  {[
                    { label: "Today", value: category.today },
                    { label: "This month", value: category.month },
                    { label: "All time", value: category.allTime },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <p className="text-[9px] text-slate-500">{metric.label}</p>
                      <p className="mt-1 text-[10px] font-medium text-slate-200">
                        {money(metric.value)}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="team-business-heading">
          <h2 id="team-business-heading" className="mb-3 text-lg font-semibold text-white">
            Team business
          </h2>
          <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <Panel title="Team overview">
              <div className="flex flex-wrap items-center gap-5">
                <div className="relative grid h-32 w-32 shrink-0 place-items-center rounded-full bg-[conic-gradient(#19e3d0_70%,#1d3339_70%)]">
                  <div className="grid h-24 w-24 place-items-center rounded-full bg-[#101c24] text-center">
                    <span>
                      <b className="block text-2xl text-white">{team.activePercent}%</b>
                      <small className="text-[10px] text-slate-500">active team</small>
                    </span>
                  </div>
                </div>
                <div className="grid flex-1 grid-cols-2 gap-3">
                  {[
                    { label: "Total team", value: team.total },
                    { label: "Active", value: team.active },
                    { label: "Inactive", value: team.inactive },
                    { label: "Directs", value: team.directs },
                  ].map((metric) => (
                    <div key={metric.label} className="rounded-xl bg-white/[0.035] p-3">
                      <p className="text-[11px] text-slate-500">{metric.label}</p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {formatNumber(metric.value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-4">
                <div>
                  <p className="text-[11px] text-slate-500">Active directs</p>
                  <p className="mt-1 font-semibold text-white">
                    {team.directActivePercent}%{" "}
                    <span className="text-xs font-normal text-slate-400">
                      ({team.activeDirects} of {team.directs})
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Levels open</p>
                  <p className="mt-1 font-semibold text-white">
                    {team.levelsOpen} / {team.levelsTotal}
                  </p>
                </div>
              </div>
            </Panel>

            <Panel title="Team business">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-3xl font-semibold text-white">{money(team.business)}</p>
                  <p className="mt-1 text-xs text-slate-500">Total team business</p>
                </div>
                <span className="rounded-full bg-emerald-400/[0.08] px-2.5 py-1 text-xs text-emerald-300">
                  ▲ {team.businessChange}
                </span>
              </div>
              <div className="mt-5 space-y-4">
                {[
                  {
                    label: "Power team business",
                    value: team.powerBusiness,
                    percent: team.powerPercent,
                    color: "#19e3d0",
                  },
                  {
                    label: "Weaker team business",
                    value: team.weakerBusiness,
                    percent: team.weakerPercent,
                    color: "#3aa3c4",
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-1.5 flex justify-between gap-3 text-xs">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="font-medium text-slate-200">
                        {money(item.value)} · {item.percent}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-4">
                <div>
                  <p className="text-[11px] text-slate-500">Power vs weaker team</p>
                  <p className="mt-1 text-sm text-slate-200">
                    Power {team.powerPercent}% · Weaker {team.weakerPercent}%
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Power Team ID No.</p>
                  <p className="mt-1 text-sm font-semibold text-white">{team.powerTeamId}</p>
                </div>
              </div>
            </Panel>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101c24]">
            <div className="border-b border-white/[0.07] px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-200">Team metrics</h3>
            </div>
            <div className="grid grid-cols-[1fr_0.8fr_1fr_0.8fr] gap-2 px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
              <span>Metric</span>
              <span>Value</span>
              <span>Progress</span>
              <span>Status</span>
            </div>
            {[
              {
                category: "Directs",
                metric: "Direct ID",
                value: String(team.directs),
                progress: `${team.activeDirects} active`,
                status: `${team.directActivePercent}% active`,
                percent: team.directActivePercent,
              },
              {
                category: "Team",
                metric: "Total Team",
                value: formatNumber(team.total),
                progress: `▲ ${team.newMembers} new`,
                status: `${team.activePercent}% active`,
                percent: team.activePercent,
              },
              {
                category: "Business",
                metric: "Team Business",
                value: money(team.business),
                progress: team.businessChange,
                status: "Sample",
                percent: 100,
              },
            ].map((row) => (
              <div
                key={row.metric}
                className="grid grid-cols-[1fr_0.8fr_1fr_0.8fr] items-center gap-2 border-t border-white/[0.06] px-4 py-3 text-xs"
              >
                <span>
                  <span className="block text-[10px] text-slate-500">{row.category}</span>
                  <span className="text-slate-200">{row.metric}</span>
                </span>
                <span className="font-medium text-white">{row.value}</span>
                <span>
                  <span className="text-slate-400">{row.progress}</span>
                  <span className="mt-1 block h-1 overflow-hidden rounded-full bg-white/[0.07]">
                    <i
                      className="block h-full rounded-full bg-[#19e3d0]"
                      style={{ width: `${row.percent}%` }}
                    />
                  </span>
                </span>
                <span className="text-slate-400">{row.status}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-2">
          <Panel
            title="Wallets"
            icon={<Wallet className="h-4 w-4 text-[#19e3d0]" aria-hidden />}
            action={
              <Link href="/reports" className="text-xs font-medium text-[#66e8d8] hover:text-white">
                Manage
              </Link>
            }
          >
            <div className="grid gap-2 sm:grid-cols-2">
              {wallets.map((item, index) => (
                <article
                  key={item.name}
                  className="rounded-xl border border-white/[0.05] bg-white/[0.025] p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-400">{item.name}</span>
                    <span className="text-[#54d9c9]">
                      {index === 0 ? (
                        <Wallet className="h-4 w-4" aria-hidden />
                      ) : index === 1 ? (
                        <CircleDollarSign className="h-4 w-4" aria-hidden />
                      ) : index === 2 ? (
                        <Coins className="h-4 w-4" aria-hidden />
                      ) : (
                        <Boxes className="h-4 w-4" aria-hidden />
                      )}
                    </span>
                  </div>
                  <p className="mt-3 text-xl font-semibold text-white">
                    {isDashboardLoading
                      ? "Loading..."
                      : dashboardError || item.value === undefined || item.value === null
                        ? "Unavailable"
                        : "token" in item
                          ? formatNumber(Number(item.value) || 0)
                          : money(Number(item.value) || 0)}
                    {"token" in item && typeof item.token === "string" && (
                      <span className="ml-1 text-xs font-medium text-slate-400">{item.token}</span>
                    )}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">{item.note}</p>
                </article>
              ))}
            </div>
          </Panel>

          <Panel
            title="Withdrawal"
            icon={<ArrowDownToLine className="h-4 w-4 text-[#d9a441]" aria-hidden />}
          >
            <div className="space-y-2">
              {homeDashboardData.withdrawals.map((item) => (
                <div
                  key={item.name}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/[0.025] px-3 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-200">{item.name}</p>
                    <p className="mt-1 text-[10px] text-slate-500">Available to withdraw</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold tabular-nums text-white">
                      {money(item.value)}
                    </span>
                    <Link
                      href="/fund-director?tab=withdrawal"
                      className="rounded-lg border border-[#19e3d0]/20 px-3 py-1.5 text-xs font-medium text-[#66e8d8] hover:bg-[#19e3d0]/[0.06]"
                    >
                      Withdraw
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Panel
            title="Notifications"
            icon={<Bell className="h-4 w-4 text-[#19e3d0]" aria-hidden />}
            action={
              <span className="rounded-full bg-[#19e3d0]/[0.08] px-2 py-1 text-[10px] text-[#66e8d8]">
                Sample
              </span>
            }
          >
            <div className="divide-y divide-white/[0.06]">
              {homeDashboardData.notifications.map((item) => (
                <div
                  key={item.text}
                  className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#19e3d0]" />
                    <p className="text-xs leading-5 text-slate-300">{item.text}</p>
                  </div>
                  <time className="shrink-0 text-[10px] text-slate-500">{item.time}</time>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            title="Live news"
            icon={<Newspaper className="h-4 w-4 text-[#3aa3c4]" aria-hidden />}
            action={
              <span className="rounded-full bg-amber-300/[0.08] px-2 py-1 text-[10px] text-amber-200">
                Static preview
              </span>
            }
          >
            <div className="divide-y divide-white/[0.06]">
              {homeDashboardData.news.map((item) => (
                <article
                  key={item.headline}
                  className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#3aa3c4]/10 text-[#64bfd0]">
                    <Newspaper className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-xs leading-5 text-slate-200">{item.headline}</h3>
                    <p className="mt-1 text-[10px] text-slate-500">{item.source} · sample</p>
                  </div>
                  <ArrowUpRight
                    className="ml-auto mt-1 h-3.5 w-3.5 shrink-0 text-slate-600"
                    aria-hidden
                  />
                </article>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
