"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  CalendarCheck,
  Database,
  Rocket,
  DollarSign,
  Code2,
  Brain,
  Plane,
  BarChart3,
  Bot,
  MessageCircle,
  Shield,
  Star,
  MoreVertical,
  Info,
  LucideIcon,
} from "lucide-react";
import { PageLoader } from "@/components/common/PageLoader";
import { useAgentLicenseHistory } from "@/features/order-history/hooks/useOrderHistory";
import type { AgentLicenseHistoryItem } from "@/services/order-history.service";

/* ---------- Types ---------- */

interface Stats {
  total: number;
  active: number;
  deployed: number;
  partners: number;
  spent: number;
}

type StatusType = "active" | "inactive" | "deployed" | "notDeployed" | "none";

interface StatCardProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number | string;
  sub: string;
  valueColor?: string;
}

interface StatusPillProps {
  type: StatusType;
  label: string;
}

/* ---------- Helpers ---------- */

const categoryStyles: Record<string, string> = {
  "AI Automation":
    "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50",
  "Business Intelligence AI":
    "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 border border-orange-200 dark:border-orange-700/50",
  "Video Creation AI":
    "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50",
  "Content Writing AI":
    "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50",
};

const fallbackCategoryStyle =
  "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/50";

const agentIcons: LucideIcon[] = [
  Code2,
  Brain,
  Plane,
  BarChart3,
  Bot,
  MessageCircle,
  Shield,
];

const agentIconBg: string[] = [
  "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300",
  "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300",
  "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-300",
  "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300",
  "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300",
  "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300",
  "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300",
];

const fallbackIconBg =
  "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300";

/* ---------- Sub Components ---------- */

const StatCard = ({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  sub,
  valueColor,
}: StatCardProps) => (
  <div className="flex items-center gap-4 p-5 transition-colors bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-2xl dark:border-gray-700">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}
    >
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p
        className={`text-2xl font-bold ${
          valueColor || "text-gray-900 dark:text-white"
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>
    </div>
  </div>
);

const StatusPill = ({ type, label }: StatusPillProps) => {
  const map: Record<StatusType, string> = {
    active:
      "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300",
    inactive:
      "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300",
    deployed:
      "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300",
    notDeployed:
      "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300",
    none: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
  };
  const dot: Record<StatusType, string> = {
    active: "bg-emerald-500",
    inactive: "bg-rose-500",
    deployed: "bg-emerald-500",
    notDeployed: "bg-rose-500",
    none: "bg-gray-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${map[type]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot[type]}`} />
      {label}
    </span>
  );
};

/* ---------- Main Component ---------- */

export function LicensePurchaseHistory() {
  const { data: rows = [], isLoading, isError } = useAgentLicenseHistory();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const paginatedRows = useMemo<AgentLicenseHistoryItem[]>(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [rows, currentPage]);

  const stats = useMemo<Stats>(() => {
    const total = rows.length;
    const active = rows.filter((r) => r.Active === true).length;
    const deployed = rows.filter((r) => r.AgCrDepStatus === true).length;
    const partners = new Set(rows.map((r) => r.PartnerName)).size;
    const spent = rows.reduce((sum, r) => sum + Number(r.Amount || 0), 0);
    return { total, active, deployed, partners, spent };
  }, [rows]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <PageLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-sm text-rose-600 bg-rose-50 rounded-2xl dark:bg-rose-900/30 dark:text-rose-300">
        Failed to load license history.
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6 md:p-8 transition-colors">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
          License Purchase History
        </h1>
        <p className="max-w-3xl mt-2 text-gray-500 dark:text-gray-400">
          All agent license purchases on your QUZO account, including agent,
          partner, amount and deployment status.
        </p>
        <div className="w-16 h-1 mt-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          icon={ClipboardCheck}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-300"
          label="Total Licenses"
          value={stats.total}
          sub="All Time"
        />
        <StatCard
          icon={CalendarCheck}
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
          iconColor="text-emerald-600 dark:text-emerald-300"
          label="Active Licenses"
          value={stats.active}
          sub="Currently Active"
        />
        <StatCard
          icon={Rocket}
          iconBg="bg-orange-100 dark:bg-orange-900/30"
          iconColor="text-orange-600 dark:text-orange-300"
          label="Deployed Agents"
          value={stats.deployed}
          sub="Total Deployed"
        />
        <StatCard
          icon={Database}
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-300"
          label="Partners"
          value={stats.partners}
          sub="Unique Partners"
          valueColor="text-purple-600 dark:text-purple-300"
        />
        <StatCard
          icon={DollarSign}
          iconBg="bg-pink-100 dark:bg-pink-900/30"
          iconColor="text-pink-600 dark:text-pink-300"
          label="Total Amount"
          value={`$${stats.spent.toLocaleString()}`}
          sub="All Amount"
          valueColor="text-rose-500 dark:text-rose-400"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden transition-colors bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-2xl dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs tracking-wider text-gray-500 uppercase dark:text-gray-400">
                <th className="px-6 py-4 font-semibold text-left">Date</th>
                <th className="px-4 py-4 font-semibold text-left">Agent</th>
                <th className="px-4 py-4 font-semibold text-left whitespace-nowrap">
                  Category
                </th>
                <th className="px-4 py-4 font-semibold text-left">Partner</th>
                <th className="px-4 py-4 font-semibold text-left">Amount</th>
                <th className="px-4 py-4 font-semibold text-left whitespace-nowrap">
                  APY
                </th>
                <th className="px-4 py-4 font-semibold text-left whitespace-nowrap">
                  Credit Used
                </th>
                <th className="px-4 py-4 font-semibold text-left">Status</th>
                <th className="px-4 py-4 font-semibold text-left whitespace-nowrap">
                  Deployment
                </th>
                <th className="px-4 py-4 font-semibold text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-16 text-center font-medium text-gray-500 dark:text-gray-400"
                  >
                    No license history found
                  </td>
                </tr>
              ) : (
                paginatedRows.map((item, localIdx) => {
                  const idx = (currentPage - 1) * rowsPerPage + localIdx;
                  const Icon = agentIcons[idx % agentIcons.length] ?? Code2;
                  const iconBg =
                    agentIconBg[idx % agentIconBg.length] ?? fallbackIconBg;
                  const isActive = item.Active === true;
                  const isDeployed = item.AgCrDepStatus === true;

                  return (
                    <tr
                      key={`${item.PartnerId || idx}-${idx}`}
                      className="transition-colors border-b border-gray-50 dark:border-gray-700/50 hover:bg-slate-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {item.DDate}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {item.agentImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.agentImage}
                              alt={item.agentName}
                              className="object-cover w-9 h-9 rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {item.agentName}
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-500">
                              {item.PartnerName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            categoryStyles[item.PartnerCategoryName] ??
                            fallbackCategoryStyle
                          }`}
                        >
                          {item.PartnerCategoryName || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {item.PartnerName}
                        </div>
                        {item.MarketplaceUrl && (
                          <a
                            href={item.MarketplaceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Visit marketplace
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          ${Number(item.Amount || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {item.Paymentmode}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-blue-600 dark:text-blue-400">
                          {item.APY}%
                        </div>
                        <div className="flex items-center gap-1 text-xs text-amber-500">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {item.rating}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-blue-600 dark:text-blue-400">
                        {Number(item.ConsumedCredit || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusPill
                          type={isActive ? "active" : "inactive"}
                          label={isActive ? "Active" : "Inactive"}
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusPill
                          type={isDeployed ? "deployed" : "notDeployed"}
                          label={isDeployed ? "Deployed" : "Not Deployed"}
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {!isDeployed ? (
                          <Link
                            href="/deploy-agents"
                            className="px-3 py-1.5 text-xs font-medium border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                          >
                            Deploy
                          </Link>
                        ) : (
                          <button className="flex items-center justify-center w-8 h-8 text-gray-400 transition-colors border border-gray-200 rounded-lg dark:border-gray-600 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 transition-colors bg-white border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {(currentPage - 1) * rowsPerPage + 1}
              </span>{" "}
              -{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {Math.min(currentPage * rowsPerPage, rows.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {rows.length}
              </span>{" "}
              entries
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .map((page, i, arr) => (
                  <span key={page} className="flex items-center">
                    {i > 0 && arr[i - 1] !== page - 1 && (
                      <span className="px-1 text-xs text-gray-400 dark:text-gray-500">
                        …
                      </span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center text-xs font-medium rounded-lg border transition-colors ${
                        page === currentPage
                          ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500"
                          : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  </span>
                ))}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col items-start justify-between gap-3 px-6 py-4 transition-colors border-t border-gray-100 md:flex-row md:items-center dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Info className="w-4 h-4" />
            Agents must be deployed before they can start earning APY.
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Deployed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Not Deployed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Inactive
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
