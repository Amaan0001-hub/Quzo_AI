"use client";

import {
  Menu,
  Moon,
  Sun,
  Wallet,
  Bell,
  ChevronDown,
  UserRound,
  ChevronUp,
  Check,
  Copy,
  Headphones,
  LogOut,
  X,
  Briefcase,
  TrendingUp,
  BarChart3,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useSidebarStore } from "@/store/sidebar.store";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { useDashboardSummary } from "@/features/dashboard/hooks/useDashboardSummary";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useTheme } from "next-themes";
import GoogleTranslate from "@/components/common/GoogleTranslate";
import { primaryNav } from "@/config/navigation";
import { usePathname } from "next/navigation";

type HeaderNotification = Record<string, unknown>;

/*
  THEME (same as home page)
  base   : #050a18 / #0a1224 navy
  accent : #65e7ff
  borders: white/10, accent borders on hover
*/
const iconBtn =
  "rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] p-2 text-cyan-700 dark:text-[#65e7ff] transition-all duration-300 hover:border-[#65e7ff]/40 hover:bg-[#65e7ff]/10 hover:shadow-[0_0_20px_-6px_rgba(101,231,255,0.7)]";
const panel =
  "overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-900/10 backdrop-blur-xl dark:border-[#65e7ff]/20 dark:bg-[#0a1224]/95 dark:shadow-[0_24px_70px_-20px_rgba(101,231,255,0.35)]";

function getNotificationRows(payload: unknown): HeaderNotification[] {
  const pending: unknown[] = [payload];
  const visited = new Set<object>();
  let depth = 0;

  while (pending.length && depth < 6) {
    const currentLevel = pending.splice(0);
    for (const value of currentLevel) {
      if (Array.isArray(value)) {
        if (
          value.every((item) => typeof item === "object" && item !== null && !Array.isArray(item))
        ) {
          return value.filter(
            (item): item is HeaderNotification =>
              typeof item === "object" && item !== null && !Array.isArray(item),
          );
        }
        pending.push(...value);
        continue;
      }
      if (typeof value !== "object" || value === null || visited.has(value)) continue;
      visited.add(value);

      const record = value as Record<string, unknown>;
      for (const key of ["unSeenNotificationList", "notificationList"]) {
        const rows = record[key];
        if (Array.isArray(rows)) {
          return rows.filter(
            (item): item is HeaderNotification =>
              typeof item === "object" && item !== null && !Array.isArray(item),
          );
        }
      }
      pending.push(...Object.values(record));
    }
    depth += 1;
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "success" in payload &&
    payload.success === false
  ) {
    throw new Error(
      "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Could not load notifications.",
    );
  }
  return [];
}

function getNotificationId(notification: HeaderNotification, index: number) {
  const id =
    notification.NotificationId ??
    notification.notificationId ??
    notification.URID ??
    notification.id;
  return String(id ?? `notification-${index}`);
}

export function Navbar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isMobileOpen = useSidebarStore((state) => state.isMobileOpen);
  const setMobileOpen = useSidebarStore((state) => state.setMobileOpen);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<HeaderNotification[]>([]);
  const [seenNotifications, setSeenNotifications] = useState<Set<string>>(new Set());
  const [seenNotificationsUser, setSeenNotificationsUser] = useState<string | null>(null);
  const [notificationsError, setNotificationsError] = useState("");
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [authLoginCopied, setAuthLoginCopied] = useState(false);

  const accountMenuRef = useRef<HTMLDivElement>(null);
  const walletRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const logout = useLogout();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: dashboardData } = useDashboardSummary(Boolean(user));
  const currentPageLabel = primaryNav
    .flatMap((item) =>
      item.dropdownItems
        ? [
          ...item.dropdownItems,
          ...(item.href !== "/" ? [{ label: item.label, href: item.href }] : []),
        ]
        : [item],
    )
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.label;
  const displayAuthLogin = dashboardData?.data?.[0]?.AuthLogin || user?.name || "Account";
  const walletData = dashboardData?.data?.[0];
  const notificationUserKey = user?.id || displayAuthLogin;

  const loadNotifications = useCallback(async () => {
    setNotificationsError("");
    try {
      const response = await fetch("/api/notifications");
      const payload: unknown = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof payload === "object" &&
            payload !== null &&
            "message" in payload &&
            typeof payload.message === "string"
            ? payload.message
            : "Could not load notifications.",
        );
      }
      setNotifications(getNotificationRows(payload));
    } catch (error) {
      console.error("Could not load header notifications:", error);
      setNotificationsError(
        error instanceof Error ? error.message : "Could not load notifications.",
      );
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    logout.mutate();
  };

  const copyAuthLogin = () => {
    if (displayAuthLogin) {
      navigator.clipboard.writeText(displayAuthLogin);
      setAuthLoginCopied(true);
      setTimeout(() => setAuthLoginCopied(false), 2000);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
      if (walletRef.current && !walletRef.current.contains(event.target as Node)) {
        setWalletOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    if (accountMenuOpen || walletOpen || notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [accountMenuOpen, walletOpen, notificationsOpen]);

  useEffect(() => {
    const openNotifications = () => {
      setAccountMenuOpen(false);
      setWalletOpen(false);
      setNotificationsOpen(true);
    };

    window.addEventListener("open-header-notifications", openNotifications);
    return () => window.removeEventListener("open-header-notifications", openNotifications);
  }, []);

  useEffect(() => {
    if (!notificationUserKey || notificationUserKey === "Account") return;
    try {
      const savedSeenNotifications = localStorage.getItem(
        `kaliki-seen-notifications:${notificationUserKey}`,
      );
      const parsed: unknown = savedSeenNotifications ? JSON.parse(savedSeenNotifications) : [];
      setSeenNotifications(
        new Set(
          Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [],
        ),
      );
    } catch (error) {
      console.error("Could not restore read notification state:", error);
      setSeenNotifications(new Set());
    }
    setSeenNotificationsUser(notificationUserKey);
  }, [notificationUserKey]);

  useEffect(() => {
    if (seenNotificationsUser !== notificationUserKey || notificationUserKey === "Account") return;
    localStorage.setItem(
      `kaliki-seen-notifications:${notificationUserKey}`,
      JSON.stringify([...seenNotifications]),
    );
  }, [notificationUserKey, seenNotifications, seenNotificationsUser]);

  useEffect(() => {
    void loadNotifications();
    const interval = window.setInterval(() => void loadNotifications(), 30_000);
    return () => window.clearInterval(interval);
  }, [loadNotifications]);

  const unreadCount = notifications.reduce((count, notification, index) => {
    const id = getNotificationId(notification, index);
    const isSeen = notification.Seen ?? notification.seen;
    return count + (!isSeen && !seenNotifications.has(id) ? 1 : 0);
  }, 0);

  const markNotificationsRead = async () => {
    try {
      const response = await fetch("/api/notifications", { method: "POST" });
      const payload: unknown = await response.json();
      if (
        !response.ok ||
        (typeof payload === "object" &&
          payload !== null &&
          "success" in payload &&
          payload.success === false)
      ) {
        throw new Error(
          typeof payload === "object" &&
            payload !== null &&
            "message" in payload &&
            typeof payload.message === "string"
            ? payload.message
            : "Could not mark notifications as read.",
        );
      }
      setSeenNotifications(
        new Set(notifications.map((notification, index) => getNotificationId(notification, index))),
      );
      await loadNotifications();
      setNotificationsOpen(false);
    } catch (error) {
      console.error("Could not mark notifications as read:", error);
      setNotificationsError(
        error instanceof Error ? error.message : "Could not mark notifications as read.",
      );
    }
  };

  const markNotificationSeen = (notification: HeaderNotification, index: number) => {
    const id = getNotificationId(notification, index);
    setSeenNotifications((current) => new Set(current).add(id));
  };

  const wallets = [
    {
      id: "income",
      name: "Working Reward Wallet",
      balance: walletData?.IncomeWallet
        ? `$${Number(walletData.IncomeWallet).toFixed(4)}`
        : "$0.0000",
      icon: Briefcase,
      color: "#38bdf8",
      lightColor: "#0284c7",
      bg: "#e0f2fe",
    },
    {
      id: "yield",
      name: "Trading Reward Wallet",
      balance: walletData?.YieldWallet ? `$${Number(walletData.YieldWallet).toFixed(4)}` : "$0.0000",
      icon: BarChart3,
      color: "#34d399",
      lightColor: "#059669",
      bg: "#d1fae5",
    },
    {
      id: "deposit",
      name: "USDT Funding Wallet",
      balance: walletData?.DepositWallet
        ? `$${Number(walletData.DepositWallet).toFixed(4)}`
        : "$0.0000",
      icon: Briefcase,
      color: "#65e7ff",
      lightColor: "#0e7490",
      bg: "#e0f2fe",
    },
    // {
    //   id: "performance",
    //   name: "QUZO Coin Wallet",
    //   balance: walletData?.QuzoWallet
    //     ? `${Number(walletData.QuzoWallet).toFixed(4)}`
    //     : "0.0000",
    //   icon: TrendingUp,
    //   color: "#a78bfa",
    //   lightColor: "#7c3aed",
    //   bg: "#ede9fe",
    // },
  ];

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 dark:border-white/10 bg-white/85 dark:bg-[#050a18]/85 px-4 backdrop-blur-xl sm:px-6">
      {/* glowing hairline under the header */}
      <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent dark:via-[#65e7ff]/50" />

      {/* Mobile Menu Button (z-10 to stay above) */}
      <button
        className={`z-10 lg:hidden ${iconBtn}`}
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        aria-expanded={isMobileOpen}
        aria-controls="primary-navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-28">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2.5" aria-label="QUZO dashboard">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-cyan-500/30 bg-white shadow-md dark:border-[#65e7ff]/30 dark:bg-[#0a1224] dark:shadow-[0_0_24px_-6px_rgba(101,231,255,0.6)]">
              <img
                src="/logos/fyntix-logo-dark.png"
                alt="QUZO Logo"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </span>
            <span className="hidden font-sans text-2xl font-bold tracking-[0.12em] text-slate-900 dark:text-white sm:block">
              QUZO
            </span>
          </Link>
        </div>

        {currentPageLabel && (
          <div className="hidden min-w-0 border-l border-slate-200 dark:border-white/10 pl-3 sm:block sm:pl-4">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
              {currentPageLabel}
            </p>
            <p className="truncate text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
              Welcome back, {displayAuthLogin}
            </p>
          </div>
        )}
      </div>

      {/* Right Side Actions (z-10 and relative) */}
      <div className="relative z-10 flex items-center gap-1.5 sm:gap-3">
        <GoogleTranslate />
        <button
          className={iconBtn}
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted && theme === "dark" ? (
            <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </button>

        <div ref={walletRef} className="relative hidden sm:block">
          <button
            onClick={() => setWalletOpen((open) => !open)}
            className={iconBtn}
            aria-label="Wallet"
          >
            <Wallet className="h-5 w-5" />
          </button>

          {walletOpen && (
            <div className={`absolute right-0 top-full z-50 mt-3 w-[350px] ${panel}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#65e7ff]/30 bg-[#65e7ff]/10 text-cyan-700 dark:text-[#65e7ff]">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Wallet Balance</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Your current balances</p>
                  </div>
                </div>
                <button
                  onClick={() => setWalletOpen(false)}
                  className="text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 p-4">
                {wallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="flex items-center justify-between rounded-xl border p-3 transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      backgroundColor: `${wallet.color}14`,
                      borderColor: `${wallet.color}40`,
                      "--wc": wallet.color,
                      "--wl": wallet.lightColor,
                    } as React.CSSProperties}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-2 w-2 rounded-full bg-[color:var(--wl)] dark:bg-[color:var(--wc)]"
                        style={{
                          boxShadow: `0 0 10px ${wallet.color}`,
                        }}
                      />
                      <wallet.icon size={18} className="text-[color:var(--wl)] dark:text-[color:var(--wc)]" />
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{wallet.name}</span>
                    </div>
                    <span className="text-sm font-bold text-[color:var(--wl)] dark:text-[color:var(--wc)]">
                      {wallet.balance}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            className={`relative ${iconBtn}`}
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            aria-expanded={notificationsOpen}
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            {unreadCount > 0 && (
              <span
                className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-slate-900 dark:text-white ring-2 ring-white dark:ring-[#050a18]"
                aria-hidden="true"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div
              className={`absolute right-0 top-full z-50 mt-3 w-[min(340px,calc(100vw-1.5rem))] ${panel}`}
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#65e7ff]/30 bg-[#65e7ff]/10">
                    <Bell className="h-4 w-4 text-cyan-700 dark:text-[#65e7ff]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight text-slate-900 dark:text-white">
                      Notifications
                    </p>
                    {unreadCount > 0 && (
                      <p className="text-[11px] leading-tight text-cyan-700 dark:text-[#65e7ff]">
                        {unreadCount} unread
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void markNotificationsRead()}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                  aria-label="Mark notifications as read and close"
                  title="Mark all as read"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div
                className={`overflow-y-auto [scrollbar-color:rgba(101,231,255,0.25)_transparent] [scrollbar-width:thin] ${
                  notifications.length > 3 ? "max-h-72" : "max-h-56"
                }`}
              >
                {notificationsError ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-xs text-rose-600 dark:text-rose-300">{notificationsError}</p>
                    <button
                      type="button"
                      onClick={() => void loadNotifications()}
                      className="mt-2 text-xs font-semibold text-cyan-700 dark:text-[#65e7ff] underline"
                    >
                      Retry
                    </button>
                  </div>
                ) : notificationsLoading ? (
                  <div className="flex justify-center px-4 py-8">
                    <Loader2
                      className="h-6 w-6 animate-spin text-cyan-700 dark:text-[#65e7ff]"
                      aria-label="Loading notifications"
                    />
                  </div>
                ) : unreadCount > 0 ? (
                  notifications.map((notification, index) => {
                    const id = getNotificationId(notification, index);
                    const isSeen = notification.Seen ?? notification.seen;
                    const isUnread = !isSeen && !seenNotifications.has(id);
                    const message =
                      (typeof notification.AdminRemarks === "string" &&
                        notification.AdminRemarks) ||
                      (typeof notification.adminRemarks === "string" &&
                        notification.adminRemarks) ||
                      (typeof notification.message === "string" && notification.message) ||
                      "You have a new notification.";
                    const rawDate = notification.NotificationDate ?? notification.notificationDate;

                    const amount = notification.Amount ?? notification.amount;
                    const amountText =
                      typeof amount === "string" || typeof amount === "number"
                        ? String(amount)
                        : "";

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => markNotificationSeen(notification, index)}
                        className={`flex w-full items-start gap-3 border-b border-slate-100 dark:border-white/5 px-4 py-3.5 text-left transition-colors last:border-0 ${isUnread
                          ? "bg-cyan-50 hover:bg-cyan-100/70 dark:bg-[#65e7ff]/[0.06] dark:hover:bg-[#65e7ff]/10"
                          : "hover:bg-slate-50 dark:hover:bg-white/[0.04]"
                          }`}
                      >
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#65e7ff]/25 bg-[#65e7ff]/10">
                          <Bell className="h-3.5 w-3.5 text-cyan-700 dark:text-[#65e7ff]" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
                            {message}
                          </span>
                          {amountText && (
                            <span className="mt-1 block text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                              {amountText}
                            </span>
                          )}
                        </span>
                        {isUnread && (
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)] dark:bg-[#65e7ff] dark:shadow-[0_0_8px_rgba(101,231,255,0.9)]" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 py-10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5">
                      <Bell className="h-6 w-6 text-slate-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">All caught up!</p>
                      <p className="text-[11px] text-slate-500">No new notifications</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div
          ref={accountMenuRef}
          className="relative"
          onMouseEnter={() => setAccountMenuOpen(true)}
          onMouseLeave={() => setAccountMenuOpen(false)}
        >
          <button
            type="button"
            onClick={() => setAccountMenuOpen(true)}
            className="flex h-10 items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-2 py-1.5 text-xs text-cyan-700 dark:text-[#65e7ff] transition-all duration-300 hover:border-[#65e7ff]/50 hover:bg-[#65e7ff]/10 hover:shadow-[0_0_20px_-6px_rgba(101,231,255,0.7)] sm:px-2.5"
            aria-expanded={accountMenuOpen}
            aria-label="Open account menu"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#050a18]"
              style={{ background: "linear-gradient(135deg, #65e7ff, #38bdf8 60%, #6366f1)" }}
            >
              <UserRound size={17} strokeWidth={2} />
            </span>
            <span className="hidden max-w-[96px] truncate font-semibold text-slate-900 dark:text-white sm:block">
              {displayAuthLogin || "Account"}
            </span>
            {accountMenuOpen ? (
              <ChevronUp size={15} strokeWidth={2} />
            ) : (
              <ChevronDown size={15} strokeWidth={2} />
            )}
          </button>

          {accountMenuOpen && (
            <div className="absolute right-0 top-full z-50 w-[min(280px,calc(100vw-1.5rem))] pt-3">
              <div className={panel}>
                <div className="p-4 sm:p-5">
                  <div className="mb-3 font-mono text-[11px] font-semibold tracking-[0.2em] text-slate-500">
                    YOUR USER ID
                  </div>
                  <button
                    type="button"
                    onClick={copyAuthLogin}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#65e7ff]/40 bg-gradient-to-r from-[#65e7ff]/20 via-[#65e7ff]/10 to-transparent p-2 text-left text-slate-900 dark:text-white shadow-[0_0_28px_-8px_rgba(101,231,255,0.55)] transition-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-[#65e7ff]"
                    aria-label="Copy your user ID"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="shrink-0 rounded-full bg-[#65e7ff]/20 px-2.5 py-1 text-[11px] font-bold tracking-wide text-cyan-700 dark:text-[#65e7ff]">
                        ID
                      </span>
                      <span className="truncate text-base font-semibold tracking-wide">
                        {displayAuthLogin || "Not available"}
                      </span>
                    </span>
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-lg text-cyan-700 dark:text-[#65e7ff]">
                      {authLoginCopied ? <Check size={17} /> : <Copy size={17} />}
                    </span>
                  </button>
                  <div className="mt-2 text-center text-xs text-slate-500">
                    Click to copy your ID
                  </div>
                </div>
                <div className="border-t border-slate-200 dark:border-white/10 py-1">
                  <Link
                    href="/profile"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-[#65e7ff]/[0.07] hover:text-cyan-700 dark:hover:text-[#65e7ff]"
                  >
                    <UserRound size={18} strokeWidth={1.8} />
                    Profile
                  </Link>

                  <Link
                    href="/support"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-[#65e7ff]/[0.07] hover:text-cyan-700 dark:hover:text-[#65e7ff]"
                  >
                    <Headphones size={18} strokeWidth={1.8} />
                    Support
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-sm font-medium text-rose-600 dark:text-rose-300 transition-colors hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-200"
                  >
                    <LogOut size={18} strokeWidth={1.8} />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
