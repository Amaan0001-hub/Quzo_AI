"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Loader2, X } from "lucide-react";
import { primaryNav } from "@/config/navigation";
import { useSidebarStore } from "@/store/sidebar.store";

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
        className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-white transition-[transform,visibility] dark:border-[#1E293B] dark:bg-[#0B1021] lg:sticky lg:top-16 lg:z-auto lg:block ${
          isMobileOpen
            ? "visible translate-x-0"
            : "invisible -translate-x-full lg:visible lg:translate-x-0"
        }`}
        aria-label="Primary navigation"
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-[#1E293B] lg:hidden">
          <span className="font-semibold text-slate-800 dark:text-slate-100">Menu</span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-2 text-slate-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-white/5"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1 p-4">
          {primaryNav.map((item) => {
            const isActive = isNavItemActive(pathname, item);
            const isDropdownOpen = openDropdown === item.label;

            if (item.isDropdown && item.dropdownItems) {
              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(isDropdownOpen ? null : item.label)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-500/10 text-blue-700 dark:bg-cyan-400/10 dark:text-cyan-300"
                        : "text-slate-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-white/5"
                    }`}
                    aria-expanded={isDropdownOpen}
                  >
                    <span className="flex items-center gap-3">
                      {item.img && <img src={item.img} alt="" className="h-5 w-5" />}
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
                            className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
                              isDropdownItemActive
                                ? "bg-blue-500/10 font-semibold text-blue-700 dark:bg-cyan-400/10 dark:text-cyan-300"
                                : "text-slate-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-white/5"
                            }`}
                          >
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
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-500/10 text-blue-700 dark:bg-cyan-400/10 dark:text-cyan-300"
                    : "text-slate-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-white/5"
                }`}
              >
                {item.img && <img src={item.img} alt="" className="h-5 w-5" />}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      {loadingInvestmentFund && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/75 px-4 backdrop-blur-sm">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border border-blue-400/20 bg-[#0B1021] shadow-2xl shadow-blue-500/10">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10">
              <Loader2 className="h-7 w-7 animate-spin text-[#25c6e8]" aria-hidden />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
