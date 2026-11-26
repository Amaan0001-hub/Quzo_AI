// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { FormProvider, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   loginSchema,
//   type LoginFormValues,
// } from "@/features/auth/schemas/auth.schema";
// import { useLogin } from "@/features/auth/hooks/useLogin";
// import { cn } from "@/lib/utils";
// import {
//   User,
//   Lock,
//   Eye,
//   EyeOff,
//   ArrowRight,
//   ShieldCheck,
//   Sparkles,
//   Blocks,
//   BrainCircuit,
//   Network,
//   Loader2,
//   type LucideIcon,
// } from "lucide-react";
// import { HeroBackground } from "@/components/landing/HeroBackground";

// type Capability = { icon: LucideIcon; text: string };

// const CAPABILITIES: Capability[] = [
//   { icon: Blocks, text: "EVM-Compatible Infrastructure" },
//   { icon: BrainCircuit, text: "AI-Powered Intelligence" },
//   { icon: Network, text: "Multi-Market Connectivity" },
// ];

// const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

// export function Login() {
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [isRobot, setIsRobot] = useState<boolean>(false);

//   const form = useForm<LoginFormValues>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: { userid: "", password: "" },
//   });

//   const login = useLogin();

//   const onSubmit = form.handleSubmit((values) => {
//     if (isRobot) login.mutate(values);
//   });

//   const inputWrapper =
//     "relative flex items-center rounded-xl border border-white/10 bg-[#031B23]/80 backdrop-blur-md transition-all duration-300 focus-within:border-[#19D8D0] focus-within:ring-2 focus-within:ring-[#19D8D0]/30 hover:border-white/20";
//   const inputField =
//     "w-full bg-transparent px-12 py-4 text-sm text-white outline-none placeholder:text-slate-500";

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 lg:p-8 relative overflow-hidden bg-[#031B23]">
//       {/* HD Background */}
//       <HeroBackground />
//       <div className="absolute inset-0 bg-[#031B23]/40 z-0" />

//       {/* Main split card */}
//       <motion.div
//         initial={{ opacity: 0, y: 40, scale: 0.95 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         transition={{ duration: 0.8, ease }}
//         className="w-full max-w-[1000px] min-h-[650px] relative z-10 flex rounded-[2rem] border border-white/10 bg-[#031B23]/70 backdrop-blur-2xl shadow-[0_0_100px_-20px_rgba(25,216,208,0.3)] overflow-hidden"
//       >
//         {/* LEFT: branding */}
//         <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-[#052832]/90 to-[#031B23]/90 border-r border-white/5 overflow-hidden">
//           <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#19D8D0]/20 blur-[100px] rounded-full pointer-events-none" />

//           <div className="relative z-10">
//             <div className="flex items-center text-3xl font-bold font-display text-white tracking-wide mb-12">
//               <img src="/logos/quzo-logo-light.png" alt="Quzo" className="h-16 w-16" />
//               Quzo
//             </div>

//             <h1 className="text-4xl lg:text-5xl font-display text-white leading-tight">
//               Intelligence <br />
//               Meets{" "}
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#19D8D0] to-[#64BDB7]">
//                 Finance.
//               </span>
//             </h1>
//             <p className="mt-6 text-slate-400 text-sm leading-relaxed max-w-sm">
//               An AI-powered blockchain ecosystem connecting digital assets, decentralised
//               finance and intelligent trading.
//             </p>
//           </div>

//           <div className="relative z-10 mt-12 space-y-4">
//             {CAPABILITIES.map(({ icon: Icon, text }, i) => (
//               <div key={i} className="flex items-center gap-3 text-slate-300 text-sm">
//                 <div className="p-2 rounded-lg bg-white/5 border border-white/10">
//                   <Icon size={16} className="text-[#19D8D0]" />
//                 </div>
//                 {text}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* RIGHT: form */}
//         <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-[#031B23]/40">
//           <Link href="/" className="flex flex-col items-center lg:items-start text-center lg:text-left mb-8 hover:opacity-80 transition-opacity">
//             <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#19D8D0]/30 bg-[#19D8D0]/10 px-4 py-1.5 text-[11px] font-mono uppercase tracking-widest text-[#19D8D0]">
//               <Sparkles size={14} />
//               Welcome Back
//             </div>
//             <h2 className="font-display text-3xl lg:text-4xl text-white tracking-wider">
//               SIGN <span className="text-[#19D8D0]">IN</span>
//             </h2>
//             <p className="mt-2 font-mono text-[11px] tracking-[0.2em] text-slate-400 uppercase">
//               Continue your journey
//             </p>
//           </Link>

//           <FormProvider {...form}>
//             <form onSubmit={onSubmit} className="space-y-6" autoComplete="off">
//               {/* Username */}
//               <div>
//                 <label className="mb-2 block text-xs font-medium text-slate-300">
//                   Username <span className="text-[#19D8D0]">*</span>
//                 </label>
//                 <div
//                   className={cn(
//                     inputWrapper,
//                     form.formState.errors.userid &&
//                       "border-red-500/60 focus-within:border-red-500 focus-within:ring-red-500/30 hover:border-red-500/60"
//                   )}
//                 >
//                   <User size={20} className="absolute left-4 text-slate-500" />
//                   <input
//                     {...form.register("userid")}
//                     type="text"
//                     autoComplete="userid"
//                     placeholder="Enter your userid"
//                     className={inputField}
//                   />
//                 </div>
//                 {form.formState.errors.userid && (
//                   <p className="mt-1.5 text-xs text-red-400">
//                     {form.formState.errors.userid.message}
//                   </p>
//                 )}
//               </div>

//               {/* Password */}
//               <div>
//                 <div className="mb-2 flex items-center justify-between">
//                   <label className="block text-xs font-medium text-slate-300">
//                     Password <span className="text-[#19D8D0]">*</span>
//                   </label>
//                   <Link
//                     href="/forgot-password"
//                     className="text-[11px] text-[#19D8D0] hover:text-white transition-colors hover:underline"
//                   >
//                     Forgot?
//                   </Link>
//                 </div>
//                 <div
//                   className={cn(
//                     inputWrapper,
//                     form.formState.errors.password &&
//                       "border-red-500/60 focus-within:border-red-500 focus-within:ring-red-500/30 hover:border-red-500/60"
//                   )}
//                 >
//                   <Lock size={20} className="absolute left-4 text-slate-500" />
//                   <input
//                     {...form.register("password")}
//                     type={showPassword ? "text" : "password"}
//                     autoComplete="current-password"
//                     placeholder="Enter your password"
//                     className={cn(inputField, "pr-12")}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((v) => !v)}
//                     className="absolute right-4 text-slate-500 hover:text-[#19D8D0] transition-colors"
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                   >
//                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                   </button>
//                 </div>
//                 {form.formState.errors.password && (
//                   <p className="mt-1.5 text-xs text-red-400">
//                     {form.formState.errors.password.message}
//                   </p>
//                 )}
//               </div>

//               {/* Robot check */}
//               <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#031B23]/60 p-4">
//                 <label className="flex cursor-pointer items-center gap-3">
//                   <input
//                     type="checkbox"
//                     checked={isRobot}
//                     onChange={() => setIsRobot((v) => !v)}
//                     className="h-5 w-5 rounded border-white/20 bg-[#031B23] accent-[#19D8D0]"
//                   />
//                   <span className="text-sm text-slate-300">I&apos;m not a robot</span>
//                 </label>
//                 <ShieldCheck size={20} className="text-[#19D8D0]/70" />
//               </div>

//               <button
//                 type="submit"
//                 disabled={login.isPending || !isRobot}
//                 className="q-focus group flex w-full items-center justify-center gap-2 rounded-xl bg-[#19D8D0] py-4 text-[#031B23] font-semibold shadow-[0_0_20px_rgba(25,216,208,0.3)] transition-all duration-300 hover:bg-[#7FF3EC] hover:shadow-[0_0_40px_rgba(25,216,208,0.6)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#19D8D0]"
//               >
//                 {login.isPending ? (
//                   <>
//                     <Loader2 size={18} className="animate-spin" />
//                     SIGNING IN...
//                   </>
//                 ) : (
//                   <>
//                     SIGN IN{" "}
//                     <ArrowRight
//                       size={18}
//                       className="transition-transform group-hover:translate-x-1"
//                     />
//                   </>
//                 )}
//               </button>
//             </form>
//           </FormProvider>

//           <div className="mt-8 flex flex-col items-center lg:items-start">
//             <p className="text-sm text-slate-400">
//               Don&apos;t have an account?{" "}
//               <Link
//                 href="/register"
//                 className="font-medium text-[#19D8D0] hover:text-[#7FF3EC] transition-colors"
//               >
//                 Create account
//               </Link>
//             </p>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// export default Login;




"use client";

import { useState } from "react";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/auth.schema";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { cn } from "@/lib/utils";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Blocks,
  BrainCircuit,
  Network,
  type LucideIcon,
} from "lucide-react";

type Capability = { icon: LucideIcon; text: string; accent: string };

const CAPABILITIES: Capability[] = [
  { icon: Blocks, text: "EVM-Compatible Infrastructure", accent: "text-cyan-300" },
  { icon: BrainCircuit, text: "AI-Powered Intelligence", accent: "text-violet-300" },
  { icon: Network, text: "Multi-Market Connectivity", accent: "text-emerald-300" },
];

/* Static background: sirf CSS gradients, koi canvas / blur / animation nahi */
const GLOW_STYLE = {
  backgroundImage: [
    "radial-gradient(ellipse 55% 60% at 75% 45%, rgba(103,232,249,0.09), transparent 70%)",
    "radial-gradient(ellipse 45% 55% at 45% 65%, rgba(139,92,246,0.08), transparent 70%)",
  ].join(","),
};

const GRID_STYLE = {
  backgroundImage:
    "linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)",
  backgroundSize: "72px 72px",
  maskImage: "radial-gradient(ellipse 75% 75% at 50% 45%, #000 30%, transparent 100%)",
  WebkitMaskImage: "radial-gradient(ellipse 75% 75% at 50% 45%, #000 30%, transparent 100%)",
};

const INPUT_WRAPPER =
  "relative flex items-center rounded-2xl border border-white/10 bg-[#0D131D] text-slate-500 hover:border-white/20 focus-within:border-cyan-300 focus-within:text-cyan-300 focus-within:ring-4 focus-within:ring-cyan-300/10";
const INPUT_ERROR =
  "border-red-400/60 hover:border-red-400/60 focus-within:border-red-400 focus-within:ring-red-400/10";
const INPUT_FIELD =
  "w-full rounded-2xl bg-transparent py-3.5 pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-500 autofill:shadow-[inset_0_0_0_1000px_#0D131D] autofill:[-webkit-text-fill-color:#fff]";
const FOCUS_RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F18]";

export function Login() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isRobot, setIsRobot] = useState<boolean>(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { userid: "", password: "" },
  });

  const login = useLogin();

  const onSubmit = form.handleSubmit((values) => {
    if (isRobot) login.mutate(values);
  });

  const { errors } = form.formState;

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center bg-[#060910] px-4 py-10 sm:px-8">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0" style={GLOW_STYLE} />
        <div className="absolute inset-0" style={GRID_STYLE} />
      </div>

      <div className="grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
        {/* LEFT: branding */}
        <div className="hidden lg:block">
          <div className="mb-14 flex items-center gap-1 text-2xl font-bold tracking-wide text-white">
            <img src="/logos/quzo-logo-light.png" alt="Quzo" className="h-16 w-16" />
            Quzo
          </div>

          <h1 className="text-6xl font-semibold leading-[1.08] tracking-tight text-white xl:text-7xl">
            Intelligence <br />
            Meets <span className="text-cyan-300">Finance.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
            An AI-powered blockchain ecosystem connecting digital assets, decentralised
            finance and intelligent trading.
          </p>

          <ul className="mt-12 grid max-w-xl grid-cols-3 gap-3">
            {CAPABILITIES.map(({ icon: Icon, text, accent }) => (
              <li
                key={text}
                className="rounded-2xl border border-white/10 bg-[#0A0F18] p-4"
              >
                <Icon size={22} className={accent} />
                <p className="mt-4 text-[13px] leading-5 text-slate-300">{text}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT: form */}
        <div className="mx-auto w-full max-w-md rounded-[28px] border border-white/10 bg-[#0A0F18] p-6 shadow-2xl shadow-black/50 sm:p-10">
          <Link
            href="/"
            className={cn("mb-8 block rounded-lg hover:opacity-80", FOCUS_RING)}
          >
            <div className="mb-4 flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-300">
              <span className="h-px w-6 bg-cyan-300" aria-hidden="true" />
              Welcome Back
            </div>
            <h2 className="text-4xl font-semibold tracking-tight text-white">
              SIGN <span className="text-cyan-300">IN</span>
            </h2>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
              Continue your journey
            </p>
          </Link>

          <FormProvider {...form}>
            <form onSubmit={onSubmit} className="space-y-5" autoComplete="off">
              {/* Username */}
              <div>
                <label htmlFor="userid" className="mb-2 block text-xs font-medium text-slate-300">
                  Username <span className="text-cyan-300">*</span>
                </label>
                <div className={cn(INPUT_WRAPPER, errors.userid && INPUT_ERROR)}>
                  <User size={18} className="pointer-events-none absolute left-4" />
                  <input
                    {...form.register("userid")}
                    id="userid"
                    type="text"
                    autoComplete="userid"
                    placeholder="Enter your userid"
                    aria-invalid={!!errors.userid}
                    className={INPUT_FIELD}
                  />
                </div>
                {errors.userid && (
                  <p role="alert" className="mt-1.5 text-xs text-red-400">
                    {errors.userid.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-medium text-slate-300">
                    Password <span className="text-cyan-300">*</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className={cn(
                      "rounded text-[11px] text-cyan-300 hover:text-white hover:underline",
                      FOCUS_RING
                    )}
                  >
                    Forgot?
                  </Link>
                </div>
                <div className={cn(INPUT_WRAPPER, errors.password && INPUT_ERROR)}>
                  <Lock size={18} className="pointer-events-none absolute left-4" />
                  <input
                    {...form.register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    aria-invalid={!!errors.password}
                    className={cn(INPUT_FIELD, "pr-12")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className={cn(
                      "absolute right-3 rounded-lg p-1 text-slate-500 hover:text-cyan-300",
                      FOCUS_RING
                    )}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p role="alert" className="mt-1.5 text-xs text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Robot check */}
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-[#0D131D] p-4 hover:border-white/20">
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isRobot}
                    onChange={() => setIsRobot((v) => !v)}
                    className="h-5 w-5 accent-cyan-300 [color-scheme:dark]"
                  />
                  <span className="text-sm text-slate-300">I&apos;m not a robot</span>
                </span>
                <ShieldCheck
                  size={20}
                  className={isRobot ? "text-cyan-300" : "text-slate-600"}
                />
              </label>

              <button
                type="submit"
                disabled={login.isPending || !isRobot}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-full bg-[#E8F4F8] py-4 text-sm font-semibold text-[#060910] hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500",
                  FOCUS_RING
                )}
              >
                {login.isPending ? (
                  "SIGNING IN..."
                ) : (
                  <>
                    SIGN IN
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </FormProvider>

          <p className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className={cn("rounded font-medium text-cyan-300 hover:text-white", FOCUS_RING)}
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
