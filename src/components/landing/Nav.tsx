"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

function Logo() {
  return (
    <span className="flex items-center gap-2 sm:gap-[11px]">
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="flex flex-col leading-none">
          <Image
            src="/Home-Logo.png"
            className="h-auto w-auto"
            alt="Logo"
            width={50}
            height={20}
          />
        </div>
      </Link>
      {/* Yahan se hidden xs:inline-block hata diya */}
      <span className="text-[13px] sm:text-[15px] font-bold tracking-[0.12em] text-[#f5f7ff]">
        QUZO<span className="font-medium text-[#65E7FF]">AI</span>
      </span>
    </span>
  );
}

const LINKS = {
  signIn: "/login",
  getStarted: "/register",
};

const NAV: [string, string, string][] = [
  ["Marketplace", "#agents", "marketplace"],
  ["How It Works", "#how-it-works", "how-it-works"],
  ["Network", "#workforce", "network"],
  ["Platform", "#workspace", "platform"],
  ["Calculator", "#calculator", "calculator"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const theme = resolvedTheme ?? "dark";
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <header className="fixed z-[100] top-0 left-0 w-full px-4 py-3 sm:px-6 sm:py-[14px]">
      <nav className="flex w-full max-w-[1370px] h-[60px] sm:h-[66px] items-center mx-auto px-3 sm:px-4 border border-white/[0.08] rounded-full bg-[rgba(7,9,16,0.72)] shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-[24px] backdrop-saturate-150" aria-label="Main navigation">

        {/* Brand */}
        <Link
          href="/"
          className="flex items-center shrink-0"
          data-testid="nav-brand-logo"
          aria-label="Velvora AI home"
        >
          <Logo />
        </Link>

        {/* Desktop Links (Visible on lg and above) */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-[27px] mx-auto">
          {NAV.map(([label, href, id]) => (
            <a
              key={id}
              href={href}
              className="relative whitespace-nowrap text-[#9aa8bc] text-[11px] xl:text-[12px] transition-colors duration-200 hover:text-[#f5f7ff] after:absolute after:right-0 after:-bottom-[9px] after:left-0 after:h-[1px] after:bg-[#65e7ff] after:content-[''] after:scale-x-0 after:origin-left after:transition-transform after:duration-250 hover:after:scale-x-100"
              data-testid={`nav-link-${id}`}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto lg:ml-[14px]">

          {/* Theme Toggle - Always Visible */}
          <button
            className="flex w-9 h-9 sm:w-10 sm:h-10 flex-none items-center justify-center border border-white/[0.08] rounded-full bg-[#121722] text-[#f5f7ff] cursor-pointer transition-all duration-200 hover:border-[#65e7ff] hover:rotate-[5deg]"
            onClick={() => setTheme(nextTheme)}
            aria-label={`Switch to ${nextTheme} theme`}
            title={`Switch to ${nextTheme} theme`}
            data-testid="theme-toggle-button"
          >
            <motion.span
              key={theme}
              initial={{ rotate: -35, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              className="flex"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </motion.span>
          </button>

          {/* Desktop Auth Buttons (Hidden on mobile) */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-[19px]">
            <a
              className="text-[#9aa8bc] text-[12px] transition-colors duration-200 hover:text-[#f5f7ff]"
              href={LINKS.signIn}
              data-testid="nav-signin-button"
            >
              Sign In
            </a>
            <a
              className="inline-flex min-h-[36px] sm:min-h-[40px] items-center justify-center gap-2 rounded-full bg-[#e8f4f8] px-4 sm:px-[18px] text-[11px] sm:text-[12px] font-semibold text-[#070910] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#65e7ff] hover:text-[#071015] shadow-[0_8px_30px_rgba(101,231,255,0.08)] whitespace-nowrap"
              href={LINKS.getStarted}
              data-testid="nav-get-started-button"
            >
              Get Started <ArrowUpRight size={14} className="hidden sm:block" />
            </a>
          </div>

          {/* Mobile Menu Toggle (Visible on mobile and tablet) */}
          <button
            className="flex lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex-none items-center justify-center border border-white/[0.08] rounded-full bg-[#121722] text-[#f5f7ff] cursor-pointer transition-all duration-200 hover:border-[#65e7ff]"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Close navigation" : "Open navigation"}
            data-testid="mobile-menu-toggle"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-[72px] sm:top-[88px] left-3 right-3 sm:left-4 sm:right-4 p-5 rounded-2xl border border-white/[0.08] bg-[rgba(7,9,16,0.95)] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] flex flex-col gap-4"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            data-testid="mobile-navigation-menu"
          >
            {NAV.map(([label, href, id]) => (
              <a
                key={id}
                href={href}
                onClick={() => setOpen(false)}
                className="text-[#9aa8bc] text-[14px] font-medium hover:text-[#f5f7ff] transition-colors"
                data-testid={`mobile-nav-link-${id}`}
              >
                {label}
              </a>
            ))}
            <a
              href={LINKS.signIn}
              className="text-[#9aa8bc] text-[14px] font-medium hover:text-[#f5f7ff] transition-colors"
              data-testid="mobile-nav-signin"
            >
              Sign In
            </a>
            <a
              className="inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-full bg-[#e8f4f8] px-5 text-[13px] font-semibold text-[#070910] hover:bg-[#65e7ff] transition-all duration-300 mt-2"
              href={LINKS.getStarted}
              data-testid="mobile-nav-get-started"
            >
              Get Started <ArrowUpRight size={16} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
