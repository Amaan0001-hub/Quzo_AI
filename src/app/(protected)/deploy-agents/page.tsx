"use client";

import { useState, useEffect, type JSX } from "react";

import {
  Clock,
  Cpu,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Star,
  StarHalf,
  Cloud,
  Search,
  ChevronRight,
  Coins,
  TrendingUp,
  Building2,
  Sparkles,
  Bot,
} from "lucide-react";
import { MdMemory, MdRefresh, MdCloudQueue } from "react-icons/md";
import { FaMicrochip } from "react-icons/fa";
import { BsLightningCharge } from "react-icons/bs";
import { apiClient } from "@/lib/api-client";
import {toast} from "sonner";
import { useRouter } from "next/navigation";
import { useTempStorage } from "@/app/components/useTempStorage";

// ---------- Types ----------

interface SortOption {
  value: string;
  label: string;
}

interface Agent {
  productId: string;
  id: string;
  name: string;
  description: string;
  shortDesc: string;
  price: number;
  creditsCost: number;
  totalCredit: number;
  consumedCredit: number;
  balanceCredit: number;
  monthlyRevenueAprox: number;
  imageUrl: string;
  agentType: string;
  platformFees: number;
  finalYiledIncome: number;
  rechargeId: string;
  deploymentStatus: string;
  licenseFee: number;
  rentalMultiplier?: string;
}

interface Partner {
  PartnerId: string;
  Name: string;
  Description: string;
  CategoryName: string;
  RiskLevel: string;
  Rating: number;
  DeploymentsText: string;
  MarketplaceUrl: string;
  PartnerImageURL: string;
  APYText: string;
  PerformanceText: string;
  DemandText: string;
}

interface Step {
  name: string;
  key: string;
}

interface OrderData {
  name: string;
  image: string;
  Rkprice: string | number;
  PartnerName: string;
  usernameInput: string;
  orderId: string;
}

// Raw API row shape (loose typing because the API returns mixed keys)
interface RawAgentRow {
  agentName?: string;
  ProductName?: string;
  SubName?: string;
  Remark?: string;
  RId?: string | number;
  ID?: string | number;
  LicenseAmount?: number;
  Rkprice?: number;
  TotalCredit?: number;
  ConsumedCredit?: number;
  BalanceCredit?: number;
  totalCredit?: number;
  consumedCredit?: number;
  balanceCredit?: number;
  MonthlyRevenueAprox?: number;
  agentImage?: string;
  Image?: string;
  AgentType?: string;
  PlatformFees?: number;
  FinalYiledIncome?: number;
  RechargeId?: string | number;
  rechargeId?: string | number;
  DeploymentStatus?: string;
  rentalMultiplier?: string;
  [key: string]: unknown;
}

interface DeployResponseItem {
  agentName?: string;
  agentImage?: string;
  LicenseAmount?: string | number;
  PartnerName?: string;
  AuthLogin?: string;
}

interface DeployResponse {
  statusCode?: number;
  message: string;
  data?: DeployResponseItem[];
}

// ---------- Sort Options ----------
// NOTE: must NOT be exported — page files cannot have extra named exports.

const sortOptions: SortOption[] = [
  { value: "personalagents", label: "Personal Agents - $10 to $490" },
  { value: "businessagents", label: "Business Agents - $500 to $4950" },
  { value: "industrialagents", label: "Industrial Agents - $5000 - $20000" },
];

// ---------- Component ----------

export default function DeployAIWorkforce() {
  const [step, setStep] = useState<number>(0);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [contractAgreed, setContractAgreed] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  const [priceFilter, setPriceFilter] = useState<string>("");
  const [, setOrderData] = useTempStorage<OrderData>("orderData");
  const route = useRouter();

  const [agentsData, setAgentsData] = useState<RawAgentRow[]>([]);
  const [partnersData, setPartnersData] = useState<Partner[]>([]);

  const extractList = (payload: unknown): unknown[] => {
    if (Array.isArray(payload)) return payload;
    const p = payload as { data?: unknown; incomeTransTypes?: unknown };
    if (Array.isArray(p?.data)) return p.data;
    if (Array.isArray(p?.incomeTransTypes)) return p.incomeTransTypes;
    return [];
  };

  const agents: Agent[] = agentsData.map((item, index) => {
    const name: string = item.agentName ?? item.ProductName ?? "";
    const description: string = item.SubName ?? item.Remark ?? "";
    return {
      productId: String(item.RId ?? item.ID ?? index),
      id: name.toLowerCase().replace(/\s+/g, ""),
      name,
      description,
      shortDesc:
        description.length > 35
          ? `${description.substring(0, 35)}...`
          : description,
      price: item.LicenseAmount ?? item.Rkprice ?? 0,
      creditsCost: item.TotalCredit ?? item.totalCredit ?? 0,
      totalCredit: item.TotalCredit ?? item.totalCredit ?? 0,
      consumedCredit: item.ConsumedCredit ?? item.consumedCredit ?? 0,
      balanceCredit: item.BalanceCredit ?? item.balanceCredit ?? 0,
      monthlyRevenueAprox: item.MonthlyRevenueAprox ?? 0,
      imageUrl: item.agentImage ?? item.Image ?? "",
      agentType: item.AgentType ?? "",
      platformFees: item.PlatformFees ?? 0,
      finalYiledIncome: item.FinalYiledIncome ?? 0,
      rechargeId: String(item.RechargeId ?? item.rechargeId ?? index),
      deploymentStatus: item.DeploymentStatus ?? "",
      licenseFee: item.LicenseAmount ?? item.Rkprice ?? 0,
      rentalMultiplier: item.rentalMultiplier,
    };
  });

  const getFilteredAgents = (): Agent[] => {
    let filtered = agents;
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (agent) =>
          agent.name?.toLowerCase().includes(query) ||
          agent.description?.toLowerCase().includes(query)
      );
    }
    if (priceFilter !== "") {
      filtered = filtered.filter((agent) => {
        const price = Number(agent.price);
        if (priceFilter === "personalagents")
          return price >= 10 && price <= 490;
        if (priceFilter === "businessagents")
          return price >= 500 && price <= 4950;
        if (priceFilter === "industrialagents")
          return price >= 5000 && price <= 20000;
        return true;
      });
    }
    return filtered;
  };

  const filteredAgents = getFilteredAgents();

  const partners: Partner[] = partnersData;

  const getAgentByProductId = (
    productId: string | null
  ): Agent | undefined => agents.find((a) => a.rechargeId === productId);

  const getSelectedPartnerDetails = (): Partner | { Name: string } =>
    partners?.find((p) => p.PartnerId === selectedPartner) ||
    partners?.[0] || { Name: "None" };

  const steps: Step[] = [
    { name: "Select Allocated Agent", key: "agent" },
    { name: "Choose Infrastructure Partner", key: "partner" },
    { name: "Deploy Agent", key: "deploy" },
  ];

  const handleNext = (): void => {
    if (step === 0 && !selectedAgent) return;
    if (step === 1 && !selectedPartner) return;
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleBack = (): void => {
    if (step > 0) setStep(step - 1);
  };

  const handleDeploy = async (): Promise<void> => {
    try {
      const agent = getAgentByProductId(selectedAgent);
      const response = await apiClient.post<DeployResponse>(
        "/WalletReport/agentDeploymentUser",
        {
          RechargeId: agent?.rechargeId,
          PartnerId: selectedPartner,
        }
      );
      if (response?.statusCode === 200) {
        const orderId = `ORD-${Math.floor(1000 + Math.random() * 900000)}`;
        setOrderData({
          name: response.data?.[0]?.agentName ?? "",
          image: response.data?.[0]?.agentImage ?? "",
          Rkprice: response.data?.[0]?.LicenseAmount ?? "",
          PartnerName: response.data?.[0]?.PartnerName ?? "",
          usernameInput: response.data?.[0]?.AuthLogin ?? "",
          orderId,
        });
        route.push("/deploy-sucess");
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Deploy Error:", error);
    }
  };

  const selectedAgentData = getAgentByProductId(selectedAgent);

  const renderRating = (rating: number): JSX.Element[] => {
    const stars: JSX.Element[] = [];
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    for (let i = 0; i < full; i++)
      stars.push(
        <Star
          key={i}
          className="w-3 h-3 text-yellow-400 fill-current sm:w-4 sm:h-4"
        />
      );
    if (half)
      stars.push(
        <StarHalf
          key="half"
          className="w-3 h-3 text-yellow-400 fill-current sm:w-4 sm:h-4"
        />
      );
    while (stars.length < 5)
      stars.push(
        <Star
          key={stars.length}
          className="w-3 h-3 text-yellow-400 sm:w-4 sm:h-4"
        />
      );
    return stars;
  };

  useEffect(() => {
    const fetchDeployData = async (): Promise<void> => {
      try {
        const agentsResponse = await apiClient.get<unknown>(
          "/WalletReport/getListofUndeployedAgents"
        );
        setAgentsData(extractList(agentsResponse) as RawAgentRow[]);
      } catch (error) {
        console.error("Failed to load undeployed agents:", error);
      }

      try {
        const partnersResponse = await apiClient.get<unknown>(
          "/WalletReport/getDeploymentPartners"
        );
        setPartnersData(extractList(partnersResponse) as Partner[]);
      } catch (error) {
        console.error("Failed to load deployment partners:", error);
        toast.error("Failed to load deployment partners.");
      }
    };
    void fetchDeployData();
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
        .animate-pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .velvora-gradient { background: linear-gradient(135deg, #2196F3, #3F51B5, #3F51B5); }
        .velvora-gradient-hover { background: linear-gradient(135deg, #4f46e5, #7c3aed, #9333ea); }
        .velvora-gradient-text { background: linear-gradient(135deg, #2196F3, #3F51B5, #3F51B5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .glass-effect { background: rgba(255,255,255,0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        .dark .glass-effect { background: rgba(17,24,39,0.7); }
        .gradient-border { position: relative; }
        .gradient-border::before { content: ''; position: absolute; inset: -2px; border-radius: inherit; padding: 2px; background: linear-gradient(135deg, #2196F3, #3F51B5, #3F51B5); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }
      `}</style>

      <div className="relative w-full px-3 py-4 overflow-hidden sm:px-5 md:px-6 lg:px-8 sm:py-6 md:py-8 lg:py-10 ">
        {/* Decorative Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute rounded-full -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-400/10 blur-3xl animate-float"></div>
          <div
            className="absolute rounded-full -bottom-40 -left-40 w-96 h-96 bg-blue-400/20 dark:bg-blue-400/10 blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Header - Velvora Style */}
          <div className="mb-8 text-center sm:mb-10 md:mb-12">
            <div
              className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2  rounded-full border 
      border-blue-200/30 dark:border-blue-800/30 mb-4 sm:mb-5 shadow-lg shadow-blue-500/5"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-xs font-semibold sm:text-sm ">
                QUZO AI Deployment Platform
              </span>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-full font-bold">
                LIVE
              </span>
            </div>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Deploy Your AI Agents{" "}
              <span className="relative velvora-gradient-text">
                <svg
                  className="absolute left-0 w-full h-1 -bottom-2"
                  viewBox="0 0 200 4"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 2L198 2"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
            <p className="max-w-2xl px-2 mx-auto mt-3 text-sm leading-relaxed text-gray-600 sm:mt-4 sm:text-base md:text-lg dark:text-gray-400">
              Select a compute-ready AI agent, choose an infrastructure partner,
              and activate your digital workforce within the QUZO AI ecosystem.
            </p>
          </div>

          {/* Step Indicators */}
          <div className="flex flex-col items-stretch justify-center gap-2 p-3 mb-8 shadow-2xl sm:flex-row sm:items-center sm:gap-3 sm:mb-10 md:mb-12 sm:p-4 md:p-5 rounded-3xl border glass-effect shadow-blue-200/20 dark:shadow-blue-900/30">
            {steps.map((s, idx) => (
              <div
                key={s.key}
                className="flex items-center w-full gap-2 sm:gap-3 sm:w-auto"
              >
                <button
                  onClick={() => idx <= step && setStep(idx)}
                  className={`flex items-center w-full sm:w-auto gap-2.5 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                    idx <= step
                      ? idx === step
                        ? "bg-gradient-to-r from-blue-600 via-blue-600 to-blue-600 text-white shadow-2xl shadow-blue-500/25 scale-[1.02]"
                        : "bg-blue-100/70 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30"
                      : "bg-gray-100/70 dark:bg-white/5 text-gray-500 dark:text-gray-500 border border-transparent"
                  }`}
                >
                  <span
                    className={`shrink-0 w-6 h-6 rounded-full grid place-items-center text-[10px] sm:text-xs font-bold transition-all ${
                      idx < step
                        ? "bg-blue-500 text-white shadow-lg shadow-emerald-500/30"
                        : idx === step
                        ? "bg-white/20 text-white"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {idx < step ? (
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      idx + 1
                    )}
                  </span>
                  <span className="hidden font-semibold truncate xs:inline">
                    {s.name}
                  </span>
                  <span className="truncate xs:hidden">
                    {s.key.charAt(0).toUpperCase() + s.key.slice(1)}
                  </span>
                </button>

                {idx < steps.length - 1 && (
                  <span className="hidden text-blue-300 sm:inline dark:text-blue-600">
                    <ChevronRight className="w-5 h-5" />
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="relative p-4 overflow-hidden shadow-2xl rounded-3xl border glass-effect  sm:p-6 md:p-8">
            {/* <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/5 via-blue-500/5 to-blue-500/5 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gradient-to-tr from-blue-500/5 via-blue-500/5 to-blue-500/5 blur-2xl"></div> */}

            <div className="relative">
              {/* Step 0 */}
              {step === 0 && (
                <>
                  <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-start lg:justify-between md:mb-7">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="grid w-8 h-8 text-sm font-bold text-white shadow-xl rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-600 place-items-center shadow-cyan-500/30">
                          1
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                          Select Allocated Agent
                        </h2>
                      </div>
                      <p className="mt-1 ml-0 text-sm text-gray-600 dark:text-gray-400 sm:ml-11">
                        Choose an agent from your allocated agents. Credits will
                        be used based on the agent&apos;s compute requirements.
                      </p>
                    </div>

                    <div className="flex flex-col w-full gap-2 sm:flex-row sm:gap-3 lg:w-auto">
                      <div className="relative w-full sm:w-56 md:w-64">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400 w-4 h-4" />
                        <input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search agents..."
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                      </div>
                      <select
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        className="w-full sm:w-auto px-3 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      >
                        <option value="">All price ranges</option>
                        {sortOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {filteredAgents.length === 0 ? (
                    <div className="py-16 text-sm text-center text-gray-500 border-2 border-gray-200 border-dashed bg-gray-50/50 dark:bg-gray-700/20 rounded-3xl dark:border-gray-700">
                      <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300 sm:w-16 sm:h-16" />
                      <p className="font-medium">
                        No agents match your search or filter criteria.
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        Try adjusting your search or filter settings
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filteredAgents.map((agent) => {
                        const totalCredits = Number(agent.totalCredit) || 0;
                        const consumed = Number(agent.consumedCredit) || 0;
                        const available = Number(agent.balanceCredit) || 0;
                        const licenseFee = agent.price
                          ? `$${agent.price}`
                          : "$0";
                        const isSelected =
                          selectedAgent === agent.rechargeId;
                        return (
                          <button
                            key={agent.rechargeId}
                            onClick={() =>
                              setSelectedAgent(agent.rechargeId)
                            }
                            className={`w-full text-left rounded-2xl border-2 p-4 sm:p-5 md:p-6 transition-all duration-500 relative overflow-hidden ${
                              isSelected
                                ? "border-blue-500 bg-gradient-to-r from-blue-50/90 to-blue-50/90 dark:from-blue-900/30 dark:to-blue-900/30 shadow-2xl shadow-blue-500/20 scale-[1.01] ring-4 ring-blue-500/10"
                                : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-2xl bg-white/50 dark:bg-gray-800/30 hover:scale-[1.01]"
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-blue-500/5 via-blue-500/5 to-blue-500/5"></div>
                            )}
                            <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-4 lg:gap-6 items-start">
                              {/* Left */}
                              <div className="flex min-w-0 gap-3 sm:gap-4">
                                <div
                                  className={`mt-1 shrink-0 w-6 h-6 rounded-full border-2 grid place-items-center transition-all duration-300 ${
                                    isSelected
                                      ? "border-blue-500 bg-blue-500 shadow-lg shadow-blue-500/30"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {isSelected && (
                                    <CheckCircle className="w-3 h-3 text-white" />
                                  )}
                                </div>

                                <div className="relative grid overflow-hidden shadow-lg shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/30 place-items-center">
                                  {agent.imageUrl ? (
                                    <img
                                      src={agent.imageUrl}
                                      alt={agent.name}
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    <Cpu className="w-6 h-6 text-blue-500" />
                                  )}
                                  {isSelected && (
                                    <div className="absolute inset-0 ring-2 ring-blue-500 rounded-xl"></div>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                    <h3 className="text-sm font-bold text-gray-900 truncate sm:text-base dark:text-white">
                                      {agent.name}
                                    </h3>
                                    {agent.agentType && (
                                      <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-100 to-blue-100 dark:from-blue-800/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 font-medium">
                                        {agent.agentType}
                                      </span>
                                    )}
                                    {isSelected && (
                                      <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-600 text-white shadow-lg shadow-blue-500/30 animate-pulse">
                                        Selected
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-1 text-xs text-gray-600 sm:text-sm dark:text-gray-400 line-clamp-2">
                                    {agent.description}
                                  </p>
                                  <div className="flex items-center gap-3 mt-2 text-xs sm:text-sm">
                                    <span className="text-gray-500">
                                      License Fee :
                                    </span>
                                    <span className="font-bold text-gray-900 dark:text-white">
                                      {licenseFee}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {/* Middle Stats */}
                              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:gap-4 lg:px-4">
                                {[
                                  {
                                    label: "Credits Allocated",
                                    value: totalCredits,
                                    sub: "Credits",
                                    icon: <Coins className="w-3 h-3" />,
                                  },
                                  {
                                    label: "Credits Used",
                                    value: consumed,
                                    sub: "Credits",
                                    icon: <TrendingUp className="w-3 h-3" />,
                                  },
                                  {
                                    label: "Credits Available",
                                    value: available,
                                    sub: "Credits",
                                    icon: <Sparkles className="w-3 h-3" />,
                                  },
                                ].map((stat, i) => (
                                  <div
                                    key={i}
                                    className="min-w-0 p-2 text-center transition-all bg-gray-50/70 dark:bg-gray-700/30 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  >
                                    <div className="flex items-center justify-center gap-1 text-[10px] sm:text-xs text-gray-500">
                                      {stat.icon} {stat.label}
                                    </div>
                                    <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mt-0.5">
                                      {stat.value}
                                    </div>
                                    <div className="text-[8px] sm:text-[10px] text-gray-400">
                                      {stat.sub}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Right */}
                              <div className="flex mt-8 lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-2 lg:gap-3 lg:min-w-[140px]">
                                <span className="text-[10px] sm:text-xs px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-800/50 dark:to-green-800/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50 font-medium whitespace-nowrap flex items-center gap-1.5">
                                  <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex w-full h-full rounded-full animate-ping bg-emerald-400"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                  </span>
                                  Ready to Deploy
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-4 mt-6 text-xs text-gray-500 border shadow-sm sm:text-sm bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl border-amber-200/50 dark:border-amber-800/30">
                    <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <Clock className="w-4 h-4 text-amber-500" />
                    </div>
                    <span className="leading-relaxed">
                      Credits will be deducted only when the agent is deployed
                      and actively running.
                    </span>
                  </div>
                </>
              )}

              {/* Step 1: Partner */}
              {step === 1 && (
                <>
                  <div className="mb-6 md:mb-7">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="grid w-8 h-8 text-sm font-bold text-white shadow-xl rounded-2xl bg-gradient-to-r from-blue-600 to-blue-600 place-items-center shadow-blue-500/30">
                        2
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                        Choose Infrastructure Partner
                      </h2>
                    </div>
                    <p className="mt-1 ml-0 text-sm text-gray-600 dark:text-gray-400 sm:ml-11">
                      Select partner for deployment &amp; maintenance
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {partners?.map((partner) => (
                      <button
                        key={partner.PartnerId}
                        onClick={() =>
                          setSelectedPartner(partner.PartnerId)
                        }
                        className={`text-left rounded-2xl p-4 sm:p-5 border-2 transition-all duration-500 relative overflow-hidden ${
                          selectedPartner === partner.PartnerId
                            ? "border-blue-500 bg-gradient-to-r from-blue-50/90 to-blue-50/90 dark:from-blue-900/30 dark:to-blue-900/30 shadow-2xl shadow-blue-500/20 ring-4 ring-blue-500/10 scale-[1.02]"
                            : "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/30 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-2xl hover:scale-[1.01]"
                        }`}
                      >
                        {selectedPartner === partner.PartnerId && (
                          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-blue-500/5 via-blue-500/5 to-fuchsia-500/5"></div>
                        )}
                        <div className="relative">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              {partner.PartnerImageURL ? (
                                <img
                                  src={partner.PartnerImageURL}
                                  alt={partner.Name}
                                  className="object-cover border border-gray-200 w-9 h-9 rounded-xl shrink-0 dark:border-gray-700"
                                  onError={(e) =>
                                    ((
                                      e.target as HTMLImageElement
                                    ).style.display = "none")
                                  }
                                />
                              ) : (
                                <Cloud className="w-8 h-8 text-gray-500 shrink-0" />
                              )}
                              <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                {partner.CategoryName || "AI Platform"}
                              </span>
                            </div>
                            <span
                              className={`text-[10px] sm:text-xs px-3 py-1 rounded-full font-bold whitespace-nowrap shrink-0 ${
                                partner.RiskLevel === "Low"
                                  ? "bg-emerald-100 dark:bg-emerald-800/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50"
                                  : partner.RiskLevel === "High"
                                  ? "bg-red-100 dark:bg-red-800/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700/50"
                                  : "bg-amber-100 dark:bg-amber-800/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50"
                              }`}
                            >
                              Risk: {partner.RiskLevel || "Medium"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 mb-2">
                            <h3 className="text-sm font-bold text-gray-900 truncate sm:text-base dark:text-white">
                              {partner.Name}
                            </h3>
                            <span className="flex items-center gap-0.5 text-xs text-yellow-500 whitespace-nowrap shrink-0">
                              {renderRating(partner.Rating || 0)}{" "}
                              {partner.Rating?.toFixed(1) || "0"}
                            </span>
                          </div>

                          <p className="mb-3 text-xs leading-relaxed text-gray-600 sm:text-sm dark:text-gray-400 line-clamp-2">
                            {partner.Description || "No description available"}
                          </p>

                          <div className="grid grid-cols-3 gap-2 mb-3">
                            {[
                              {
                                label: "APY",
                                value: partner.APYText || "0.0%",
                                color:
                                  "text-emerald-600 dark:text-emerald-400",
                              },
                              {
                                label: "Performance",
                                value: partner.PerformanceText || "0.0%",
                                color: "text-blue-600 dark:text-blue-400",
                              },
                              {
                                label: "Demand",
                                value: partner.DemandText || "0.0%",
                                color: "text-blue-600 dark:text-blue-400",
                              },
                            ].map((s, i) => (
                              <div
                                key={i}
                                className="p-2 text-center transition-colors bg-gray-50/70 dark:bg-gray-700/30 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              >
                                <p className="text-[9px] sm:text-[10px] text-gray-500">
                                  {s.label}
                                </p>
                                <p
                                  className={`text-xs sm:text-sm font-bold ${s.color}`}
                                >
                                  {s.value}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between gap-2 text-[10px] sm:text-xs text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span className="flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5" />{" "}
                              {partner.DeploymentsText || "0"} deployments
                            </span>
                            {partner.MarketplaceUrl && (
                              <a
                                href={partner.MarketplaceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-blue-600 dark:text-blue-400 hover:underline font-medium whitespace-nowrap shrink-0 flex items-center gap-1 hover:gap-1.5 transition-all"
                              >
                                Marketplace{" "}
                                <ChevronRight className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Step 2: Deploy */}
              {step === 2 &&
                (() => {
                  const partner = getSelectedPartnerDetails();
                  const computeCredits =
                    Number(selectedAgentData?.totalCredit) || 0;
                  const apr =
                    "APYText" in partner ? partner.APYText : "0%";
                  const revenueShare = 90;

                  return (
                    <>
                      <h2 className="text-lg font-semibold sm:text-xl">
                        Activate Your AI Agent
                      </h2>
                      <p className="mt-1 mb-5 text-sm text-gray-600 dark:text-gray-400">
                        Review your deployment summary, verify your compute
                        capacity, accept the deployment agreement, and activate
                        your AI agent.
                      </p>

                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 sm:gap-6">
                        {/* LEFT COLUMN */}
                        <div className="space-y-5">
                          {/* Deployment Summary */}
                          <div>
                            <h3 className="text-[11px] sm:text-xs font-semibold tracking-widest text-gray-500 mb-2">
                              DEPLOYMENT SUMMARY
                            </h3>
                            <div className="p-4 border divide-y rounded-xl border-amber-200 bg-amber-50/60 dark:border-amber-500/20 dark:bg-amber-500/5 sm:p-5 divide-amber-200/60 dark:divide-amber-500/10">
                              {[
                                {
                                  label: "AI Agent",
                                  value: selectedAgentData?.name || "—",
                                },
                                {
                                  label: "Compute Credits",
                                  value: `${computeCredits.toLocaleString()} credits`,
                                },
                                {
                                  label: "Infrastructure Partner",
                                  value: partner?.Name || "—",
                                },
                                {
                                  label: "Estimated APR",
                                  value: apr,
                                  valueClass:
                                    "text-green-600 dark:text-green-400",
                                },
                                {
                                  label: "Revenue Share",
                                  value: `${revenueShare}% to you · ${
                                    100 - revenueShare
                                  }% platform`,
                                  valueClass:
                                    "text-green-600 dark:text-green-400",
                                },
                                {
                                  label: "Status",
                                  value: "Ready to Activate",
                                  valueClass:
                                    "text-amber-600 dark:text-amber-400",
                                },
                              ].map((row, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                                >
                                  <span className="min-w-0 text-xs text-gray-600 truncate sm:text-sm dark:text-gray-400">
                                    {row.label}
                                  </span>
                                  <span
                                    className={`text-xs sm:text-sm font-semibold text-right min-w-0 truncate ${
                                      row.valueClass || ""
                                    }`}
                                  >
                                    {row.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Compute Resources (replaces Monthly Revenue Preview) */}
                          <div className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                              Compute Resources
                            </h3>

                            <div className="grid grid-cols-2 gap-3">
                              {[
                                {
                                  icon: <MdMemory className="w-4 h-4" />,
                                  label: "CPU Processing",
                                  desc: "Multi-threaded",
                                },
                                {
                                  icon: <FaMicrochip className="w-4 h-4" />,
                                  label: "GPU Acceleration",
                                  desc: "High-performance",
                                },
                                {
                                  icon: <MdRefresh className="w-4 h-4" />,
                                  label: "Agent Memory",
                                  desc: "Persistent storage",
                                },
                                {
                                  icon: <Clock className="w-4 h-4" />,
                                  label: "Runtime",
                                  desc: "24/7 operation",
                                },
                                {
                                  icon: (
                                    <BsLightningCharge className="w-4 h-4" />
                                  ),
                                  label: "AI Engine",
                                  desc: "Real-time",
                                },
                                {
                                  icon: <MdCloudQueue className="w-4 h-4" />,
                                  label: "Usage Monitoring",
                                  desc: "Track insights",
                                },
                              ].map((item, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                                >
                                  <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                                    {item.icon}
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                                      {item.label}
                                    </p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                      {item.desc}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* RIGHT COLUMN — Deployment Contract */}
                        <div>
                          <h3 className="text-[11px] sm:text-xs font-semibold tracking-widest text-gray-500 mb-2">
                            DEPLOYMENT CONTRACT
                          </h3>
                          <div className="p-4 bg-white border border-gray-200 rounded-xl dark:border-white/10 dark:bg-white/5 sm:p-5">
                            <div className="pr-2 mb-4 overflow-y-auto text-xs text-gray-600 max-h-40 sm:max-h-48 sm:text-sm dark:text-gray-400">
                              <p className="mb-2 font-semibold text-gray-800 dark:text-gray-200">
                                QUZO AI DEPLOYMENT AGREEMENT
                              </p>

                              <p className="mb-3">
                                This Deployment Agreement (&quot;Agreement&quot;)
                                is entered into between QUZO AI Marketplace Pte.
                                Ltd. (&quot;Platform&quot;) and the deploying
                                user (&quot;Agent Owner&quot;) identified by
                                their registered User ID.
                              </p>

                              <p className="mb-1 font-semibold text-gray-800 dark:text-gray-200">
                                1. Agent Deployment Authorization
                              </p>
                              <p className="mb-3">
                                The Agent Owner authorizes the Platform to
                                deploy their licensed AI agent{" "}
                                <strong>({selectedAgentData?.name})</strong> via
                                the selected infrastructure partner{" "}
                                <strong>({partner?.Name})</strong>. The agent
                                will operate on a 24/7 basis and be listed
                                actively in the QUZO marketplace for business
                                client access.
                              </p>

                              <p className="mb-1 font-semibold text-gray-800 dark:text-gray-200">
                                2. Revenue Sharing Terms
                              </p>
                              <p className="mb-3">
                                Gross utilization revenue generated by the
                                deployed agent shall be distributed as follows:
                                <strong> 90% to the Agent Owner</strong> and
                                <strong>
                                  {" "}
                                  10% as Platform Operations Fee
                                </strong>
                                . Revenue distributions are processed on a
                                rolling 30-day cycle to the Agent Owner&apos;s
                                QUZO wallet.
                              </p>

                              <p className="mb-1 font-semibold text-gray-800 dark:text-gray-200">
                                3. Compute Credits &amp; Resource Usage
                              </p>
                              <p className="mb-3">
                                Deployed agents consume compute credits in
                                real-time based on actual usage. The Agent Owner
                                will receive low-credit alerts when the balance
                                falls below 10%. Insufficient credits will
                                result in agent suspension until topped up.
                              </p>

                              <p className="mb-1 font-semibold text-gray-800 dark:text-gray-200">
                                4. Infrastructure Partner SLA
                              </p>
                              <p className="mb-3">
                                The Platform facilitates deployment via the
                                selected infrastructure partner{" "}
                                <strong>({partner?.Name})</strong> but does not
                                guarantee uptime beyond each partner&apos;s
                                published SLA. Estimated APR figures are
                                projections based on historical marketplace
                                performance and are not guaranteed returns.
                              </p>

                              <p className="mb-1 font-semibold text-gray-800 dark:text-gray-200">
                                5. Termination
                              </p>
                              <p>
                                The Agent Owner may terminate deployment at any
                                time from the dashboard. Upon termination,
                                remaining compute credits are retained in the
                                account for future deployment. No refunds are
                                provided for used credits or license fees.
                              </p>
                            </div>

                            <div className="space-y-2.5 mb-4">
                              {[
                                "I have read and agree to the QUZO Deployment Agreement",
                                "I understand that estimated APR is a projection, not a guaranteed return",
                                "I confirm I have sufficient compute credits for deployment",
                              ].map((text, i) => (
                                <label
                                  key={i}
                                  className="flex items-start gap-2 text-xs cursor-pointer sm:text-sm"
                                >
                                  <input
                                    type="checkbox"
                                    checked={contractAgreed[i]}
                                    onChange={(e) => {
                                      const next = [...contractAgreed];
                                      next[i] = e.target.checked;
                                      setContractAgreed(next);
                                    }}
                                    className="mt-0.5 w-4 h-4 rounded border-gray-300 shrink-0"
                                  />
                                  <span className="text-gray-700 dark:text-gray-300">
                                    {text}
                                  </span>
                                </label>
                              ))}
                            </div>

                            <button
                              onClick={handleDeploy}
                              disabled={!contractAgreed.every(Boolean)}
                              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#235ae3]  text-white  transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              🔗 Activate Deployment
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}

              {/* Navigation Buttons */}
              <div className="flex flex-col-reverse items-stretch justify-between gap-3 mt-2 sm:mt-10 sm:flex-row sm:items-center ">
                <button
                  onClick={handleBack}
                  disabled={step === 0}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold transition-all border-2 border-gray-200 sm:px-6 rounded-xl dark:border-gray-700 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                {step < steps.length - 1 && (
                  <button
                    onClick={handleNext}
                    disabled={
                      (step === 0 && !selectedAgent) ||
                      (step === 1 && !selectedPartner)
                    }
                    className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 via-blue-600 to-blue-600 hover:from-blue-700 hover:via-blue-700 hover:to-blue-700 text-white shadow-2xl shadow-blue-500/25 hover:shadow-3xl hover:shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                  >
                    <span className="absolute inset-0 w-full h-full transition-transform duration-1000 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full"></span>
                    Next: {steps[step + 1]?.name ?? ""}{" "}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}