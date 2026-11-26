"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Award,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  ChevronDown,
  Circle,
  Coins,
  Files,
  GitBranch,
  House,
  LayoutDashboard,
  Loader2,
  LogOut,
  Network,
  PackageOpen,
  PanelsTopLeft,
  Rocket,
  ScrollText,
  UserRoundPlus,
  Sparkles,
  UsersRound,
  WalletCards,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { primaryNav } from "@/config/navigation";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useSidebarStore } from "@/store/sidebar.store";

const menuIcons: Record<string, LucideIcon> = {
  Home: House,
  Dashboard: LayoutDashboard,
  Packages: PackageOpen,
  "Investment Fund": Coins,
  "Investment Fund ": Coins,
  "Order History": ScrollText,
  "Fund Director": BriefcaseBusiness,
  Tools: Wrench,
  "AI Engine": BrainCircuit,
  "AI Assistant": Bot,
  Analytics: ChartNoAxesCombined,
  Affiliate: UsersRound,
  "Business Dashboard": PanelsTopLeft,
  "Direct Partners": UserRoundPlus,
  "Level Tree": GitBranch,
  "Downline Partners": Network,
  Reports: Files,
  "Income Report": ChartNoAxesCombined,
  "Wallet Manager": WalletCards,
  Rank: Award,
  "AI Subscriptions": WalletCards,
  "My Assets": BriefcaseBusiness,
  "Business Network": Network,
  "Explore Plans": PackageOpen,
  "Purchase History": ScrollText,
  "Business Overview": PanelsTopLeft,
  "My Partners": UserRoundPlus,
  "Network Structure": GitBranch,
  "Extended Network": Network,
  "AI Tools": Sparkles,
  "AI Agents": Bot,
  "By Agent License": Coins,
  "Deploy Agents": Rocket,
  "License Purchase History": ScrollText,
  "Agent Deployment Report": ChartNoAxesCombined,
};

function MenuIcon({ label, className }: { label: string; className?: string }) {
  const Icon = menuIcons[label] ?? Circle;
  return <Icon className={className ?? "h-5 w-5"} aria-hidden="true" />;
}

function isNavPathActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

function isNavItemActive(pathname: string, item: (typeof primaryNav)[number]) {
  return item.isDropdown && item.dropdownItems
    ? item.dropdownItems.some((dropdownItem) => isNavPathActive(pathname, dropdownItem.href))
    : isNavPathActive(pathname, item.href);
}

/*
  THEME (same as home page)
  base   : #050a18 / #0a1224 navy
  accent : #65e7ff
  active : #65e7ff glass + glowing left bar
  borders: white/10
*/
const itemBase =
  "group relative flex items-center gap-3 rounded-2xl border px-4 py-3 font-medium transition-all duration-300";
const itemActive =
  "border-cyan-500/40 bg-gradient-to-r from-[#65e7ff]/30 via-[#65e7ff]/15 to-transparent text-slate-900 shadow-[0_8px_24px_-12px_rgba(6,182,212,0.5)] dark:border-[#65e7ff]/40 dark:from-[#65e7ff]/20 dark:via-[#65e7ff]/10 dark:text-white dark:shadow-[0_0_28px_-8px_rgba(101,231,255,0.55)]";
const itemIdle =
  "border-transparent text-slate-600 dark:text-slate-300 hover:border-slate-200 dark:hover:border-white/10 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white";

function ActiveBar() {
  return (
    <span
      aria-hidden="true"
      className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.6)] dark:bg-[#65e7ff] dark:shadow-[0_0_12px_rgba(101,231,255,0.9)]"
    />
  );
}

export function MobileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isMobileOpen = useSidebarStore((state) => state.isMobileOpen);
  const setMobileOpen = useSidebarStore((state) => state.setMobileOpen);
  const logout = useLogout();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [loadingInvestmentFund, setLoadingInvestmentFund] = useState(false);

  useEffect(() => {
    const activeDropdown = primaryNav.find(
      (item) =>
        item.isDropdown &&
        item.dropdownItems?.some((dropdownItem) => isNavPathActive(pathname, dropdownItem.href)),
    );
    setOpenDropdown(activeDropdown?.label ?? null);
    setMobileOpen(false);
    setLoadingInvestmentFund(false);
  }, [pathname, setMobileOpen]);

  const handleNavigation = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileOpen(false);
    if (href === "/investment-amount" && pathname !== href) {
      event.preventDefault();
      setLoadingInvestmentFund(true);
      router.push(href);
    }
  };

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          className="fixed inset-x-0 bottom-0 top-16 z-30 bg-slate-900/40 backdrop-blur-sm dark:bg-[#050a18]/70 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation menu"
        />
      )}
      <aside
        id="primary-navigation"
        className={`fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-64 shrink-0 flex-col overflow-y-auto border-r border-slate-200 dark:border-white/10 bg-white dark:bg-[linear-gradient(180deg,#0a1224_0%,#050a18_55%,#050a18_100%)] transition-[transform,visibility] [scrollbar-color:rgba(101,231,255,0.25)_transparent] [scrollbar-width:thin] lg:sticky lg:top-16 lg:z-auto lg:block ${
          isMobileOpen
            ? "visible translate-x-0"
            : "invisible -translate-x-full lg:visible lg:translate-x-0"
        }`}
        aria-label="Primary navigation"
      >
        <nav className="flex-1 space-y-1.5 p-4">
          {primaryNav.map((item) => {
            const isActive = isNavItemActive(pathname, item);
            const isDropdownOpen = openDropdown === item.label;

            if (item.isDropdown && item.dropdownItems) {
              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(isDropdownOpen ? null : item.label)}
                    className={`${itemBase} w-full justify-between text-left text-sm ${
                      isActive ? itemActive : itemIdle
                    }`}
                    aria-expanded={isDropdownOpen}
                  >
                    {isActive && <ActiveBar />}
                    <span className="flex items-center gap-3">
                      {item.img ? (
                        <img src={item.img} alt="" className="h-5 w-5" />
                      ) : (
                        <MenuIcon
                          label={item.label}
                          className={`h-5 w-5 shrink-0 transition-colors ${
                            isActive
                              ? "text-cyan-700 dark:text-[#65e7ff]"
                              : "text-slate-500 dark:text-slate-400 group-hover:text-cyan-700 dark:group-hover:text-[#65e7ff]"
                          }`}
                        />
                      )}
                      {item.label}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isActive ? "text-cyan-700 dark:text-[#65e7ff]" : "text-slate-500"
                      } ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isDropdownOpen && (
                    <div className="ml-6 mt-2 space-y-1 border-l border-[#65e7ff]/20 pl-3">
                      {item.dropdownItems.map((dropdownItem) => {
                        const isDropdownItemActive = isNavPathActive(pathname, dropdownItem.href);

                        return (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            onClick={(event) => handleNavigation(event, dropdownItem.href)}
                            aria-current={isDropdownItemActive ? "page" : undefined}
                            className={`group flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-all duration-300 ${
                              isDropdownItemActive
                                ? "border-cyan-500/30 bg-cyan-50 font-semibold text-cyan-800 shadow-sm dark:border-[#65e7ff]/30 dark:bg-[#65e7ff]/10 dark:text-[#65e7ff] dark:shadow-[0_0_20px_-8px_rgba(101,231,255,0.6)]"
                                : "border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            <MenuIcon
                              label={dropdownItem.label}
                              className={`h-4 w-4 shrink-0 transition-colors ${
                                isDropdownItemActive
                                  ? "text-cyan-700 dark:text-[#65e7ff]"
                                  : "text-slate-500 group-hover:text-cyan-700 dark:group-hover:text-[#65e7ff]"
                              }`}
                            />
                            {dropdownItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(event) => handleNavigation(event, item.href)}
                aria-current={isActive ? "page" : undefined}
                className={`${itemBase} text-base ${isActive ? itemActive : itemIdle}`}
              >
                {isActive && <ActiveBar />}
                {item.img ? (
                  <img src={item.img} alt="" className="h-5 w-5" />
                ) : (
                  <MenuIcon
                    label={item.label}
                    className={`h-5 w-5 shrink-0 transition-colors ${
                      isActive ? "text-cyan-700 dark:text-[#65e7ff]" : "text-slate-500 dark:text-slate-400 group-hover:text-cyan-700 dark:group-hover:text-[#65e7ff]"
                    }`}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-slate-200 dark:border-white/10 p-4">
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              logout.mutate();
            }}
            className="flex w-full items-center gap-3 rounded-2xl border border-rose-400/20 bg-rose-500/[0.06] px-4 py-3 text-base font-medium text-rose-600 dark:text-rose-300 transition-all duration-300 hover:border-rose-400/40 hover:bg-rose-500/15 hover:text-rose-700 dark:hover:text-rose-200"
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>
      {/* {loadingInvestmentFund && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm dark:bg-[#050a18]/80">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#65e7ff]/25 bg-white shadow-xl dark:bg-[#0a1224] dark:shadow-[0_0_60px_-10px_rgba(101,231,255,0.5)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#65e7ff]/30 bg-[#65e7ff]/10">
              <Loader2 className="h-7 w-7 animate-spin text-cyan-700 dark:text-[#65e7ff]" aria-hidden />
            </div>
          </div>
        </div>
      )} */}
    </>
  );
}
