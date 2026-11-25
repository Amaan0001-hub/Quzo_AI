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
          className="fixed inset-x-0 bottom-0 top-16 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation menu"
        />
      )}
      <aside
        id="primary-navigation"
        className={`fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-64 shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white transition-[transform,visibility] dark:border-[#1E293B] dark:bg-[#0B1021] lg:sticky lg:top-16 lg:z-auto lg:block ${
          isMobileOpen
            ? "visible translate-x-0"
            : "invisible -translate-x-full lg:visible lg:translate-x-0"
        }`}
        aria-label="Primary navigation"
      >
        <nav className="flex-1 space-y-1 p-4">
          {primaryNav.map((item) => {
            const isActive = isNavItemActive(pathname, item);
            const isDropdownOpen = openDropdown === item.label;

            if (item.isDropdown && item.dropdownItems) {
              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(isDropdownOpen ? null : item.label)}
                    className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-[#12a594] to-[#32d3bd] text-white shadow-[0_12px_24px_rgba(18,165,148,0.25)]"
                        : "text-slate-700 hover:bg-[#12a594]/5 dark:text-slate-200 dark:hover:bg-[#7ff0cf]/[0.06]"
                    }`}
                    aria-expanded={isDropdownOpen}
                  >
                    <span className="flex items-center gap-3">
                      {item.img ? (
                        <img src={item.img} alt="" className="h-5 w-5" />
                      ) : (
                        <MenuIcon label={item.label} className="h-5 w-5 shrink-0" />
                      )}
                      {item.label}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isDropdownOpen && (
                    <div className="ml-4 mt-2 space-y-1">
                      {item.dropdownItems.map((dropdownItem) => {
                        const isDropdownItemActive = isNavPathActive(pathname, dropdownItem.href);

                        return (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            onClick={(event) => handleNavigation(event, dropdownItem.href)}
                            aria-current={isDropdownItemActive ? "page" : undefined}
                            className={`flex items-center gap-3 rounded-xl px-4 py-2 text-sm transition-all ${
                              isDropdownItemActive
                                ? "bg-gradient-to-r from-[#12a594] to-[#32d3bd] font-semibold text-white shadow-[0_8px_18px_rgba(18,165,148,0.2)]"
                                : "text-slate-600 hover:bg-[#12a594]/5 dark:text-slate-300 dark:hover:bg-[#7ff0cf]/[0.06]"
                            }`}
                          >
                            <MenuIcon label={dropdownItem.label} className="h-4 w-4 shrink-0" />
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
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#12a594] to-[#32d3bd] text-white shadow-[0_12px_24px_rgba(18,165,148,0.25)]"
                    : "text-slate-700 hover:bg-[#12a594]/5 dark:text-slate-200 dark:hover:bg-[#7ff0cf]/[0.06]"
                }`}
              >
                {item.img ? (
                  <img src={item.img} alt="" className="h-5 w-5" />
                ) : (
                  <MenuIcon label={item.label} className="h-5 w-5 shrink-0" />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-gray-200 p-4 dark:border-[#1E293B]">
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              logout.mutate();
            }}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-rose-600 transition-colors hover:bg-rose-500/10 dark:text-rose-400"
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>
      {loadingInvestmentFund && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/75 px-4 backdrop-blur-sm">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#7ff0cf]/20 bg-[#0B1021] shadow-2xl shadow-[#12a594]/10">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#7ff0cf]/20 bg-[#7ff0cf]/10">
              <Loader2 className="h-7 w-7 animate-spin text-[#7ff0cf]" aria-hidden />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
