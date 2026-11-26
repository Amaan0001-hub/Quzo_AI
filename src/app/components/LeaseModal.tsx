// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import Cookies from "js-cookie";
// import {
//   RiWallet3Line,
//   RiUserLine,
//   RiArrowRightLine,
//   RiCloseLine,
//   RiCheckLine,
//   RiSearchLine,
//   RiErrorWarningLine,
//   RiShieldCheckLine,
//   RiFlashlightLine,
//   RiBriefcaseLine,
//   RiBuilding4Line,
//   RiCoinsLine,
//   RiBarChartBoxLine,
//   RiRepeatLine,
//   RiArrowUpLine,
//   RiSafe2Line,
//   RiHistoryLine,
// } from "react-icons/ri";
// import { useTempStorage } from "./useTempStorage";

// /* ─── Types ───────────────────────────────────────────── */

// export interface Agent {
//   productId: string;
//   productName: string;
//   imageUrl: string | null;
//   price?: number;
//   toatalmonth?: number;
//   totalReturn?: number;
//   weeklyReturn?: number;
//   task?: string;
//   rating?: number;
//   subName?: string;
//   unit?: string;
//   categoryName?: string;
//   status?: string;
// }

// interface LeaseModalProps {
//   agent: Agent;
//   onClose: () => void;
//   productId: string;
//   month: string;
// }

// type PlanKey = "personal" | "business" | "industrial";

// interface PlanRange {
//   min: number;
//   max: number;
//   step: number;
// }

// interface PlanTw {
//   activePill: string;
//   inactivePill: string;
//   cardBg: string;
//   cardBorder: string;
//   badgeBg: string;
//   accentText: string;
//   rangeHex: string;
//   sliderBg: (pct: number) => string;
//   sliderBgDark: (pct: number) => string;
//   confirmBtn: string;
// }

// interface Plan {
//   key: PlanKey;
//   name: string;
//   multiplier: number;
//   revenueShare: string;
//   range: PlanRange;
//   badge: string;
//   Icon: React.ComponentType<{ className?: string }>;
//   tw: PlanTw;
// }

// interface WalletData {
//   depositWallet: number;
//   legacyWallet: number;
// }

// interface UsernameResult {
//   name: string;
//   authLogin: string;
// }

// interface OrderData {
//   image: string;
//   name: string;
//   Rkprice: number;
//   usernameInput: string;
//   searchedUsername: string | null;
//   month: string;
//   orderId: string;
// }

// interface BuyLicenseResponseItem {
//   image: string;
//   ProductName: string;
//   Rkprice: number;
// }

// interface BuyLicenseResponse {
//   statusCode: number;
//   data: BuyLicenseResponseItem[];
// }

// interface BuyLicensePayload {
//   productId: string;
//   rkprice: number;
//   byAuthlogin: string;
//   RechargeType: number;
// }

// /* ─── Plans ───────────────────────────────────────────── */

// const PLANS: Record<PlanKey, Plan> = {
//   personal: {
//     key: "personal",
//     name: "Personal",
//     multiplier: 6,
//     revenueShare: "6%-7%",
//     range: { min: 10, max: 490, step: 10 },
//     badge: "Starter",
//     Icon: RiFlashlightLine,
//     tw: {
//       activePill: "bg-blue-600 text-white shadow-md",
//       inactivePill:
//         "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400",
//       cardBg:
//         "bg-gradient-to-br from-blue-50 to-blue-50 dark:from-blue-950/40 dark:to-blue-950/40",
//       cardBorder: "border-blue-200 dark:border-blue-800",
//       badgeBg:
//         "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
//       accentText: "text-blue-600 dark:text-blue-400",
//       rangeHex: "#2563EB",
//       sliderBg: (pct: number) =>
//         `linear-gradient(to right, #2563EB ${pct}%, #E2E8F0 ${pct}%)`,
//       sliderBgDark: (pct: number) =>
//         `linear-gradient(to right, #3B82F6 ${pct}%, #1E293B ${pct}%)`,
//       confirmBtn: "bg-blue-600 hover:bg-blue-700",
//     },
//   },
//   business: {
//     key: "business",
//     name: "Business",
//     multiplier: 8,
//     revenueShare: "7%–8%",
//     range: { min: 500, max: 1490, step: 50 },
//     badge: "Popular",
//     Icon: RiBriefcaseLine,
//     tw: {
//       activePill: "bg-violet-600 text-white shadow-md",
//       inactivePill:
//         "text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400",
//       cardBg:
//         "bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/40 dark:to-blue-950/40",
//       cardBorder: "border-violet-200 dark:border-violet-800",
//       badgeBg:
//         "bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300",
//       accentText: "text-violet-600 dark:text-violet-400",
//       rangeHex: "#7C3AED",
//       sliderBg: (pct: number) =>
//         `linear-gradient(to right, #7C3AED ${pct}%, #E2E8F0 ${pct}%)`,
//       sliderBgDark: (pct: number) =>
//         `linear-gradient(to right, #8B5CF6 ${pct}%, #1E293B ${pct}%)`,
//       confirmBtn: "bg-violet-600 hover:bg-violet-700",
//     },
//   },
//   industrial: {
//     key: "industrial",
//     name: "Industrial",
//     multiplier: 10,
//     revenueShare: "9%–10%",
//     range: { min: 5000, max: 20000, step: 100 },
//     badge: "Enterprise",
//     Icon: RiBuilding4Line,
//     tw: {
//       activePill: "bg-pink-600 text-white shadow-md",
//       inactivePill:
//         "text-slate-500 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400",
//       cardBg:
//         "bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/40 dark:to-rose-950/40",
//       cardBorder: "border-pink-200 dark:border-pink-800",
//       badgeBg:
//         "bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300",
//       accentText: "text-pink-600 dark:text-pink-400",
//       rangeHex: "#DB2777",
//       sliderBg: (pct: number) =>
//         `linear-gradient(to right, #DB2777 ${pct}%, #E2E8F0 ${pct}%)`,
//       sliderBgDark: (pct: number) =>
//         `linear-gradient(to right, #EC4899 ${pct}%, #1E293B ${pct}%)`,
//       confirmBtn: "bg-pink-600 hover:bg-pink-700",
//     },
//   },
// };

// /* ─── API Helpers ─────────────────────────────────────── */

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

// async function fetchWalletReport(): Promise<WalletData> {
//   const res = await fetch(`/api/FundManager`, {
//     credentials: "include",
//   });
//   if (!res.ok) throw new Error("Failed to fetch wallet report");
//   const json = await res.json();
//   const wallet = json?.data ?? {};
//   return {
//     depositWallet: Number(wallet.DepositWallet ?? 0),
//     legacyWallet: Number(wallet.IncomeWallet ?? 0),
//   };
// }

// async function fetchUsernameByLoginId(
//   loginId: string
// ): Promise<UsernameResult | null> {
//   const res = await fetch(`/api/FundManager?authLogin=${loginId}`, {
//     credentials: "include",
//   });
//   if (!res.ok) return null;
//   const json = await res.json();
//   if (!json?.data) return null;
//   return { name: json.data.Name, authLogin: json.data.authLogin };
// }

// async function fetchBuyAgentLicense(
//   payload: BuyLicensePayload
// ): Promise<BuyLicenseResponse> {
//   const res = await fetch(`/api/FundManager`, {
//     method: "POST",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
//   if (!res.ok) throw new Error("Lease purchase failed");
//   return res.json();
// }

// /* ─── Sub-components ─────────────────────────────────── */

// interface StatPillProps {
//   icon: React.ComponentType<{ className?: string }>;
//   label: string;
//   value: string;
//   accentClass: string;
// }

// const StatPill: React.FC<StatPillProps> = ({
//   icon: Icon,
//   label,
//   value,
//   accentClass,
// }) => (
//   <div className="flex flex-col items-center justify-center gap-1 px-2 py-3 transition-all duration-200 border dark:bg-slate-800/70 border-slate-200/60 dark:border-slate-700/60 rounded-2xl hover:shadow-md">
//     {Icon && <Icon className={`text-base ${accentClass}`} />}
//     <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-none">
//       {label}
//     </span>
//     <span className={`text-xs font-bold tabular-nums ${accentClass}`}>
//       {value}
//     </span>
//   </div>
// );

// interface SummaryRowProps {
//   label: string;
//   value: string;
//   valueClass?: string;
// }

// const SummaryRow: React.FC<SummaryRowProps> = ({
//   label,
//   value,
//   valueClass = "",
// }) => (
//   <div className="flex items-center justify-between px-4 py-3 transition-colors duration-200 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-700/50">
//     <span className="text-xs text-slate-400 dark:text-slate-500">{label}</span>
//     <span
//       className={`text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-100 ${valueClass}`}
//     >
//       {value}
//     </span>
//   </div>
// );

// /* ─── Main Modal ─────────────────────────────────────── */

// export default function LeaseModal({
//   agent,
//   onClose,
//   productId,
//   month,
// }: LeaseModalProps) {
//   const router = useRouter();

//   const [selectedPlan, setSelectedPlan] = useState<PlanKey>("personal");
//   const [investment, setInvestment] = useState<number>(
//     PLANS.personal.range.min
//   );
//   const [usernameInput, setUsernameInput] = useState<string>("");
//   const [searchedUsername, setSearchedUsername] = useState<string | null>(null);
//   const [searchedUrid, setSearchedUrid] = useState<string | null>(null);
//   const [hasSearched, setHasSearched] = useState<boolean>(false);
//   const [isSearching, setIsSearching] = useState<boolean>(false);
//   const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
//   const [isConfirming, setIsConfirming] = useState<boolean>(false);
//   const [, setOrderData] = useTempStorage<OrderData>("orderData");
//   const [depositWallet, setDepositWallet] = useState<number>(0);
//   const [legacyWallet, setLegacyWallet] = useState<number>(0);

//   const [routeMap, setRouteMap] = useState<Record<string, string>>({});

//   /* ── Route map ── */
//   // useEffect(() => {
//   //   const updateRouteMap = () => {
//   //     const seed = Cookies.get("routeSlugsSeed");
//   //     if (seed) {
//   //       setRouteMap(createRouteMapFromSeed(seed, 6) as Record<string, string>);
//   //     } else {
//   //       setRouteMap({});
//   //     }
//   //   };
//   //   updateRouteMap();
//   //   const interval = setInterval(updateRouteMap, 1000);
//   //   return () => clearInterval(interval);
//   // }, []);

//   /* ── Wallet fetch ── */
//   useEffect(() => {
//     (async () => {
//       try {
//         const w = await fetchWalletReport();
//         setDepositWallet(w.depositWallet);
//         setLegacyWallet(w.legacyWallet);
//       } catch (e) {
//         console.error("Wallet fetch error:", e);
//       }
//     })();
//   }, []);

//   /* ── Plan & investment derived ── */
//   const plan = PLANS[selectedPlan];
//   const { min, max, step } = plan.range;
//   const clamped = Math.min(Math.max(investment, min), max);
//   const credits = clamped * plan.multiplier;
//   const pct = ((clamped - min) / (max - min)) * 100;

//   const canAcquireLicense = Boolean(searchedUrid);

//   const handlePlanChange = useCallback((key: PlanKey) => {
//     setSelectedPlan(key);
//     setInvestment(PLANS[key].range.min);
//   }, []);

//   const handleInvestmentChange = useCallback(
//     (val: string) => {
//       const parsed = parseInt(val) || min;
//       setInvestment(Math.min(Math.max(parsed, min), max));
//     },
//     [min, max]
//   );

//   /* ── Username search (debounced) ── */
//   useEffect(() => {
//     const t = setTimeout(async () => {
//       if (usernameInput.length >= 3) {
//         setIsSearching(true);
//         setHasSearched(true);
//         try {
//           const result = await fetchUsernameByLoginId(usernameInput);
//           if (result) {
//             setSearchedUsername(result.name);
//             setSearchedUrid(result.authLogin);
//           } else {
//             setSearchedUsername(null);
//             setSearchedUrid(null);
//           }
//         } catch {
//           setSearchedUsername(null);
//           setSearchedUrid(null);
//         } finally {
//           setIsSearching(false);
//         }
//       } else {
//         setSearchedUsername(null);
//         setSearchedUrid(null);
//         setHasSearched(false);
//       }
//     }, 500);
//     return () => clearTimeout(t);
//   }, [usernameInput]);

//   /* ── Confirm lease ── */
//   const handleConfirmLease = async () => {
//     setShowConfirmation(false);
//     setIsConfirming(true);
//     if (depositWallet < clamped) {
//       toast.error("Insufficient balance in Deposit Wallet");
//       setIsConfirming(false);
//       return;
//     }

//     const data: BuyLicensePayload = {
//       productId,
//       rkprice: clamped,
//       byAuthlogin: searchedUrid!,
//       RechargeType: 1,
//     };

//     try {
//       const result = await fetchBuyAgentLicense(data);
//       if (result.statusCode === 200) {
//         const r = result.data[0];
//         if (!r) {
//           toast.error("Invalid response from server.");
//           return;
//         }
//         toast.success("Subscribed successfully!");
//         const orderId = `ORD-${Math.floor(1000 + Math.random() * 900000)}`;
//         setOrderData({
//           image: r.image,
//           name: r.ProductName,
//           Rkprice: r.Rkprice,
//           usernameInput,
//           searchedUsername,
//           month,
//           orderId,
//         });
//         const basePath =
//           routeMap["/order-successfully"] || "/order-successfully";
//         router.push(basePath);
//       } else {
//         toast.error("Lease confirmation failed. Please try again.");
//       }
//     } catch {
//       toast.error("An error occurred. Please try again.");
//     } finally {
//       setIsConfirming(false);
//     }
//   };

//   if (!agent) return null;

//   return (
//     <>
//       <style>{`
//         .lease-slider::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:${plan.tw.rangeHex};border:3px solid white;box-shadow:0 0 0 1px ${plan.tw.rangeHex}40,0 2px 6px rgba(0,0,0,.15);cursor:pointer;transition:all 0.2s ease;}
//         .lease-slider::-webkit-slider-thumb:hover{transform:scale(1.1);}
//         .lease-slider::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:${plan.tw.rangeHex};border:3px solid white;cursor:pointer;}
//         .modal-scroll::-webkit-scrollbar{display:none}
//         .velvora-glow { box-shadow: 0 0 40px rgba(99, 102, 241, 0.1); }
//         .velvora-glow-dark { box-shadow: 0 0 40px rgba(99, 102, 241, 0.05); }
//       `}</style>

//       {/* ── Confirm Dialog ── */}
//       {showConfirmation && (
//         <div className="fixed inset-0 z-[700] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
//           <div className="w-full max-w-sm p-6 border shadow-2xl bg-white/95 dark:bg-slate-900/95 border-slate-200/50 dark:border-slate-700/50 rounded-3xl velvora-glow dark:velvora-glow-dark">
//             <div className="flex items-center gap-3 mb-5">
//               <div
//                 className={`w-10 h-10 rounded-2xl flex items-center justify-center ${plan.tw.confirmBtn} bg-opacity-10 shadow-lg`}
//               >
//                 <RiShieldCheckLine
//                   className={`text-xl ${plan.tw.accentText}`}
//                 />
//               </div>
//               <div>
//                 <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
//                   Confirm action
//                 </p>
//                 <h3 className="text-base font-bold text-slate-800 dark:text-white">
//                   Acquire AI Agent License?
//                 </h3>
//               </div>
//             </div>
//             <div className="mb-5 space-y-2">
//               <SummaryRow
//                 label="License Fee"
//                 value={`$${clamped.toLocaleString()}`}
//               />
//               <SummaryRow label="Assigned To" value={usernameInput} />
//               <SummaryRow
//                 label="License Plan"
//                 value={`${plan.name} · ${plan.multiplier}X`}
//               />
//             </div>
//             <div className="flex gap-2.5">
//               <button
//                 onClick={() => setShowConfirmation(false)}
//                 disabled={isConfirming}
//                 className="flex-1 py-3 text-sm font-semibold transition-all border rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmLease}
//                 disabled={isConfirming}
//                 className={`flex-[2] py-3 rounded-2xl text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${plan.tw.confirmBtn}`}
//               >
//                 {isConfirming ? (
//                   <span className="flex items-center gap-2">
//                     <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                     <span className="opacity-90">Processing…</span>
//                   </span>
//                 ) : (
//                   <>
//                     Yes, Confirm <RiArrowRightLine className="text-base" />
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Main Modal ── */}
//       <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn mt-5">
//         <div className="modal-scroll w-full max-w-[550px] max-h-[92vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-2xl velvora-glow dark:velvora-glow-dark">
//           {/* Sticky Header */}
//           <div className="sticky top-0 z-10 px-6 pt-6 pb-4 border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-slate-100 dark:border-slate-800 rounded-t-3xl">
//             <button
//               onClick={onClose}
//               aria-label="Close modal"
//               className="absolute flex items-center justify-center w-8 h-8 transition-all top-5 right-5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 hover:scale-105"
//             >
//               <RiCloseLine className="text-lg" />
//             </button>
//             <h2 className="pr-10 text-xl font-bold text-slate-800 dark:text-white">
//               Configure Your License
//             </h2>
//           </div>

//           <div className="px-6 py-5 space-y-5">
//             {/* Wallet Balance */}
//             <div className="grid grid-cols-2 gap-3">
//               <div className="group relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-br from-emerald-400/60 via-green-300/40 to-teal-400/60 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300">
//                 <div className="relative flex items-center justify-between px-3 py-3 rounded-2xl bg-white/90 dark:bg-zinc-950/80 backdrop-blur-xl">
//                   <div className="absolute inset-0 transition-transform duration-1000 -translate-x-full pointer-events-none group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
//                   <div className="relative z-10 flex flex-wrap items-center gap-3">
//                     <div className="relative flex items-center justify-center shadow-lg w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/30">
//                       <div className="absolute inset-0 rounded-xl bg-emerald-400/40 blur-md -z-10" />
//                       <RiWallet3Line className="text-xl text-white" />
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-semibold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-[0.12em]">
//                         Deposit Wallet
//                       </p>
//                       <p className="text-lg font-bold leading-tight text-transparent bg-gradient-to-r from-emerald-700 to-green-600 dark:from-emerald-300 dark:to-green-400 bg-clip-text tabular-nums">
//                         $
//                         {Number(depositWallet).toLocaleString("en-US", {
//                           minimumFractionDigits: 2,
//                         })}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="relative z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40">
//                     <RiArrowUpLine className="text-sm text-emerald-600 dark:text-emerald-400" />
//                   </div>
//                 </div>
//               </div>

//               {/* <div className="group relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-br from-violet-400/60 via-blue-300/40 to-fuchsia-400/60 shadow-lg shadow-violet-500/10 hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all duration-300">
//                 <div className="relative flex items-center justify-between px-3 py-3 rounded-2xl bg-white/90 dark:bg-zinc-950/80 backdrop-blur-xl">
//                   <div className="absolute inset-0 transition-transform duration-1000 -translate-x-full pointer-events-none group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
//                   <div className="relative z-10 flex flex-wrap items-center gap-3">
//                     <div className="relative flex items-center justify-center shadow-lg w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-violet-500/30">
//                       <div className="absolute inset-0 rounded-xl bg-violet-400/40 blur-md -z-10" />
//                       <RiSafe2Line className="text-xl text-white" />
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-semibold text-violet-600/80 dark:text-violet-400/80 uppercase tracking-[0.12em]">
//                         Legacy Wallet
//                       </p>
//                       <p className="text-lg font-bold leading-tight text-transparent bg-gradient-to-r from-violet-700 to-blue-600 dark:from-violet-300 dark:to-blue-400 bg-clip-text tabular-nums">
//                         $
//                         {Number(legacyWallet).toLocaleString("en-US", {
//                           minimumFractionDigits: 2,
//                         })}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="relative z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-900/40">
//                     <RiHistoryLine className="text-sm text-violet-600 dark:text-violet-400" />
//                   </div>
//                 </div>
//               </div> */}
//             </div>

//             {/* Plan Selector */}
//             <div>
//               <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2.5">
//                 Select plan
//               </p>
//               <div className="grid grid-cols-3 gap-2 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl p-1.5 shadow-inner">
//                 {Object.values(PLANS).map((p) => {
//                   const isActive = selectedPlan === p.key;
//                   return (
//                     <button
//                       key={p.key}
//                       onClick={() => handlePlanChange(p.key)}
//                       className={`flex flex-col items-center gap-0.5 py-2.5 px-2 rounded-xl text-[11px] font-bold transition-all duration-200 ${
//                         isActive ? p.tw.activePill : p.tw.inactivePill
//                       }`}
//                     >
//                       <p.Icon
//                         className={`text-base mb-0.5 ${
//                           isActive ? "text-white" : ""
//                         }`}
//                       />
//                       {p.name}
//                       <span
//                         className={`text-[10px] font-semibold ${
//                           isActive ? "text-white/80" : "text-slate-400"
//                         }`}
//                       >
//                         {p.multiplier}X
//                       </span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Investment Calculator */}
//             <div className="p-4 space-y-3 transition-all duration-200 border shadow-sm bg-slate-50/80 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60 rounded-2xl hover:shadow-md">
//               <div className="flex items-center justify-between">
//                 <p className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
//                   Investment
//                 </p>
//                 <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 shadow-sm">
//                   <span className="text-xs text-slate-400">$</span>
//                   <input
//                     type="number"
//                     value={clamped}
//                     min={min}
//                     max={max}
//                     step={step}
//                     onChange={(e) => handleInvestmentChange(e.target.value)}
//                     className="w-20 text-sm font-bold text-right bg-transparent outline-none text-slate-800 dark:text-white tabular-nums"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <input
//                   type="range"
//                   min={min}
//                   max={max}
//                   step={step}
//                   value={clamped}
//                   onChange={(e) => handleInvestmentChange(e.target.value)}
//                   className="lease-slider w-full h-1.5 rounded-full appearance-none outline-none cursor-pointer"
//                   style={{ background: plan.tw.sliderBg(pct) }}
//                 />
//                 <div className="flex justify-between mt-1">
//                   <span className="text-[10px] text-slate-400 tabular-nums">
//                     ${min.toLocaleString()}
//                   </span>
//                   <span className="text-[10px] text-slate-400 tabular-nums">
//                     ${max.toLocaleString()}
//                   </span>
//                 </div>
//               </div>

//               <div className="grid grid-cols-3 gap-2 pt-1">
//                 <StatPill
//                   icon={RiCoinsLine}
//                   label="Amount"
//                   value={`$${clamped.toLocaleString()}`}
//                   accentClass="text-slate-700 dark:text-slate-200"
//                 />
//                 <StatPill
//                   icon={RiRepeatLine}
//                   label="Multiplier"
//                   value={`${plan.multiplier}X`}
//                   accentClass={plan.tw.accentText}
//                 />
//                 <div className="p-2 border rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
//                   <StatPill
//                     icon={RiBarChartBoxLine}
//                     label="Credit Capacity"
//                     value={credits.toLocaleString()}
//                     accentClass="text-emerald-600 dark:text-emerald-400"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Divider */}
//             <div className="flex items-center gap-3">
//               <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-200 dark:to-slate-700" />
//               <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
//                 Assign to
//               </span>
//               <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-200 dark:to-slate-700" />
//             </div>

//             {/* Username Search */}
//             <div className="space-y-2">
//               <div className="relative">
//                 <RiUserLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-base" />
//                 <input
//                   type="text"
//                   value={usernameInput}
//                   onChange={(e) => setUsernameInput(e.target.value)}
//                   placeholder="Search username…"
//                   className="w-full py-3 pl-10 pr-10 text-sm transition-colors bg-white border shadow-sm outline-none dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-400 dark:focus:border-slate-500 focus:shadow-md"
//                 />
//                 <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
//                   {isSearching ? (
//                     <div className="w-4 h-4 border-2 rounded-full border-slate-300 border-t-slate-600 animate-spin" />
//                   ) : (
//                     <RiSearchLine className="text-base text-slate-300 dark:text-slate-600" />
//                   )}
//                 </div>
//               </div>

//               {!isSearching && hasSearched && !searchedUsername && (
//                 <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-red-50/80 dark:bg-red-950/30 border border-red-200/60 dark:border-red-800/60 rounded-xl animate-fadeIn">
//                   <RiErrorWarningLine className="flex-shrink-0 text-base text-red-500 dark:text-red-400" />
//                   <p className="text-xs font-medium text-red-600 dark:text-red-400">
//                     Username not found. Try a different name.
//                   </p>
//                 </div>
//               )}

//               {!isSearching && searchedUsername && (
//                 <div className="flex items-center gap-3 px-3.5 py-3 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 rounded-xl animate-fadeIn shadow-sm hover:shadow-md transition-all duration-200">
//                   <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 shadow-inner bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
//                     <RiCheckLine className="text-base text-emerald-600 dark:text-emerald-400" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs font-medium text-emerald-600 dark:text-emerald-500">
//                       User found
//                     </p>
//                     <p className="text-sm font-bold truncate text-emerald-700 dark:text-emerald-300">
//                       {searchedUsername}
//                     </p>
//                   </div>
//                   <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-500 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-1 rounded-lg flex-shrink-0">
//                     <RiShieldCheckLine className="text-xs" /> Verified
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Community Notice */}
//             <div className="flex items-start gap-3 bg-gradient-to-r from-blue-50/80 to-blue-50/80 dark:from-blue-950/30 dark:to-blue-950/30 border border-blue-200/60 dark:border-blue-800/60 rounded-2xl px-4 py-3.5 shadow-sm hover:shadow-md transition-all duration-200">
//               <div className="w-7 h-7 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-emerald-500/20">
//                 <RiShieldCheckLine className="text-sm text-white" />
//               </div>
//               <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
//                 This agent is{" "}
//                 <span className="font-semibold text-slate-700 dark:text-slate-200">
//                   approved
//                 </span>{" "}
//                 and marked for deployment under the{" "}
//                 <Link
//                   href={routeMap["/community"] || "/community"}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="font-semibold text-blue-600 underline transition-colors dark:text-blue-400 underline-offset-2 hover:text-blue-700 dark:hover:text-blue-300"
//                 >
//                   QURO Community Program
//                 </Link>
//                 .
//               </p>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-3 pb-1">
//               <button
//                 onClick={onClose}
//                 className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-all hover:shadow-md"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => {
//                   if (!canAcquireLicense) {
//                     if (!searchedUrid) {
//                       toast.error("Please search and select a user");
//                     }
//                     return;
//                   }
//                   setShowConfirmation(true);
//                 }}
//                 disabled={!canAcquireLicense}
//                 className={`flex-[2] py-3.5 rounded-2xl text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
//                   plan.tw.confirmBtn
//                 } relative overflow-hidden group ${
//                   !canAcquireLicense
//                     ? "opacity-60 cursor-not-allowed shadow-none hover:shadow-none"
//                     : ""
//                 }`}
//               >
//                 <span className="absolute inset-0 w-full h-full transition-transform duration-1000 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full"></span>
//                 Acquire License
//                 <RiArrowRightLine className="text-base transition-transform duration-200 group-hover:translate-x-1" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


"use client";
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
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

const PLANS: Record<PlanKey, Plan> = {
  personal: {
    key: "personal",
    name: "Personal",
    multiplier: 6,
    revenueShare: "6%-7%",
    range: { min: 10, max: 490, step: 10 },
    badge: "Starter",
    Icon: RiFlashlightLine,
    tw: {
      activePill: "bg-blue-600 text-white shadow-md",
      inactivePill:
        "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400",
      cardBg:
        "bg-gradient-to-br from-blue-50 to-blue-50 dark:from-blue-950/40 dark:to-blue-950/40",
      cardBorder: "border-blue-200 dark:border-blue-800",
      badgeBg:
        "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
      accentText: "text-blue-600 dark:text-blue-400",
      rangeHex: "#2563EB",
      sliderBg: (pct: number) =>
        `linear-gradient(to right, #2563EB ${pct}%, #E2E8F0 ${pct}%)`,
      sliderBgDark: (pct: number) =>
        `linear-gradient(to right, #3B82F6 ${pct}%, #1E293B ${pct}%)`,
      confirmBtn: "bg-blue-600 hover:bg-blue-700",
    },
  },
  business: {
    key: "business",
    name: "Business",
    multiplier: 8,
    revenueShare: "7%–8%",
    range: { min: 500, max: 1490, step: 50 },
    badge: "Popular",
    Icon: RiBriefcaseLine,
    tw: {
      activePill: "bg-violet-600 text-white shadow-md",
      inactivePill:
        "text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400",
      cardBg:
        "bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/40 dark:to-blue-950/40",
      cardBorder: "border-violet-200 dark:border-violet-800",
      badgeBg:
        "bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300",
      accentText: "text-violet-600 dark:text-violet-400",
      rangeHex: "#7C3AED",
      sliderBg: (pct: number) =>
        `linear-gradient(to right, #7C3AED ${pct}%, #E2E8F0 ${pct}%)`,
      sliderBgDark: (pct: number) =>
        `linear-gradient(to right, #8B5CF6 ${pct}%, #1E293B ${pct}%)`,
      confirmBtn: "bg-violet-600 hover:bg-violet-700",
    },
  },
  industrial: {
    key: "industrial",
    name: "Industrial",
    multiplier: 10,
    revenueShare: "9%–10%",
    range: { min: 5000, max: 20000, step: 100 },
    badge: "Enterprise",
    Icon: RiBuilding4Line,
    tw: {
      activePill: "bg-pink-600 text-white shadow-md",
      inactivePill:
        "text-slate-500 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400",
      cardBg:
        "bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/40 dark:to-rose-950/40",
      cardBorder: "border-pink-200 dark:border-pink-800",
      badgeBg:
        "bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300",
      accentText: "text-pink-600 dark:text-pink-400",
      rangeHex: "#DB2777",
      sliderBg: (pct: number) =>
        `linear-gradient(to right, #DB2777 ${pct}%, #E2E8F0 ${pct}%)`,
      sliderBgDark: (pct: number) =>
        `linear-gradient(to right, #EC4899 ${pct}%, #1E293B ${pct}%)`,
      confirmBtn: "bg-pink-600 hover:bg-pink-700",
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
  <div className="flex flex-col items-center justify-center gap-1 px-2 py-3 transition-all duration-200 border dark:bg-slate-800/70 border-slate-200/60 dark:border-slate-700/60 rounded-2xl hover:shadow-md">
    {Icon && <Icon className={`text-base ${accentClass}`} />}
    <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-none">
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
  <div className="flex items-center justify-between px-4 py-3 transition-colors duration-200 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-700/50">
    <span className="text-xs text-slate-400 dark:text-slate-500">{label}</span>
    <span
      className={`text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-100 ${valueClass}`}
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
  const credits = clamped * plan.multiplier;
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
        .lease-slider::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:${plan.tw.rangeHex};border:3px solid white;box-shadow:0 0 0 1px ${plan.tw.rangeHex}40,0 2px 6px rgba(0,0,0,.15);cursor:pointer;transition:all 0.2s ease;}
        .lease-slider::-webkit-slider-thumb:hover{transform:scale(1.1);}
        .lease-slider::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:${plan.tw.rangeHex};border:3px solid white;cursor:pointer;}
        .modal-scroll::-webkit-scrollbar{display:none}
        .velvora-glow { box-shadow: 0 0 40px rgba(99, 102, 241, 0.1); }
        .velvora-glow-dark { box-shadow: 0 0 40px rgba(99, 102, 241, 0.05); }
      `}</style>

      {/* ── Confirm Dialog ── */}
      {showConfirmation && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm p-6 border shadow-2xl bg-white/95 dark:bg-slate-900/95 border-slate-200/50 dark:border-slate-700/50 rounded-3xl velvora-glow dark:velvora-glow-dark">
            <div className="flex items-center gap-3 mb-5">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${plan.tw.confirmBtn} bg-opacity-10 shadow-lg`}
              >
                <RiShieldCheckLine
                  className={`text-xl ${plan.tw.accentText}`}
                />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Confirm action
                </p>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
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
                className="flex-1 py-3 text-sm font-semibold transition-all border rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLease}
                disabled={isConfirming}
                className={`flex-[2] py-3 rounded-2xl text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${plan.tw.confirmBtn}`}
              >
                {isConfirming ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
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
      <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn mt-5">
        <div className="modal-scroll relative w-full max-w-[550px] max-h-[92vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-2xl velvora-glow dark:velvora-glow-dark">
          {isConfirming && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl">
              <PageLoader />
            </div>
          )}
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 px-6 pt-6 pb-4 border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-slate-100 dark:border-slate-800 rounded-t-3xl">
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute flex items-center justify-center w-8 h-8 transition-all top-5 right-5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 hover:scale-105"
            >
              <RiCloseLine className="text-lg" />
            </button>
            <h2 className="pr-10 text-xl font-bold text-slate-800 dark:text-white">
              Configure Your License
            </h2>
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* Wallet Balance */}
            <div className="grid grid-cols-2 gap-3">
              <div className="group relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-br from-emerald-400/60 via-green-300/40 to-teal-400/60 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300">
                <div className="relative flex items-center justify-between px-3 py-3 rounded-2xl bg-white/90 dark:bg-zinc-950/80 backdrop-blur-xl">
                  <div className="absolute inset-0 transition-transform duration-1000 -translate-x-full pointer-events-none group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
                  <div className="relative z-10 flex flex-wrap items-center gap-3">
                    <div className="relative flex items-center justify-center shadow-lg w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/30">
                      <div className="absolute inset-0 rounded-xl bg-emerald-400/40 blur-md -z-10" />
                      <RiWallet3Line className="text-xl text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-[0.12em]">
                        Deposit Wallet
                      </p>
                      <p className="text-lg font-bold leading-tight text-transparent bg-gradient-to-r from-emerald-700 to-green-600 dark:from-emerald-300 dark:to-green-400 bg-clip-text tabular-nums">
                        $
                        {Number(depositWallet).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                    <RiArrowUpLine className="text-sm text-emerald-600 dark:text-emerald-400" />
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
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2.5">
                Select plan
              </p>
              <div className="grid grid-cols-3 gap-2 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl p-1.5 shadow-inner">
                {Object.values(PLANS).map((p) => {
                  const isActive = selectedPlan === p.key;
                  return (
                    <button
                      key={p.key}
                      onClick={() => handlePlanChange(p.key)}
                      className={`flex flex-col items-center gap-0.5 py-2.5 px-2 rounded-xl text-[11px] font-bold transition-all duration-200 ${
                        isActive ? p.tw.activePill : p.tw.inactivePill
                      }`}
                    >
                      <p.Icon
                        className={`text-base mb-0.5 ${
                          isActive ? "text-white" : ""
                        }`}
                      />
                      {p.name}
                      <span
                        className={`text-[10px] font-semibold ${
                          isActive ? "text-white/80" : "text-slate-400"
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
            <div className="p-4 space-y-3 transition-all duration-200 border shadow-sm bg-slate-50/80 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60 rounded-2xl hover:shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                  Investment
                </p>
                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 shadow-sm">
                  <span className="text-xs text-slate-400">$</span>
                  <input
                    type="number"
                    value={clamped}
                    min={min}
                    max={max}
                    step={step}
                    onChange={(e) => handleInvestmentChange(e.target.value)}
                    className="w-20 text-sm font-bold text-right bg-transparent outline-none text-slate-800 dark:text-white tabular-nums"
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
                  className="lease-slider w-full h-1.5 rounded-full appearance-none outline-none cursor-pointer"
                  style={{ background: plan.tw.sliderBg(pct) }}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-slate-400 tabular-nums">
                    ${min.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 tabular-nums">
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
                <div className="p-2 border rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                  <StatPill
                    icon={RiBarChartBoxLine}
                    label="Credit Capacity"
                    value={credits.toLocaleString()}
                    accentClass="text-emerald-600 dark:text-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-200 dark:to-slate-700" />
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Assign to
              </span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-200 dark:to-slate-700" />
            </div>

            {/* Username Search */}
            <div className="space-y-2">
              <div className="relative">
                <RiUserLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-base" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Search username…"
                  className="w-full py-3 pl-10 pr-10 text-sm transition-colors bg-white border shadow-sm outline-none dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-400 dark:focus:border-slate-500 focus:shadow-md"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 rounded-full border-slate-300 border-t-slate-600 animate-spin" />
                  ) : (
                    <RiSearchLine className="text-base text-slate-300 dark:text-slate-600" />
                  )}
                </div>
              </div>

              {!isSearching && hasSearched && !searchedUsername && (
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-red-50/80 dark:bg-red-950/30 border border-red-200/60 dark:border-red-800/60 rounded-xl animate-fadeIn">
                  <RiErrorWarningLine className="flex-shrink-0 text-base text-red-500 dark:text-red-400" />
                  <p className="text-xs font-medium text-red-600 dark:text-red-400">
                    Username not found. Try a different name.
                  </p>
                </div>
              )}

              {!isSearching && searchedUsername && (
                <div className="flex items-center gap-3 px-3.5 py-3 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 rounded-xl animate-fadeIn shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 shadow-inner bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                    <RiCheckLine className="text-base text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-500">
                      User found
                    </p>
                    <p className="text-sm font-bold truncate text-emerald-700 dark:text-emerald-300">
                      {searchedUsername}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-500 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-1 rounded-lg flex-shrink-0">
                    <RiShieldCheckLine className="text-xs" /> Verified
                  </span>
                </div>
              )}
            </div>

            {/* Community Notice */}
            <div className="flex items-start gap-3 bg-gradient-to-r from-blue-50/80 to-blue-50/80 dark:from-blue-950/30 dark:to-blue-950/30 border border-blue-200/60 dark:border-blue-800/60 rounded-2xl px-4 py-3.5 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-7 h-7 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-emerald-500/20">
                <RiShieldCheckLine className="text-sm text-white" />
              </div>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                This agent is{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  approved
                </span>{" "}
                and marked for deployment under the{" "}
                <Link
                  href={routeMap["/community"] || "/community"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 underline transition-colors dark:text-blue-400 underline-offset-2 hover:text-blue-700 dark:hover:text-blue-300"
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
                className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-all hover:shadow-md"
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
                className={`flex-[2] py-3.5 rounded-2xl text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                  plan.tw.confirmBtn
                } relative overflow-hidden group ${
                  !canAcquireLicense || isConfirming
                    ? "opacity-60 cursor-not-allowed shadow-none hover:shadow-none"
                    : ""
                }`}
              >
                <span className="absolute inset-0 w-full h-full transition-transform duration-1000 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full"></span>
                {isConfirming ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
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