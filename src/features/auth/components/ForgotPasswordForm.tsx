// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { FormProvider, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   forgotPasswordSchema,
//   type ForgotPasswordFormValues,
// } from "@/features/auth/schemas/auth.schema";
// import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";
// import { cn } from "@/lib/utils";
// import {
//   User,
//   Mail,
//   ArrowRight,
//   Sparkles,
//   ShieldCheck,
//   Lock,
//   ArrowLeft,
//   Loader2,
//   type LucideIcon,
// } from "lucide-react";
// import { HeroBackground } from "@/components/landing/HeroBackground";

// type TrustItem = { icon: LucideIcon; text: string };

// const TRUST_ITEMS: TrustItem[] = [
//   { icon: ShieldCheck, text: "Bank-Grade Encryption" },
//   { icon: Lock, text: "Secure Password Reset" },
//   { icon: User, text: "Identity Verification" },
// ];

// const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

// export function ForgotPassword() {
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   // Form Setup (API Logic)
//   const form = useForm<ForgotPasswordFormValues>({
//     resolver: zodResolver(forgotPasswordSchema),
//     defaultValues: { UserId: "", Email: "" },
//   });

//   const forgotPassword = useForgotPassword();

//   const onSubmit = form.handleSubmit((values) => {
//     forgotPassword.mutate(values, {
//       onSuccess: () => setIsSubmitted(true),
//     });
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
//         className="w-full max-w-[1000px] min-h-[600px] relative z-10 flex rounded-[2rem] border border-white/10 bg-[#031B23]/70 backdrop-blur-2xl shadow-[0_0_100px_-20px_rgba(25,216,208,0.3)] overflow-hidden"
//       >
//         {/* LEFT: branding */}
//         <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-[#052832]/90 to-[#031B23]/90 border-r border-white/5 overflow-hidden">
//           <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#19D8D0]/20 blur-[100px] rounded-full pointer-events-none" />

//           <div className="relative z-10">
//             <Link
//               href="/"
//               className="flex items-center text-3xl font-bold font-display text-white tracking-wide mb-12 w-max"
//             >
//               <img src="/logos/quzo-logo-light.png" alt="Quzo" className="h-16 w-16" />
//               Quzo
//             </Link>

//             <h1 className="text-4xl lg:text-5xl font-display text-white leading-tight">
//               Recover <br />
//               Your{" "}
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#19D8D0] to-[#64BDB7]">
//                 Access.
//               </span>
//             </h1>
//             <p className="mt-6 text-slate-400 text-sm leading-relaxed max-w-sm">
//               Don&apos;t worry, it happens to the best of us. Enter your details and
//               we&apos;ll help you get back into your account securely.
//             </p>
//           </div>

//           <div className="relative z-10 mt-12 space-y-4">
//             {TRUST_ITEMS.map(({ icon: Icon, text }) => (
//               <div key={text} className="flex items-center gap-3 text-slate-300 text-sm">
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
//               Account Recovery
//             </div>
//             <h2 className="font-display text-3xl lg:text-4xl text-white tracking-wider">
//               FORGOT <span className="text-[#19D8D0]">PASSWORD</span>
//             </h2>
//             <p className="mt-2 font-mono text-[11px] tracking-[0.2em] text-slate-400 uppercase">
//               Reset your account access
//             </p>
//           </Link>

//           {/* API Logic Integrated Here */}
//           {isSubmitted ? (
//             // Success State (Theme matched with Quzo)
//             <div className="flex flex-col items-center text-center py-6">
//               <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#19D8D0] to-[#64BDB7] shadow-[0_0_30px_rgba(25,216,208,0.5)]">
//                 <ShieldCheck className="h-8 w-8 text-[#031B23]" />
//               </div>
//               <h3 className="mb-2 text-xl font-semibold text-white">Check Your Email</h3>
//               <p className="mb-6 text-sm text-slate-400">
//                 We&apos;ve sent a password reset link to your email address.
//               </p>
//               <Link
//                 href="/login"
//                 className="group flex items-center justify-center gap-2 rounded-xl bg-[#19D8D0] px-6 py-3 text-sm font-semibold text-[#031B23] shadow-[0_0_20px_rgba(25,216,208,0.3)] transition-all duration-300 hover:bg-[#7FF3EC] hover:shadow-[0_0_40px_rgba(25,216,208,0.6)]"
//               >
//                 <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
//                 Back to Login
//               </Link>
//             </div>
//           ) : (
//             // Form State
//             <FormProvider {...form}>
//               <form onSubmit={onSubmit} className="space-y-6" autoComplete="off">
//                 {/* User ID */}
//                 <div>
//                   <label className="mb-2 block text-xs font-medium text-slate-300">
//                     User ID <span className="text-[#19D8D0]">*</span>
//                   </label>
//                   <div
//                     className={cn(
//                       inputWrapper,
//                       form.formState.errors.UserId &&
//                         "border-red-500/60 focus-within:border-red-500 focus-within:ring-red-500/30 hover:border-red-500/60"
//                     )}
//                   >
//                     <User size={20} className="absolute left-4 text-slate-500" />
//                     <input
//                       {...form.register("UserId")}
//                       type="text"
//                       autoComplete="username"
//                       placeholder="Enter your User ID"
//                       className={inputField}
//                     />
//                   </div>
//                   {form.formState.errors.UserId && (
//                     <p className="mt-1.5 text-xs text-red-400">
//                       {form.formState.errors.UserId.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="mb-2 block text-xs font-medium text-slate-300">
//                     Email Address <span className="text-[#19D8D0]">*</span>
//                   </label>
//                   <div
//                     className={cn(
//                       inputWrapper,
//                       form.formState.errors.Email &&
//                         "border-red-500/60 focus-within:border-red-500 focus-within:ring-red-500/30 hover:border-red-500/60"
//                     )}
//                   >
//                     <Mail size={20} className="absolute left-4 text-slate-500" />
//                     <input
//                       {...form.register("Email")}
//                       type="email"
//                       autoComplete="email"
//                       placeholder="Enter your registered email"
//                       className={inputField}
//                     />
//                   </div>
//                   {form.formState.errors.Email && (
//                     <p className="mt-1.5 text-xs text-red-400">
//                       {form.formState.errors.Email.message}
//                     </p>
//                   )}
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={forgotPassword.isPending}
//                   className="q-focus group flex w-full items-center justify-center gap-2 rounded-xl bg-[#19D8D0] py-4 text-[#031B23] text-base font-semibold shadow-[0_0_20px_rgba(25,216,208,0.3)] transition-all duration-300 hover:bg-[#7FF3EC] hover:shadow-[0_0_40px_rgba(25,216,208,0.6)] mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#19D8D0]"
//                 >
//                   {forgotPassword.isPending ? (
//                     <>
//                       <Loader2 size={20} className="animate-spin" />
//                       SENDING LINK...
//                     </>
//                   ) : (
//                     <>
//                       SEND RESET LINK{" "}
//                       <ArrowRight
//                         size={20}
//                         className="transition-transform group-hover:translate-x-1"
//                       />
//                     </>
//                   )}
//                 </button>
//               </form>
//             </FormProvider>
//           )}

//           {/* Footer - Only shows when form is not submitted */}
//           {!isSubmitted && (
//             <div className="mt-8 flex flex-col items-center lg:items-start">
//               <p className="text-sm text-slate-400">
//                 Back to{" "}
//                 <Link
//                   href="/login"
//                   className="font-medium text-[#19D8D0] hover:text-[#7FF3EC] transition-colors ml-1 inline-flex items-center gap-1"
//                 >
//                   <ArrowLeft size={14} /> Sign In
//                 </Link>
//               </p>
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// export default ForgotPassword;




"use client";

import { useState } from "react";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/schemas/auth.schema";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";
import { cn } from "@/lib/utils";
import {
  User,
  Mail,
  ArrowRight,
  ShieldCheck,
  Lock,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";

type TrustItem = { icon: LucideIcon; text: string; accent: string };

const TRUST_ITEMS: TrustItem[] = [
  { icon: ShieldCheck, text: "Bank-Grade Encryption", accent: "text-cyan-300" },
  { icon: Lock, text: "Secure Password Reset", accent: "text-violet-300" },
  { icon: User, text: "Identity Verification", accent: "text-emerald-300" },
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
const PRIMARY_BUTTON =
  "flex items-center justify-center gap-2 rounded-full bg-[#E8F4F8] text-sm font-semibold text-[#060910] hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500";

export function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form Setup (API Logic)
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { UserId: "", Email: "" },
  });

  const forgotPassword = useForgotPassword();

  const onSubmit = form.handleSubmit((values) => {
    forgotPassword.mutate(values, {
      onSuccess: () => setIsSubmitted(true),
    });
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
          <Link
            href="/"
            className={cn(
              "mb-14 flex w-max items-center gap-1 rounded-lg text-2xl font-bold tracking-wide text-white",
              FOCUS_RING
            )}
          >
            <img src="/logos/quzo-logo-light.png" alt="" className="h-16 w-16" />
            Quzo
          </Link>

          <h1 className="text-6xl font-semibold leading-[1.08] tracking-tight text-white xl:text-7xl">
            Recover <br />
            Your <span className="text-cyan-300">Access.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
            Don&apos;t worry, it happens to the best of us. Enter your details and
            we&apos;ll help you get back into your account securely.
          </p>

          <ul className="mt-12 grid max-w-xl grid-cols-3 gap-3">
            {TRUST_ITEMS.map(({ icon: Icon, text, accent }) => (
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
              Account Recovery
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              FORGOT <span className="text-cyan-300">PASSWORD</span>
            </h2>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
              Reset your account access
            </p>
          </Link>

          {/* API Logic Integrated Here */}
          {isSubmitted ? (
            // Success State
            <div className="flex flex-col items-center border-t border-white/10 pt-8 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10">
                <ShieldCheck className="h-8 w-8 text-cyan-300" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Check Your Email</h3>
              <p className="mb-8 text-sm leading-6 text-slate-400">
                We&apos;ve sent a password reset link to your email address.
              </p>
              <Link
                href="/login"
                className={cn(PRIMARY_BUTTON, "w-full py-4", FOCUS_RING)}
              >
                <ArrowLeft size={18} />
                Back to Login
              </Link>
            </div>
          ) : (
            // Form State
            <FormProvider {...form}>
              <form onSubmit={onSubmit} className="space-y-5" autoComplete="off">
                {/* User ID */}
                <div>
                  <label htmlFor="UserId" className="mb-2 block text-xs font-medium text-slate-300">
                    User ID <span className="text-cyan-300">*</span>
                  </label>
                  <div className={cn(INPUT_WRAPPER, errors.UserId && INPUT_ERROR)}>
                    <User size={18} className="pointer-events-none absolute left-4" />
                    <input
                      {...form.register("UserId")}
                      id="UserId"
                      type="text"
                      autoComplete="username"
                      placeholder="Enter your User ID"
                      aria-invalid={!!errors.UserId}
                      className={INPUT_FIELD}
                    />
                  </div>
                  {errors.UserId && (
                    <p role="alert" className="mt-1.5 text-xs text-red-400">
                      {errors.UserId.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="Email" className="mb-2 block text-xs font-medium text-slate-300">
                    Email Address <span className="text-cyan-300">*</span>
                  </label>
                  <div className={cn(INPUT_WRAPPER, errors.Email && INPUT_ERROR)}>
                    <Mail size={18} className="pointer-events-none absolute left-4" />
                    <input
                      {...form.register("Email")}
                      id="Email"
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your registered email"
                      aria-invalid={!!errors.Email}
                      className={INPUT_FIELD}
                    />
                  </div>
                  {errors.Email && (
                    <p role="alert" className="mt-1.5 text-xs text-red-400">
                      {errors.Email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={forgotPassword.isPending}
                  className={cn(PRIMARY_BUTTON, "w-full py-4", FOCUS_RING)}
                >
                  {forgotPassword.isPending ? (
                    "SENDING LINK..."
                  ) : (
                    <>
                      SEND RESET LINK
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </FormProvider>
          )}

          {/* Footer - Only shows when form is not submitted */}
          {!isSubmitted && (
            <p className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
              Back to{" "}
              <Link
                href="/login"
                className={cn(
                  "ml-1 inline-flex items-center gap-1 rounded align-bottom font-medium text-cyan-300 hover:text-white",
                  FOCUS_RING
                )}
              >
                <ArrowLeft size={14} /> Sign In
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
