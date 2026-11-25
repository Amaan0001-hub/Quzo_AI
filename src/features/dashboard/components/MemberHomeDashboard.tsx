"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  ChartNoAxesCombined,
  Coins,
  ArrowDownToLine,
  Plus,
  Gift,
  ShieldCheck,
  Wallet,
  Users,
  TrendingUp,
  LayoutGrid,
  Bell,
  CircleDollarSign,
  Settings,
  Briefcase,
  Layers,
  Sparkles,
  Globe,
} from "lucide-react";

/* ============================================================
   DUMMY DATA & CONSTANTS
   ============================================================ */

// Global AI Market Data
const MARKET_VIEWS = {
  spending: {
    tab: "AI spending",
    note: "Worldwide AI spending, US$ trillion. 2026 and 2027 are forecasts. Source: Gartner, Sep 2026.",
    unit: "T",
    data: [
      { year: "2025", v: 1.79 },
      { year: "2026", v: 2.67 },
      { year: "2027", v: 3.64 },
    ],
  },
  market: {
    tab: "AI market size",
    note: "Global AI market size, US$ trillion. 2033 is a projection; only these two points are shown. Source: UNCTAD.",
    unit: "T",
    data: [
      { year: "2023", v: 0.189 },
      { year: "2033", v: 4.8 },
    ],
  },
  jobs: {
    tab: "Jobs by 2030",
    note: "Projected jobs by 2030, millions, all industries and all drivers. Source: WEF Future of Jobs 2025.",
    unit: "M",
    data: [
      { year: "Created", v: 170 },
      { year: "Displaced", v: 92 },
      { year: "Net", v: 78 },
    ],
  },
};

const MARKET_STATS = [
  { value: "$2.67T", label: "Projected worldwide AI spending", type: "Spending", year: "2026", source: "Gartner, Sep 2026" },
  { value: "$4.8T", label: "Projected global AI market size", type: "Market size", year: "2033", source: "UNCTAD, 2025" },
  { value: "78M", label: "Net new jobs, all industries", type: "Employment", year: "By 2030", source: "WEF Future of Jobs 2025" },
  { value: "170M", label: "New jobs created, all industries", type: "Employment", year: "By 2030", source: "WEF Future of Jobs 2025" },
];

const INCOME_BARS = [
  { label: 'Wk 1', yield: 45, performance: 25, affiliate: 15 },
  { label: 'Wk 2', yield: 45, performance: 30, affiliate: 15 },
  { label: 'Wk 3', yield: 45, performance: 30, affiliate: 20 },
  { label: 'Wk 4', yield: 45, performance: 35, affiliate: 15 },
  { label: 'Wk 5', yield: 45, performance: 40, affiliate: 20 },
];

const INCOME_SOURCES = [
  { label: 'Yield', value: '$663 · 50%', percent: 50, color: '#3b82f6' },
  { label: 'Performance', value: '$399 · 30%', percent: 30, color: '#10b981' },
  { label: 'Affiliate', value: '$266 · 20%', percent: 20, color: '#8b5cf6' },
];
// Income Chart Data for different ranges
const INCOME_RANGES = {
  "7D": {
    total: "$320.50",
    growth: "+5.2%",
    data: [
      { label: "Day 1", yield: 25, performance: 10, affiliate: 5 },
      { label: "Day 2", yield: 30, performance: 15, affiliate: 5 },
      { label: "Day 3", yield: 20, performance: 12, affiliate: 8 },
      { label: "Day 4", yield: 35, performance: 18, affiliate: 10 },
      { label: "Day 5", yield: 40, performance: 20, affiliate: 12 },
      { label: "Day 6", yield: 30, performance: 15, affiliate: 8 },
      { label: "Day 7", yield: 45, performance: 22, affiliate: 15 },
    ],
  },
  "30D": {
    total: "$1,328.00",
    growth: "+11.8%",
    data: [
      { label: "Wk 1", yield: 125, performance: 50, affiliate: 30 },
      { label: "Wk 2", yield: 150, performance: 65, affiliate: 35 },
      { label: "Wk 3", yield: 140, performance: 60, affiliate: 40 },
      { label: "Wk 4", yield: 160, performance: 70, affiliate: 35 },
      { label: "Wk 5", yield: 180, performance: 80, affiliate: 45 },
    ],
  },
  "90D": {
    total: "$4,150.00",
    growth: "+24.5%",
    data: [
      { label: "Mo 1", yield: 450, performance: 200, affiliate: 120 },
      { label: "Mo 2", yield: 520, performance: 250, affiliate: 150 },
      { label: "Mo 3", yield: 600, performance: 300, affiliate: 180 },
    ],
  },
  "1Y": {
    total: "$18,500.00",
    growth: "+45.2%",
    data: [
      { label: "Q1", yield: 1500, performance: 800, affiliate: 400 },
      { label: "Q2", yield: 1800, performance: 900, affiliate: 500 },
      { label: "Q3", yield: 2200, performance: 1100, affiliate: 600 },
      { label: "Q4", yield: 2500, performance: 1200, affiliate: 700 },
    ],
  },
};

const INCOME_SOURCES_DATA = [
  { label: 'Yield', value: '$663 · 50%', percent: 50, color: '#3b82f6' },
  { label: 'Performance', value: '$399 · 30%', percent: 30, color: '#10b981' },
  { label: 'Affiliate', value: '$266 · 20%', percent: 20, color: '#8b5cf6' },
];

const RECENT_TX_DATA = [
  { type: 'Performance income', date: '24 Nov · Credited', amount: '+$42.60' },
  { type: 'Affiliate income', date: '23 Nov · Credited', amount: '+$60.00' },
  { type: 'Yield income', date: '22 Nov · Pending', amount: '+$28.40' },
  { type: 'Affiliate income', date: '20 Nov · Credited', amount: '+$35.00' },
];

const RECENT_TX = [
  { type: 'Performance income', date: '24 Nov · Credited', amount: '+$42.60' },
  { type: 'Affiliate income', date: '23 Nov · Credited', amount: '+$60.00' },
  { type: 'Yield income', date: '22 Nov · Pending', amount: '+$28.40' },
  { type: 'Affiliate income', date: '20 Nov · Credited', amount: '+$35.00' },
];

const LEVEL_INCOME = [
  { level: 'Level 1', members: '14 members', value: '$48,200', percent: 100 },
  { level: 'Level 2', members: '21 members', value: '$32,100', percent: 75 },
  { level: 'Level 3', members: '13 members', value: '$16,100', percent: 40 },
];

const AFFILIATE_STATS = [
  { label: "Direct Referrals", value: "14" },
  { label: "Total Team Members", value: "48" },
  { label: "Active Members", value: "36" },
  { label: "Team Business Volume", value: "$96,400" },
];

const RECENT_JOINED = [
  { name: "Sample Member A", level: 1, joined: "Today", status: "Active" },
  { name: "Sample Member B", level: 2, joined: "Yesterday", status: "Active" },
  { name: "Sample Member C", level: 1, joined: "3 days ago", status: "Inactive" },
  { name: "Sample Member D", level: 3, joined: "5 days ago", status: "Active" },
];

const OPPORTUNITIES = [
  { title: "AI Agents License", desc: "Access curated AI services using x402 payments and earn commissions.", icon: Bot },
  { title: "Vendor Deployment", desc: "Deploy your AI tools on the marketplace, list services and receive payments.", icon: LayoutGrid },
  { title: "Affiliate Program", desc: "Earn rewards by inviting new users to join the ecosystem.", icon: Users },
  { title: "AI Agent Services", desc: "Launch AI service requests and connect with enterprise users.", icon: Sparkles },
];

const QUICK_LINKS = [
  { label: "My OTC", icon: CircleDollarSign },
  { label: "My Coins", icon: Coins },
  { label: "My Customers", icon: Users },
  { label: "My Payouts", icon: Wallet },
  { label: "My Team", icon: Users },
  { label: "My Vendors", icon: Briefcase },
  { label: "My Plans", icon: Layers },
  { label: "My Assets", icon: Settings },
];

const NOTIFICATIONS = [
  { title: "Income credited", desc: "A yield deposit has been added", time: "2 min ago", icon: "plus" },
  { title: "Your team has completed a business milestone", desc: "New tier unlocked for your team", time: "1 hr ago", icon: "trophy" },
  { title: "Your AI agent deployment has been approved.", desc: "Ready to start accepting service requests", time: "3 hrs ago", icon: "bot" },
];

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export function MemberHomeDashboard() {
  const [mounted, setMounted] = useState(false);
  
  
  // State for Global AI Market Chart Tabs
  const [marketView, setMarketView] = useState<keyof typeof MARKET_VIEWS>("spending");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full min-h-screen bg-[#f4f7f9] dark:bg-[#03161f] text-[#06262f] dark:text-[#e6f7f9] font-sans selection:bg-[#12a594]/30">
      
      {/* ================= HERO SECTION (COMPACT) ================= */}
      <div className="bg-[#03161f] w-full px-4 pt-6 pb-12 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden rounded-b-[2rem]">
        
        {/* Background Glow Effects */}
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] -translate-y-1/2 translate-x-1/4 bg-[#12a594]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-[#35d6c0]/10 rounded-full blur-[80px] pointer-events-none" />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center relative z-10">
          
          {/* ================= LEFT CONTENT ================= */}
          <div className="relative z-20 flex flex-col items-start pt-4 lg:pt-0">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#12a594]/30 bg-[#12a594]/10 backdrop-blur-md text-[#35d6c0] text-[10px] font-semibold tracking-[0.15em] uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#35d6c0] shadow-[0_0_10px_#35d6c0]" />
              YOUR AI BUSINESS PANEL
            </div>
            
            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-[3.2rem] font-extrabold text-white leading-[1.1] mb-3 tracking-tight">
              THE FUTURE IS NO LONGER COMING. <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#12a594] to-[#35d6c0]">
  {"IT'S HERE."}
</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-[13px] sm:text-[14px] text-slate-400 max-w-[480px] mb-6 leading-relaxed">
              Discover the next generation of AI agents, autonomous robotics, intelligent automation and global business opportunities.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 relative z-20">
              <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#12a594] to-[#35d6c0] hover:opacity-90 text-white text-[13px] font-semibold transition-all shadow-[0_0_20px_rgba(18,165,148,0.3)] flex items-center gap-2">
                <Bot className="w-4 h-4" /> Explore AI Marketplace <ArrowRight className="w-4 h-4 ml-1" />
              </button>
              <button className="px-5 py-2.5 rounded-xl border border-[#12a594]/30 bg-white/5 hover:bg-white/10 text-white text-[13px] font-semibold transition-all flex items-center gap-2 backdrop-blur-sm">
                <Globe className="w-4 h-4 text-[#35d6c0]" /> Discover Opportunities
              </button>
              <button className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-[13px] font-semibold transition-all flex items-center gap-2 backdrop-blur-sm mt-2 sm:mt-0">
                <Sparkles className="w-4 h-4 text-[#12a594]" /> Deploy Agents
              </button>
            </div>
          </div>
          
          {/* ================= RIGHT ILLUSTRATION ================= */}
          <div className="relative h-[300px] lg:h-[380px] flex items-center justify-center z-10">
            
            {/* Central Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(18,165,148,0.15)_0%,transparent_60%)] pointer-events-none" />

            {/* Floating Glassmorphism Cards */} 
            <div className="absolute top-[5%] left-[0%] lg:-left-[5%] z-20 flex items-center gap-2.5 p-2.5 pr-4 rounded-xl border border-[#12a594]/20 bg-[#03161f]/80 backdrop-blur-xl shadow-lg">
              <div className="w-8 h-8 rounded-full bg-[#0a2a33] flex items-center justify-center border border-[#12a594]/30">
                <Bot className="w-4 h-4 text-[#35d6c0]" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">AI Agents</div>
                <div className="text-[9px] text-[#84a2ad]">Digital workforce</div>
              </div>
            </div>

            <div className="absolute top-[0%] right-[0%] lg:-right-[5%] z-20 flex items-center gap-2.5 p-2.5 pr-4 rounded-xl border border-[#12a594]/20 bg-[#03161f]/80 backdrop-blur-xl shadow-lg">
              <div className="w-8 h-8 rounded-full bg-[#0a2a33] flex items-center justify-center border border-[#12a594]/30">
                <Globe className="w-4 h-4 text-[#35d6c0]" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">Global Network</div>
                <div className="text-[9px] text-[#84a2ad]">Connected intelligence</div>
              </div>
            </div>

            <div className="absolute bottom-[15%] right-[0%] lg:-right-[2%] z-20 flex items-center gap-2.5 p-2.5 pr-4 rounded-xl border border-[#12a594]/20 bg-[#03161f]/80 backdrop-blur-xl shadow-lg">
              <div className="w-8 h-8 rounded-full bg-[#0a2a33] flex items-center justify-center border border-[#12a594]/30">
                <LayoutGrid className="w-4 h-4 text-[#35d6c0]" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">Smart Factories</div>
                <div className="text-[9px] text-[#84a2ad]">Robotic production</div>
              </div>
            </div>

            <div className="absolute bottom-[5%] left-[0%] lg:left-[2%] z-20 flex items-center gap-2.5 p-2.5 pr-4 rounded-xl border border-[#12a594]/20 bg-[#03161f]/80 backdrop-blur-xl shadow-lg">
              <div className="w-8 h-8 rounded-full bg-[#0a2a33] flex items-center justify-center border border-[#12a594]/30">
                <Globe className="w-4 h-4 text-[#35d6c0]" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">Autonomous Mobility</div>
                <div className="text-[9px] text-[#84a2ad]">Robo taxi and drones</div>
              </div>
            </div>

            <Image 
              src="/quzo-hero-robot.webp" 
              alt="QUZO AI Robot" 
              width={400}
              height={400}
              priority
              className="relative z-10 w-[200px] lg:w-[300px] h-auto object-contain drop-shadow-[0_0_40px_rgba(18,165,148,0.2)] animate-[float_6s_ease-in-out_infinite]"
            />
            
          </div>
        </div>
      </div>

      {/* ================= OVERLAPPING STATS CARDS ================= */}
      <div className="w-full bg-[#f4f7f9] dark:bg-[#03161f] pb-8">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 -mt-10 relative z-20">
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Card 1: Total Income */}
            <div className="bg-white dark:bg-[#07242e] rounded-2xl p-5 border border-slate-100 dark:border-[#153747] shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-1">Total Income</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">$8,420.75</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#12a594]/10 flex items-center justify-center">
                <CircleDollarSign className="w-6 h-6 text-[#12a594]" />
              </div>
            </div>

            {/* Card 2: Yield Wallet */}
            <div className="bg-white dark:bg-[#07242e] rounded-2xl p-5 border border-slate-100 dark:border-[#153747] shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-1">Yield Wallet</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">$1,240.50</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#12a594]/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-[#12a594]" />
              </div>
            </div>

            {/* Card 3: Performance Wallet */}
            <div className="bg-white dark:bg-[#07242e] rounded-2xl p-5 border border-slate-100 dark:border-[#153747] shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-1">Performance Wallet</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">$386.20</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#12a594]/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#12a594]" />
              </div>
            </div>

            {/* Card 4: Deposit Wallet */}
            <div className="bg-white dark:bg-[#07242e] rounded-2xl p-5 border border-slate-100 dark:border-[#153747] shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-1">Deposit Wallet</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">$5,000.00</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#12a594]/10 flex items-center justify-center">
                <ArrowDownToLine className="w-6 h-6 text-[#12a594]" />
              </div>
            </div>

            {/* Card 5: Active Licenses */}
            <div className="bg-white dark:bg-[#07242e] rounded-2xl p-5 border border-slate-100 dark:border-[#153747] shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-1">Active Licenses</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">3</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#12a594]/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#12a594]" />
              </div>
            </div>

            {/* Card 6: Total Team */}
            <div className="bg-white dark:bg-[#07242e] rounded-2xl p-5 border border-slate-100 dark:border-[#153747] shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-1">Total Team</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">48</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#12a594]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#12a594]" />
              </div>
            </div>
          </div>

          {/* Bottom Bar: AI Credits Progress & Actions */}
          <div className="mt-4 bg-white dark:bg-[#07242e] rounded-2xl p-5 border border-slate-100 dark:border-[#153747] shadow-sm flex flex-col xl:flex-row items-center gap-6">
            <div className="flex-1 w-full">
              <div className="flex justify-between text-[13px] font-medium text-slate-600 dark:text-slate-300 mb-3">
                <span>AI credits available</span>
                <span className="text-slate-400">31,200 of 50,000</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#12a594] to-[#35d6c0] rounded-full w-[62%]" />
              </div>
            </div>

            <div className="flex items-center gap-3 w-full xl:w-auto shrink-0">
              <button className="flex-1 xl:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#12a594] to-[#35d6c0] hover:opacity-90 text-white text-[13px] font-semibold transition-opacity flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(18,165,148,0.3)]">
                <Plus className="w-4 h-4" /> Add Funds
              </button>
              <button className="flex-1 xl:flex-none px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[13px] font-semibold transition-colors flex items-center justify-center gap-2">
                <ArrowDownToLine className="w-4 h-4" /> Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT GRID ================= */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 space-y-6">
        
        {/* --- SECTION: INCOME STATISTICS --- */}
        <section>
          <div className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase mb-2">Income Statistics</div>
          
          <div className="flex flex-col gap-6">
            {/* Header & Time Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Income Overview</h2>
              <div className="flex gap-2">
                {["7 Days", "30 Days", "90 Days", "1 Year"].map((t, i) => (
                  <button 
                    key={t} 
                    className={`px-4 py-1.5 text-[11px] font-medium rounded-full transition-colors border ${
                      i === 1 
                        ? "bg-[#6b4eff] text-white border-[#6b4eff]" 
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-[#07242e] dark:border-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Chart Card */}
            <div className="bg-white dark:bg-[#07242e] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-[#153747]">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-[11px] text-slate-500 mb-1">Income in selected period</div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">$1,328</div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#12a594] bg-[#12a594]/10 px-2.5 py-1 rounded-md">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                  +11.8% <span className="text-slate-500 font-normal ml-0.5">vs previous period</span>
                </div>
              </div>

              {/* Chart Area */}
              <div className="relative w-full h-[250px] mb-4">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6 pl-10">
                  {[320, 240, 160, 80, 0].map((val) => (
                    <div key={val} className="flex items-center w-full relative">
                      <span className="text-[10px] text-slate-400 w-10 absolute -left-10 -mt-2">{val === 0 ? '$0' : `$${val}`}</span>
                      <div className="flex-1 border-t border-slate-100 dark:border-slate-800"></div>
                    </div>
                  ))}
                </div>

                <div className="absolute inset-0 flex justify-around items-end pl-12 pb-6 z-10">
                  {INCOME_BARS.map((item, i) => (
                    <div key={i} className="flex flex-col items-center group w-12 h-full justify-end">
                      <div className="w-8 flex flex-col justify-end h-full">
                        <div className="w-full bg-[#8b5cf6] rounded-t-sm" style={{ height: `${item.affiliate}%` }} />
                        <div className="w-full bg-[#10b981]" style={{ height: `${item.performance}%` }} />
                        <div className="w-full bg-[#3b82f6]" style={{ height: `${item.yield}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-0 left-0 right-0 flex justify-around pl-12">
                  {INCOME_BARS.map((item, i) => (
                    <div key={i} className="w-12 flex justify-center">
                      <span className="text-[10px] text-slate-400">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" /> Affiliate
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> Performance
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /> Yield
                </div>
              </div>
            </div>

            {/* Bottom Row Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#07242e] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-[#153747]">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6">Income by source</h3>
                <div className="space-y-5">
                  {INCOME_SOURCES.map((src, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-[11px] mb-2">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{src.label}</span>
                        <span className="text-slate-500">{src.value}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${src.percent}%`, backgroundColor: src.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-[#07242e] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-[#153747]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent transactions</h3>
                  <a href="#" className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline">View all</a>
                </div>
                <div className="space-y-4">
                  {RECENT_TX.map((tx, i) => (
                    <div key={i} className="flex justify-between items-start pb-3 border-b border-slate-50 dark:border-slate-800/50 last:border-0 last:pb-0">
                      <div>
                        <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 mb-0.5">{tx.type}</div>
                        <div className="text-[10px] text-slate-400">{tx.date}</div>
                      </div>
                      <span className={`text-[11px] font-bold ${tx.date.includes('Pending') ? 'text-slate-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION: AFFILIATE TEAM GROWTH --- */}
        <section>
          <div className="text-[10px] font-semibold tracking-[0.15em] text-[#6b4eff] uppercase mb-2">Affiliate</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Affiliate Team Growth</h2>
          
          <div className="flex flex-col gap-6">
            {/* Referral Link Bar */}
            <div className="bg-white dark:bg-[#07242e] rounded-2xl p-4 border border-slate-100 dark:border-[#153747] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Your referral link</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">http://localhost:3002/register?ref=DEMO1234</p>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-[#6b4eff] hover:bg-[#5a3ee6] text-white text-[12px] font-semibold transition-colors flex items-center justify-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> 
                  Copy link
                </button>
                <button className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[12px] font-semibold transition-colors">
                  Affiliate dashboard
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {AFFILIATE_STATS.map((stat, i) => (
                <div key={i} className="bg-white dark:bg-[#07242e] rounded-2xl p-5 border border-slate-100 dark:border-[#153747] shadow-sm">
                  <p className="text-[11px] text-slate-500 mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                </div>
              ))}
            </div>

            {/* Time Filters */}
            <div className="flex gap-2">
              {["7 Days", "30 Days", "90 Days", "1 Year"].map((t, i) => (
                <button 
                  key={t} 
                  className={`px-4 py-1.5 text-[11px] font-medium rounded-full transition-colors border ${
                    i === 1 
                      ? "bg-[#6b4eff] text-white border-[#6b4eff]" 
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-[#07242e] dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#07242e] rounded-2xl p-6 border border-slate-100 dark:border-[#153747] shadow-sm">
                <h4 className="text-sm font-bold mb-6 text-slate-900 dark:text-white">Team members over time</h4>
                <div className="relative h-[220px] w-full">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
                    {[60, 45, 30, 15, 0].map((val) => (
                      <div key={val} className="flex items-center w-full">
                        <span className="text-[10px] text-slate-400 w-6">{val}</span>
                        <div className="flex-1 border-t border-slate-100 dark:border-slate-800 ml-2"></div>
                      </div>
                    ))}
                  </div>

                  <div className="absolute inset-0 ml-8 pb-6">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0,50 L25,45 L50,40 L75,35 L100,30 L100,100 L0,100 Z" fill="url(#chartGradient)" />
                      <path d="M0,50 L25,45 L50,40 L75,35 L100,30" fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                    </svg>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 flex justify-between pl-8">
                    {['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5'].map((label) => (
                      <span key={label} className="text-[10px] text-slate-400">{label}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#07242e] rounded-2xl p-6 border border-slate-100 dark:border-[#153747] shadow-sm">
                <h4 className="text-sm font-bold mb-6 text-slate-900 dark:text-white">Level-wise team</h4>
                <div className="space-y-6">
                  {LEVEL_INCOME.map((lvl, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center text-[12px] mb-2">
                        <span className="text-slate-700 dark:text-slate-300">
                          {lvl.level} <span className="text-slate-400">· {lvl.members}</span>
                        </span>
                        <span className="font-semibold text-slate-600 dark:text-slate-400">{lvl.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                        <div className="h-full rounded-full bg-[#3b82f6]" style={{ width: `${lvl.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Table: Recently joined */}
            <div className="bg-white dark:bg-[#07242e] rounded-2xl border border-slate-100 dark:border-[#153747] shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Recently joined</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                      <th className="py-3 px-5 font-medium">Member</th>
                      <th className="py-3 px-5 font-medium text-center w-24">Level</th>
                      <th className="py-3 px-5 font-medium">Joined</th>
                      <th className="py-3 px-5 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {RECENT_JOINED.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-5 font-semibold text-slate-800 dark:text-slate-200">
                          {row.name}
                        </td>
                        <td className="py-4 px-5 text-center text-slate-500">
                          {row.level}
                        </td>
                        <td className="py-4 px-5 text-slate-500">
                          {row.joined}
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${row.status === "Active" ? "bg-[#10b981]" : "bg-slate-400"}`} />
                            <span className={`font-medium ${row.status === "Active" ? "text-slate-700 dark:text-slate-300" : "text-slate-500"}`}>
                              {row.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION: BUSINESS OPPORTUNITIES --- */}
        <section>
          <div className="text-[12px] font-semibold tracking-[0.15em] text-[#35d6c0] uppercase mb-2">Business Opportunities</div>
          <h2 className="text-xl font-bold mb-4">Grow Your Business With Quzo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {OPPORTUNITIES.map((opp, i) => (
              <div key={i} className="bg-white dark:bg-[#07242e] rounded-2xl border border-[#d9e8ec] dark:border-[#153747] p-5 shadow-sm hover:-translate-y-1 transition-transform cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center mb-4 group-hover:bg-[#3b82f6]/20 transition-colors">
                  <opp.icon className="w-5 h-5 text-[#3b82f6]" />
                </div>
                <h3 className="text-sm font-bold mb-2">{opp.title}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-4">{opp.desc}</p>
                <div className="text-[10px] font-semibold text-[#12a594] flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION: QUICK LINKS --- */}
        <section>
          <div className="text-[10px] font-semibold tracking-[0.15em] text-[#35d6c0] uppercase mb-2">Quick Links</div>
          <h2 className="text-xl font-bold mb-4">Your Business Command Center</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {QUICK_LINKS.map((link, i) => (
              <button key={i} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-[#07242e] border border-[#d9e8ec] dark:border-[#153747] hover:border-[#3b82f6] dark:hover:border-[#3b82f6] transition-colors group">
                <link.icon className="w-5 h-5 text-slate-400 group-hover:text-[#3b82f6] transition-colors" />
                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 text-center leading-tight">{link.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* --- SECTION: NOTIFICATIONS & UPDATES --- */}
        <section>
          <div className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase mb-2">Notifications & Updates</div>
          <div className="bg-white dark:bg-[#07242e] rounded-2xl border border-[#d9e8ec] dark:border-[#153747] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">What&apos;s Happening</h2>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-700 font-medium">
                  <Bell className="w-3.5 h-3.5" /> Unread
                </button>
                <button className="text-[11px] font-semibold text-[#3b82f6]">Mark all read</button>
                <button className="text-[11px] text-slate-400 hover:text-slate-600">View All Notifications</button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {NOTIFICATIONS.map((note, i) => (
                <div key={i} className="flex gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#051c25]">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-[#07242e] border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                    {note.icon === "plus" && <CircleDollarSign className="w-4 h-4 text-[#12a594]" />}
                    {note.icon === "trophy" && <ShieldCheck className="w-4 h-4 text-[#d9a441]" />}
                    {note.icon === "bot" && <Bot className="w-4 h-4 text-[#3b82f6]" />}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold leading-tight">{note.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{note.desc}</p>
                    <span className="text-[9px] text-slate-400 mt-2 block">{note.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- SECTION: AI ECONOMY (PURE TAILWIND CHART) --- */}
        <section>
          <div className="text-[10px] font-semibold tracking-[0.15em] text-[#35d6c0] uppercase mb-2">Global AI Market Snapshot</div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            THE AI ECONOMY IS ENTERING ITS TRILLION-DOLLAR ERA.
          </h2>

          {/* Top 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {MARKET_STATS.map((s, i) => (
              <div key={i} className="bg-white dark:bg-[#07242e] rounded-2xl p-5 border border-slate-100 dark:border-[#153747] shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#6b4eff] to-transparent opacity-50" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#6b4eff] dark:text-[#8b6cf0] mb-2">
                  {s.type} · {s.year}
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{s.value}</p>
                <p className="text-[11px] text-slate-500 leading-tight mb-3">{s.label}</p>
                <a href="#" className="text-[10px] text-slate-400 underline underline-offset-2 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  {s.source}
                </a>
              </div>
            ))}
          </div>

          {/* Interactive Chart Card */}
          <div className="bg-white dark:bg-[#07242e] rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-[#153747] shadow-sm">
            <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Chart measure">
              {(Object.keys(MARKET_VIEWS) as (keyof typeof MARKET_VIEWS)[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setMarketView(k)}
                  className={`rounded-full px-4 py-1.5 text-[11px] font-semibold transition-colors ${
                    marketView === k 
                      ? "bg-[#35d6c0] text-white" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {MARKET_VIEWS[k].tab}
                </button>
              ))}
            </div>

            {/* Custom Tailwind Bar Chart */}
            <div className="relative h-64 w-full flex items-end justify-around border-b border-slate-100 dark:border-slate-800 pb-2">
              {/* Y-Axis Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
                {[1, 0.75, 0.5, 0.25, 0].map((pct, idx) => (
                  <div key={idx} className="w-full border-t border-slate-100 dark:border-slate-800/50 relative">
                    <span className="absolute -top-2.5 -left-2 text-[9px] text-slate-400">
                      {marketView === 'spending' ? (pct * 4).toFixed(1) : 
                       marketView === 'market' ? (pct * 5).toFixed(1) : 
                       (pct * 200).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bars */}
              <div className="absolute inset-0 flex justify-around items-end pl-8 pb-8 z-10">
                {MARKET_VIEWS[marketView].data.map((item, i) => {
                  const maxVal = Math.max(...MARKET_VIEWS[marketView].data.map(d => d.v));
                  const heightPct = (item.v / maxVal) * 100;

                  return (
                    <div key={i} className="flex flex-col items-center group w-16 h-full justify-end">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.v}{MARKET_VIEWS[marketView].unit}
                      </span>
                      <div 
                        className="w-10 sm:w-14 bg-[#35d6c0] rounded-t-sm transition-all duration-500 hover:bg-[#12a594]" 
                        style={{ height: `${heightPct}%` }} 
                      />
                    </div>
                  );
                })}
              </div>

              {/* X-Axis Labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-around pl-8">
                {MARKET_VIEWS[marketView].data.map((item, i) => (
                  <div key={i} className="w-16 flex justify-center">
                    <span className="text-[11px] font-semibold text-slate-500">{item.year}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart Note */}
            <p className="mt-6 text-[10px] text-slate-500 dark:text-slate-400">
              {MARKET_VIEWS[marketView].note} These measures use different methods and should not be compared with each other.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}