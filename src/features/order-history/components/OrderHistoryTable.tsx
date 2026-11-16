"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/Badge";
import { useOrderHistory } from "@/features/order-history/hooks/useOrderHistory";
import { formatCurrency } from "@/lib/utils";
import type { OrderHistoryItem } from "@/services/order-history.service";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function OrderHistoryTable() {
  const [filterType, setFilterType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: allData, isLoading, isError } = useOrderHistory();

  const filterOptions = useMemo(() => {
    if (!allData?.data) return [];
    const unique = Array.from(new Set(allData.data.map((item) => item.ProductName)));
    return unique.map((name) => ({ value: name, label: name }));
  }, [allData?.data]);

  const filteredData = useMemo(() => {
    let result = allData?.data ?? [];
    if (filterType) result = result.filter((item) => item.ProductName === filterType);
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.ProductName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Paymentmode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return result;
  }, [filterType, searchTerm, allData?.data]);

  const totalEntries = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / entriesPerPage));
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + entriesPerPage);

  if (isLoading) return <div className="p-10 text-center text-gray-500">Loading...</div>;
  if (isError) return <div className="p-10 text-center text-red-500">Failed to load data.</div>;

  return (
    <div className="w-full">
      {/* Top Bar: Title + Filter */}
      <div className="flex flex-col justify-between gap-4 px-6 py-5 md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Fund Deposit Records
          </h2>
        </div>
        <div>
          <select
            value={filterType ?? ""}
            onChange={(e) => {
              setFilterType(e.target.value || null);
              setCurrentPage(1);
            }}
            className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 outline-none focus:border-teal-500 dark:border-gray-700 dark:bg-[#1a1d24] dark:text-gray-200"
          >
            <option value="">All</option>
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Show & Search Bar */}
      <div className="flex flex-col items-start justify-between gap-4 px-6 pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Show</span>
          <select
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded border border-gray-300 bg-white px-2 py-1 outline-none focus:border-teal-500 dark:border-gray-700 dark:bg-[#1a1d24]"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Search:</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search records..."
            className="rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-teal-500 dark:border-gray-700 dark:bg-[#1a1d24]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="bg-teal-500 text-[11px] font-semibold uppercase tracking-wider text-white">
              <th className="px-6 py-4">S.No</th>
              <th className="px-6 py-4">Package Type</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Payment Mode</th>
              <th className="px-6 py-4">Order Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Remark</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700 dark:text-gray-300">
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center font-medium text-gray-500">
                  No data available in table
                </td>
              </tr>
            ) : (
              currentData.map((item, idx) => (
                <tr
                  key={`${item.ProductId}-${item.RDate}-${idx}`}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                >
                  <td className="px-6 py-4">{startIndex + idx + 1}</td>
                  <td className="px-6 py-4">{item.ProductName}</td>
                  <td className="px-6 py-4 font-medium">{formatCurrency(item.Rkprice)}</td>
                  <td className="px-6 py-4">{item.Paymentmode}</td>
                  <td className="px-6 py-4 text-gray-500">{item.RDate}</td>
                  <td className="px-6 py-4">
                    <Badge variant={item.Active ? "success" : "destructive"}>
                      {item.Active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">{item.Remark || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-6 py-4 dark:border-gray-800 md:flex-row">
        <div className="text-sm text-gray-500">
          Showing {totalEntries === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + entriesPerPage, totalEntries)} of {totalEntries} entries
        </div>
        
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="flex h-8 w-8 items-center justify-center rounded bg-teal-500 text-sm font-bold text-white">
            {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}