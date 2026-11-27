"use client";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  RiStackLine,
  RiAddLine,
  RiRobot2Line,
  RiCheckboxCircleFill,
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

interface Plan {
  key: PlanKey;
  name: string;
  desc: string;
  multiplier: number;
  revenueShare: string;
  range: { min: number; max: number; step: number };
  Icon: React.ComponentType<{ className?: string }>;
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

const PLANS: Record<PlanKey, Plan> = {
  personal: {
    key: "personal",
    name: "Personal",
    desc: "For individual users",
    multiplier: 2.5,
    revenueShare: "6%-7%",
    range: { min: 50, max: 490, step: 10 },
    Icon: RiFlashlightLine,
  },
  business: {
    key: "business",
    name: "Business",
    desc: "For growing teams",
    multiplier: 2.5,
    revenueShare: "7%–8%",
    range: { min: 500, max: 1490, step: 50 },
    Icon: RiBriefcaseLine,
  },
  industrial: {
    key: "industrial",
    name: "Industrial",
    desc: "For large-scale operation",
    multiplier: 2.5,
    revenueShare: "9%–10%",
    range: { min: 1500, max: 25000, step: 100 },
    Icon: RiBuilding4Line,
  },
};

const FEATURES = [
  {
    Icon: RiFlashlightLine,
    title: "AI Trading Intelligence",
    sub: "Automated & data-driven strategies",
  },
  {
    Icon: RiStackLine,
    title: "Higher Earning Potential",
    sub: "Upto 2.5x returns",
  },
  {
    Icon: RiShieldCheckLine,
    title: "Secure & Compliant",
    sub: "Enterprise-grade protection",
  },
  {
    Icon: RiBarChartBoxLine,
    title: "Real-time Performance",
    sub: "Track and grow your results",
  },
];

/* ─── API Helpers ─────────────────────────────────────── */

async function fetchWalletReport(): Promise<WalletData> {
  const res = await fetch(`/api/FundManager`, { credentials: "include" });
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
    { credentials: "include" }
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
  highlight?: boolean;
}

const StatPill: React.FC<StatPillProps> = ({
  icon: Icon,
  label,
  value,
  highlight = false,
}) => (
  <div
    className={`flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl border px-1.5 py-2.5 text-center transition-colors ${highlight
      ? "border-emerald-300/70 bg-gradient-to-b from-[#e3faf3] to-[#f2fcf9] dark:border-emerald-400/30 dark:from-emerald-400/15 dark:to-emerald-400/5"
      : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.03]"
      }`}
  >
    <Icon
      className={`text-sm ${highlight ? "text-emerald-600 dark:text-emerald-300" : "text-slate-500 dark:text-slate-400"
        }`}
    />
    <span className="w-full truncate text-[10px] leading-none text-slate-500 dark:text-slate-400">
      {label}
    </span>
    <span className="w-full truncate text-sm font-bold tabular-nums text-slate-900 dark:text-white">
      {value}
    </span>
  </div>
);

interface SummaryRowProps {
  label: string;
  value: string;
}

const SummaryRow: React.FC<SummaryRowProps> = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
    <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
    <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
      {value}
    </span>
  </div>
);

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 sm:text-[11px]">
    {children}
  </p>
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
  const [investment, setInvestment] = useState<number>(PLANS.personal.range.min);
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [searchedUsername, setSearchedUsername] = useState<string | null>(null);
  const [searchedUrid, setSearchedUrid] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [, setOrderData] = useTempStorage<OrderData>("orderData");
  const [depositWallet, setDepositWallet] = useState<number>(0);
  const [, setLegacyWallet] = useState<number>(0);

  const [routeMap] = useState<Record<string, string>>({});

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
        const basePath = routeMap["/order-success"] || "/order-success";
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
        .lease-slider{--lease-track:#d5dde5;--lease-thumb-border:#ffffff;}
        .dark .lease-slider{--lease-track:#1b2640;--lease-thumb-border:#070d1c;}
        .lease-slider::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#10b981;border:3px solid var(--lease-thumb-border);box-shadow:0 0 0 1px #10b98166,0 0 12px #10b98188;cursor:pointer;transition:transform .2s ease;}
        .lease-slider::-webkit-slider-thumb:hover{transform:scale(1.12);}
        .lease-slider::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#10b981;border:3px solid var(--lease-thumb-border);cursor:pointer;}
        .modal-scroll::-webkit-scrollbar{display:none}
        .modal-scroll{scrollbar-width:none}
      `}</style>

      {/* ── Confirm Dialog ── */}
      {showConfirmation && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-md animate-fadeIn dark:bg-[#02050f]/75">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/20 dark:border-emerald-400/20 dark:bg-[#070d1c] sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-300/60 bg-emerald-50 dark:border-emerald-400/30 dark:bg-emerald-400/10">
                <RiShieldCheckLine className="text-xl text-emerald-600 dark:text-emerald-300" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Confirm action
                </p>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Acquire AI Agent License?
                </h3>
              </div>
            </div>
            <div className="mb-5 space-y-2">
              <SummaryRow label="License Fee" value={`$${clamped.toLocaleString()}`} />
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
                className="flex-1 rounded-full border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLease}
                disabled={isConfirming}
                className="flex flex-[2] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0b7a66] to-[#12b49a] py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:brightness-110"
              >
                {isConfirming ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Processing…
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
      <div className="fixed inset-0 z-[50] flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-md animate-fadeIn dark:bg-[#02050f]/75 sm:p-4"
        onClick={onClose}
      >
        <div className="relative flex max-h-[92vh] w-full max-w-[900px] overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl shadow-slate-900/30 dark:border-emerald-400/20 dark:bg-[#070d1c]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* {isConfirming && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-[#070d1c]/80">
              <PageLoader />
            </div>
          )} */}

          {/* ───────── LEFT: image panel (hidden on mobile) ───────── */}
          <aside className="relative hidden w-[36%] shrink-0 flex-col overflow-hidden bg-[#032124] md:flex">
          
            <div className="absolute inset-x-0 bottom-0 top-[10%]">
              <Image
                src="/lease-agent-bg.webp"
                alt=""
                fill
                priority
                sizes="320px"
                className="object-cover object-center"
              />
            </div>
            {/* fades so the image melts into the panel colour */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#032124] via-[#032124]/80 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#032124]/90 via-[#032124]/40 to-transparent" />

            <div className="relative z-10 p-5 lg:p-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-200 backdrop-blur">
                <RiRobot2Line className="text-sm" />
                QUZO AI Agents
              </span>
              <h2 className="mt-4 text-2xl font-extrabold leading-[1.1] tracking-tight text-white lg:text-[2rem]">
                Deploy Your
                <span className="block text-[#35f0c0]">AI Agent</span>
              </h2>
              <p className="mt-3 max-w-[230px] text-xs leading-relaxed text-slate-200/90 lg:text-[13px]">
                Activate your agent license and start earning with the power of
                QUZO AI.
              </p>
            </div>

            <ul className="relative z-10 mt-auto space-y-1.5 p-4 lg:p-5">
              {FEATURES.map(({ Icon, title, sub }) => (
                <li
                  key={title}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-2 backdrop-blur-md"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-emerald-300/20 bg-gradient-to-br from-teal-400/30 to-emerald-500/10 text-emerald-200">
                    <Icon className="text-lg" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-white">{title}</p>
                    <p className="truncate text-[10px] text-slate-300">{sub}</p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          {/* ───────── RIGHT: form ───────── */}
          <section className="modal-scroll min-w-0 flex-1 overflow-y-auto bg-gradient-to-b from-white to-[#f4fbfa] dark:from-[#070d1c] dark:to-[#070d1c]">
            <div className="space-y-4 p-4 sm:p-5 lg:p-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                    Configure Your License
                  </h2>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 sm:text-xs">
                    Choose a plan, set your investment and deploy your AI agent
                  </p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:scale-105 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:text-white"
                >
                  <RiCloseLine className="text-lg" />
                </button>
              </div>

              {/* Deposit wallet */}
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-200/70 bg-gradient-to-r from-[#e3faf3] to-[#f0fbfa] p-3 dark:border-emerald-400/25 dark:from-emerald-400/10 dark:to-sky-400/5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-300">
                    <RiWallet3Line className="text-xl" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-300">
                      Deposit Wallet
                    </p>
                    <p className="truncate text-lg font-extrabold tabular-nums text-slate-900 dark:text-white sm:text-xl">
                      $
                      {Number(depositWallet).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
                {/* TODO: change href to your deposit / add-funds route */}
                <Link
                  href="/fund-director"
                  className="flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-[#0b9a7f] to-[#16c9a6] px-3 py-2 text-[11px] font-bold text-white shadow-md shadow-emerald-600/25 transition hover:brightness-110 sm:px-4 sm:text-xs"
                >
                  <RiAddLine className="text-sm" />
                  Add Funds
                </Link>
              </div>

              {/* Plan selector */}
              <div>
                <SectionLabel>Select plan</SectionLabel>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {Object.values(PLANS).map((p) => {
                    const isActive = selectedPlan === p.key;
                    return (
                      <button
                        key={p.key}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => handlePlanChange(p.key)}
                        className={`relative flex min-w-0 flex-col items-center rounded-xl border px-1.5 py-2.5 text-center transition-all sm:px-2 sm:py-3 ${isActive
                          ? "border-sky-300 bg-gradient-to-b from-[#e3faf3] to-white shadow-[0_0_0_3px_rgba(45,212,191,0.18)] dark:border-emerald-400/60 dark:from-emerald-400/15 dark:to-transparent"
                          : "border-slate-200 bg-white hover:border-emerald-300 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-emerald-400/40"
                          }`}
                      >
                        {isActive && (
                          <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white shadow">
                            <RiCheckLine className="text-xs" />
                          </span>
                        )}
                        <p.Icon
                          className={`text-lg ${isActive ? "text-emerald-600 dark:text-emerald-300" : "text-slate-600 dark:text-slate-300"
                            }`}
                        />
                        <span className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100 sm:text-xs">
                          {p.name}
                        </span>
                        <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-300 sm:text-lg">
                          {p.multiplier}×
                        </span>
                        <span className="w-full text-[9px] leading-tight text-slate-500 dark:text-slate-400 sm:text-[10px]">
                          {p.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <hr className="border-slate-200/80 dark:border-white/10" />

              {/* Investment */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <SectionLabel>Investment amount</SectionLabel>
                  <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm focus-within:border-emerald-500 dark:border-white/10 dark:bg-[#0a1224]">
                    <span className="text-xs text-slate-500">$</span>
                    <input
                      type="number"
                      value={clamped}
                      min={min}
                      max={max}
                      step={step}
                      onChange={(e) => handleInvestmentChange(e.target.value)}
                      className="w-16 bg-transparent text-right text-sm font-bold tabular-nums text-slate-900 outline-none dark:text-white sm:w-20"
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
                    aria-label="Investment amount"
                    className="lease-slider h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none"
                    style={{
                      background: `linear-gradient(to right, #10b981 ${pct}%, var(--lease-track) ${pct}%)`,
                    }}
                  />
                  <div className="mt-1.5 flex justify-between text-[10px] tabular-nums text-slate-500">
                    <span>${min.toLocaleString()}</span>
                    <span>${max.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <StatPill icon={RiCoinsLine} label="Amount" value={`$${clamped.toLocaleString()}`} />
                  <StatPill icon={RiRepeatLine} label="Multiplier" value={`${plan.multiplier}×`} />
                  <StatPill
                    icon={RiStackLine}
                    label="Credit Capacity"
                    value={credits.toLocaleString()}
                    highlight
                  />
                </div>
              </div>

              {/* Assign to */}
              <div className="space-y-2">
                <SectionLabel>Assign to</SectionLabel>
                <div className="relative">
                  <RiUserLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-slate-500 dark:text-slate-400" />
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Search username…"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-400/15 dark:border-white/10 dark:bg-[#0a1224] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-400/70"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {isSearching ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600 dark:border-white/20 dark:border-t-emerald-300" />
                    ) : (
                      <RiSearchLine className="text-base text-slate-400 dark:text-slate-500" />
                    )}
                  </div>
                </div>

                {!isSearching && hasSearched && !searchedUsername && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 animate-fadeIn dark:border-red-400/30 dark:bg-red-500/10">
                    <RiErrorWarningLine className="shrink-0 text-base text-red-500 dark:text-red-300" />
                    <p className="text-xs font-medium text-red-600 dark:text-red-300">
                      Username not found. Try a different name.
                    </p>
                  </div>
                )}

                {!isSearching && searchedUsername && (
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 animate-fadeIn dark:border-emerald-400/30 dark:bg-emerald-400/10">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-100 dark:bg-emerald-400/15">
                      <RiCheckLine className="text-base text-emerald-600 dark:text-emerald-300" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        User found
                      </p>
                      <p className="truncate text-sm font-bold text-emerald-700 dark:text-emerald-300">
                        {searchedUsername}
                      </p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300">
                      <RiShieldCheckLine className="text-xs" /> Verified
                    </span>
                  </div>
                )}
              </div>

              {/* Community notice */}
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200/70 bg-gradient-to-r from-[#e3faf3] to-[#f0fbfa] px-3 py-2.5 dark:border-emerald-400/20 dark:from-emerald-400/10 dark:to-transparent">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                  <RiShieldCheckLine className="text-base" />
                </span>
                <p className="min-w-0 flex-1 text-[11px] leading-snug text-slate-600 dark:text-slate-300 sm:text-xs">
                  This agent is approved and marked for deployment under the{" "}
                  <Link
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-900 dark:text-emerald-300"
                  >
                    QUZO Community Program
                  </Link>
                  .
                </p>
                <RiCheckboxCircleFill className="shrink-0 text-lg text-emerald-500" />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pb-1">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-full border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-white/15 dark:bg-transparent dark:text-white dark:hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!canAcquireLicense) {
                      toast.error("Please search and select a user");
                      return;
                    }
                    setShowConfirmation(true);
                  }}
                  disabled={!canAcquireLicense || isConfirming}
                  className={`group flex flex-[2] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0b6f5d] to-[#14b89c] py-3 text-sm font-bold text-white shadow-lg shadow-emerald-700/25 transition-all hover:brightness-110 ${!canAcquireLicense || isConfirming
                    ? "cursor-not-allowed opacity-60 shadow-none hover:brightness-100"
                    : ""
                    }`}
                >
                  {isConfirming ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
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
          </section>
        </div>
      </div>
    </>
  );
}



