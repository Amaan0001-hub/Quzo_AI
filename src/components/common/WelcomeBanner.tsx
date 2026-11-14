"use client";

import { FiUserPlus } from "react-icons/fi";
import { RiBrainLine } from "react-icons/ri";
import React, { useState } from "react";
import ReferralLink from "./ReferralLink";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useDashboardSummary } from "@/features/dashboard/hooks/useDashboardSummary";

export const WelcomeBanner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: dashboardData } = useDashboardSummary();

  // Get data from dashboard API
  const fullName = dashboardData?.data?.[0]?.FullName || user?.name || "";
  const authLogin = dashboardData?.data?.[0]?.AuthLogin || user?.email || "";

  const getInitials = (fullName: string) => {
    if (!fullName) return "";
    const names = fullName.trim().split(/\s+/).filter(Boolean);
    return names
      .map((name: string) => name[0])
      .join("")
      .toUpperCase();
  };

  const initials = getInitials(fullName);

  return (
    <div className="relative px-1 py-2 transition-colors duration-300 sm:px-2 sm:py-3 md:px-3 lg:px-4">
      <div className="relative overflow-hidden rounded-2xl border border-[#12a594]/20 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#12a594]/20 dark:border-[#7ff0cf]/15 dark:bg-[#07242e]/90 sm:rounded-3xl">
        {/* Decorative gradient overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#35d6c0]/10 blur-3xl dark:bg-[#35d6c0]/5"></div>
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#1f5f7a]/10 blur-3xl dark:bg-[#1f5f7a]/20"></div>
        </div>

        {/* Gradient line at top */}
        <div className="absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-[#12a594] via-[#35d6c0] to-[#1f5f7a]"></div>

        <div className="relative p-3 sm:p-4 md:p-5 lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            {/* Left Section - User Info */}
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#12a594] via-[#35d6c0] to-[#1f5f7a] text-sm font-bold text-white shadow-lg shadow-[#12a594]/25 sm:h-12 sm:w-12 sm:text-base">
                    {initials || "U"}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 animate-pulse rounded-full border-2 border-white bg-emerald-500 dark:border-gray-800"></div>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Welcome back
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold capitalize text-gray-800 dark:text-white sm:text-base">
                      {fullName || "User"}
                    </span>
                    <span className="rounded-full border border-[#12a594]/20 bg-[#12a594]/5 px-2 py-0.5 font-mono text-xs text-[#087f73] dark:border-[#7ff0cf]/20 dark:bg-[#7ff0cf]/10 dark:text-[#7ff0cf]">
                      {authLogin || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Action Button */}
            <div className="flex-shrink-0">
              {pathname === "/buy-agent-license" ? (
                <button
                  onClick={() => router.push("/ai-tools")}
                  className="group relative flex transform items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#12a594] via-[#35d6c0] to-[#1f5f7a] px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#12a594]/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#12a594]/30 hover:brightness-110 active:scale-[0.98] sm:px-6 sm:py-3 sm:text-sm"
                >
                  <span className="absolute inset-0 h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></span>
                  <RiBrainLine
                    size={18}
                    className="transition-transform duration-300 group-hover:rotate-12"
                  />
                  Ai Tools Demo
                </button>
              ) : (
                <button
                  onClick={() => setIsOpen(true)}
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#12a594] via-[#35d6c0] to-[#1f5f7a] px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#12a594]/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#12a594]/40 sm:px-6 sm:py-3 sm:text-sm"
                >
                  <span className="absolute inset-0 h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></span>
                  <FiUserPlus
                    size={18}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  Invite Friends
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Premium */}
      {isOpen && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-black/60 px-4 backdrop-blur-sm duration-300 dark:bg-black/70">
          <div className="animate-in slide-in-from-top-4 relative w-full max-w-lg rounded-3xl border border-gray-200/50 bg-white p-6 shadow-2xl duration-300 dark:border-gray-700/50 dark:bg-gray-800 sm:p-8">
            {/* Decorative gradient overlay */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#35d6c0]/5 blur-2xl dark:bg-[#35d6c0]/5"></div>
              <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-[#1f5f7a]/5 blur-2xl dark:bg-[#1f5f7a]/10"></div>
            </div>

            {/* Close Button */}
            <button
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-all duration-300 hover:scale-110 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="relative mb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-[#12a594] via-[#35d6c0] to-[#1f5f7a] p-2.5 shadow-lg shadow-[#12a594]/25">
                  <FiUserPlus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white sm:text-xl">
                    Invite Friends
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                    Share your referral link and earn rewards
                  </p>
                </div>
              </div>
            </div>

            {/* Referral Link Component */}
            <div className="relative">
              <ReferralLink />
            </div>

            {/* Footer Note */}
            <div className="relative mt-4 border-t border-gray-200/50 pt-3 dark:border-gray-700/50">
              <p className="text-center text-[10px] text-gray-500 dark:text-gray-400 sm:text-xs">
                Earn rewards for every friend who joins through your link
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
