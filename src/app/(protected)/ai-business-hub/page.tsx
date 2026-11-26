"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Boxes, Coins, Users, ShieldCheck, Network, TrendingUp, Zap } from "lucide-react";
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
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth="8" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
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
              cx={size / 2}
              cy={size / 2}
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

const pctOf = (a: number, b: number) => (b > 0 ? Math.min(100, (a / b) * 100) : 0);

// ---------- Team table helpers ----------
function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-[#dcebe8] dark:border-[#1E293B] bg-[#f3f9f8] dark:bg-[#0B1021] px-4 py-2 text-xs font-semibold text-[#12a594]">
      {children}
    </div>
  );
}

function MetricRow({
  icon,
  label,
  value,
  pct,
  status,
  accent = "#12a594",
  from = "#12a594",
  to = "#34cdb8",
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  pct: number;
  status: string;
  accent?: string;
  from?: string;
  to?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 border-b border-[#e3eeec] dark:border-[#1E293B] px-4 py-3 md:grid-cols-[2fr_1.2fr_3fr_1.2fr] ${highlight ? "bg-[#eef6f9] dark:bg-[#0B1021]" : "bg-white dark:bg-[#0B1021]"
        }`}
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <div className="flex items-center gap-3">
        <span
          className="grid h-9 w-9 place-items-center rounded-lg"
          style={{ background: `${accent}1f`, color: accent }}
        >
          {icon}
        </span>
        <span className="text-[15px] text-[#0f2a33] dark:text-gray-300">{label}</span>
      </div>
      <div className="text-right text-base font-bold text-[#0f2a33] dark:text-white md:text-left">{value}</div>
      <div className="order-last col-span-2 h-2 overflow-hidden rounded-full bg-[#dff0ec] dark:bg-[#1E293B] md:order-none md:col-span-1">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${from}, ${to})` }}
        />
      </div>
      <div className="text-right">
        <span
          className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: `${accent}1f`, color: accent }}
        >
          {status}
        </span>
      </div>
    </div>
  );
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

  const handleViewMore = (label: string) => {
    localStorage.setItem('incomeTab', label);
    router.push('/income-reports');
  };

  // Data from affiliate
  const activeDirectMembers = getText(affiliate?.ActiveDirectMembers, "0");
  const directBusiness = getNumber(affiliate?.DirectBusiness);
  const levelOpen = getNumber(affiliate?.LevelOpen);
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
  // Income data from API
  const AgentAccessRewards = getNumber(affiliate?.AgentAccessRewards);
  const AgenticFleetLeadershipRewards = getNumber(affiliate?.AgenticFleetLeadershipRewards);
  const DirectActivationRewards = getNumber(affiliate?.DirectActivationRewards);
  const BoosterProfitProtocol = getNumber(affiliate?.BoosterProfitProtocol);
  const UnityRevenueClubs = getNumber(affiliate?.UnityRevenueClubs);
  const ReferralRoyaltyRewards = getNumber(affiliate?.ReferralRoyaltyRewards);
  const PerformanceRewrads = getNumber(affiliate?.PerformanceRewrads);

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

  // Team table values (sab existing data se)
  const activeDirectNum = getNumber(affiliate?.ActiveDirectMembers);
  const totalTeamNum = getNumber(affiliate?.TotalTeam);
  const activeTeamNum = getNumber(affiliate?.ActiveTeam);
  const powerPct = pctOf(powerLeg, teamTotal);
  const weakPct = teamTotal > 0 ? 100 - powerPct : 0;

  // Package info
  const packageInfo = {
    multiplier: "Income Cap",
    investment: activeTradingPackage || 0,
    totalIncomeCap: totalTradingPackage || 0,
    remainingCap: remaningPackage || 0,
capUsedPercent:totalTradingPackage > 0? Number(((activeTradingPackage / totalTradingPackage) * 100).toFixed(3)): 0,
  };

  // QUZO price
  const quzoPrice = {
    value: "1",
    unit: "USDT",
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
    { label: "Direct Activation Rewards", value: DirectActivationRewards, prefix: "$", dec: 2, tone: "blue", icon: "chart", series: [10, 12, 14, 16, 18, 20, 22] },
    { label: "Agent Access Rewards", value: AgentAccessRewards, prefix: "$", dec: 2, tone: "green", icon: "arrowUp", series: [12, 15, 18, 22, 25, 28, 30] },
    { label: "Booster Profit Protocol", value: BoosterProfitProtocol, prefix: "$", dec: 2, tone: "violet", icon: "award", series: [8, 10, 12, 15, 18, 20, 25] },
    { label: "Referral Royalty Rewards", value: ReferralRoyaltyRewards, prefix: "$", dec: 2, tone: "amber", icon: "rocket", series: [15, 18, 22, 25, 28, 32, 35] },
    { label: "Fleet Leadership Rewards", value: AgenticFleetLeadershipRewards, prefix: "$", dec: 2, tone: "violet", icon: "group", series: [10, 12, 14, 16, 18, 20, 22] },
    { label: "Performance Rewrads", value: PerformanceRewrads, prefix: "$", dec: 2, tone: "blue", icon: "share", series: [12, 14, 16, 18, 20, 22, 24] },
    { label: "Unity Revenue Clubs", value: UnityRevenueClubs, prefix: "$", dec: 2, tone: "green", icon: "refresh", series: [15, 18, 21, 24, 27, 30, 33] },
  ];

  const incomeHistory = [
    { name: "Agent Access Rewards", amount: AgentAccessRewards, icon: "arrowUp" },
    { name: "Direct Activation Rewards", amount: DirectActivationRewards, icon: "chart" },
    { name: "Booster Profit Protocol", amount: BoosterProfitProtocol, icon: "group" },
    { name: "Referral Royalty Rewards", amount: ReferralRoyaltyRewards, icon: "award" },
    { name: "Fleet Leadership Rewards", amount: AgenticFleetLeadershipRewards, icon: "rocket" },
    { name: "Performance Rewrads", amount: PerformanceRewrads, icon: "share" },
    { name: "Unity Revenue Clubs", amount: UnityRevenueClubs, icon: "refresh" },
  ];

  const incomeTotal = incomeHistory.reduce((a, i) => a + i.amount, 0);
  const topStream = incomeHistory.length > 0
    ? incomeHistory.reduce((m, i) => (i.amount > m.amount ? i : m), incomeHistory[0]!)
    : null;

  const palette = ["#1f6fe5", "#0a9b62", "#8a5cf0", "#e8920a", "#e0334f", "#14a8c9"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-[#0B1021]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <>
      <div className=" p-4 sm:p-6 lg:p-8">

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
                    <span className="trend"><a href="#" onClick={(e) => { e.preventDefault(); handleViewMore(k.label); }} style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>View More</a></span>
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
          <h2 id="trading-package-heading" className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            Trading package
          </h2>
          <div className="grid gap-4 xl:grid-cols-2">
            <article className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 dark:border-[#1E293B] bg-white dark:bg-[#0B1021] p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  <circle cx="75" cy="75" r="60" fill="none" stroke="#e5e7eb" strokeWidth="10" className="dark:stroke-[#1E293B]" />
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
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{packageInfo.capUsedPercent}%</p>
                  <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">cap used</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full">
                {[
                  { label: "Investment", value: money(packageInfo.investment) },
                  { label: "Total income cap", value: money(packageInfo.totalIncomeCap) },
                  { label: "Remaining cap", value: money(packageInfo.remainingCap) },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-gray-50 dark:bg-[#1E293B] p-3">
                    <p className="text-[10px] leading-4 text-gray-500 dark:text-gray-400">{item.label}</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-[#1E293B] w-full">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#12a594] to-[#3aa3c4]"
                  style={{ width: `${packageInfo.capUsedPercent}%` }}
                />
              </div>
            </article>

            <article className="flex flex-col justify-between rounded-2xl border border-gray-200 dark:border-[#1E293B] bg-white dark:bg-[#0B1021] p-4 sm:p-5 shadow-sm">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#d9a441]/10 text-[#d9a441]">
                    <Coins className="h-4 w-4" aria-hidden />
                  </span>
                  QUZO Coin Pre Allocation
                </div>
                <p className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
                  {quzoPrice.value}{" "}
                  <span className="text-base font-medium text-gray-500 dark:text-gray-400">{quzoPrice.unit}</span>
                </p>
                <p className="mt-1 text-xs text-green-600 dark:text-green-400">
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

        {/* Team Network */}
        <section className="mb-8 mt-3">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-[#dcebe8] dark:border-[#1E293B] bg-[#f3f9f8] dark:bg-[#0B1021] shadow-sm">
              {/* Header */}
              <div className="hidden grid-cols-[2fr_1.2fr_3fr_1.2fr] border-b border-[#dcebe8] dark:border-[#1E293B] px-4 py-3 text-sm font-medium text-[#5b7580] dark:text-gray-400 md:grid">
                <span>Metric</span>
                <span>Value</span>
                <span>Progress</span>
                <span className="text-right">Status</span>
              </div>

              <GroupLabel>Directs</GroupLabel>
              <MetricRow
                icon={<Users size={18} />}
                label="Direct ID"
                value={getText(affiliate?.DirectID, "N/A")}
                pct={100}
                status="Direct line"
              />
              <MetricRow
                icon={<ShieldCheck size={18} />}
                label="Active Direct ID"
                value={activeDirectMembers}
                pct={activeDirectNum > 0 ? 100 : 0}
                status={`${activeDirectMembers} active`}
              />

              <GroupLabel>Team</GroupLabel>
              <MetricRow
                icon={<Network size={18} />}
                label="Total Team"
                value={totalTeam}
                pct={100}
                status={`${totalTeam} members`}
                accent="#1f5f7a"
                from="#2a8f9a"
                to="#34cdb8"
              />
              <MetricRow
                icon={<Users size={18} />}
                label="Active Team"
                value={activeTeam}
                highlight
                pct={pctOf(activeTeamNum, totalTeamNum)}
                status={`${pctOf(activeTeamNum, totalTeamNum).toFixed(0)}% active`}
                accent="#2fa3c4"
                from="#3bb5cf"
                to="#34cdb8"
              />

              <GroupLabel>Business</GroupLabel>
              <MetricRow
                icon={<TrendingUp size={18} />}
                label="Direct Business"
                value={<CountUp value={directBusiness} prefix="$" dec={0} />}
                pct={pctOf(directBusiness, teamBusiness)}
                status={`${pctOf(directBusiness, teamBusiness).toFixed(0)}% of team`}
                accent="#d9a441"
                from="#a8b860"
                to="#34cdb8"
              />

              <MetricRow
                icon={<TrendingUp size={18} />}
                label="Team Business"
                value={<CountUp value={teamBusiness} prefix="$" dec={0} />}
                pct={100}
                status="Total"
                accent="#d9a441"
                from="#a8b860"
                to="#34cdb8"
              />
              <MetricRow
                icon={<Zap size={18} />}
                label="Level Open"
                value={<CountUp value={levelOpen} prefix="" dec={0} />}
                pct={pctOf(levelOpen, 20)}
                status={`${pctOf(levelOpen, 20).toFixed(0)}%`}
                accent="#8a5cf0"
                from="#a855f7"
                to="#c084fc"
              />
              <MetricRow
                icon={<Zap size={18} />}
                label="Power Team Business"
                value={money(powerLeg, 0)}
                pct={powerPct}
                status={`${powerPct.toFixed(0)}% of team`}
                accent="#4b7a85"
                from="#3f9a9a"
                to="#34cdb8"
              />
              <MetricRow
                icon={<TrendingUp size={18} />}
                label="Weaker Team Business"
                value={money(weakLeg, 0)}
                pct={weakPct}
                status={`${weakPct.toFixed(0)}% of team`}
                accent="#5f7782"
                from="#4f9a96"
                to="#34cdb8"
              />

              {/* Footer */}
              <div className="grid grid-cols-1 gap-5 px-4 py-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-[#5b7580] dark:text-gray-400">Power vs weaker team</p>
                  <div className="mt-2 flex gap-1">
                    <div className="h-3 rounded-full bg-[#4b7a85]" style={{ width: `${powerPct}%` }} />
                    <div className="h-3 rounded-full bg-[#5f7782]" style={{ width: `${weakPct}%`, minWidth: 6 }} />
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-[#5b7580] dark:text-gray-400">
                    <span>Power {powerPct.toFixed(0)}%</span>
                    <span>Weaker {weakPct.toFixed(0)}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#5b7580] dark:text-gray-400">Power Team ID No.</p>
                  <p className="mt-1 text-2xl font-bold text-[#0f2a33] dark:text-white">{strongLegID}</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Personal Info */}
          <Reveal delay={100}>
            <div className="hub-card mt-4">
              <div className="hub-card-head">
                <h3>Personal Info</h3>
                <span className="hub-chip muted">Active</span>
              </div>
              <div className="hub-kv"><span>User ID</span><span className="mono">{getText(affiliate?.AuthloginId, "N/A")}</span></div>
              <div className="hub-kv"><span>Email</span><span className="mono">{getText(affiliate?.EmailId, "N/A")}</span></div>
              <div className="hub-kv"><span>Mobile</span><span className="mono">{getText(affiliate?.Mobile, "N/A")}</span></div>
              <div className="hub-kv"><span>Sponsor</span><span className="mono">{getText(affiliate?.SponsorId, "N/A")}</span></div>
            </div>
          </Reveal>
        </section>

        <p className="foot dark:text-gray-400">Risk notice — investing involves market risk. Past performance does not guarantee future results.</p>
      </div>
      <div className={`hub-toast ${toast ? "show" : ""}`}>{toast}</div>
    </>
  );
}
