"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  CircleDollarSign,
  Coins,
  Loader2,
  Newspaper,
  Package,
  Wallet,
} from "lucide-react";
import { ErrorState } from "@/components/ui/ErrorState";
import { RecentActivity } from "@/features/dashboard/components/RecentActivity";
import { useDashboardSummary } from "@/features/dashboard/hooks/useDashboardSummary";
import type { DashboardData } from "@/services/dashboard.service";

const marketPairs = ["BTC/USDT", "ETH/USDT", "EUR/USD", "XAU/USD", "QUZO/BTC"];
const marketLine =
  "M0 166 L20 170 L40 154 L60 149 L80 160 L100 135 L120 141 L140 117 L160 106 L180 88 L200 96 L220 84 L240 110 L260 118 L280 103 L300 124 L320 97 L340 91 L360 76 L380 65 L400 42 L420 48 L440 33 L460 38 L480 56 L500 50 L520 72 L540 66 L560 82 L580 70 L600 88 L620 61 L640 55 L660 45 L680 49 L700 33 L720 43 L740 27 L760 32 L780 18 L800 28";

const incomeWallets = [
  { label: "Income wallet", field: "IncomeWallet", color: "#12a594" },
  { label: "Performance wallet", field: "PerformanceWallet", color: "#3aa3c4" },
  { label: "Yield wallet", field: "YieldWallet", color: "#1f5f7a" },
] as const satisfies readonly {
  label: string;
  field: keyof DashboardData;
  color: string;
}[];

const accountWallets = [
  { label: "Working wallet", field: "WorkingWallet", icon: Wallet },
  { label: "Profit wallet", field: "PerformanceWallet", icon: CircleDollarSign },
  { label: "USDT wallet", field: "DepositWallet", icon: Coins },
  { label: "QUZO wallet", field: "LegacyWallet", icon: Boxes },
] as const satisfies readonly {
  label: string;
  field: keyof DashboardData;
  icon: typeof Wallet;
}[];

const incomeCards = [
  { label: "Income wallet", field: "IncomeWallet", color: "#12a594" },
  { label: "Performance wallet", field: "PerformanceWallet", color: "#3aa3c4" },
  { label: "Yield wallet", field: "YieldWallet", color: "#1f5f7a" },
  { label: "Mentor wallet", field: "MentorWallet", color: "#d9a441" },
] as const satisfies readonly {
  label: string;
  field: keyof DashboardData;
  color: string;
}[];

const withdrawalFields = [
  { label: "Performance withdrawal", field: "PerformanceWithdrawal" },
  { label: "Yield withdrawal", field: "YieldWithdrawal" },
] as const satisfies readonly {
  label: string;
  field: keyof DashboardData;
}[];

function amount(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function money(value: unknown) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount(value));
}

function number(value: unknown) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(amount(value));
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#101c24] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.12)] sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold text-slate-100">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function HomeDashboard() {
  const { data, isLoading, isError, refetch } = useDashboardSummary();
  const [activePair, setActivePair] = useState(marketPairs[0] ?? "BTC/USDT");
  const account = data?.data?.[0];

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#19e3d0]" aria-label="Loading dashboard" />
      </div>
    );
  }

  if (isError || !account) {
    return (
      <ErrorState
        title="Could not load your dashboard"
        description="Account details are not available right now. Please try again."
        onRetry={() => void refetch()}
      />
    );
  }

  const incomeValues = incomeWallets.map((item) => ({
    ...item,
    value: amount(account[item.field]),
  }));
  const totalIncomeBalances = incomeValues.reduce((total, item) => total + item.value, 0);
  const teamCount = amount(account.TotalTeam);
  const activeTeamCount = amount(account.ActiveTeam);
  const activeTeamPercent = teamCount > 0 ? Math.min((activeTeamCount / teamCount) * 100, 100) : 0;
  const directCount = amount(account.DirectIds);
  const activeDirectCount = amount(account.ActiveDirectIds);
  const activeDirectPercent =
    directCount > 0 ? Math.min((activeDirectCount / directCount) * 100, 100) : 0;

  const teamStats = [
    { label: "Total team", value: account.TotalTeam, detail: "Team members" },
    { label: "Active team", value: account.ActiveTeam, detail: "Currently active" },
    { label: "Directs", value: account.DirectIds, detail: "Direct partners" },
    { label: "Active directs", value: account.ActiveDirectIds, detail: "Currently active" },
  ];

  return (
    <div className="-mx-6 -my-6 min-h-full bg-[#0b1218] px-4 py-5 text-slate-100 sm:px-6 lg:px-7">
      <div className="mx-auto w-full max-w-[1500px] space-y-5 pb-8">
        <section className="relative overflow-hidden rounded-2xl border border-[#19e3d0]/15 bg-[radial-gradient(ellipse_at_top_right,rgba(25,227,208,0.12),transparent_38%),linear-gradient(135deg,#101c24,#0e2429_58%,#102b30)] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.2)] sm:p-7">
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Market pair">
                {marketPairs.map((pair) => (
                  <button
                    key={pair}
                    type="button"
                    role="tab"
                    aria-selected={activePair === pair}
                    onClick={() => setActivePair(pair)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                      activePair === pair
                        ? "border-[#19e3d0]/40 bg-[#19e3d0]/10 text-[#7af4e5]"
                        : "border-white/[0.08] bg-white/[0.025] text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    {pair}
                  </button>
                ))}
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/15 bg-amber-300/[0.06] px-3 py-1.5 text-[11px] text-amber-200/80">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                Illustrative market preview
              </span>
            </div>
            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {activePair}
              </h1>
              <span className="text-sm text-slate-500">Market overview</span>
            </div>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  67,692.15
                </span>
                <span className="text-sm font-medium text-[#4ff3c9]">▲ 0.11%</span>
              </div>
              <span className="text-xs text-slate-500">Sample price · not a live quote</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-[#4ff3c9]">
              <ArrowUpRight className="h-4 w-4" aria-hidden />
              Sample chart · market data is not connected
            </div>
            <div className="mt-5 h-44 w-full overflow-hidden sm:h-52">
              <svg
                viewBox="0 0 800 200"
                preserveAspectRatio="none"
                className="h-full w-full"
                role="img"
                aria-label={`Illustrative ${activePair} market chart`}
              >
                <defs>
                  <linearGradient id="dashboard-chart-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#19e3d0" stopOpacity=".32" />
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
                <path d={`${marketLine} L800 200 L0 200 Z`} fill="url(#dashboard-chart-fill)" />
                <path
                  d={marketLine}
                  fill="none"
                  stroke="#19e3d0"
                  strokeWidth="2.4"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              Illustrative only. No live quotes or investment performance are represented.
            </p>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Trading package">
            <div className="grid gap-5 sm:grid-cols-[150px_1fr] sm:items-center">
              <div className="relative mx-auto grid h-36 w-36 place-items-center rounded-full border-[10px] border-[#1c3138]">
                <div className="absolute inset-[-10px] rounded-full border-[10px] border-[#12a594] border-r-transparent border-t-transparent [transform:rotate(-45deg)]" />
                <div className="text-center">
                  <p className="text-2xl font-semibold text-white">
                    {account.TradingPackage == null
                      ? "—"
                      : amount(account.TradingPackage) > 0
                        ? "Active"
                        : "Inactive"}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">Package status</p>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#12a594]/10 text-[#53d9c6]">
                    <Package className="h-4 w-4" aria-hidden />
                  </span>
                  Trading package
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/[0.035] p-3">
                    <p className="text-xs text-slate-500">Package value</p>
                    <p className="mt-1 font-semibold text-white">
                      {account.TradingPackage == null ? "—" : money(account.TradingPackage)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/[0.035] p-3">
                    <p className="text-xs text-slate-500">Current rank</p>
                    <p className="mt-1 truncate font-semibold text-white">
                      {account.UserRank || "Not available"}
                    </p>
                  </div>
                </div>
                <Link
                  href="/investment-amount"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#66e8d8] hover:text-white"
                >
                  View packages
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </Panel>

          <Panel title="Wallet balance overview">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs text-slate-400">Available account balances</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
                  {money(totalIncomeBalances)}
                </p>
              </div>
              <span className="rounded-full bg-[#12a594]/10 px-2.5 py-1 text-[11px] text-[#63dfcc]">
                From account data
              </span>
            </div>
            <div className="mt-5 flex h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
              {incomeValues.map((item) => (
                <div
                  key={item.field}
                  className="h-full"
                  style={{
                    width:
                      totalIncomeBalances > 0
                        ? `${(item.value / totalIncomeBalances) * 100}%`
                        : "0%",
                    backgroundColor: item.color,
                  }}
                />
              ))}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {incomeValues.map((item) => (
                <div key={item.field} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="min-w-0 flex-1 truncate text-slate-400">{item.label}</span>
                  <span className="font-medium text-slate-200">{money(item.value)}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <section aria-labelledby="income-wallets-heading">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 id="income-wallets-heading" className="text-lg font-semibold text-white">
              Wallets
            </h2>
            <Link
              href="/reports"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#66e8d8] hover:text-white"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {incomeCards.map((item) => (
              <article
                key={item.field}
                className="rounded-2xl border border-white/[0.08] bg-[#101c24] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-400">{item.label}</span>
                  <span
                    className="grid h-8 w-8 place-items-center rounded-lg"
                    style={{ color: item.color, backgroundColor: `${item.color}1a` }}
                  >
                    <Wallet className="h-4 w-4" aria-hidden />
                  </span>
                </div>
                <p className="mt-4 text-xl font-semibold text-white">
                  {money(account[item.field])}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">Current balance</p>
              </article>
            ))}
          </div>
        </section>

        <Panel title="Team business">
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="flex items-center gap-4 rounded-xl bg-white/[0.025] p-4">
              <div
                className="relative grid h-28 w-28 shrink-0 place-items-center rounded-full"
                style={{
                  background: `conic-gradient(#19e3d0 ${activeTeamPercent}%, rgba(255,255,255,0.08) ${activeTeamPercent}% 100%)`,
                }}
              >
                <div className="grid h-[5.25rem] w-[5.25rem] place-items-center rounded-full bg-[#101c24] text-center">
                  <span>
                    <strong className="block text-xl text-white">
                      {Math.round(activeTeamPercent)}%
                    </strong>
                    <small className="text-[10px] text-slate-500">active team</small>
                  </span>
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400">Team business</p>
                <p className="mt-1 text-2xl font-semibold text-white">
                  {money(amount(account.LeftBussiness) + amount(account.RightBussiness))}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Left {money(account.LeftBussiness)} · Right {money(account.RightBussiness)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {teamStats.map((item) => (
                <div key={item.label} className="rounded-xl border border-white/[0.06] p-3">
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{item.value ?? "—"}</p>
                  <p className="mt-1 text-[10px] text-slate-500">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-4 border-t border-white/[0.07] pt-4 sm:grid-cols-2">
            <div>
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-slate-400">Active team</span>
                <span className="text-slate-200">
                  {number(account.ActiveTeam)} / {number(account.TotalTeam)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                <div
                  className="h-full rounded-full bg-[#19e3d0]"
                  style={{ width: `${activeTeamPercent}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-slate-400">Active direct partners</span>
                <span className="text-slate-200">
                  {number(account.ActiveDirectIds)} / {number(account.DirectIds)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                <div
                  className="h-full rounded-full bg-[#3aa3c4]"
                  style={{ width: `${activeDirectPercent}%` }}
                />
              </div>
            </div>
          </div>
        </Panel>

        <div className="grid gap-4 xl:grid-cols-2">
          <Panel
            title="Wallets"
            action={
              <Link href="/reports" className="text-xs font-medium text-[#66e8d8] hover:text-white">
                Manage
              </Link>
            }
          >
            <div className="space-y-2">
              {accountWallets.map(({ label, field, icon: Icon }) => (
                <div
                  key={field}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.025] px-3 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#19e3d0]/[0.08] text-[#54d9c9]">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{label}</p>
                      <p className="text-[10px] text-slate-500">Account balance</p>
                    </div>
                  </div>
                  <span className="font-semibold tabular-nums text-white">
                    {money(account[field])}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Withdrawals">
            <div className="space-y-2">
              {withdrawalFields.map((item) => (
                <div
                  key={item.field}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.025] px-3 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#d9a441]/10 text-[#e7bb67]">
                      <ArrowDownToLine className="h-4 w-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{item.label}</p>
                      <p className="text-[10px] text-slate-500">Recorded withdrawal amount</p>
                    </div>
                  </div>
                  <span className="font-semibold tabular-nums text-white">
                    {money(account[item.field])}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/fund-director?tab=withdrawal"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#19e3d0]/20 px-3 py-2 text-xs font-medium text-[#66e8d8] transition hover:bg-[#19e3d0]/[0.06]"
            >
              Withdrawal options
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </Panel>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.08] bg-[#101c24] p-3 sm:p-4">
            <RecentActivity />
          </div>
          <Panel title="Live news">
            <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.1] px-5 text-center">
              <Newspaper className="h-8 w-8 text-slate-600" aria-hidden />
              <p className="mt-3 text-sm font-medium text-slate-300">News feed unavailable</p>
              <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                A live news source is not connected yet. Market headlines are not shown as live
                content.
              </p>
            </div>
          </Panel>
        </div>

        <p className="flex items-start gap-2 rounded-xl border border-amber-300/10 bg-amber-300/[0.035] px-4 py-3 text-[11px] leading-5 text-slate-500">
          <BarChart3 className="mt-0.5 h-4 w-4 shrink-0 text-amber-200/70" aria-hidden />
          Account figures are loaded from your dashboard data. Market chart is illustrative only;
          daily rewards are not guaranteed. AI strategy yield income, if applicable, is paid in
          USDT.
        </p>
      </div>
    </div>
  );
}
