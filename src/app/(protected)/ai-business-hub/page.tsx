"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Boxes, Coins } from "lucide-react";
import type { IconType } from "react-icons";

import {
  RiLineChartLine,
  RiRocketLine,
  RiShareLine,
  RiAwardLine,
  RiGroupLine,
  RiBriefcaseLine,
  RiArrowUpLine,
  RiRefreshLine,
} from "react-icons/ri";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getText(value: unknown, fallback: string): string {
  return (typeof value === "string" || typeof value === "number") && String(value)
    ? String(value)
    : fallback;
}

// Simple UI Components
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease-out' }}>{children}</div>;
}

function CountUp({ value, prefix = "", dec = 2 }: { value: number; prefix?: string; dec?: number }) {
  const animatedValue = useCountUp(value, 1000);
  return <span>{prefix}{animatedValue.toFixed(dec)}</span>;
}

function Ring({ pct, size = 100, color = "#3b8bff", sub = "" }: { pct: number; size?: number; color?: string; sub?: string }) {
  const radius = (size - 16) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className="ring-wrap" style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
        <circle cx={size/2} cy={size/2} r={radius} stroke={color} strokeWidth="8" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="ring-txt" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 18, fontWeight: 'bold' }}>{pct.toFixed(0)}%</span>
        {sub && <span style={{ fontSize: 10 }}>{sub}</span>}
      </div>
    </div>
  );
}

function Donut({ size = 100, stroke = 12, parts = [], center }: { size?: number; stroke?: number; parts: Array<{ pct: number; color: string }>; center?: React.ReactNode }) {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  let offset = 0;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {parts.map((part, i) => {
          const segmentLength = (part.pct / 100) * circumference;
          const segment = (
            <circle
              key={i}
              cx={size/2}
              cy={size/2}
              r={radius}
              stroke={part.color}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={segmentLength}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          );
          offset += segmentLength;
          return segment;
        })}
      </svg>
      {center && <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'white' }}>{center}</div>}
    </div>
  );
}

function Icon({ name, size = 16 }: { name: string; size?: number }) {
  const icons = {
    arrowUp: RiArrowUpLine,
    refresh: RiRefreshLine,
    share: RiShareLine,
    rocket: RiRocketLine,
    chart: RiLineChartLine,
    award: RiAwardLine,
    group: RiGroupLine,
    briefcase: RiBriefcaseLine,
  };
  const IconComponent: IconType = icons[name as keyof typeof icons] || RiArrowUpLine;
  return <IconComponent size={size} />;
}

function Spark({ data = [], color = "#3b8bff" }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const points = data.map((v, i) => `${i * 10},${30 - (v / max) * 25}`).join(' ');
  return (
    <svg width={data.length * 10} height={30} viewBox={`0 0 ${data.length * 10} 30`}>
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} />
    </svg>
  );
}

function money(value: number, dec = 2): string {
  return `$${value.toFixed(dec)}`;
}

// ---------- Count-up hook ----------
function useCountUp(endValue: number, duration = 1000) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    const target = Number(endValue) || 0;
    const startValue = startValueRef.current;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = startValue + (target - startValue) * progress;
      setValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setValue(target);
        startValueRef.current = target;
      }
    };

    

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [endValue, duration]);

  return value;
}

export default function AIBUSINESSHUB() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [affiliate, setAffiliate] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const boosterRemDateTime = "";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/Authentication/affiliate-network');
        const data: unknown = await response.json();
        if (
          isRecord(data) &&
          data.statusCode === 200 &&
          Array.isArray(data.data) &&
          isRecord(data.data[0])
        ) {
          setAffiliate(data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!boosterRemDateTime) return;
    const target = new Date(boosterRemDateTime);
    const updateTimer = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff > 0) {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setHours(h);
        setMinutes(m);
        setSeconds(s);
      } else {
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      }
    };
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [boosterRemDateTime]);

  const say = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 1800);
  };

  // Data from affiliate
  const activeDirectMembers = getText(affiliate?.ActiveDirectMembers, "0");
  const directBusiness = getNumber(affiliate?.DirectBusiness);
  const subscription = getNumber(affiliate?.EarningLimit);
  const teamBusiness = getNumber(affiliate?.TeamBusiness);
  const directBonus = getNumber(affiliate?.DynamicReferralYield);
  const matchingIncome = getNumber(affiliate?.DailyRevenueSharing);
  const rewardBonus = getNumber(affiliate?.BoosterProfit);
  const yieldIncome = getNumber(affiliate?.UnityRevenueYield);
  const levelIncome = getNumber(affiliate?.PerformanceRevenue);
  const performanceWithdrawal = getNumber(affiliate?.IncomeWithdrawal);
  const yieldWithdrawal = getNumber(affiliate?.MentorWithdrawal);
  const tradingPackage = getNumber(affiliate?.BoosterPackage);
  const smartBonds = getNumber(affiliate?.SmartBonds);
  const smartGrowth = getNumber(affiliate?.SmartGrowth);
  const secureBonds = getNumber(affiliate?.SecureBonds);
  const leftBusvolume = getNumber(affiliate?.PowerTeamBusines);
  const rightBusvolume = getNumber(affiliate?.WeakerTeamBusines);
  const strongLegID = getText(affiliate?.PowerTeamID, "N/A");
  const leadershipRank = getText(affiliate?.UserRank, "N/A");
  const rankPercentage = getNumber(affiliate?.YieldPer);
  const totalEarning = getNumber(affiliate?.TotalEarning);
  const remainingLimit = getNumber(affiliate?.RemainingLimit);
  const totalTeam = getText(affiliate?.TotalTeam, "0");
  const activeTeam = getText(affiliate?.ActiveTeam, "0");

  // Income data from API
  const directIncome = getNumber(affiliate?.DirectIncome);
  const dailyProfitIncome = getNumber(affiliate?.DailyProfitIncome);
  const levelIncomeAPI = getNumber(affiliate?.LevelIncome);
  const boosterProfitAPI = getNumber(affiliate?.BoosterProfit);
  const rewardIncome = getNumber(affiliate?.RewardIncome);
  const salaryIncome = getNumber(affiliate?.SalaryIncome);
  const daoIncome = getNumber(affiliate?.DaoIncome);

  // Package API values
  const totalTradingPackage = getNumber(affiliate?.TotalEarning);
   const remaningPackage = getNumber(affiliate?.RemainingLimit);
  const activeTradingPackage = getNumber(affiliate?.TradingPackage);
  const activeSmartBondPack = getNumber(affiliate?.SmartBondPack);
  const activeSecureBondPack = getNumber(affiliate?.SecureBondPack);
  const totalSmartBondPack = getNumber(affiliate?.TotalSmartBondPack);
  const totalSecureBondPack = getNumber(affiliate?.TotalSecureBondPack);
  const liquidityEarningLimit = getNumber(affiliate?.LiquidityEarningLimit);
  const liquidityPendingLimit = getNumber(affiliate?.LiquidityPendingLimit);
  const secureEarningLimit = getNumber(affiliate?.SecureEarningLimit);
  const securePendingLimit = getNumber(affiliate?.SecurePendingLimit);
  const smartEarningLimit = getNumber(affiliate?.SmartEarningLimit);
  const smartPendingLimit = getNumber(affiliate?.SmartPendingLimit);

  // Calculated values
  const teamTotal = Number(leftBusvolume) + Number(rightBusvolume);
  const powerLeg = Math.max(Number(leftBusvolume), Number(rightBusvolume));
  const weakLeg = Math.min(Number(leftBusvolume), Number(rightBusvolume));

  // Package info
  const packageInfo = {
    multiplier: "Income Cap",
    investment: activeTradingPackage || 0,
    totalIncomeCap: totalTradingPackage || 0,
    remainingCap: remaningPackage || 0,
    capUsedPercent: totalTradingPackage > 0 ? ((activeTradingPackage / totalTradingPackage) * 100) : 0,
  };

  // QUZO price
  const quzoPrice = {
    value: "0.00000444",
    unit: "BTC",
    change: "3.12%",
    period: "24h",
  };

  // Sparkline component
  function Sparkline({ id, color, path }: { id: string; color: string; path: string }) {
    return (
      <svg viewBox="0 0 100 40" className="h-full w-full">
        <defs>
          <linearGradient id={`sparkline-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity=".4" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${path} L100 40L0 40Z`} fill={`url(#sparkline-${id})`} />
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  const kpis = [
    { label: "Direct Referral Income", value: directIncome, prefix: "$", dec: 2, tone: "green", icon: "arrowUp", trend: "+12%", series: [12, 15, 18, 22, 25, 28, 30] },
    { label: "Daily Profit Income", value: dailyProfitIncome, prefix: "$", dec: 2, tone: "blue", icon: "chart", trend: "+8%", series: [10, 12, 14, 16, 18, 20, 22] },
    { label: "Booster Income", value: boosterProfitAPI, prefix: "$", dec: 2, tone: "violet", icon: "award", trend: "+15%", series: [8, 10, 12, 15, 18, 20, 25] },
    { label: "DAO Income", value: daoIncome, prefix: "$", dec: 2, tone: "amber", icon: "rocket", trend: "+20%", series: [15, 18, 22, 25, 28, 32, 35] },
    { label: "Level Income", value: levelIncomeAPI, prefix: "$", dec: 2, tone: "violet", icon: "group", trend: "+10%", series: [10, 12, 14, 16, 18, 20, 22] },
    { label: "Rewards Income", value: rewardIncome, prefix: "$", dec: 2, tone: "blue", icon: "share", trend: "+18%", series: [12, 14, 16, 18, 20, 22, 24] },
    { label: "Salary Income", value: salaryIncome, prefix: "$", dec: 2, tone: "green", icon: "refresh", trend: "+25%", series: [15, 18, 21, 24, 27, 30, 33] },
  ];

  const wallets = [
    { label: "Total Earning", value: totalEarning },
    { label: "Earning Limit", value: subscription },
    { label: "Remaining Limit", value: remainingLimit },
    { label: "Team Business", value: teamBusiness },
  ];

  const packages = [
    { key: "lp", name: "Liquidity Provider", desc: "LP Trade", active: activeTradingPackage, total: totalTradingPackage, limit: liquidityEarningLimit, pending: liquidityPendingLimit, tone: "blue" },
    { key: "sb", name: "Smart Bonds", desc: "Fixed returns", active: activeSmartBondPack, total: totalSmartBondPack, limit: smartEarningLimit, pending: smartPendingLimit, tone: "violet" },
    { key: "sec", name: "Secure Bonds", desc: "Secure growth", active: activeSecureBondPack, total: totalSecureBondPack, limit: secureEarningLimit, pending: securePendingLimit, tone: "amber" },
  ];

  const boosters = [
    { key: "r", name: "Runner", icon: "🏃", reward: 20, req: "Sponsor 3 direct participants within 7 days", window: "", target: 3, progress: 2, state: "IN PROGRESS" },
    { key: "b", name: "Biker", icon: "🚴", reward: 30, req: "Achieve 3 Runners within 15 days", window: "", target: 3, progress: 0, state: "LOCKED" },
    { key: "f", name: "Fighter", icon: "🥊", reward: 50, req: "Achieve 3 Bikers within 30 days", window: "", target: 3, progress: 0, state: "LOCKED" },
  ];

  const dryTiers = [
    { dir: 1, pct: 10 },
    { dir: 3, pct: 15 },
    { dir: 5, pct: 20 },
    { dir: 10, pct: 30 },
    { dir: 20, pct: 50 },
    { dir: 50, pct: 100 },
  ];

  const unityTiers = [
    { vol: "$10K", pct: 15 },
    { vol: "$50K", pct: 25 },
    { vol: "$100K", pct: 40 },
    { vol: "$500K", pct: 60 },
    { vol: "$1M", pct: 80 },
    { vol: "$5M", pct: 100 },
  ];

  const incomeHistory = [
    { name: "Direct Referral Income", amount: directIncome, icon: "arrowUp" },
    { name: "Daily Profit Income", amount: dailyProfitIncome, icon: "chart" },
    { name: "Level Income", amount: levelIncomeAPI, icon: "group" },
    { name: "Booster Income", amount: boosterProfitAPI, icon: "award" },
    { name: "DAO Income", amount: daoIncome, icon: "rocket" },
    { name: "Rewards Income", amount: rewardIncome, icon: "share" },
    { name: "Salary Income", amount: salaryIncome, icon: "refresh" },
  ];

  const incomeTotal = incomeHistory.reduce((a, i) => a + i.amount, 0);
  const topStream = incomeHistory.length > 0
    ? incomeHistory.reduce((m, i) => (i.amount > m.amount ? i : m), incomeHistory[0]!)
    : null;

  const palette = ["#1f6fe5", "#0a9b62", "#8a5cf0", "#e8920a", "#e0334f", "#14a8c9"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <>
      <div className="hub-bg p-4 sm:p-6 lg:p-8">

      


        {/* Business Overview */}
        <section className="mb-8">
          <Reveal>
            <div className="hub-card hub-biz">
              <div>
                <small className="mono">Team Business</small>
                <div className="num mono"><CountUp value={teamTotal} prefix="$" dec={2} /></div>
                <span className="hub-badge"><span className="hub-pulse" /> Network volume growing</span>
              </div>
              <div>
                <div className="hub-legkey">
                  <div><small><i className="hub-dot" style={{ background: 'var(--hub-green)' }} />Strong team</small><b className="mono">{money(powerLeg, 0)}</b></div>
                  <div style={{ textAlign: 'right' }}><small><i className="hub-dot" style={{ background: 'var(--hub-amber)' }} />Other team</small><b className="mono">{money(weakLeg, 0)}</b></div>
                </div>
                <div className="hub-legbar">
                  <div style={{ width: `${(powerLeg / teamTotal) * 100}%` }} />
                  <div style={{ width: `${(weakLeg / teamTotal) * 100}%`, minWidth: 6 }} />
                </div>
                <div className="sub">Power leg carries {((powerLeg / teamTotal) * 100).toFixed(2)}% of total volume</div>
              </div>
              <div className="hub-idcard"><small className="mono">Strong Team ID</small><b className="mono">{strongLegID}</b></div>
              <div className="hub-idcard hub-rank-card"><small className="mono">Current Rank</small><b className="mono" style={{ background: 'linear-gradient(90deg, var(--hub-green), var(--hub-blue))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{leadershipRank}</b></div>
            </div>
          </Reveal>
        </section>

        {/* KPI Tiles */}
        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k, i) => (
              <Reveal key={k.label} delay={i * 90}>
                <div className={`hub-card hub-k2 hub-tone-${k.tone}`}>
                  <div className="hub-k2-top">
                    <div className="ico"><Icon name={k.icon} size={20} /></div>
                    <span className="trend">{k.trend}</span>
                  </div>
                  <small className="mono">{k.label}</small>
                  <b className="mono"><CountUp value={k.value} prefix={k.prefix} dec={k.dec} /></b>
                  <div className="spark">
                    <Spark data={k.series} color={k.tone === "green" ? "var(--hub-green)" : k.tone === "blue" ? "var(--hub-blue)" : k.tone === "violet" ? "var(--hub-violet)" : "var(--hub-amber)"} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>


        {/* Trading Packages */}
          <section aria-labelledby="trading-package-heading">
          <h2 id="trading-package-heading" className="mb-3 text-lg font-semibold text-gray-900">
            Trading package
          </h2>
          <div className="grid gap-4 xl:grid-cols-2">
            <article className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#12a594]/10 text-[#12a594]">
                  <Boxes className="h-4 w-4" aria-hidden />
                </span>
                {packageInfo.multiplier}
              </div>
              <div className="relative grid h-36 w-36 place-items-center">
                <svg viewBox="0 0 150 150" className="absolute inset-0 h-full w-full -rotate-90">
                  <defs>
                    <linearGradient id="package-ring-gradient">
                      <stop offset="0" stopColor="#12a594" />
                      <stop offset="1" stopColor="#1f5f7a" />
                    </linearGradient>
                  </defs>
                  <circle cx="75" cy="75" r="60" fill="none" stroke="#e5e7eb" strokeWidth="10" />
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
                  <p className="text-2xl font-semibold text-gray-900">{packageInfo.capUsedPercent}%</p>
                  <p className="mt-1 text-[11px] text-gray-500">cap used</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full">
                {[
                  { label: "Investment", value: money(packageInfo.investment) },
                  { label: "Total income cap", value: money(packageInfo.totalIncomeCap) },
                  { label: "Remaining cap", value: money(packageInfo.remainingCap) },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-gray-50 p-3">
                    <p className="text-[10px] leading-4 text-gray-500">{item.label}</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200 w-full">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#12a594] to-[#3aa3c4]"
                  style={{ width: `${packageInfo.capUsedPercent}%` }}
                />
              </div>
            </article>

            <article className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#d9a441]/10 text-[#d9a441]">
                    <Coins className="h-4 w-4" aria-hidden />
                  </span>
                  QUZO / BTC live price
                </div>
                <p className="mt-4 text-2xl font-semibold text-gray-900">
                  {quzoPrice.value}{" "}
                  <span className="text-base font-medium text-gray-500">{quzoPrice.unit}</span>
                </p>
                <p className="mt-1 text-xs text-green-600">
                  ▲ {quzoPrice.change} · {quzoPrice.period}
                </p>
              </div>
              <div className="mt-5">
                <Sparkline
                  id="quzo-price-sparkline"
                  color="#d9a441"
                  path="M0 28 C10 26, 15 30, 25 25 C35 20, 40 22, 50 18 C60 14, 65 16, 75 12 C85 8, 90 10, 100 6"
                />
              </div>
            </article>
          </div>
        </section>

       

        

    

        {/* Team + Personal */}
        <section className="mb-8 mt-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Reveal>
              <div className="hub-card">
                <div className="hub-card-head">
                  <h3>Team Network</h3>
                  <span className="hub-chip blue">Direct line</span>
                </div>
                <div className="grid grid-cols-3 gap-3" style={{ gap: 10, gridTemplateColumns: 'repeat(3,1fr)' }}>
                  <div className="hub-wallet" style={{ textAlign: 'center' }}><small>Direct ID</small><b className="mono" style={{ color: 'var(--hub-text)' }}>{getText(affiliate?.AuthloginId, "N/A")}</b></div>
                  <div className="hub-wallet" style={{ textAlign: 'center' }}><small>Active Direct</small><b className="mono">{activeDirectMembers}</b></div>
                  <div className="hub-wallet" style={{ textAlign: 'center' }}><small>Direct Business</small><b className="mono"><CountUp value={directBusiness} prefix="$" dec={0} /></b></div>
                  <div className="hub-wallet" style={{ textAlign: 'center' }}><small>Total Team</small><b className="mono">{totalTeam}</b></div>
                  <div className="hub-wallet" style={{ textAlign: 'center' }}><small>Active Team</small><b className="mono">{activeTeam}</b></div>
                  <div className="hub-wallet" style={{ textAlign: 'center' }}><small>Team Business</small><b className="mono"><CountUp value={teamBusiness} prefix="$" dec={0} /></b></div>
                </div>
                <div className="hub-kv" style={{ marginTop: 14 }}><span>Current Booster Rank</span><span>{leadershipRank}</span></div>
                <div className="hub-kv"><span>Booster Status</span><span>Active</span></div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="hub-card">
                <div className="hub-card-head">
                  <h3>Personal Info</h3>
                  <span className="hub-chip muted">Active</span>
                </div>
                <div className="hub-kv"><span>User ID</span><span className="mono">{getText(affiliate?.AuthloginId, "N/A")}</span></div>
                <div className="hub-kv"><span>Email</span><span className="mono">{getText(affiliate?.EmailId, "N/A")}</span></div>
                <div className="hub-kv"><span>Mobile</span><span className="mono">{getText(affiliate?.Mobile, "N/A")}</span></div>
                <div className="hub-kv"><span>Sponsor</span><span className="mono">{getText(affiliate?.SponsorId, "N/A")}</span></div>
                <div className="hub-kv"><span>Current Rank</span><span>{leadershipRank}</span></div>
                <div className="hub-kv"><span>Rank Progress</span><span>{rankPercentage}%</span></div>
                <div className="hub-kv"><span>Strong Team ID</span><span className="mono">{strongLegID}</span></div>
              </div>
            </Reveal>
          </div>
        </section>

        <p className="foot">Risk notice — investing involves market risk. Past performance does not guarantee future results.</p>
      </div>
      <div className={`hub-toast ${toast ? "show" : ""}`}>{toast}</div>
    </>
  );
}
