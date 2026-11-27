"use client";
import React, { useState, useEffect, useCallback } from "react";
// import toast from "react-hot-toast";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  RiWallet3Line,
  RiUserLine,
  RiArrowRightLine,
  RiCloseLine,
  RiCheckLine,
  RiSearchLine,
  RiErrorWarningLine,
  RiShieldCheckLine,
  RiFlashlightLine,
  RiBriefcaseLine,
  RiBuilding4Line,
  RiCoinsLine,
  RiBarChartBoxLine,
  RiRepeatLine,
  RiArrowUpLine,
  RiSafe2Line,
  RiHistoryLine,
} from "react-icons/ri";
import { useTempStorage } from "./useTempStorage";
import { PageLoader } from "@/components/common/PageLoader";

/* ─── Types ───────────────────────────────────────────── */

export interface Agent {
  productId: string;
  productName: string;
  imageUrl: string | null;
  price?: number;
  toatalmonth?: number;
  totalReturn?: number;
  weeklyReturn?: number;
  task?: string;
  rating?: number;
  subName?: string;
  unit?: string;
  categoryName?: string;
  status?: string;
}

interface LeaseModalProps {
  agent: Agent;
  onClose: () => void;
  productId: string;
  month: string;
}

type PlanKey = "personal" | "business" | "industrial";

interface PlanRange {
  min: number;
  max: number;
  step: number;
}

interface PlanTw {
  activePill: string;
  inactivePill: string;
  cardBg: string;
  cardBorder: string;
  badgeBg: string;
  accentText: string;
  accentBox: string;
  rangeHex: string;
  sliderBg: (pct: number) => string;
  sliderBgDark: (pct: number) => string;
  confirmBtn: string;
}

interface Plan {
  key: PlanKey;
  name: string;
  multiplier: number;
  revenueShare: string;
  range: PlanRange;
  badge: string;
  Icon: React.ComponentType<{ className?: string }>;
  tw: PlanTw;
}

interface WalletData {
  depositWallet: number;
  legacyWallet: number;
}

interface UsernameResult {
  name: string;
  authLogin: string;
}

interface OrderData {
  image: string;
  name: string;
  Rkprice: number;
  usernameInput: string;
  searchedUsername: string | null;
  month: string;
  orderId: string;
}

interface BuyLicenseResponseItem {
  image: string;
  ProductName: string;
  Rkprice: number;
}

interface BuyLicenseResponse {
  statusCode: number;
  message?: string;
  data: BuyLicenseResponseItem[] | null;
}

interface BuyLicensePayload {
  productId: string;
  rkprice: number;
  byAuthlogin: string;
}

/* ─── Plans ───────────────────────────────────────────── */
/*
  THEME: navy base + #65e7ff accent (same as home page).
  Personal = cyan, Business = violet, Industrial = pink — all as glass pills.
  Primary buttons: white pill (dark mode) / dark pill (light mode), tier-coloured glow on hover.
*/

const PLANS: Record<PlanKey, Plan> = {
  personal: {
    key: "personal",
    name: "Personal",
    multiplier: 2.5,
    revenueShare: "6%-7%",
    range: { min: 50, max: 490, step: 10 },
    badge: "Starter",
    Icon: RiFlashlightLine,
    tw: {
      activePill:
        "border border-cyan-600/50 bg-[#65e7ff]/20 text-cyan-800 shadow-[0_0_22px_-6px_rgba(101,231,255,0.8)] dark:border-[#65e7ff]/50 dark:bg-[#65e7ff]/10 dark:text-[#65e7ff]",
      inactivePill:
        "border border-transparent text-slate-500 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-[#65e7ff]",
      cardBg: "bg-cyan-50 dark:bg-[#65e7ff]/[0.06]",
      cardBorder: "border-cyan-200 dark:border-[#65e7ff]/25",
      badgeBg: "bg-cyan-100 dark:bg-[#65e7ff]/10 text-cyan-700 dark:text-[#65e7ff]",
      accentText: "text-cyan-700 dark:text-[#65e7ff]",
      accentBox:
        "border-cyan-500/30 bg-cyan-50 shadow-cyan-500/10 dark:border-[#65e7ff]/30 dark:bg-[#65e7ff]/10",
      rangeHex: "#65e7ff",
      sliderBg: (pct: number) =>
        `linear-gradient(to right, #65e7ff ${pct}%, var(--lease-track) ${pct}%)`,
      sliderBgDark: (pct: number) =>
        `linear-gradient(to right, #65e7ff ${pct}%, #1b2640 ${pct}%)`,
      confirmBtn:
        "bg-slate-900 text-white hover:shadow-[0_0_32px_-6px_rgba(101,231,255,0.85)] dark:bg-white dark:text-[#050a18]",
    },
  },
  business: {
    key: "business",
    name: "Business",
    multiplier: 2.5,
    revenueShare: "7%–8%",
    range: { min: 500, max: 1490, step: 50 },
    badge: "Popular",
    Icon: RiBriefcaseLine,
    tw: {
      activePill:
        "border border-violet-500/50 bg-violet-500/10 text-violet-700 shadow-[0_0_22px_-6px_rgba(167,139,250,0.7)] dark:border-violet-400/50 dark:bg-violet-400/10 dark:text-violet-300",
      inactivePill:
        "border border-transparent text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-300",
      cardBg: "bg-violet-50 dark:bg-violet-400/[0.06]",
      cardBorder: "border-violet-200 dark:border-violet-400/25",
      badgeBg:
        "bg-violet-100 dark:bg-violet-400/10 text-violet-700 dark:text-violet-300",
      accentText: "text-violet-600 dark:text-violet-300",
      accentBox:
        "border-violet-500/30 bg-violet-50 shadow-violet-500/10 dark:border-violet-400/30 dark:bg-violet-400/10",
      rangeHex: "#a78bfa",
      sliderBg: (pct: number) =>
        `linear-gradient(to right, #a78bfa ${pct}%, var(--lease-track) ${pct}%)`,
      sliderBgDark: (pct: number) =>
        `linear-gradient(to right, #a78bfa ${pct}%, #1b2640 ${pct}%)`,
      confirmBtn:
        "bg-slate-900 text-white hover:shadow-[0_0_32px_-6px_rgba(167,139,250,0.85)] dark:bg-white dark:text-[#050a18]",
    },
  },
  industrial: {
    key: "industrial",
    name: "Industrial",
    multiplier: 2.5,
    revenueShare: "9%–10%",
    range: { min: 1500, max: 25000, step: 100 },
    badge: "Enterprise",
    Icon: RiBuilding4Line,
    tw: {
      activePill:
        "border border-pink-500/50 bg-pink-500/10 text-pink-700 shadow-[0_0_22px_-6px_rgba(244,114,182,0.7)] dark:border-pink-400/50 dark:bg-pink-400/10 dark:text-pink-300",
      inactivePill:
        "border border-transparent text-slate-500 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-300",
      cardBg: "bg-pink-50 dark:bg-pink-400/[0.06]",
      cardBorder: "border-pink-200 dark:border-pink-400/25",
      badgeBg: "bg-pink-100 dark:bg-pink-400/10 text-pink-700 dark:text-pink-300",
      accentText: "text-pink-600 dark:text-pink-300",
      accentBox:
        "border-pink-500/30 bg-pink-50 shadow-pink-500/10 dark:border-pink-400/30 dark:bg-pink-400/10",
      rangeHex: "#f472b6",
      sliderBg: (pct: number) =>
        `linear-gradient(to right, #f472b6 ${pct}%, var(--lease-track) ${pct}%)`,
      sliderBgDark: (pct: number) =>
        `linear-gradient(to right, #f472b6 ${pct}%, #1b2640 ${pct}%)`,
      confirmBtn:
        "bg-slate-900 text-white hover:shadow-[0_0_32px_-6px_rgba(244,114,182,0.85)] dark:bg-white dark:text-[#050a18]",
    },
  },
};

/* ─── API Helpers ─────────────────────────────────────── */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

async function fetchWalletReport(): Promise<WalletData> {
  const res = await fetch(`/api/FundManager`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch wallet report");
  const json = await res.json();
  const wallet = json?.data ?? {};
  return {
    depositWallet: Number(wallet.DepositWallet ?? 0),
    legacyWallet: Number(wallet.IncomeWallet ?? 0),
  };
}

async function fetchUsernameByLoginId(
  loginId: string
): Promise<UsernameResult | null> {
  const res = await fetch(
    `/api/FundManager?authLogin=${encodeURIComponent(loginId)}`,
    {
      credentials: "include",
    }
  );
  if (!res.ok) return null;
  const json = await res.json();
  if (!json?.data) return null;
  return { name: json.data.Name, authLogin: loginId };
}

async function fetchBuyAgentLicense(
  payload: BuyLicensePayload
): Promise<BuyLicenseResponse> {
  const res = await fetch(`/api/FundManager`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Lease purchase failed");
  return res.json();
}

/* ─── Sub-components ─────────────────────────────────── */

interface StatPillProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accentClass: string;
}

const StatPill: React.FC<StatPillProps> = ({
  icon: Icon,
  label,
  value,
  accentClass,
}) => (
  <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white px-2 py-3 transition-all duration-200 hover:border-cyan-500/40 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-[#65e7ff]/30">
    {Icon && <Icon className={`text-base ${accentClass}`} />}
    <span className="text-[10px] leading-none text-slate-500 dark:text-slate-400">
      {label}
    </span>
    <span className={`text-xs font-bold tabular-nums ${accentClass}`}>
      {value}
    </span>
  </div>
);

interface SummaryRowProps {
  label: string;
  value: string;
  valueClass?: string;
}

const SummaryRow: React.FC<SummaryRowProps> = ({
  label,
  value,
  valueClass = "",
}) => (
  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-colors duration-200 hover:border-cyan-500/40 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-[#65e7ff]/30">
    <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
    <span
      className={`text-sm font-semibold tabular-nums text-slate-900 dark:text-white ${valueClass}`}
    >
      {value}
    </span>
  </div>
);

/* ─── Main Modal ─────────────────────────────────────── */

export default function LeaseModal({
  agent,
  onClose,
  productId,
  month,
}: LeaseModalProps) {
  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("personal");
  const [investment, setInvestment] = useState<number>(
    PLANS.personal.range.min
  );
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [searchedUsername, setSearchedUsername] = useState<string | null>(null);
  const [searchedUrid, setSearchedUrid] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [, setOrderData] = useTempStorage<OrderData>("orderData");
  const [depositWallet, setDepositWallet] = useState<number>(0);
  const [legacyWallet, setLegacyWallet] = useState<number>(0);

  const [routeMap, setRouteMap] = useState<Record<string, string>>({});

  /* ── Route map ── */
  // useEffect(() => {
  //   const updateRouteMap = () => {
  //     const seed = Cookies.get("routeSlugsSeed");
  //     if (seed) {
  //       setRouteMap(createRouteMapFromSeed(seed, 6) as Record<string, string>);
  //     } else {
  //       setRouteMap({});
  //     }
  //   };
  //   updateRouteMap();
  //   const interval = setInterval(updateRouteMap, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  /* ── Wallet fetch ── */
  useEffect(() => {
    (async () => {
      try {
        const w = await fetchWalletReport();
        setDepositWallet(w.depositWallet);
        setLegacyWallet(w.legacyWallet);
      } catch (e) {
        console.error("Wallet fetch error:", e);
      }
    })();
  }, []);

  /* ── Plan & investment derived ── */
  const plan = PLANS[selectedPlan];
  const { min, max, step } = plan.range;
  const clamped = Math.min(Math.max(investment, min), max);
  const credits = clamped * 100;
  const pct = ((clamped - min) / (max - min)) * 100;

  const canAcquireLicense = Boolean(searchedUrid);

  const handlePlanChange = useCallback((key: PlanKey) => {
    setSelectedPlan(key);
    setInvestment(PLANS[key].range.min);
  }, []);

  const handleInvestmentChange = useCallback(
    (val: string) => {
      const parsed = parseInt(val) || min;
      setInvestment(Math.min(Math.max(parsed, min), max));
    },
    [min, max]
  );

  /* ── Username search (debounced) ── */
  useEffect(() => {
    const t = setTimeout(async () => {
      if (usernameInput.length >= 3) {
        setIsSearching(true);
        setHasSearched(true);
        try {
          const result = await fetchUsernameByLoginId(usernameInput);
          if (result) {
            setSearchedUsername(result.name);
            setSearchedUrid(result.authLogin);
          } else {
            setSearchedUsername(null);
            setSearchedUrid(null);
          }
        } catch {
          setSearchedUsername(null);
          setSearchedUrid(null);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchedUsername(null);
        setSearchedUrid(null);
        setHasSearched(false);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [usernameInput]);

  /* ── Confirm lease ── */
  const handleConfirmLease = async () => {
    setShowConfirmation(false);
    setIsConfirming(true);
    if (depositWallet < clamped) {
      toast.error("Insufficient balance in Deposit Wallet");
      setIsConfirming(false);
      return;
    }

    const data: BuyLicensePayload = {
      productId,
      rkprice: clamped,
      byAuthlogin: searchedUrid!,
    };

    try {
      const result = await fetchBuyAgentLicense(data);
      if (result.statusCode === 200) {
        toast.success(result.message || "Subscribed successfully!");
        const orderId = `ORD-${Math.floor(1000 + Math.random() * 900000)}`;
        const r = result.data?.[0];
        setOrderData({
          image: r?.image ?? agent.imageUrl ?? "",
          name: r?.ProductName ?? agent.productName,
          Rkprice: r?.Rkprice ?? clamped,
          usernameInput,
          searchedUsername,
          month,
          orderId,
        });
        const basePath =
          routeMap["/order-success"] || "/order-success";
        router.push(basePath);
      } else {
        toast.error(
          result.message || "Lease confirmation failed. Please try again."
        );
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsConfirming(false);
    }
  };

  if (!agent) return null;

  return (
    <>
      <style>{`
        .lease-slider{--lease-track:#cbd5e1;--lease-thumb-border:#ffffff;}
        .dark .lease-slider{--lease-track:#1b2640;--lease-thumb-border:#050a18;}
        .lease-slider::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:${plan.tw.rangeHex};border:3px solid var(--lease-thumb-border);box-shadow:0 0 0 1px ${plan.tw.rangeHex}66,0 0 14px ${plan.tw.rangeHex}88;cursor:pointer;transition:all 0.2s ease;}
        .lease-slider::-webkit-slider-thumb:hover{transform:scale(1.1);}
        .lease-slider::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:${plan.tw.rangeHex};border:3px solid var(--lease-thumb-border);cursor:pointer;}
        .modal-scroll::-webkit-scrollbar{display:none}
      `}</style>

      {/* ── Confirm Dialog ── */}
      {showConfirmation && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-md animate-fadeIn dark:bg-[#02050f]/75">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/20 dark:border-[#65e7ff]/20 dark:bg-[#070d1c] dark:shadow-[0_30px_90px_-20px_rgba(101,231,255,0.35)]">
            <div className="flex items-center gap-3 mb-5">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl border shadow-lg ${plan.tw.accentBox}`}
              >
                <RiShieldCheckLine
                  className={`text-xl ${plan.tw.accentText}`}
                />
              </div>
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Confirm action
                </p>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Acquire AI Agent License?
                </h3>
              </div>
            </div>
            <div className="mb-5 space-y-2">
              <SummaryRow
                label="License Fee"
                value={`$${clamped.toLocaleString()}`}
              />
              <SummaryRow label="Assigned To" value={usernameInput} />
              <SummaryRow
                label="License Plan"
                value={`${plan.name} · ${plan.multiplier}X`}
              />
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={isConfirming}
                className="flex-1 rounded-full border border-slate-300 bg-transparent py-3 text-sm font-semibold text-slate-700 transition-all hover:border-cyan-600 hover:bg-cyan-50 dark:border-[#65e7ff]/40 dark:text-white dark:hover:border-[#65e7ff] dark:hover:bg-[#65e7ff]/10"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLease}
                disabled={isConfirming}
                className={`flex flex-[2] items-center justify-center gap-2 rounded-full py-3 text-sm font-bold shadow-lg transition-all ${plan.tw.confirmBtn}`}
              >
                {isConfirming ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white dark:border-[#050a18]/30 dark:border-t-[#050a18]" />
                    <span className="opacity-90">Processing…</span>
                  </span>
                ) : (
                  <>
                    Yes, Confirm <RiArrowRightLine className="text-base" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Modal ── */}
      <div className="fixed inset-0 z-[50] mt-5 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-md animate-fadeIn dark:bg-[#02050f]/75">
        <div className="modal-scroll relative max-h-[92vh] w-full max-w-[550px] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 dark:border-[#65e7ff]/20 dark:bg-[#070d1c] dark:shadow-[0_30px_90px_-20px_rgba(101,231,255,0.35)]">
          {isConfirming && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-white/80 backdrop-blur-sm dark:bg-[#070d1c]/80">
              <PageLoader />
            </div>
          )}
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 rounded-t-3xl border-b border-slate-200 bg-white/90 px-6 pb-4 pt-6 backdrop-blur-xl dark:border-white/10 dark:bg-[#070d1c]/90">
            <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent dark:via-[#65e7ff]/60" />
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all hover:scale-105 hover:border-cyan-500/50 hover:text-cyan-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:border-[#65e7ff]/50 dark:hover:text-[#65e7ff]"
            >
              <RiCloseLine className="text-lg" />
            </button>
            <h2 className="pr-10 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Configure Your License
            </h2>
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* Wallet Balance */}
            <div className="grid grid-cols-2 gap-3">
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/60 via-[#65e7ff]/40 to-sky-400/60 p-[1px] shadow-lg shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-12px_rgba(101,231,255,0.6)]">
                <div className="relative flex items-center justify-between rounded-2xl bg-white px-3 py-3 dark:bg-[#0a1224]">
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full dark:via-white/10" />
                  <div className="relative z-10 flex flex-wrap items-center gap-3">
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#65e7ff] to-sky-500 shadow-lg shadow-cyan-500/30">
                      <div className="absolute inset-0 -z-10 rounded-xl bg-[#65e7ff]/40 blur-md" />
                      <RiWallet3Line className="text-xl text-[#050a18]" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-700/80 dark:text-[#65e7ff]/80">
                        Deposit Wallet
                      </p>
                      <p className="bg-gradient-to-r from-cyan-700 to-sky-600 bg-clip-text text-lg font-bold leading-tight text-transparent tabular-nums dark:from-[#65e7ff] dark:to-sky-300">
                        $
                        {Number(depositWallet).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center gap-1 rounded-full bg-cyan-100 px-2 py-1 dark:bg-[#65e7ff]/10">
                    <RiArrowUpLine className="text-sm text-cyan-700 dark:text-[#65e7ff]" />
                  </div>
                </div>
              </div>

              {/* <div className="group relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-br from-violet-400/60 via-blue-300/40 to-fuchsia-400/60 shadow-lg shadow-violet-500/10 hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all duration-300">
                <div className="relative flex items-center justify-between px-3 py-3 rounded-2xl bg-white/90 dark:bg-zinc-950/80 backdrop-blur-xl">
                  <div className="absolute inset-0 transition-transform duration-1000 -translate-x-full pointer-events-none group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
                  <div className="relative z-10 flex flex-wrap items-center gap-3">
                    <div className="relative flex items-center justify-center shadow-lg w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-violet-500/30">
                      <div className="absolute inset-0 rounded-xl bg-violet-400/40 blur-md -z-10" />
                      <RiSafe2Line className="text-xl text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-violet-600/80 dark:text-violet-400/80 uppercase tracking-[0.12em]">
                        Legacy Wallet
                      </p>
                      <p className="text-lg font-bold leading-tight text-transparent bg-gradient-to-r from-violet-700 to-blue-600 dark:from-violet-300 dark:to-blue-400 bg-clip-text tabular-nums">
                        $
                        {Number(legacyWallet).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-900/40">
                    <RiHistoryLine className="text-sm text-violet-600 dark:text-violet-400" />
                  </div>
                </div>
              </div> */}
            </div>

            {/* Plan Selector */}
            <div>
              <p className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Select plan
              </p>
              <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-slate-100 p-1.5 dark:border-white/10 dark:bg-[#0a1224]">
                {Object.values(PLANS).map((p) => {
                  const isActive = selectedPlan === p.key;
                  return (
                    <button
                      key={p.key}
                      onClick={() => handlePlanChange(p.key)}
                      className={`flex flex-col items-center gap-0.5 rounded-xl px-2 py-2.5 text-[11px] font-bold transition-all duration-200 ${
                        isActive ? p.tw.activePill : p.tw.inactivePill
                      }`}
                    >
                      <p.Icon className="mb-0.5 text-base" />
                      {p.name}
                      <span
                        className={`text-[10px] font-semibold ${
                          isActive ? "opacity-80" : "text-slate-400"
                        }`}
                      >
                        {p.multiplier}X
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Investment Calculator */}
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-200 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300">
                  Investment
                </p>
                <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 transition-colors focus-within:border-cyan-500/60 dark:border-white/10 dark:bg-[#050a18] dark:focus-within:border-[#65e7ff]/60">
                  <span className="text-xs text-slate-500">$</span>
                  <input
                    type="number"
                    value={clamped}
                    min={min}
                    max={max}
                    step={step}
                    onChange={(e) => handleInvestmentChange(e.target.value)}
                    className="w-20 bg-transparent text-right text-sm font-bold text-slate-900 outline-none tabular-nums dark:text-white"
                  />
                </div>
              </div>

              <div>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={clamped}
                  onChange={(e) => handleInvestmentChange(e.target.value)}
                  className="lease-slider h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none"
                  style={{ background: plan.tw.sliderBg(pct) }}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-slate-500 tabular-nums">
                    ${min.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 tabular-nums">
                    ${max.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <StatPill
                  icon={RiCoinsLine}
                  label="Amount"
                  value={`$${clamped.toLocaleString()}`}
                  accentClass="text-slate-700 dark:text-slate-200"
                />
                <StatPill
                  icon={RiRepeatLine}
                  label="Multiplier"
                  value={`${plan.multiplier}X`}
                  accentClass={plan.tw.accentText}
                />
                <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-2 dark:border-[#65e7ff]/25 dark:bg-[#65e7ff]/[0.06]">
                  <StatPill
                    icon={RiBarChartBoxLine}
                    label="Credit Capacity"
                    value={credits.toLocaleString()}
                    accentClass="text-cyan-700 dark:text-[#65e7ff]"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-300 dark:to-[#65e7ff]/30" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Assign to
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-300 dark:to-[#65e7ff]/30" />
            </div>

            {/* Username Search */}
            <div className="space-y-2">
              <div className="relative">
                <RiUserLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-cyan-700/70 dark:text-[#65e7ff]/70" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Search username…"
                  className="w-full rounded-full border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-cyan-500/40 focus:border-cyan-500 focus:ring-4 focus:ring-[#65e7ff]/20 dark:border-white/10 dark:bg-[#0a1224] dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-[#65e7ff]/30 dark:focus:border-[#65e7ff]/70 dark:focus:ring-[#65e7ff]/15"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  {isSearching ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-cyan-600 dark:border-white/20 dark:border-t-[#65e7ff]" />
                  ) : (
                    <RiSearchLine className="text-base text-slate-400 dark:text-slate-500" />
                  )}
                </div>
              </div>

              {!isSearching && hasSearched && !searchedUsername && (
                <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 animate-fadeIn dark:border-red-400/30 dark:bg-red-500/10">
                  <RiErrorWarningLine className="flex-shrink-0 text-base text-red-500 dark:text-red-300" />
                  <p className="text-xs font-medium text-red-600 dark:text-red-300">
                    Username not found. Try a different name.
                  </p>
                </div>
              )}

              {!isSearching && searchedUsername && (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 transition-all duration-200 animate-fadeIn dark:border-emerald-400/30 dark:bg-emerald-400/10">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-400/15">
                    <RiCheckLine className="text-base text-emerald-600 dark:text-emerald-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      User found
                    </p>
                    <p className="truncate text-sm font-bold text-emerald-700 dark:text-emerald-300">
                      {searchedUsername}
                    </p>
                  </div>
                  <span className="flex flex-shrink-0 items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300">
                    <RiShieldCheckLine className="text-xs" /> Verified
                  </span>
                </div>
              )}
            </div>

            {/* Community Notice */}
            <div className="flex items-start gap-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3.5 transition-all duration-200 dark:border-[#65e7ff]/20 dark:bg-[#65e7ff]/[0.06]">
              <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#65e7ff] to-sky-500 shadow-lg shadow-cyan-500/20">
                <RiShieldCheckLine className="text-sm text-[#050a18]" />
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                This agent is{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  approved
                </span>{" "}
                and marked for deployment under the{" "}
                <Link
                  // href={routeMap["/community"] || "/community"}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-cyan-700 underline underline-offset-2 transition-colors hover:text-cyan-900 dark:text-[#65e7ff] dark:hover:text-white"
                >
                  QURO Community Program
                </Link>
                .
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pb-1">
              <button
                onClick={onClose}
                className="flex-1 rounded-full border border-slate-300 bg-transparent py-3.5 text-sm font-bold text-slate-700 transition-all hover:border-cyan-600 hover:bg-cyan-50 dark:border-[#65e7ff]/40 dark:text-white dark:hover:border-[#65e7ff] dark:hover:bg-[#65e7ff]/10"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!canAcquireLicense) {
                    if (!searchedUrid) {
                      toast.error("Please search and select a user");
                    }
                    return;
                  }
                  setShowConfirmation(true);
                }}
                disabled={!canAcquireLicense || isConfirming}
                className={`group relative flex flex-[2] items-center justify-center gap-2 overflow-hidden rounded-full py-3.5 text-sm font-bold shadow-lg transition-all ${
                  plan.tw.confirmBtn
                } ${
                  !canAcquireLicense || isConfirming
                    ? "cursor-not-allowed opacity-60 shadow-none hover:shadow-none"
                    : ""
                }`}
              >
                <span className="absolute inset-0 h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-[#65e7ff]/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></span>
                {isConfirming ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white dark:border-[#050a18]/30 dark:border-t-[#050a18]" />
                    Processing…
                  </span>
                ) : (
                  <>
                    Acquire License
                    <RiArrowRightLine className="text-base transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
