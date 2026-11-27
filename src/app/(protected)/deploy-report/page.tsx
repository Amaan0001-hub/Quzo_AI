"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  UserX,
  Download,
  Eye,
  Calendar,
  Tag,
  CreditCard,
  Zap,
  Coins,
  FileText,
  Layers,
  BarChart3,
  Star,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  orderHistoryService,
  type AgentLicenseHistoryItem,
} from "@/services/order-history.service";

/* ---------- Types ---------- */

interface DeploymentAgent extends AgentLicenseHistoryItem {
  DeploymentId?: string | number;
  statusCode?: number;
  Task?: number | string;
  Rkprice?: number | string;
}

interface DeployData {
  incomeTransTypes: DeploymentAgent[];
}

interface StatusBadge {
  icon: React.ReactNode;
  text: string;
  bg: string;
  textColor: string;
  border: string;
}

/* ---------- API fetcher ---------- */
async function fetchDeploymentHistoryUser(): Promise<DeployData> {
  const rows = await orderHistoryService.getAgentLicenseHistory();
  return { incomeTransTypes: rows as DeploymentAgent[] };
}

/* ---------- Main Component ---------- */

export default function MyADeployments() {
  const router = useRouter();
  const pathname = usePathname();

  // --- Local state replacing Redux ---
  const [deployData, setDeployData] = useState<DeployData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [generatingPDFs, setGeneratingPDFs] = useState<
    Record<string, boolean>
  >({});
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const invoiceRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDeploymentHistoryUser();
        if (!cancelled) setDeployData(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load deployments.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    setCustomerName("");
    setCustomerEmail("");

    return () => {
      cancelled = true;
    };
  }, []);

  const handleContract = (agent: DeploymentAgent): void => {
    const id = agent.DeploymentId ?? agent.PartnerId;
    router.push(`/my-agents/agreement?id=${id ?? ""}`);
  };

  const getStatusBadge = (statusCode: number): StatusBadge => {
    switch (statusCode) {
      case 1:
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          text: "Available",
          bg: "bg-emerald-500/10",
          textColor: "text-emerald-600",
          border: "border-emerald-500/20",
        };
      case 0:
        return {
          icon: <XCircle className="w-4 h-4" />,
          text: "Unavailable",
          bg: "bg-rose-500/10",
          textColor: "text-rose-600",
          border: "border-rose-500/20",
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          text: "Pending",
          bg: "bg-amber-500/10",
          textColor: "text-amber-600",
          border: "border-amber-500/20",
        };
    }
  };

  const downloadInvoice = async (
    agent: DeploymentAgent,
    uniqueKey: string
  ): Promise<void> => {
    if (generatingPDFs[uniqueKey]) return;

    setGeneratingPDFs((prev) => ({ ...prev, [uniqueKey]: true }));

    try {
      const node = invoiceRefs.current[uniqueKey];
      if (!node) return;

      const clonedNode = node.cloneNode(true) as HTMLElement;
      clonedNode.style.display = "block";
      clonedNode.style.position = "absolute";
      clonedNode.style.left = "-9999px";
      document.body.appendChild(clonedNode);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(clonedNode, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      document.body.removeChild(clonedNode);
      if (!canvas) {
        throw new Error("Canvas generation failed");
      }

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Aspect-ratio-safe sizing — content height A4 se zyada bhi ho sakta hai
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      } else {
        // Content taller than one A4 page — split across multiple pages
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }

      pdf.save(`invoice-${uniqueKey}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      const pdf = new jsPDF();
      pdf.setFontSize(16);
      pdf.text("Invoice", 105, 15, { align: "center" });
      pdf.setFontSize(12);
      pdf.text(`Order ID: ${uniqueKey}`, 20, 30);
      pdf.text(`Product: ${agent.agentName}`, 20, 40);
      pdf.text(`Total: $${agent.Amount ?? agent.Rkprice}`, 20, 50);
      pdf.text(`Customer: ${customerName}`, 20, 60);
      pdf.text(`Email: ${customerEmail}`, 20, 70);
      pdf.save(`invoice-${uniqueKey}.pdf`);
    } finally {
      setGeneratingPDFs((prev) => ({ ...prev, [uniqueKey]: false }));
    }
  };

  const getRecordId = (agent: DeploymentAgent, index: number): string => {
    return `${agent.DeploymentId ?? agent.PartnerId ?? index}`;
  };

  const getPaymentBadge = (paymentMode?: string): React.ReactNode => {
    if (paymentMode?.toLowerCase() === "unpaid") {
      return (
        <span className="px-3 py-1 text-xs font-bold text-red-600 border border-red-300 rounded-full bg-red-500/10">
          Unpaid
        </span>
      );
    }
    return null;
  };

  return (
    <>
      <div className="relative w-full min-h-screen px-3 pb-10 space-y-6 overflow-hidden sm:px-4 md:px-6 lg:px-8 md:space-y-8 ">
        {/* Decorative Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute rounded-full -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-400/10 blur-3xl animate-float"></div>
          <div
            className="absolute rounded-full -bottom-40 -left-40 w-96 h-96 bg-blue-400/20 dark:bg-blue-400/10 blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-400/10 dark:bg-violet-400/5 rounded-full blur-3xl"></div>
        </div>

        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pulseGlow { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
          @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
          .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
          .animate-slideUp { animation: slideUp 0.4s ease-out; }
          .animate-pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }
          .animate-float { animation: float 3s ease-in-out infinite; }
          .animate-shimmer { background-size: 200% 100%; animation: shimmer 3s ease-in-out infinite; }
          .velvora-gradient { background: linear-gradient(135deg, #2196F3, #3F51B5, #3F51B5); }
          .velvora-gradient-text { background: linear-gradient(135deg, #2196F3, #3F51B5, #3F51B5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
          .glass-effect { background: rgba(255,255,255,0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
          .dark .glass-effect { background: rgba(17,24,39,0.7); }
          .gradient-border { position: relative; }
          .gradient-border::before { content: ''; position: absolute; inset: -2px; border-radius: inherit; padding: 2px; background: linear-gradient(135deg, #2196F3, #3F51B5, #3F51B5); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }
          .card-hover { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
          .card-hover:hover { transform: translateY(-4px) scale(1.002); box-shadow: 0 20px 60px rgba(99, 102, 241, 0.15); }
        `}</style>

        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading deployments...
            </p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="p-6 text-sm text-rose-600 bg-rose-50 rounded-2xl dark:bg-rose-900/30 dark:text-rose-300">
              {error}
            </div>
          </div>
        ) : !deployData?.incomeTransTypes ||
          deployData.incomeTransTypes.length === 0 ? (
          <div className="flex items-center justify-center h-[60vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center p-10 text-center border border-gray-200 shadow-xl glass-effect dark:border-white rounded-2xl gradient-border"
            >
              <div className="p-4 mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/30">
                <UserX className="w-12 h-12 text-blue-500 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                No Deployments Found
              </h2>
              <p className="mt-2 text-xs font-bold text-gray-800 dark:text-gray-200">
                Try adjusting your filters or search criteria.
              </p>
            </motion.div>
          </div>
        ) : (
          deployData.incomeTransTypes.map((agent, index) => {
            const recordId = getRecordId(agent, index);
            const statusCode =
              agent.statusCode ?? (agent.Active === true ? 1 : 0);
            const status = getStatusBadge(statusCode);
            const orderId = recordId;
            const isGenerating = generatingPDFs[recordId];

            return (
              <motion.div
                key={`${recordId}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="relative overflow-hidden transition-all duration-500 border shadow-xl bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 rounded-3xl gradient-border card-hover glass-effect"
              >
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 transition-opacity duration-700 opacity-0 pointer-events-none group-hover:opacity-100">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-blue-500/5 to-violet-500/5"></div>
                </div>

                <div className="relative flex flex-col h-full md:flex-row">
                  {/* Image Section */}
                  <div className="relative w-full h-56 overflow-hidden md:w-1/3 lg:w-2/5 md:h-auto">
                    <img
                      src={agent.agentImage || "/default-agent.png"}
                      alt={agent.agentName}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    {agent.Paymentmode?.toLowerCase() === "unpaid" && (
                      <div className="absolute z-10 top-4 right-4">
                        <span className="px-3 py-1 text-xs font-bold text-red-600 border border-red-300 rounded-full shadow-lg bg-red-100/90 backdrop-blur-sm">
                          UNPAID
                        </span>
                      </div>
                    )}
                    {/* Status badge on image */}
                    <div className="absolute z-10 bottom-4 left-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${status.bg} ${status.textColor} border ${status.border}`}
                      >
                        {status.icon}
                        {status.text}
                      </span>
                    </div>
                  </div>

                  {/* Content on Right */}
                  <div className="flex flex-col w-full p-5 sm:p-6 md:p-7 lg:p-8 md:w-2/3 lg:w-3/5">
                    {/* Title and Description */}
                    <div className="mb-5 md:mb-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1 sm:gap-3">
                            {getPaymentBadge(agent.Paymentmode)}
                            <h3 className="text-xl font-extrabold text-gray-800 sm:text-2xl md:text-3xl dark:text-white">
                              {agent.agentName}
                            </h3>
                          </div>
                          <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                            {agent.description}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row shrink-0">
                          {agent.Paymentmode?.toLowerCase() === "unpaid" && (
                            <button
                              onClick={() => handleContract(agent)}
                              className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-violet-600 hover:from-blue-700 hover:via-blue-700 hover:to-violet-700 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                            >
                              <span className="absolute inset-0 w-full h-full transition-transform duration-1000 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full"></span>
                              <Eye className="w-4 h-4" />
                              Contract
                            </button>
                          )}

                          <button
                            onClick={() =>
                              downloadInvoice(agent, recordId)
                            }
                            disabled={isGenerating}
                            className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                          >
                            <span className="absolute inset-0 w-full h-full transition-transform duration-1000 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full"></span>
                            {isGenerating ? (
                              <span className="flex items-center gap-2">
                                <svg
                                  className="w-4 h-4 animate-spin"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                Generating...
                              </span>
                            ) : (
                              <>
                                <Download className="w-4 h-4" />
                                Invoice
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-3 mb-5 sm:grid-cols-3 sm:gap-4 md:mb-6">
                      <div className="group p-4 transition-all duration-300 rounded-2xl shadow-sm bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 hover:shadow-lg hover:scale-[1.02] border border-blue-100/50 dark:border-blue-800/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 transition-all rounded-full bg-blue-400/10 blur-2xl group-hover:bg-blue-400/20"></div>
                        <div className="relative">
                          <div className="flex items-center gap-2 text-xs text-blue-600 sm:text-sm dark:text-blue-400">
                            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <Coins className="w-3.5 h-3.5" />
                            </div>
                            Deploy Amount
                          </div>
                          <div className="pl-8 mt-1 text-xl font-bold text-blue-700 sm:text-2xl dark:text-blue-300">
                            ${agent.Amount?.toLocaleString() || ""}
                          </div>
                        </div>
                      </div>

                      <div className="group p-4 transition-all duration-300 rounded-2xl shadow-sm bg-gradient-to-br from-emerald-50/80 to-green-50/80 dark:from-emerald-900/20 dark:to-green-900/20 hover:shadow-lg hover:scale-[1.02] border border-emerald-100/50 dark:border-emerald-800/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 transition-all rounded-full bg-emerald-400/10 blur-2xl group-hover:bg-emerald-400/20"></div>
                        <div className="relative">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                              <Tag className="w-3.5 h-3.5" />
                            </div>
                            Credit Consumed
                          </div>
                          <div className="pl-8 mt-1 text-xl font-bold sm:text-2xl text-emerald-700 dark:text-emerald-300">
                            {agent.ConsumedCredit?.toLocaleString() || "0"}
                          </div>
                        </div>
                      </div>

                      <div className="group p-4 transition-all duration-300 rounded-2xl shadow-sm bg-gradient-to-br from-blue-50/80 to-violet-50/80 dark:from-blue-900/20 dark:to-violet-900/20 hover:shadow-lg hover:scale-[1.02] border border-blue-100/50 dark:border-blue-800/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 transition-all rounded-full bg-blue-400/10 blur-2xl group-hover:bg-blue-400/20"></div>
                        <div className="relative">
                          <div className="flex items-center gap-2 text-xs text-blue-600 sm:text-sm dark:text-blue-400">
                            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <CreditCard className="w-3.5 h-3.5" />
                            </div>
                            Payment Mode
                          </div>
                          <div className="pl-8 mt-1 text-xl font-bold text-blue-700 sm:text-2xl dark:text-blue-300">
                            {agent.Paymentmode || "—"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Information */}
                    <div className="relative p-4 border sm:p-5 bg-gray-50/80 dark:bg-gray-700/30 rounded-2xl border-gray-200/50 dark:border-gray-600/50">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                        {/* Left Section */}
                        <div className="space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between px-3 py-2 transition-all rounded-xl hover:bg-white/60 dark:hover:bg-gray-600/20 group">
                            <span className="flex items-center gap-2 text-xs text-teal-600 sm:text-sm dark:text-teal-400">
                              <div className="p-1 transition-transform bg-teal-100 rounded-lg dark:bg-teal-900/30 group-hover:scale-110">
                                <Calendar className="w-3.5 h-3.5" />
                              </div>
                              Date:
                            </span>
                            <span className="text-xs font-semibold text-teal-800 sm:text-sm dark:text-teal-200">
                              {agent.DDate || "0"}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center justify-between px-3 py-2 transition-all rounded-xl hover:bg-white/60 dark:hover:bg-gray-600/20 group">
                            <span className="flex items-center gap-2 text-xs text-blue-600 sm:text-sm dark:text-blue-400">
                              <div className="p-1 transition-transform bg-blue-100 rounded-lg dark:bg-blue-900/30 group-hover:scale-110">
                                <Layers className="w-3.5 h-3.5" />
                              </div>
                              Status:
                            </span>
                            <span className="text-xs font-semibold text-blue-800 sm:text-sm dark:text-blue-200">
                              {statusCode === 1 ? "Active" : "Inactive"}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center justify-between px-3 py-2 transition-all rounded-xl hover:bg-white/60 dark:hover:bg-gray-600/20 group">
                            <span className="flex items-center gap-2 text-xs text-orange-600 sm:text-sm dark:text-orange-400">
                              <div className="p-1 transition-transform bg-orange-100 rounded-lg dark:bg-orange-900/30 group-hover:scale-110">
                                <FileText className="w-3.5 h-3.5" />
                              </div>
                              Remark:
                            </span>
                            <span className="text-xs font-semibold text-orange-800 sm:text-sm dark:text-orange-200">
                              {agent.Remark || "0"}
                            </span>
                          </div>
                        </div>

                        {/* Right Section */}
                        <div className="space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between px-3 py-2 transition-all rounded-xl hover:bg-white/60 dark:hover:bg-gray-600/20 group">
                            <span className="flex items-center gap-2 text-xs text-blue-600 sm:text-sm dark:text-blue-400">
                              <div className="p-1 transition-transform bg-blue-100 rounded-lg dark:bg-blue-900/30 group-hover:scale-110">
                                <Zap className="w-3.5 h-3.5" />
                              </div>
                              MarketPlace
                            </span>
                            <span className="text-xs font-semibold text-blue-800 sm:text-sm dark:text-blue-200">
                              {agent.PartnerName || ""}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center justify-between px-3 py-2 transition-all rounded-xl hover:bg-white/60 dark:hover:bg-gray-600/20 group">
                            <span className="flex items-center gap-2 text-xs sm:text-sm text-rose-600 dark:text-rose-400">
                              <div className="p-1 transition-transform rounded-lg bg-rose-100 dark:bg-rose-900/30 group-hover:scale-110">
                                <BarChart3 className="w-3.5 h-3.5" />
                              </div>
                              Partner Category
                            </span>
                            <span className="text-xs sm:text-sm font-semibold text-rose-800 dark:text-rose-200 truncate max-w-[120px] sm:max-w-[150px]">
                              {agent.PartnerCategoryName || ""}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center justify-between px-3 py-2 transition-all rounded-xl hover:bg-white/60 dark:hover:bg-gray-600/20 group">
                            <span className="flex items-center gap-2 text-xs text-pink-600 sm:text-sm dark:text-pink-400">
                              <div className="p-1 transition-transform bg-pink-100 rounded-lg dark:bg-pink-900/30 group-hover:scale-110">
                                <Star className="w-3.5 h-3.5" />
                              </div>
                              Rating:
                            </span>
                            <span className="flex items-center gap-1 text-xs font-semibold text-pink-800 sm:text-sm dark:text-pink-200">
                              ⭐ {agent.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hidden invoice template for PDF generation */}
                <div
                  ref={(el) => {
                    invoiceRefs.current[recordId] = el;
                  }}
                  className="hidden"
                >
                  <div className="relative mx-auto bg-white text-gray-900 shadow-md rounded-md p-6 w-[794px] min-h-[1123px]">
                    {agent.Paymentmode?.toLowerCase() === "unpaid" && (
                      <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
                        <div
                          className="absolute top-6 bottom-2 right-[-42px] pb-3 rotate-45 bg-red-600 text-white text-xs font-bold
                                     h-6 w-[160px] flex items-center justify-center shadow-lg"
                        >
                          UNPAID
                        </div>
                      </div>
                    )}
                    {/* Logo */}
                    <div className="flex justify-center mb-4">
                      <img
                        src="/VelvoraLogo.png"
                        alt="Logo"
                        className="h-12"
                        crossOrigin="anonymous"
                      />
                    </div>

                    {/* Header */}
                    <div className="flex items-start justify-between pb-2 mb-4 border-b">
                      <div>
                        <h1 className="text-xl font-bold">Invoice</h1>
                        <p className="text-sm text-gray-600">
                          Recharge ID: {orderId}
                        </p>
                      </div>
                      <div className="text-right">
                        <h2 className="text-base font-semibold">
                          AI Agent Deployed
                        </h2>
                        <p className="text-sm text-gray-600">
                          Invoice Date: {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="flex justify-between mb-4 text-sm">
                      <div>
                        <p className="font-semibold">Billed To:</p>
                        <p>{customerName}</p>
                        <p>{customerEmail}</p>
                      </div>
                      <div className="text-right">
                        <p>Transaction Date:</p>
                        <p>{new Date().toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Product */}
                    <div className="flex items-center p-3 text-sm border rounded bg-gray-50">
                      {agent.agentImage && (
                        <img
                          src={agent.agentImage}
                          alt={agent.agentName}
                          className="object-cover w-12 h-12 mr-3 rounded"
                          crossOrigin="anonymous"
                          onError={(e) =>
                            ((e.target as HTMLImageElement).style.display =
                              "none")
                          }
                        />
                      )}
                      <div>
                        <p className="font-bold ">{agent.agentName}</p>
                        <p className="text-gray-600">AI Agent Subscription</p>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="p-3 mb-4 text-sm border rounded bg-gray-50">
                      <h3 className="mb-1 font-semibold">Order Details:</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>${agent.Amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>$0</span>
                        </div>
                        <div className="pt-2 mt-4 border-gray-300">
                          <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span>${agent.Amount}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="p-3 mb-4 text-sm border rounded bg-gray-50">
                      <h3 className="mb-1 font-semibold">
                        Features Included:
                      </h3>
                      <ul className="pl-4 text-gray-700 list-disc">
                        <li>24/7 Availability</li>
                        <li>{agent.Task || "0"} tasks/hour limit</li>
                        <li>Email support</li>
                        <li>Performance analytics</li>
                      </ul>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 text-xs text-center text-gray-500 border-t">
                      <p>Thank you for your business!</p>
                      <p>
                        For questions contact{" "}
                        <span className="font-medium">
                          support@quzo.network
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </>
  );
}