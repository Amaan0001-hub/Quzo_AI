"use client";
import React, { useState } from "react";
import { apiClient } from "@/spr-admin/lib/api-client";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Search, FileSpreadsheet, RotateCcw, Users, User } from "lucide-react";
import { Spinner } from "@/spr-admin/components/ui/Spinner";

export interface PersonalDownlineMember {
  uLvl: number;
  Loginid: string;
  Name: string;
  RegDate: string;
  Topup: string;
  Position: string | null;
  TopupDate: string | null;
  Package: number;
  TeamBusiness: number;
  Country_Code: string | null;
  Country_Name: string | null;
  CountryFlag: string | null;
}

const DownlineAffiliates = () => {
  const [authLogin, setAuthLogin] = useState("");
  const [searched, setSearched] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PersonalDownlineMember[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(500);

  const handleSearch = async () => {
    if (!authLogin.trim()) {
      setErrors({ title: "User ID is required" });
      return;
    }
    setErrors({});
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post("/Community/getPersonalTeam_Admin", {
        AuthLogin: authLogin,
        lvl: "",
        statusId: "",
        uRank: ""
      });
      const resData = (response as { data?: PersonalDownlineMember[] })?.data || [];
      setData(Array.isArray(resData) ? resData : []);
      setSearched(true);
      setCurrentPage(1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (data.length === 0) {
      alert("No data available to export");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((member, idx) => ({
        "S.N.": idx + 1,
        "Level": member.uLvl,
        "Login ID": member.Loginid,
        "Name": member.Name,
        "Reg. Date": member.RegDate || "-",
        "Topup Status": member.Topup || "-",
        "Topup Date": member.TopupDate || "-",
        "Package": member.Package ? `$${member.Package}` : "$0",
        "Team Business": member.TeamBusiness ? `$${member.TeamBusiness}` : "$0",
        "Country": member.Country_Name || "-",
        "Country Code": member.Country_Code?.trim() || "-"
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Downline Members");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "DownlineMembers.xlsx");
  };

  const handleRefresh = () => {
    setRefreshLoading(true);
    setTimeout(() => {
      setAuthLogin("");
      setSearched(false);
      setCurrentPage(1);
      setErrors({});
      setError(null);
      setData([]);
      setRefreshLoading(false);
    }, 1000);
  };

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 dark:bg-indigo-400/10">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Downline Partners</h1>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              View and manage your downline partner network
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-500/20">
          <Users className="w-3.5 h-3.5" />
          {data.length} Partners
        </span>
      </div>

      {/* ── Search Card ── */}
      <div className="p-5 border border-slate-200 dark:border-slate-700/60 rounded-xl bg-white dark:bg-slate-800/50 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[220px]">
            <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
              Enter Login ID
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={authLogin}
                onChange={(e) => {
                  setAuthLogin(e.target.value);
                  if (e.target.value === "") setSearched(false);
                }}
                placeholder="e.g. QU7201437"
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg bg-slate-50 dark:bg-slate-900/50 border transition-all focus:outline-none focus:ring-2 ${
                  errors.title
                    ? "border-red-400 focus:ring-red-400/30 text-slate-900 dark:text-white"
                    : "border-slate-200 dark:border-slate-700 focus:ring-indigo-500/30 focus:border-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                }`}
              />
            </div>
            {errors.title && (
              <p className="mt-1.5 text-xs font-medium text-red-500">{errors.title}</p>
            )}
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-indigo-600/20"
          >
            {loading ? <Spinner className="w-4 h-4 text-white" /> : <Search className="w-4 h-4" />}
            {loading ? "Searching..." : "Search"}
          </button>

          <button
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm shadow-emerald-600/20"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export
          </button>

          <button
            onClick={handleRefresh}
            disabled={refreshLoading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700/60 dark:text-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {refreshLoading ? <Spinner className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
            Refresh
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      {searched && (
        <div className="w-full">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 border border-slate-200 dark:border-slate-700/60 rounded-xl bg-white dark:bg-slate-800/50">
              <Spinner className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading downline members...</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-20 border border-red-200 dark:border-red-500/30 rounded-xl bg-red-50/50 dark:bg-red-500/5">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-500/15">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="mt-3 text-base font-medium text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {!loading && !error && data.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 border border-slate-200 dark:border-slate-700/60 rounded-xl bg-white dark:bg-slate-800/50">
              <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-700/50">
                <Users className="w-10 h-10 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-200">No data found</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">No downline members found for this user</p>
            </div>
          )}

          {!loading && data.length > 0 && (
            <div className="overflow-hidden border border-slate-200 dark:border-slate-700/60 rounded-xl bg-white dark:bg-slate-800/50 shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-700/60">
                      {["S.N.", "Level", "Login ID", "Name", "Reg. Date", "Topup", "Topup Date", "Package", "Team Business", "Country"].map((heading, i) => (
                        <th key={i} className="px-4 py-3 text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase whitespace-nowrap">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
                    {paginatedData.map((member, idx) => (
                      <tr
                        key={idx}
                        className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30"
                      >
                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-400 dark:text-slate-500 font-medium">
                          {startIndex + idx + 1}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 text-xs font-bold">
                            {member.uLvl}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-slate-900 dark:text-white">
                          {member.Loginid}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 dark:text-slate-300">
                          {member.Name}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400">
                          {member.RegDate || "-"}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              member.Topup === "Activated"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 ring-1 ring-emerald-200/60 dark:ring-emerald-500/20"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 ring-1 ring-amber-200/60 dark:ring-amber-500/20"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              member.Topup === "Activated" ? "bg-emerald-500" : "bg-amber-500"
                            }`} />
                            {member.Topup || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400">
                          {member.TopupDate || "-"}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">
                            ${member.Package ?? 0}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            ${member.TeamBusiness ?? 0}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {member.CountryFlag ? (
                            <div className="flex items-center gap-2">
                              <img
                                src={member.CountryFlag}
                                alt={member.Country_Name || "flag"}
                                className="w-5 h-3.5 rounded object-cover ring-1 ring-slate-200 dark:ring-slate-600"
                              />
                              <span className="text-slate-600 dark:text-slate-300">{member.Country_Name}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Pagination ── */}
              <div className="flex flex-col items-center justify-between gap-4 px-4 py-3.5 border-t border-slate-200 dark:border-slate-700/60 sm:flex-row bg-slate-50/50 dark:bg-slate-900/20">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Rows:</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2.5 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  >
                    <option value="500">500</option>
                    <option value="1000">1000</option>
                    <option value="1500">1500</option>
                  </select>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{startIndex + 1}</span> to{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{Math.min(endIndex, data.length)}</span> of{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{data.length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-1.5 rounded-lg transition-colors ${
                      currentPage === 1
                        ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-1.5 rounded-lg transition-colors ${
                      currentPage === totalPages
                        ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DownlineAffiliates;