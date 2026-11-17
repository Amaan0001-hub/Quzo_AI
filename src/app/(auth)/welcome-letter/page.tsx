"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { ThemeLogo } from "@/components/common/ThemeLogo";
import { AuthThemeToggle } from "@/components/common/AuthThemeToggle";
import { FaExclamationTriangle } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { Sparkles } from "lucide-react";

export default function WelcomeLetter() {
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  // Get data from query params (passed from registration)
  const queryEmail = searchParams.get("email");
  const queryFirstName = searchParams.get("firstName");
  const queryLastName = searchParams.get("lastName");

  // Use query params if available, otherwise fallback to auth store
  const userName = queryFirstName
    ? `${queryFirstName} ${queryLastName || ""}`.trim()
    : user?.name?.split(" ")[0] || "User";
  const userEmail = queryEmail || user?.email || "Your registered email";

  return (
    <>
      <div className="auth-screen relative min-h-screen w-full overflow-hidden bg-gray-50 dark:bg-[#031B23]">
        <AuthThemeToggle />
        {/* Teal/cyan glow from logo (top center) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#19D8D0]/20 dark:bg-[#19D8D0]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#19D8D0]/10 dark:bg-[#19D8D0]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Teal ambient glow (bottom corners) */}
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#19D8D0]/5 dark:bg-[#19D8D0]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#19D8D0]/5 dark:bg-[#19D8D0]/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Subtle teal grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(25, 216, 208, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(25, 216, 208, 0.4) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-6">
          <div className="w-full max-w-[480px]">
            {/* ═══ Main Card ═══ */}
            <div className="auth-card relative rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-[0_0_60px_-15px_rgba(25,216,208,0.3)] backdrop-blur-xl bg-white dark:bg-[#031B23]/70">

              {/* Teal gradient top bar */}
              <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#19D8D0] to-transparent" />

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gray-200 dark:border-white/10 rounded-tl-2xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gray-200 dark:border-white/10 rounded-tr-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gray-200 dark:border-white/10 rounded-bl-2xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gray-200 dark:border-white/10 rounded-br-2xl pointer-events-none" />

              <div className="p-5 sm:p-6">
                {/* ═══ Header ═══ */}
                <div className="flex flex-col items-center text-center mb-5">
                  {/* "WELCOME" badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#19D8D0]/30 bg-[#19D8D0]/10 mb-3">
                    <Sparkles className="w-3 h-3 text-[#19D8D0]" />
                    <span className="text-[10px] sm:text-xs font-medium tracking-[0.25em] text-[#19D8D0] uppercase">
                      Welcome aboard
                    </span>
                  </div>

                  {/* Display heading */}
                  {/* <h1
                    className="text-2xl sm:text-3xl font-bold tracking-wide uppercase"
                    style={{
                      fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
                      background: "linear-gradient(180deg, #25c6e8 0%, #1680ff 60%, #7d75ff 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Smart Earning Journey
                  </h1> */}

                  <p className="mt-2 text-[10px] sm:text-xs tracking-[0.3em] uppercase text-slate-500 dark:text-slate-400">
                    The future is here
                  </p>
                </div>

                <div className="mb-5 space-y-3 text-start">
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    Welcome to Quzo, {userName}! We&apos;re thrilled to have you on board.
                  </p>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    The future is Agentic. With Quzo, AI agents work for you, generate rewards, and free up your time for what truly matters.
                  </p>

                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    🤖 Put Your Agents to Work. Let them earn while you live smarter.
                  </p>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    🛠️ Your Capital. Our Platform. Limitless Potential.
                  </p>

                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    Let&apos;s create recurring income and real freedom — the Quzo way.
                  </p>
                </div>

                <div className="p-4 mb-5 text-left border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-[#031B23]/60">
                  <h3 className="mb-3 text-sm font-bold text-[#19D8D0]">
                    Sign Into Your Account
                  </h3>
                  <div className="grid grid-cols-1 text-xs sm:grid-cols-3 gap-y-2 gap-x-12">
                    <div className="font-semibold text-slate-700 dark:text-white">Email</div>
                    <div className="text-slate-800 dark:text-white sm:col-span-2 break-all">
                      {userEmail}
                    </div>
                  </div>
                </div>

                <p className="mb-5 text-xs leading-relaxed text-slate-500 dark:text-slate-400 text-start">
                  Congratulations! Your account has been successfully created. Check your inbox for login details and store them securely.
                </p>

                <div className="flex flex-col space-y-1">
                  <Link href="/login">
                    <button
                      className="relative w-full py-3 rounded-lg font-semibold text-xs tracking-[0.15em] uppercase transition-all duration-300 overflow-hidden group text-[#031B23]"
                      style={{
                        background: "#19D8D0",
                        boxShadow: "0 0 25px rgba(25,216,208,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
                      }}
                    >
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                      <span className="relative flex items-center justify-center gap-2">
                        <FiArrowLeft className="text-lg" />
                        Back to SignIn
                      </span>
                    </button>
                  </Link>

                  <div className="flex items-start gap-3 p-3 border-l-4 rounded-md bg-[#19D8D0]/10 border-[#19D8D0]/40">
                    <FaExclamationTriangle className="text-[#19D8D0] text-lg mt-0.5 flex-shrink-0" />
                    <p className="text-xs leading-snug text-slate-500 dark:text-slate-400">
                      Please change your password after logging in for the first time to ensure account security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
