"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { homePageData } from "@/features/dashboard/constants/home-page";

const periods = ["1D", "7D", "30D", "90D", "1Y"] as const;
const pathForAnalytics = homePageData.analytics.values
  .map((value, index) => {
    const x = (index / (homePageData.analytics.values.length - 1)) * 600;
    const y = 160 - value * 1.5;
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  })
  .join(" ");

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function SectionTitle({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
      {detail && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p>}
    </div>
  );
}

function HomeCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_24px_rgba(13,44,55,0.05)] dark:border-white/[0.08] dark:bg-[#101c24] sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}

export function HomePageDashboard() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("30D");
  const [currency, setCurrency] = useState<"BTC" | "USD">("BTC");
  const bot = homePageData.bot;
  const rank = homePageData.rank;

  return (
    <main className="min-h-screen bg-[#f3f8f7] px-4 py-5 text-slate-900 dark:bg-[#0b1218] dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px] space-y-5">

        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="relative overflow-hidden rounded-2xl border border-[#1f5f7a]/20 bg-gradient-to-br from-[#102e36] via-[#123f48] to-[#0c685e] p-6 text-white shadow-sm sm:p-8">
            <div className="pointer-events-none absolute -right-14 -top-20 h-72 w-72 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-3 -top-10 h-52 w-52 rounded-full border border-white/10" />
            <div className="relative max-w-2xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal-100/80">
                QUZO decentralised AI platform
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.08] sm:text-5xl">
                Invest. Automate.
                <span className="mt-1 block">
                  Grow with <span className="text-[#7ff0cf]">AI.</span>
                </span>
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-teal-50/80">
                Invest in AI-powered trading bots and earn consistent, automated profits with QUZO.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/investment-amount"
                  className="rounded-lg bg-[#7ff0cf] px-4 py-2.5 text-sm font-semibold text-[#103c38] transition hover:bg-[#a0f4dc]"
                >
                  Invest now <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/landing#ecosystem"
                  className="rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  How it works
                </Link>
              </div>
            </div>
            <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[40%] items-center justify-center sm:flex">
              <div className="relative grid h-48 w-48 place-items-center rounded-full border border-[#7ff0cf]/15">
                <div className="absolute h-36 w-36 rounded-full border border-[#7ff0cf]/20" />
                <div className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-[#7ff0cf] to-[#0a8f6a] text-6xl font-bold text-white shadow-[0_0_60px_rgba(127,240,207,0.28)]">
                  Q
                </div>
              </div>
            </div>
          </section>

          <HomeCard>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#12a594]/10 font-bold text-[#12a594]">
                  Q
                </span>
                QUZO Coin (QZ)
              </div>
              <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-white/[0.04]">
                {periods.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPeriod(item)}
                    aria-pressed={period === item}
                    className={`rounded-md px-2 py-1 text-[10px] transition ${period === item
                      ? "bg-[#12a594] text-white"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                  {currency === "BTC" ? homePageData.coin.priceBtc : homePageData.coin.priceUsd}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {currency === "BTC" ? "BTC" : "USD"}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ≈ {currency === "BTC" ? homePageData.coin.priceUsd : homePageData.coin.priceBtc}
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                  ▲ {homePageData.coin.change} ({period})
                </span>
              </div>
              <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-white/[0.04]">
                {(["BTC", "USD"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCurrency(item)}
                    aria-pressed={currency === item}
                    className={`rounded-md px-2.5 py-1 text-[10px] ${currency === item
                      ? "bg-[#1f5f7a] text-white"
                      : "text-slate-500 dark:text-slate-400"
                      }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="min-w-0 flex-1">
                <div className="h-[190px] overflow-hidden rounded-xl bg-slate-50 dark:bg-[#0b151b]">
                  <svg viewBox="0 0 600 190" preserveAspectRatio="none" className="h-full w-full">
                    <defs>
                      <linearGradient id="quzo-coin-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#12a594" stopOpacity=".25" />
                        <stop offset="1" stopColor="#12a594" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[47.5, 95, 142.5].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        x2="600"
                        y1={y}
                        y2={y}
                        stroke="rgba(120,145,150,0.2)"
                        strokeDasharray="3 5"
                      />
                    ))}
                    <path
                      d={`${homePageData.coin.chart} L600 190 L0 190 Z`}
                      fill="url(#quzo-coin-fill)"
                    />
                    <path
                      d={homePageData.coin.chart}
                      fill="none"
                      stroke="#12a594"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                    <circle cx="600" cy="20" r="3" fill="#12a594" />
                  </svg>
                </div>
                <div className="mt-2 flex justify-between text-[9px] text-slate-400">
                  {homePageData.coin.labels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-between pb-5 text-[9px] text-slate-400">
                <span>4.44µ</span>
                <span>3.97µ</span>
                <span>3.50µ</span>
                <span>3.04µ</span>
              </div>
            </div>
          </HomeCard>
        </div>

        <section>
          <SectionTitle title="Quick actions" />
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-12">
            {homePageData.quickActions.map((action, index) => (
              <Link
                key={action.label}
                href={action.href}
                className="group flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-center transition hover:-translate-y-0.5 hover:border-[#12a594]/50 hover:shadow-md dark:border-white/[0.08] dark:bg-[#101c24]"
              >
                <span
                  className="grid h-10 w-10 place-items-center rounded-xl text-xl font-semibold text-white transition group-hover:scale-105"
                  style={{
                    backgroundColor: ["#12a594", "#1f5f7a", "#3aa3c4"][index % 3],
                  }}
                >
                  {action.icon}
                </span>
                <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <HomeCard>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
                <Wallet className="h-5 w-5 text-[#12a594]" aria-hidden />
                My wallets
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Your balances across the QUZO ecosystem
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Total balance (USD)</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                $12,434.12{" "}
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                  ▲ +12.64%
                </span>
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {homePageData.wallets.map((wallet) => (
              <Link
                key={wallet.name}
                href="/reports"
                className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-[#12a594]/40 dark:border-white/[0.06] dark:bg-white/[0.025]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="grid h-9 w-9 place-items-center rounded-xl text-white"
                    style={{ backgroundColor: wallet.color }}
                  >
                    <Wallet className="h-4 w-4" aria-hidden />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-[#12a594]" />
                </div>
                <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">{wallet.name}</p>
                <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                  {wallet.amount}
                </p>
                <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                  {wallet.detail}
                </p>
              </Link>
            ))}
          </div>
        </HomeCard>

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <HomeCard>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
                  <Bot className="h-5 w-5 text-[#12a594]" aria-hidden />
                  My AI bot investment
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </p>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#12a594]/10 text-lg font-bold text-[#12a594]">
                Q
              </span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { label: "Invested amount", value: "$1,000.00" },
                { label: "Total profit", value: "+$1,245.60" },
                { label: "ROI (cumulative)", value: "+124.56%" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-slate-50 p-3 dark:bg-white/[0.03]">
                  <p className="text-[10px] leading-4 text-slate-500 dark:text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Investment performance
              </h3>
              <div className="flex gap-1">
                {(["7D", "30D", "90D", "1Y"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`rounded-md px-2 py-1 text-[10px] ${item === "30D"
                      ? "bg-[#12a594] text-white"
                      : "text-slate-500 dark:text-slate-400"
                      }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 flex h-28 items-end gap-2 rounded-xl bg-slate-50 px-4 pt-4 dark:bg-white/[0.025]">
              {[30, 42, 37, 58, 52, 74, 65, 92, 83, 100].map((height, index) => (
                <span
                  key={index}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-[#1f5f7a] to-[#12a594]"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-slate-500">
              <span>Investment start</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-300">
                ▲ {bot.performance}
              </span>
              <span>Today</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-200 pt-4 dark:border-white/[0.08] sm:grid-cols-4">
              {[
                { label: "AI bot status", value: "Running" },
                { label: "Avg. monthly ROI", value: `${bot.avgMonthlyRoi}%` },
                { label: "Bot uptime", value: `${bot.uptime}%` },
                { label: "Current version", value: bot.version },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.label}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-900 dark:text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </HomeCard>

          <div className="space-y-5">
            <HomeCard>
              <SectionTitle title="Earnings overview" />
              <div className="grid gap-3 sm:grid-cols-3">
                {homePageData.earnings.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/[0.06] dark:bg-white/[0.025]"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <p className="mt-3 text-[10px] text-slate-500 dark:text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                      ${item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="mt-1 text-[10px] text-emerald-600 dark:text-emerald-300">
                      ▲ {item.change}
                    </p>
                  </div>
                ))}
              </div>
            </HomeCard>
            <HomeCard>
              <div className="flex items-center justify-between">
                <SectionTitle title="Recent activity" />
                <span className="mb-4 inline-flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Live
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                {homePageData.activity.slice(0, 3).map((item) => (
                  <div
                    key={`${item.title}-${item.time}`}
                    className="flex justify-between gap-3 py-2.5 first:pt-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">{item.time}</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-slate-900 dark:text-white">
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </HomeCard>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {homePageData.promotions.map((promo) => (
            <article
              key={promo.title}
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/[0.08] dark:bg-[#101c24]"
            >
              <span
                className="text-[9px] font-bold tracking-[0.16em]"
                style={{ color: promo.color }}
              >
                {promo.label}
              </span>
              <h2 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
                {promo.title}
              </h2>
              <p className="mt-2 min-h-10 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {promo.detail}
              </p>
              <Link
                href={promo.href}
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold"
                style={{ color: promo.color }}
              >
                {promo.action}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </article>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <HomeCard>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Earnings analytics
                </h2>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  ${homePageData.analytics.total.toLocaleString("en-US")}
                </p>
                <p className="mt-1 text-[10px] text-emerald-600 dark:text-emerald-300">
                  ▲ {homePageData.analytics.change} vs previous week · avg $
                  {homePageData.analytics.average.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-[10px] dark:bg-white/[0.04]">
                <button className="rounded-md bg-[#12a594] px-2 py-1 text-white">Week</button>
                <button className="px-2 py-1 text-slate-500 dark:text-slate-400">Month</button>
                <button className="px-2 py-1 text-slate-500 dark:text-slate-400">Year</button>
              </div>
            </div>
            <div className="mt-5 h-44 rounded-xl bg-slate-50 p-2 dark:bg-[#0b151b]">
              <svg viewBox="0 0 600 180" preserveAspectRatio="none" className="h-full w-full">
                <defs>
                  <linearGradient id="earnings-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#12a594" stopOpacity=".25" />
                    <stop offset="1" stopColor="#12a594" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[45, 90, 135].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    x2="600"
                    y1={y}
                    y2={y}
                    stroke="rgba(120,145,150,0.18)"
                    strokeDasharray="3 5"
                  />
                ))}
                <path d={`${pathForAnalytics} L600 180 L0 180 Z`} fill="url(#earnings-area)" />
                <path
                  d={pathForAnalytics}
                  fill="none"
                  stroke="#12a594"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {homePageData.analytics.categories.map((category) => (
                <span
                  key={category.label}
                  className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400"
                >
                  <i className="h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} />
                  {category.label}
                </span>
              ))}
            </div>
          </HomeCard>

          <div className="space-y-5">
            <HomeCard>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Rank progress
                </h2>
                <span className="rounded-full bg-[#12a594]/10 px-2.5 py-1 text-[10px] font-semibold text-[#118b7d] dark:text-[#6be2d2]">
                  {rank.from} → {rank.to}
                </span>
              </div>
              <div className="mt-5 flex items-end justify-between gap-3">
                <span className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {rank.progress}%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {money(rank.business)} / {money(rank.target)}
                </span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.07]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#12a594] to-[#3aa3c4]"
                  style={{ width: `${rank.progress}%` }}
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { label: "Remaining", value: money(rank.remaining) },
                  { label: "Reward", value: money(rank.reward) },
                  { label: "Salary", value: rank.salary },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg bg-slate-50 p-2.5 dark:bg-white/[0.03]"
                  >
                    <p className="text-[9px] text-slate-500">{item.label}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </HomeCard>

            <HomeCard>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Top DAO partners
                </h2>
                <span className="text-[10px] text-slate-500">This week</span>
              </div>
              <div className="space-y-2">
                {homePageData.partners.map((partner, index) => (
                  <div key={partner.initials} className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#1f5f7a]/10 text-[10px] font-semibold text-[#1f5f7a] dark:text-[#84c8d1]">
                      {partner.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                        {index === 0 && <span className="mr-1 text-amber-500">♛</span>}
                        {partner.name}
                      </span>
                      <span className="text-[9px] text-slate-500">{partner.volume}</span>
                    </span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {partner.amount}
                    </span>
                  </div>
                ))}
              </div>
            </HomeCard>
          </div>
        </div>

        <HomeCard>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Reward achievers
            </h2>
            <span className="text-[10px] text-slate-500">Latest</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {homePageData.achievers.map((person) => (
              <article
                key={person.initials}
                className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-white/[0.025]"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#12a594]/10 text-[10px] font-semibold text-[#118b7d] dark:text-[#6be2d2]">
                  {person.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-slate-900 dark:text-white">
                    {person.name}
                  </span>
                  <span className="block text-[9px] text-slate-500">
                    {person.rank} · {person.time}
                  </span>
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                  {person.reward}
                </span>
              </article>
            ))}
          </div>
        </HomeCard>

      </div>
    </main>
  );
}
