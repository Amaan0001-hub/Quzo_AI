"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Sora } from 'next/font/google';
import { QUERY_KEYS } from '@/lib/constants';

const sora = Sora({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface PlanFeature {
  text: string;
}

interface Plan {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  investmentRange: string;
  features: PlanFeature[];
  min: number;
  max: number | null;
  investorLimit: number;
  leadersLimit: number;
  colors: { a: string; b: string };
  isPopular?: boolean;
  BoosterPackage: number;
}

interface ActivatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  userId?: string;
}

/* ------------------------------------------------------------------ */
/*  Tailwind class presets                                             */
/* ------------------------------------------------------------------ */
const THEME_VARS = [
  "[--card:#fff] dark:[--card:#07242e]",
  "[--ink:#06262f] dark:[--ink:#e6f7f9]",
  "[--mut:#5b7885] dark:[--mut:#84a2ad]",
  "[--line:#d9e8ec] dark:[--line:#153747]",
  "[--sh:0_10px_30px_-14px_rgba(10,60,80,.28)] dark:[--sh:0_10px_30px_-14px_#000]",
  "[--p:#12a594] [--p2:#35d6c0]",
].join(" ");

const CARD_BASE =
  "relative overflow-hidden rounded-[18px] border border-[color:var(--line)] bg-[color:var(--card)] [box-shadow:var(--sh)] " +
  "transition-[transform,border-color,background,box-shadow] duration-[250ms] animate-[qzrise_.6s_both] [animation-delay:calc(var(--i,0)*45ms)] " +
  "hover:-translate-y-[3px] hover:border-[color:var(--c,var(--p))]";

const CARD =
  CARD_BASE +
  " p-4 after:content-[''] after:absolute after:-right-[30px] after:-top-[30px] after:h-[110px] after:w-[110px] after:rounded-full " +
  "after:bg-[color:var(--c,var(--p))] after:opacity-10 after:transition-all after:duration-[400ms] hover:after:scale-150 hover:after:opacity-[.16]";

const CARD_INC =
  CARD_BASE +
  " p-0 hover:[box-shadow:0_18px_34px_-14px_var(--c)] " +
  "before:content-[''] before:absolute before:inset-x-0 before:top-0 before:z-[2] before:h-1 before:[background:linear-gradient(90deg,var(--c),var(--p2))] " +
  "after:content-[''] after:absolute after:-right-[50px] after:-top-[60px] after:h-[170px] after:w-[170px] after:rounded-full " +
  "after:bg-[color:var(--c)] after:opacity-20 after:blur-[34px] after:transition-all after:duration-[400ms] hover:after:scale-[1.2] hover:after:opacity-[.34]";

const CARD_PKG =
  CARD_BASE + " p-0 hover:[box-shadow:0_20px_36px_-16px_var(--a)]";

const GRID = "mt-[14px] grid gap-[14px]";
const G2 = `${GRID} grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(340px,1fr))]`;
const G3 = `${GRID} grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]`;
const G4 = `${GRID} grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(210px,1fr))]`;

const H2 =
  "mt-[26px] flex items-center gap-2 text-[15px] font-semibold tracking-[.01em] text-[color:var(--ink)] " +
  "before:content-[''] before:h-4 before:w-1 before:rounded before:[background:linear-gradient(var(--p),var(--p2))]";

const LAB = "flex items-center gap-2 text-[12.5px] font-medium text-[color:var(--mut)]";
const IB =
  "grid h-[30px] w-[30px] place-items-center rounded-[10px] text-[color:var(--c,var(--p))] [background:color-mix(in_srgb,var(--c,var(--p))_15%,transparent)]";
const VAL = "mt-[10px] mb-0.5 text-[24px] font-semibold tabular-nums";
const RW = "flex items-center justify-between gap-[10px]";
const BAR = "mt-[10px] h-2 overflow-hidden rounded-[9px] [background:color-mix(in_srgb,var(--c,var(--p))_14%,transparent)]";
const BAR_I =
  "block h-full rounded-[9px] [background:linear-gradient(90deg,var(--c,var(--p)),var(--p2))] [background-size:200%_100%] animate-[qzsh_3s_linear_infinite]";
const KV_WRAP = "grid grid-cols-3 gap-[6px] sm:gap-[10px]";
const KV_CELL = "rounded-xl p-[8px] sm:p-[10px] [background:color-mix(in_srgb,var(--p)_7%,transparent)]";
const KV_SMALL = "block text-[10px] sm:text-[11.5px] text-[color:var(--mut)]";
const KV_B = "text-[14px] sm:text-[17px]";
const LV_WRAP = "mt-[10px] flex flex-wrap gap-1";
const LV_I =
  "h-[15px] w-[15px] rounded-[5px] animate-[qzpop_.4s_both] [animation-delay:calc(var(--k)*40ms)] [background:linear-gradient(135deg,var(--p),var(--p2))]";
const GO =
  "cursor-pointer rounded-xl px-4 py-[10px] font-semibold text-white transition duration-200 [background:linear-gradient(90deg,var(--p),var(--p2))] hover:-translate-y-px hover:brightness-[1.08]";
const PILL =
  "whitespace-nowrap rounded-full px-[10px] py-1 text-[11.5px] font-semibold text-[color:var(--c)] [background:color-mix(in_srgb,var(--c)_15%,transparent)]";
const BIG_IB =
  "relative grid h-11 w-11 place-items-center rounded-[14px] text-white [background:linear-gradient(135deg,var(--c),color-mix(in_srgb,var(--c)_55%,#fff))] [box-shadow:0_8px_18px_-6px_var(--c)] " +
  "after:content-[''] after:absolute after:-inset-[5px] after:rounded-[17px] after:border-2 after:border-[color:var(--c)] after:opacity-0 after:animate-[qzpl2_3s_infinite]";
const QMARK =
  "grid place-items-center font-bold text-white [background:linear-gradient(135deg,var(--p),var(--p2))] animate-[qzbob_4s_ease-in-out_infinite] [box-shadow:0_6px_18px_-4px_var(--p)]";
const LIVE = "inline-flex items-center gap-1.5 text-[12px] text-[#7ff5e6]";
const LIVE_I = "h-2 w-2 rounded-full bg-[#19e3d0] animate-[qzpl_1.4s_infinite]";

const PKG_TOP = [
  "relative overflow-hidden px-[18px] pt-[18px] pb-5 text-white [background:linear-gradient(135deg,var(--a),var(--b))]",
  "before:content-[''] before:absolute before:-right-[70px] before:-top-[100px] before:h-[230px] before:w-[230px] before:rounded-full before:bg-white before:opacity-[.14] before:animate-[qzbob_6s_ease-in-out_infinite]",
].join(" ");

const HERO = [
  "relative overflow-hidden rounded-[22px] px-[22px] py-5 text-[#e8fbff] animate-[qzrise_.6s_both] [box-shadow:var(--sh)]",
  "[background:radial-gradient(700px_260px_at_90%_-30%,#1f5f7a66,transparent_60%),radial-gradient(600px_260px_at_0_130%,#19e3d044,transparent_60%),#06222d]",
  "after:content-[''] after:absolute after:inset-0 after:[transform:translateX(-100%)] after:animate-[qzswp_6s_infinite]",
  "after:[background:linear-gradient(105deg,transparent_40%,#ffffff12_50%,transparent_60%)]",
].join(" ");

const ORB = [
  "relative z-[1] grid h-[118px] w-[118px] place-items-center",
  "before:content-[''] before:absolute before:inset-0 before:rounded-[36px] before:border-2 before:border-[#19e3d0] before:animate-[qzpl2_3s_infinite]",
  "after:content-[''] after:absolute after:inset-0 after:rounded-[36px] after:border-2 after:border-[#19e3d0] after:animate-[qzpl2_3s_infinite] after:[animation-delay:1.5s]",
].join(" ");

/* ------------------------------------------------------------------ */
/*  Design helpers                                                     */
/* ------------------------------------------------------------------ */
const P: Record<string, string> = {
  pkg: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5',
  ai: 'M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3M7 6h10v12H7zM10 10h4v4h-4z',
  users: 'M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3 3-5 6-5s6 2 6 5M17 11a2.5 2.5 0 100-5M18 15c2 .4 3 2 3 5',
  coin: 'M12 3a9 9 0 100 18 9 9 0 000-18zM9.5 9.5h4a1.5 1.5 0 010 3h-3a1.5 1.5 0 000 3h4M12 7v2M12 15v2',
  bolt: 'M13 3L5 14h6l-1 7 8-11h-6z',
  tree: 'M12 4v6M5 20v-4h14v4M12 10v6M7 16v-3h10v3',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  trend: 'M3 17l6-6 4 4 8-8M15 7h6v6',
  gift: 'M4 11h16v9H4zM3 8h18v3H3zM12 8v12M12 8c-3 0-4-4-1-4s1 4 1 4zM12 8c3 0 4-4 1-4s-1 4-1 4z',
};

const Ic = ({ n, size = "h-[18px] w-[18px]" }: { n: string; size?: string }) => (
  <svg
    className={`block flex-none fill-none stroke-current [stroke-width:1.8] [stroke-linecap:round] [stroke-linejoin:round] ${size}`}
    viewBox="0 0 24 24"
  >
    <path d={P[n]} />
  </svg>
);

const fmt = (v: number, d = 2) =>
  v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

/* ------------------------------------------------------------------ */
/*  Static design data                                                 */
/* ------------------------------------------------------------------ */
interface Offer {
  t: string; ic: string; c: string; b: string; s: string; d: string; x?: string; f: [string, string][];
}
const OFF: Offer[] = [
  { t: 'Daily Booster Program', ic: 'bolt', c: '#d9a441', b: 'LIVE', s: '+0.3% / +0.5%', d: 'Add direct referrals within 24 hours to boost daily rewards. Your directs’ total investment must be equal to or greater than your own.', x: 'cd', f: [['3 directs', '+0.3%'], ['5 directs', '+0.5%']] },
  { t: 'Level Income Unlock', ic: 'tree', c: '#1f5f7a', b: 'UNLOCK', s: '20 levels · 30%', d: 'Self-investment of $50 or more plus up to 5 direct referrals opens all 20 levels.', x: 'lv', f: [['Self-invest', '$50+'], ['Directs', '5']] },
  { t: 'Direct Referral Income', ic: 'users', c: '#12a594', b: 'EARN', s: '8% total', d: 'Commission is shared across three levels of your referral line.', x: 'ref', f: [['Level 1', '5%'], ['Level 2', '2%'], ['Level 3', '1%']] },
  { t: 'DAO Partner', ic: 'shield', c: '#4a7f8f', b: 'LIMITED', s: '5% shared pool', d: 'Generate $3,000 direct business within 15 days to qualify. Equal shares, paid every Friday.', x: 'dao', f: [['Seats', '280'], ['Payout', 'Friday']] },
  { t: 'Salary Rewards', ic: 'coin', c: '#1fa88a', b: '36 MONTHS', s: 'Up to 10%', d: 'Rank-based monthly salary for 36 months. Keep 5% fresh business next month to stay eligible.', f: [['Nova', '1%'], ['Global Apex', '10%']] },
  { t: 'Rank Rewards', ic: 'gift', c: '#8fc9cf', b: 'NEW', s: 'Up to $15,000', d: 'One-time rewards linked to total business across your entire downline.', f: [['Nova', '$100'], ['Global Apex', '$15,000']] },
];

const RK: [string, number, number][] = [
  ['Nova', 5000, 100], ['Pioneer', 15000, 250], ['Trader', 30000, 500], ['Navigator', 50000, 1000], ['Elite', 75000, 2000],
  ['Strategist', 110000, 3000], ['Architect', 170000, 5000], ['Vanguard', 250000, 7500], ['Sovereign', 350000, 10000], ['Global Apex', 500000, 15000],
];
const RC = ['#8fc9cf', '#6fc0c4', '#4fb8a0', '#12a594', '#2a8fb0', '#1f6f8f', '#1f5f7a', '#17495c', '#0f3d4d', '#d9a441'];

/* ------------------------------------------------------------------ */
/*  Design components                                                  */
/* ------------------------------------------------------------------ */
function Cd() {
  const [s, setS] = useState(5 * 3600 + 42 * 60 + 10);
  useEffect(() => {
    const t = setInterval(() => setS((x) => (x > 0 ? x - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const f = (n: number) => String(n).padStart(2, '0');
  return (
    <span className="font-semibold tabular-nums text-[color:var(--c)]">
      {f((s / 3600) | 0)}:{f(((s / 60) % 60) | 0)}:{f(s % 60)}
    </span>
  );
}

function OfferCard({ o, i }: { o: Offer; i: number }) {
  return (
    <div className={CARD_INC} style={{ '--c': o.c, '--i': i } as React.CSSProperties}>
      <div className="relative z-[1] px-4 pt-[18px] pb-0">
        <div className={RW}>
          <span className={BIG_IB}><Ic n={o.ic} size="h-[22px] w-[22px]" /></span>
          <span className={PILL}>{o.b}</span>
        </div>
        <div className={`${LAB} mt-3`}>{o.t}</div>
        <div className={`${VAL} !mt-1 !text-[22px]`}>{o.s}</div>
        <div className="mt-2 text-[12.5px] leading-[1.55] text-[color:var(--mut)]">{o.d}</div>
        {o.x === 'cd' && (
          <div className="mt-2 text-[12.5px] leading-[1.55] text-[color:var(--mut)]">
            Window closes in <Cd />
          </div>
        )}
        {o.x === 'lv' && (
          <div className={LV_WRAP}>
            {Array.from({ length: 20 }, (_, j) => (
              <i key={j} className={LV_I} style={{ '--k': j } as React.CSSProperties}></i>
            ))}
          </div>
        )}
        {o.x === 'ref' && (
          <div className="mt-3 flex h-2 gap-[3px]">
            <i className="rounded-md" style={{ flex: 5, background: '#12a594' }}></i>
            <i className="rounded-md" style={{ flex: 2, background: '#3aa3c4' }}></i>
            <i className="rounded-md" style={{ flex: 1, background: '#1f5f7a' }}></i>
          </div>
        )}
        {o.x === 'dao' && (
          <>
            <div className={BAR}><i className={BAR_I} style={{ width: '76%' }}></i></div>
            <div className="mt-[7px] flex justify-between text-[11.5px] text-[color:var(--mut)]">
              <span>Seats filled (sample)</span><span>212 / 280</span>
            </div>
          </>
        )}
      </div>
      <div className="relative z-[1] mt-[14px] flex justify-between gap-1.5 border-t border-dashed border-[color:var(--line)] px-4 pt-[10px] pb-[14px] text-[11px] text-[color:var(--mut)]">
        {o.f.map(([a, b]) => (
          <span key={a}>
            {a}
            <b className="mt-px block text-[12.5px] text-[color:var(--ink)]">{b}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

function PlanCard({ plan, i, onActivate }: { plan: Plan; i: number; onActivate: () => void }) {
  const hi = plan.max || 10000;
  const [amt, setAmt] = useState<number>(plan.min);

  return (
    <div
      className={CARD_PKG}
      style={{ '--a': plan.colors.a, '--b': plan.colors.b, '--i': i } as React.CSSProperties}
    >
      <div className={PKG_TOP}>
        <div className={`${RW} relative`}>
          <span className="grid h-[46px] w-[46px] place-items-center rounded-[14px] bg-[#ffffff2e]">
            <Ic n="pkg" size="h-6 w-6" />
          </span>
          <span className="rounded-full bg-[#ffffff33] px-[11px] py-1 text-[11.5px] font-semibold text-center">
            {plan.isPopular ? '★ Most Popular' : plan.subtitle}
          </span>
        </div>
        <div className="relative mt-3 text-[20px] font-semibold">{plan.icon} {plan.title}</div>
        <div className="relative text-[12.5px] opacity-[.85]">{plan.subtitle}</div>
        <div className="relative mt-[14px]">
          <small className="block text-[12px] opacity-[.85]">Investment range</small>
          <b className="text-[34px] font-bold">{plan.investmentRange}</b>
        </div>
      </div>

      <div className="px-[18px] pt-4 pb-[18px]">
        <div className={KV_WRAP}>
          <div className={KV_CELL}><small className={KV_SMALL}>Minimum</small><b className={KV_B}>${fmt(plan.min, 0)}</b></div>
          <div className={KV_CELL}><small className={KV_SMALL}>Investor limit</small><b className={KV_B}>{plan.investorLimit}×</b></div>
          <div className={KV_CELL}><small className={KV_SMALL}>Leaders limit</small><b className={KV_B}>{plan.leadersLimit}×</b></div>
        </div>

        <ul className="mt-[14px] flex list-none flex-col gap-2 p-0">
          {plan.features.map((f, k) => (
            <li key={k} className="flex items-start gap-[9px] text-[12.5px] leading-[1.45] text-[color:var(--mut)]">
              <span className="grid h-[18px] w-[18px] flex-none place-items-center rounded-full text-[10px] font-bold text-[color:var(--a)] [background:color-mix(in_srgb,var(--a)_14%,transparent)]">
                ✓
              </span>
              {f.text}
            </li>
          ))}
        </ul>

        <div className={`${LAB} mt-4`}>Investment amount (USDT)</div>
        <div className="mt-3 flex gap-2">
          <input
            type="number"
            className="min-w-0 flex-1 rounded-xl border border-[color:var(--line)] bg-transparent px-3 py-[10px] text-inherit outline-none"
            value={amt}
            onChange={(e) => setAmt(+e.target.value || 0)}
          />
        </div>
        <input
          className="mt-3 w-full [accent-color:var(--a)]"
          type="range"
          min={plan.min}
          max={hi}
          step={plan.min >= 100 ? 100 : 10}
          value={Math.min(Math.max(amt, plan.min), hi)}
          onChange={(e) => setAmt(+e.target.value)}
        />

        <div className="my-[14px] flex flex-col sm:flex-row sm:justify-between rounded-xl p-3 text-[12px] text-[color:var(--mut)] [background:color-mix(in_srgb,var(--a)_9%,transparent)] gap-2 sm:gap-0">
          <span>Investor cap<b className="block text-[17px] text-[color:var(--ink)]">${fmt(amt * plan.investorLimit)}</b></span>
          <span className="sm:text-right">Leaders cap<b className="block text-[17px] text-[color:var(--ink)]">${fmt(amt * plan.leadersLimit)}</b></span>
        </div>

        <button className={`${GO} w-full`} onClick={onActivate}>
          Activate package
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Activate modal                                                     */
/* ------------------------------------------------------------------ */
const ActivatePlanModal: React.FC<ActivatePlanModalProps> = ({
  isOpen,
  onClose,
  plan,
  userId = "",
}) => {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amountError, setAmountError] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [fundWalletBalance, setFundWalletBalance] = useState(0);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [activationError, setActivationError] = useState("");
  const [userIdInput, setUserIdInput] = useState(userId);
  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [isLoadingUserName, setIsLoadingUserName] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUserIdInput(userId);
      setUserName("");
      setUserNameError("");
      fetchWalletDetails();
    }
  }, [isOpen, userId]);

  const fetchUserName = useCallback(async () => {
    setIsLoadingUserName(true);
    setUserName("");
    setUserNameError("");
    try {
      const response = await fetch(`/api/FundManager?authLogin=${userIdInput}`);
      const data = await response.json();

      if (response.ok && data.statusCode === 200 && data.data?.Name) {
        setUserName(data.data.Name);
      } else {
        setUserNameError(
          typeof data.message === "string" ? data.message : "User ID not found.",
        );
      }
    } catch (error) {
      console.error('Failed to fetch user name:', error);
      setUserNameError("Could not verify this User ID. Please try again.");
    } finally {
      setIsLoadingUserName(false);
    }
  }, [userIdInput]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (userIdInput && userIdInput.length > 0) {
        fetchUserName();
      } else {
        setUserName("");
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [userIdInput, fetchUserName]);

  const fetchWalletDetails = async () => {
    setIsLoadingWallet(true);
    try {
      const response = await fetch('/api/FundManager');
      const data = await response.json();

      if (data.statusCode === 200 && data.data) {
        setWalletBalance(data.data.DepositWallet || 0);
        setFundWalletBalance(data.data.FundWallet || 0);
      } else {
        setWalletBalance(0);
        setFundWalletBalance(0);
      }
    } catch (error) {
      console.error('Failed to fetch wallet details:', error);
      setWalletBalance(0);
      setFundWalletBalance(0);
    } finally {
      setIsLoadingWallet(false);
    }
  };

  const handleActivate = async () => {
    if (!plan) return;

    setIsActivating(true);
    setActivationError("");

    try {
      const response = await fetch('/api/FundManager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: plan.id,
          rkprice: Number(amount) || 0,
          byAuthlogin: userIdInput,
          RechargeType: plan.BoosterPackage,
        }),
      });

      const data = await response.json();

      if (data.statusCode === 200) {
        toast.success(data.message || "Plan activated successfully!");
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.summary });
        onClose();
      } else {
        setActivationError(data.message || "Failed to activate plan");
        toast.error(data.message || "Failed to activate plan");
      }
    } catch (error) {
      console.error('Failed to activate plan:', error);
      setActivationError("An error occurred while activating the plan");
      toast.error("An error occurred while activating the plan");
    } finally {
      setIsActivating(false);
    }
  };

  if (!isOpen || !plan) return null;

  const isQuantityPlan = plan.title === "Legacy Reborn 2.0";

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qty = e.target.value;
    setQuantity(qty);

    const numQty = Number(qty);
    if (qty === "" || numQty <= 0) {
      setQuantityError("Please enter a valid quantity");
      setAmount("");
    } else {
      const calculatedAmount = numQty * 660;
      setAmount(calculatedAmount.toString());

      if (calculatedAmount > walletBalance) {
        setQuantityError("Insufficient balance");
      } else {
        setQuantityError("");
      }
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);

    if (value === "") {
      setAmountError("");
      return;
    }

    const numValue = Number(value);

    if (plan.title === "Liquidity Provider") {
      if (numValue < 10) {
        setAmountError("Minimum investment is $10");
      } else if (numValue > walletBalance) {
        setAmountError("Insufficient balance");
      } else {
        setAmountError("");
      }
    } else if (plan.title === "Smart Bonds") {
      if (numValue < 100) {
        setAmountError("Minimum investment is $100");
      } else if (numValue > walletBalance) {
        setAmountError("Insufficient balance");
      } else {
        setAmountError("");
      }
    } else {
      if (numValue < 100) {
        setAmountError("Minimum investment is $100");
      } else if (numValue > walletBalance) {
        setAmountError("Insufficient balance");
      } else {
        setAmountError("");
      }
    }
  };

  const getModalTheme = () => {
    if (plan.title === "Normal") {
      return { btn: "bg-blue-500 hover:bg-blue-600 text-white", text: "text-blue-600", iconBg: "bg-blue-100" };
    }
    if (plan.title === "Legacy Reborn") {
      return { btn: "bg-amber-500 hover:bg-amber-600 text-white", text: "text-amber-600", iconBg: "bg-amber-100" };
    }
    return { btn: "bg-purple-500 hover:bg-purple-600 text-white", text: "text-purple-600", iconBg: "bg-purple-100" };
  };

  const modalTheme = getModalTheme();

  const isSubmitDisabled =
    !amount ||
    !userIdInput ||
    !!amountError ||
    (isQuantityPlan && (!!quantityError || !quantity)) ||
    isActivating;

  return (
    <>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="relative w-full max-w-[480px] bg-white dark:bg-[#11111a] rounded-3xl shadow-2xl p-5 sm:p-8 animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/10">

          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-blue-500 text-xs font-bold tracking-widest uppercase mb-1">
                Subscribe Now
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Activate <span className={modalTheme.text}>{plan.title}</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors border border-gray-100 dark:border-white/10"
            >
              <span className="text-gray-500 dark:text-gray-400 font-bold text-lg leading-none">&times;</span>
            </button>
          </div>

          {/* Wallet Info Box */}
          <div className="bg-[#f0fdf4] dark:bg-green-900/20 border border-green-100 dark:border-green-500/30 rounded-2xl p-5 mb-6">
            {plan?.title === "Liquidity Provider" ? (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-1">USDT Wallet</p>
                  <p className="text-green-600 dark:text-green-400 text-2xl font-bold">
                    {isLoadingWallet ? <Loader2 className="h-6 w-6 animate-spin text-[#F5C451]" aria-label="Loading" /> : `$${walletBalance}`}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-600 dark:text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-1">Fund Wallet</p>
                <p className="text-green-600 dark:text-green-400 text-2xl font-bold">
                  {isLoadingWallet ? <Loader2 className="h-6 w-6 animate-spin text-[#F5C451]" aria-label="Loading" /> : `$${walletBalance}`}
                </p>
              </>
            )}
          </div>

          {/* Form */}
          <div className="space-y-5">
            <div>
              <label className="block text-gray-800 dark:text-gray-200 text-sm font-bold mb-2">
                USER ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userIdInput}
                  placeholder="Enter UserID"
                  onChange={(e) => {
                    setUserIdInput(e.target.value);
                    setUserName("");
                    setUserNameError("");
                  }}
                  aria-invalid={!!userNameError}
                  aria-describedby={userNameError ? "user-id-error" : undefined}
                  className="w-full bg-[#f4f6fc] dark:bg-white/5 text-gray-800 dark:text-white text-lg placeholder-gray-400 font-medium px-4 py-3.5 pr-12 rounded-xl border outline-none transition-all"
                />
                {isLoadingUserName && (
                  <Loader2
                    className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-[#F5C451]"
                    aria-label="Loading user name"
                  />
                )}
              </div>
              {userName && (
                <span className="text-green-600 dark:text-green-400 text-sm font-medium mt-2 block">
                  {userName}
                </span>
              )}
              {userNameError && !isLoadingUserName && (
                <p id="user-id-error" className="mt-2 text-xs font-medium text-red-500" role="alert">
                  {userNameError}
                </p>
              )}
            </div>

            {isQuantityPlan ? (
              <div>
                <label className="block text-gray-800 dark:text-gray-200 text-sm font-bold mb-2">
                  QUANTITY <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className={`w-full bg-[#f4f6fc] dark:bg-white/5 text-gray-800 dark:text-white text-lg placeholder-gray-400 font-medium px-4 py-3.5 rounded-xl border outline-none transition-all ${quantityError
                    ? "border-red-400 dark:border-red-500"
                    : "border-transparent focus:border-blue-300 dark:focus:border-blue-500"
                    }`}
                />
                {quantityError ? (
                  <p className="text-red-500 text-xs font-medium mt-2">⚠️ {quantityError}</p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mt-2 flex items-center gap-1">
                    💡 1 Quantity = $660
                  </p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-gray-800 dark:text-gray-200 text-sm font-bold mb-2">SELECTED PLAN</label>
                <div className="w-full bg-[#f8f9fc] dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-600 dark:text-gray-300 text-lg font-medium px-4 py-3.5 rounded-xl flex items-center gap-3">
                  <span className={`text-xl p-1.5 rounded-md ${modalTheme.iconBg}`}>{plan.icon}</span>
                  <span className={modalTheme.text}>{plan.title}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-800 dark:text-gray-200 text-sm font-bold mb-2">
                INVESTMENT AMOUNT (USD) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={handleAmountChange}
                readOnly={isQuantityPlan}
                className={`w-full bg-[#f4f6fc] dark:bg-white/5 text-gray-800 dark:text-white text-lg placeholder-gray-400 font-medium px-4 py-3.5 rounded-xl border outline-none transition-all ${isQuantityPlan ? "cursor-not-allowed" : ""
                  } ${amountError
                    ? "border-red-400 dark:border-red-500"
                    : "border-transparent focus:border-blue-300 dark:focus:border-blue-500"
                  }`}
              />
              {amountError ? (
                <p className="text-red-500 text-xs font-medium mt-2">⚠️ {amountError}</p>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mt-2 flex items-center gap-1">
                  💡 Investment range: <span className="text-gray-900 dark:text-white font-bold">{plan.investmentRange}</span>
                </p>
              )}
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleActivate}
            disabled={isSubmitDisabled || isActivating}
            className={`w-full mt-8 py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-extrabold tracking-widest uppercase transition-all duration-300 ${modalTheme.btn} ${isSubmitDisabled || isActivating ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            <span className="text-xl">{isActivating ? "⏳" : "🚀"}</span>
            {isActivating ? "Activating..." : `Activate ${plan.title}`}
          </button>

          {activationError && (
            <p className="text-red-500 text-xs font-medium mt-3 text-center">⚠️ {activationError}</p>
          )}

        </div>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/investment-plans?Type=1', {
          method: 'GET',
        });

        const data = await response.json();

        if (data.statusCode === 200 && data.data) {
          const hardcodedPlans: Plan[] = [
            {
              id: "",
              title: "",
              subtitle: "Perfect for New Investors",
              icon: "🚀",
              investmentRange: "$10+",
              isPopular: true,
              features: [
                { text: "Accessible entry starting at just $10" },
                { text: "Yields 0.33% daily revenue sharing (10% monthly)" },
                { text: "Investor Limit 2.X" },
                { text: "Leaders Limit 4X" },
              ],
              min: 10,
              max: null,
              investorLimit: 2,
              leadersLimit: 4,
              colors: { a: '#12a594', b: '#3aa3c4' },
              BoosterPackage: 1,
            },
            {
              id: "",
              title: "",
              subtitle: "For Consistent Growth",
              icon: "📊",
              investmentRange: "$100+",
              features: [
                { text: "Accessible entry starting at just $100" },
                { text: "Investor Limit 1X" },
                { text: "Leaders Limit 1X" },
              ],
              min: 100,
              max: null,
              investorLimit: 1,
              leadersLimit: 1,
              colors: { a: '#1f5f7a', b: '#3aa3c4' },
              BoosterPackage: 2,
            },
          ];

          const mappedPlans = hardcodedPlans.map((plan, index) => {
            const apiItem = data.data[index];
            if (apiItem) {
              return {
                ...plan,
                id: apiItem.productId,
                title: apiItem.name,
                BoosterPackage: apiItem.BoosterPackage,
              };
            }
            return plan;
          });

          setPlans(mappedPlans);
        }
      } catch (error) {
        console.error('Failed to fetch plans:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div
      className={`${sora.className} ${THEME_VARS} min-h-screen bg-[#edf4f5] p-4 sm:p-6 text-[14px] leading-[normal] text-[color:var(--ink)] transition-colors duration-[400ms] dark:bg-[#031B23] overflow-x-hidden`}
    >
      <style jsx global>{`
        @keyframes qzbob{50%{transform:translateY(-3px) rotate(-4deg)}}
        @keyframes qzpl{0%{box-shadow:0 0 0 0 #19e3d0aa}100%{box-shadow:0 0 0 10px #19e3d000}}
        @keyframes qzpl2{from{transform:scale(.5);opacity:1}to{transform:scale(1.6);opacity:0}}
        @keyframes qzrise{from{opacity:0;transform:translateY(14px)}}
        @keyframes qzsh{to{background-position:-200% 0}}
        @keyframes qzswp{60%,100%{transform:translateX(100%)}}
        @keyframes qzgrow{from{transform:scaleY(.2);opacity:0}}
        @keyframes qzpop{from{transform:scale(0)}}
        @media(prefers-reduced-motion:reduce){
          [data-qz],[data-qz] *,[data-qz] *::before,[data-qz] *::after{animation:none!important;transition:none!important}
        }
      `}</style>

      <div data-qz className="mx-auto">
        {showBanner && (
          <div className="mb-[14px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-[14px] px-4 py-[11px] text-[13px] text-[#2b1b00] animate-[qzrise_.5s_both] [background:linear-gradient(90deg,#d9a441,#ffbf5c)]">
            <span><b>New:</b> the Daily Booster is live. Add 3 or 5 direct partners within 24 hours to lift your daily rewards.</span>
            <button className="cursor-pointer text-[16px] font-bold self-end sm:self-auto mt-1 sm:mt-0" onClick={() => setShowBanner(false)} aria-label="Dismiss">✕</button>
          </div>
        )}

        {/* Hero */}
        <div className={HERO}>
          <div className="relative z-[1] flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-[26px]">
            <div className="relative z-[1] min-w-[240px] flex-1">
              <span className={LIVE}><i className={LIVE_I}></i>New season</span>
              <div className="mt-2 mb-1.5 text-[24px] sm:text-[28px] font-semibold leading-tight">Explore the QUZO ecosystem</div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-[#b9e3ea]">
                AI Intelligence · Crypto &amp; Forex Trading · DeFi · Rewards
              </div>
              <button
                className={`${GO} mt-4`}
                onClick={() => document.getElementById('qz-packages')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Invest now
              </button>
            </div>
            <div className={ORB}>
              <span className={`${QMARK} h-[92px] w-[92px] rounded-[28px] text-[46px]`}>Q</span>
            </div>
          </div>
        </div>

        {/* Packages (live data + modal) */}
        <h2 className={H2} id="qz-packages">AI strategy packages</h2>
        <div className={G2}>
          {isLoading ? (
            <div className="col-span-full flex justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-[#F5C451]" aria-label="Loading" />
            </div>
          ) : (
            plans.map((plan, i) => (
              <PlanCard
                key={plan.id || i}
                plan={plan}
                i={i}
                onActivate={() => setSelectedPlan(plan)}
              />
            ))
          )}
        </div>

        <div className={G4}>
          {([
            ['ai', 'AI-powered trading strategies'],
            ['pkg', 'Multi-DEX execution'],
            ['shield', 'Risk-managed and secure'],
            ['trend', 'Optimised yield potential'],
          ] as [string, string][]).map(([ic, t], i) => (
            <div className={`${CARD} !p-[14px]`} key={t} style={{ '--i': i } as React.CSSProperties}>
              <div className={`${LAB} items-start sm:items-center`}><span className={IB}><Ic n={ic} /></span><span className="leading-tight text-[11px] sm:text-[12.5px]">{t}</span></div>
            </div>
          ))}
        </div>

        {/* Offers */}
        <h2 className={H2}>New offers and promotions</h2>
        <div className={G3}>
          {OFF.map((o, i) => (
            <OfferCard key={o.t} o={o} i={i} />
          ))}
        </div>

        {/* Rank ladder */}
        <h2 className={H2}>Rank rewards ladder</h2>
        <div className="mt-1.5 flex items-end gap-[10px] overflow-x-auto px-1 pt-4 pb-2 custom-scrollbar">
          {RK.map(([n, b, r], k) => (
            <div
              key={n}
              className="flex flex-[1_0_100px] sm:flex-[1_0_118px] flex-col justify-end gap-0.5 rounded-t-[16px] rounded-b-[12px] p-3 text-white animate-[qzgrow_.8s_both] [animation-delay:calc(var(--k)*70ms)] [transform-origin:bottom] [box-shadow:0_12px_22px_-12px_var(--c)] [background:linear-gradient(180deg,var(--c),color-mix(in_srgb,var(--c)_55%,#000))]"
              style={{ '--c': RC[k], '--k': k, minHeight: 90 + k * 17 } as React.CSSProperties}
            >
              <span className="text-[12px] font-semibold">{n}</span>
              <small className="text-[10px] sm:text-[11px] opacity-[.85]">Business ${fmt(b, 0)}</small>
              <b className="text-[15px] sm:text-[17px]">${fmt(r, 0)}</b>
            </div>
          ))}
        </div>

        <div className="mt-[26px] text-center text-[12px] text-[color:var(--mut)]">
          Proposed terms. Daily rewards are not guaranteed. All AI strategy yield income is paid exclusively in USDT.
        </div>
      </div>

      <ActivatePlanModal
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        plan={selectedPlan}
      />
    </div>
  );
}