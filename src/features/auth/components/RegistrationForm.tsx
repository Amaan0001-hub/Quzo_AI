// "use client";

// import { useState, useEffect, useCallback, useRef } from "react";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import { FormProvider, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useSearchParams } from "next/navigation";
// import {
//   registrationSchema,
//   type RegistrationFormValues,
// } from "@/features/auth/schemas/auth.schema";
// import {
//   useRegistration,
//   useValidateReferral,
//   useSendOtpForRegistration
// } from "@/features/auth/hooks/useRegistration";
// import { cn } from "@/lib/utils";
// import {
//   User,
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   ArrowRight,
//   Hash,
//   Sparkles,
//   Blocks,
//   BrainCircuit,
//   Network,
//   ShieldCheck,
//   CheckCircle2,
//   XCircle,
//   Loader2,
//   X,
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

// export function Register() {
//   const searchParams = useSearchParams();
//   const [mounted, setMounted] = useState(false);
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [referralName, setReferralName] = useState("");
//   const [referralError, setReferralError] = useState("");

//   // OTP Modal State
//   const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
//   const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [registeredEmail, setRegisteredEmail] = useState("");
//   const [pendingFormData, setPendingFormData] = useState<RegistrationFormValues | null>(null);
//   const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

//   // API Hooks
//   const registration = useRegistration();
//   const validateReferral = useValidateReferral();
//   const validateReferralMutation = validateReferral.mutateAsync;

//   // Naya hook OTP send ke liye
//   const sendOtpReg = useSendOtpForRegistration();

//   // Form Setup
//   const form = useForm<RegistrationFormValues>({
//     resolver: zodResolver(registrationSchema),
//     defaultValues: {
//       referralId: "",
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       termsAccepted: undefined,
//     },
//   });

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Referral Validation Logic
//   const handleReferralValidation = useCallback(
//     async (referralId: string) => {
//       setReferralError("");
//       setReferralName("");
//       try {
//         const result = await validateReferralMutation(referralId);
//         if (result.statusCode === 200) setReferralName(result.data.FullName);
//         else setReferralError(result.message || "Referral ID not found");
//       } catch {
//         setReferralError("Invalid referral ID");
//       }
//     },
//     [validateReferralMutation]
//   );

//   // URL Params Check for Referral
//   useEffect(() => {
//     if (!mounted || !searchParams) return;
//     let ref = "";
//     const possibleKeys = ["RefID", "Ref", "REF", "refid", "ref"];
//     for (const key of possibleKeys) {
//       const val = searchParams.get(key);
//       if (val) {
//         ref = val;
//         break;
//       }
//     }
//     if (ref.includes("~")) ref = ref.split("~")[0] || ref;
//     if (ref) {
//       form.setValue("referralId", ref);
//       handleReferralValidation(ref);
//     }
//   }, [mounted, searchParams, form, handleReferralValidation]);

//   // 1. FORM SUBMIT: Pehle OTP send karega
//   const onSubmit = (values: RegistrationFormValues) => {
//     setPendingFormData(values); // Data save kiya
//     setRegisteredEmail(values.email);

//     // OTP Send API Call
//     sendOtpReg.mutate(
//       { userid: values.email, password: values.password },
//       {
//         onSuccess: () => {
//           // OTP send hone ke baad Modal open hoga
//           setIsOtpModalOpen(true);
//           setTimeout(() => otpInputs.current[0]?.focus(), 100);
//         },
//       }
//     );
//   };

//   // OTP Input Handlers
//   const handleOtpChange = (index: number, value: string) => {
//     if (isNaN(Number(value))) return;
//     const newOtp = [...otp];
//     newOtp[index] = value.substring(value.length - 1);
//     setOtp(newOtp);

//     if (value && index < 5) {
//       otpInputs.current[index + 1]?.focus();
//     }
//   };

//   const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       otpInputs.current[index - 1]?.focus();
//     }
//   };

//   // 2. OTP VERIFY: OTP dalne ke baad Registration API call hogi
//   const handleVerifyOtp = (e: React.FormEvent) => {
//     e.preventDefault();
//     const otpValue = otp.join("");
//     if (otpValue.length < 6 || !pendingFormData) return;

//     setIsVerifying(true);

//     registration.mutate(
//       {
//         fName: pendingFormData.firstName,  // Small 'f'
//         lName: pendingFormData.lastName,   // Small 'l'
//         password: pendingFormData.password, // Small 'p'
//         email: pendingFormData.email,
//         introAuth: pendingFormData.referralId || undefined,
//         OTP: otpValue, // Ab ye perfectly valid hai
//       },
//       {
//         onSuccess: () => {
//           setIsVerifying(false);
//           setIsOtpModalOpen(false);
//           resetFullForm();
//         },
//         onError: () => {
//           setIsVerifying(false);
//           resetOtpOnly();
//         }
//       }
//     );
//   };

//   // Password Strength Logic
//   const passwordValue = form.watch("password") || "";
//   const passwordStrengthChecks = [
//     passwordValue.length >= 8,
//     /[a-z]/.test(passwordValue),
//     /[A-Z]/.test(passwordValue),
//     /\d/.test(passwordValue),
//     /[@$!%*?&]/.test(passwordValue),
//   ];
//   const passwordStrength = passwordStrengthChecks.filter(Boolean).length;
//   const passwordStrengthLabel =
//     passwordStrength <= 2 ? "Weak" : passwordStrength <= 3 ? "Medium" : "Strong";
//   const passwordStrengthColor =
//     passwordStrength <= 2
//       ? "bg-red-500"
//       : passwordStrength <= 3
//         ? "bg-amber-400"
//         : "bg-emerald-500";


//   // Shared styling
//   const inputWrapper =
//     "relative flex items-center rounded-xl border border-white/10 bg-[#031B23]/80 backdrop-blur-md transition-all duration-300 focus-within:border-[#19D8D0] focus-within:ring-2 focus-within:ring-[#19D8D0]/30 hover:border-white/20";
//   const inputField =
//     "w-full bg-transparent px-12 py-3.5 text-sm text-white outline-none placeholder:text-slate-500";

//   const resetFullForm = () => {
//     // 1. React Hook Form reset karega (default values par wapas)
//     form.reset({
//       referralId: "",
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       termsAccepted: undefined,
//     });

//     // 2. OTP aur Modal ki state reset karega
//     setOtp(["", "", "", "", "", ""]);
//     setIsOtpModalOpen(false);
//     setRegisteredEmail("");
//     setPendingFormData(null);
//     setReferralName("");
//     setReferralError("");
//     setShowPassword(false);
//   };
//   const resetOtpOnly = () => {
//     // OTP array ko khali kar dega
//     setOtp(["", "", "", "", "", ""]);

//     // Pehle input box par focus wapas le aayega
//     setTimeout(() => {
//       otpInputs.current[0]?.focus();
//     }, 100);
//   };
//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 lg:p-8 relative overflow-hidden bg-[#031B23]">
//       {/* HD Background */}
//       <HeroBackground />
//       <div className="absolute inset-0 bg-[#031B23]/40 z-0" />

//       {/* Main Split Card Container */}
//       <motion.div
//         initial={{ opacity: 0, y: 40, scale: 0.95 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         transition={{ duration: 0.8, ease }}
//         className="w-full max-w-[1100px] relative z-10 flex rounded-[2rem] border border-white/10 bg-[#031B23]/70 backdrop-blur-2xl shadow-[0_0_100px_-20px_rgba(25,216,208,0.3)] overflow-hidden my-8"
//       >
//         {/* LEFT SIDE - Branding (Hidden on Mobile) */}
//         <div className="hidden lg:flex w-1/3 relative flex-col justify-between p-12 bg-gradient-to-br from-[#052832]/90 to-[#031B23]/90 border-r border-white/5 overflow-hidden">
//           <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#19D8D0]/20 blur-[100px] rounded-full pointer-events-none" />

//           <div className="relative z-10">
//             <div className="flex items-center text-3xl font-bold font-display text-white tracking-wide mb-12">
//               <img src="/logos/quzo-logo-light.png" alt="Quzo" className="h-16 w-16" />
//               Quzo
//             </div>

//             <h1 className="text-4xl font-display text-white leading-tight">
//               Join the <br />
//               New Era.
//             </h1>
//             <p className="mt-6 text-slate-400 text-sm leading-relaxed max-w-sm">
//               Powering the future of wealth through AI and decentralised finance. Create
//               your account to get started.
//             </p>
//           </div>

//           <div className="relative z-10 mt-12 space-y-4">
//             {CAPABILITIES.map(({ icon: Icon, text }) => (
//               <div key={text} className="flex items-center gap-3 text-slate-300 text-sm">
//                 <div className="p-2 rounded-lg bg-white/5 border border-white/10">
//                   <Icon size={16} className="text-[#19D8D0]" />
//                 </div>
//                 {text}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* RIGHT SIDE - The Form */}
//         <div className="w-full lg:w-2/3 p-8 md:p-12 flex flex-col justify-center relative bg-[#031B23]/40 overflow-y-auto">

//           {/* Header Section */}
//           <Link href="/" className="flex flex-col items-start mb-8 hover:opacity-80 transition-opacity">
//             <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#19D8D0]/30 bg-[#19D8D0]/10 px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[#19D8D0]">
//               <Sparkles size={14} />
//               Join the New Era
//             </div>
//             <h2 className="font-display text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#19D8D0] to-[#64BDB7] tracking-wider font-bold">
//               CREATE ACCOUNT
//             </h2>
//             <p className="mt-3 font-mono text-[10px] tracking-[0.25em] text-slate-400 uppercase">
//               Powering the future of wealth
//             </p>
//           </Link>

//           <FormProvider {...form}>
//             <form
//               onSubmit={form.handleSubmit(onSubmit)}
//               className="space-y-6"
//               autoComplete="off"
//             >
//               {/* Section 1: Referral & Placement */}
//               <div className="rounded-xl border border-white/5 bg-[#031B23]/40 p-5">
//                 <div className="flex items-center gap-3 mb-5 border-b border-white/5 pb-3">
//                   <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#19D8D0] to-[#64BDB7] flex items-center justify-center shadow-[0_0_15px_rgba(25,216,208,0.4)]">
//                     <Hash size={16} className="text-[#031B23]" />
//                   </div>
//                   <div>
//                     <h3 className="text-xs font-semibold tracking-[0.1em] text-[#19D8D0] uppercase">
//                       Referral & Placement
//                     </h3>
//                     <p className="text-[10px] text-slate-400">Connect with your sponsor</p>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-xs font-medium text-slate-300">
//                     Referral ID <span className="text-[#19D8D0]">*</span>
//                   </label>
//                   <div
//                     className={cn(
//                       inputWrapper,
//                       form.formState.errors.referralId &&
//                       "border-red-500/60 focus-within:border-red-500 focus-within:ring-red-500/30 hover:border-red-500/60"
//                     )}
//                   >
//                     <input
//                       {...form.register("referralId")}
//                       type="text"
//                       maxLength={9}
//                       placeholder="Enter Referral ID"
//                       className={`${inputField} px-5`}
//                       onBlur={(e) => {
//                         form.trigger("referralId");
//                         if (e.target.value) handleReferralValidation(e.target.value);
//                       }}
//                     />
//                     {validateReferral.isPending && (
//                       <Loader2 className="absolute right-4 text-[#19D8D0] animate-spin" size={18} />
//                     )}
//                     {referralName && !referralError && !validateReferral.isPending && (
//                       <CheckCircle2 className="absolute right-4 text-emerald-400" size={18} />
//                     )}
//                     {referralError && (
//                       <XCircle className="absolute right-4 text-red-400" size={18} />
//                     )}
//                   </div>

//                   {/* Referral Messages */}
//                   {form.formState.errors.referralId && (
//                     <p className="mt-1.5 text-xs text-red-400">
//                       {form.formState.errors.referralId.message}
//                     </p>
//                   )}
//                   {referralError && !form.formState.errors.referralId && (
//                     <p className="mt-1.5 text-xs text-red-400">{referralError}</p>
//                   )}
//                   {referralName && !referralError && (
//                     <p className="mt-1.5 text-xs font-medium text-emerald-400">
//                       {referralName}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Section 2: Personal Information */}
//               <div className="rounded-xl border border-white/5 bg-[#031B23]/40 p-5">
//                 <div className="flex items-center gap-3 mb-5 border-b border-white/5 pb-3">
//                   <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#19D8D0] to-[#64BDB7] flex items-center justify-center shadow-[0_0_15px_rgba(25,216,208,0.4)]">
//                     <User size={16} className="text-[#031B23]" />
//                   </div>
//                   <h3 className="text-xs font-semibold tracking-[0.1em] text-[#19D8D0] uppercase">
//                     Personal Information
//                   </h3>
//                 </div>

//                 <div className="grid gap-4 sm:grid-cols-2">
//                   {/* First Name */}
//                   <div>
//                     <label className="mb-2 block text-xs font-medium text-slate-300">
//                       First Name <span className="text-[#19D8D0]">*</span>
//                     </label>
//                     <div
//                       className={cn(
//                         inputWrapper,
//                         form.formState.errors.firstName &&
//                         "border-red-500/60 focus-within:border-red-500 focus-within:ring-red-500/30 hover:border-red-500/60"
//                       )}
//                     >
//                       <User size={18} className="absolute left-4 text-slate-500" />
//                       <input
//                         {...form.register("firstName")}
//                         maxLength={100}
//                         placeholder="John"
//                         className={inputField}
//                       />
//                     </div>
//                     {form.formState.errors.firstName && (
//                       <p className="mt-1.5 text-xs text-red-400">
//                         {form.formState.errors.firstName.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Last Name */}
//                   <div>
//                     <label className="mb-2 block text-xs font-medium text-slate-300">
//                       Last Name <span className="text-[#19D8D0]">*</span>
//                     </label>
//                     <div
//                       className={cn(
//                         inputWrapper,
//                         form.formState.errors.lastName &&
//                         "border-red-500/60 focus-within:border-red-500 focus-within:ring-red-500/30 hover:border-red-500/60"
//                       )}
//                     >
//                       <User size={18} className="absolute left-4 text-slate-500" />
//                       <input
//                         {...form.register("lastName")}
//                         maxLength={100}
//                         placeholder="Doe"
//                         className={inputField}
//                       />
//                     </div>
//                     {form.formState.errors.lastName && (
//                       <p className="mt-1.5 text-xs text-red-400">
//                         {form.formState.errors.lastName.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Email Address */}
//                   <div>
//                     <label className="mb-2 block text-xs font-medium text-slate-300">
//                       Email Address <span className="text-[#19D8D0]">*</span>
//                     </label>
//                     <div
//                       className={cn(
//                         inputWrapper,
//                         form.formState.errors.email &&
//                         "border-red-500/60 focus-within:border-red-500 focus-within:ring-red-500/30 hover:border-red-500/60"
//                       )}
//                     >
//                       <Mail size={18} className="absolute left-4 text-slate-500" />
//                       <input
//                         {...form.register("email")}
//                         maxLength={100}
//                         placeholder="john@example.com"
//                         className={inputField}
//                       />
//                     </div>
//                     {form.formState.errors.email && (
//                       <p className="mt-1.5 text-xs text-red-400">
//                         {form.formState.errors.email.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Password */}
//                   <div>
//                     <label className="mb-2 block text-xs font-medium text-slate-300">
//                       Password <span className="text-[#19D8D0]">*</span>
//                     </label>
//                     <div
//                       className={cn(
//                         inputWrapper,
//                         form.formState.errors.password &&
//                         "border-red-500/60 focus-within:border-red-500 focus-within:ring-red-500/30 hover:border-red-500/60"
//                       )}
//                     >
//                       <Lock size={18} className="absolute left-4 text-slate-500" />
//                       <input
//                         {...form.register("password")}
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Create a strong password"
//                         className={`${inputField} pr-12`}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword((v) => !v)}
//                         className="absolute right-4 text-slate-500 hover:text-[#19D8D0] transition-colors"
//                         aria-label={showPassword ? "Hide password" : "Show password"}
//                       >
//                         {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                       </button>
//                     </div>

//                     {/* Password Strength Meter */}
//                     {passwordValue && (
//                       <div className="mt-2" aria-live="polite">
//                         <div className="mb-1.5 flex items-center justify-between text-[11px]">
//                           <span className="text-slate-400">Password strength</span>
//                           <span
//                             className={cn(
//                               "font-semibold",
//                               passwordStrength <= 2
//                                 ? "text-red-400"
//                                 : passwordStrength <= 3
//                                   ? "text-amber-300"
//                                   : "text-emerald-400"
//                             )}
//                           >
//                             {passwordStrengthLabel}
//                           </span>
//                         </div>
//                         <div className="flex gap-1">
//                           {passwordStrengthChecks.map((_, index) => (
//                             <span
//                               key={index}
//                               className={cn(
//                                 "h-1.5 flex-1 rounded-full bg-slate-700/70",
//                                 index < passwordStrength && passwordStrengthColor
//                               )}
//                             />
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {form.formState.errors.password && (
//                       <p className="mt-1.5 text-xs text-red-400">
//                         {form.formState.errors.password.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Terms */}
//               <div className="flex flex-col gap-1 px-1">
//                 <div className="flex items-start gap-3">
//                   <input
//                     {...form.register("termsAccepted")}
//                     type="checkbox"
//                     id="termsAccepted"
//                     className="mt-0.5 h-4 w-4 cursor-pointer rounded border-white/20 bg-[#031B23] accent-[#19D8D0]"
//                   />
//                   <label
//                     htmlFor="termsAccepted"
//                     className="text-xs leading-relaxed text-slate-400 sm:text-sm cursor-pointer"
//                   >
//                     I agree to the{" "}
//                     <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#19D8D0] hover:underline">
//                       Terms &amp; Conditions
//                     </Link>{" "}
//                     and{" "}
//                     <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#19D8D0] hover:underline">
//                       Privacy Policy
//                     </Link>
//                   </label>
//                 </div>
//                 {form.formState.errors.termsAccepted && (
//                   <p className="text-xs text-red-400 mt-1 ml-7">
//                     {form.formState.errors.termsAccepted.message}
//                   </p>
//                 )}
//               </div>

//               {/* Submit Button (Pehle OTP send karega) */}
//               <button
//                 type="submit"
//                 disabled={sendOtpReg.isPending}
//                 className="q-focus group flex w-full items-center justify-center gap-2 rounded-xl bg-[#19D8D0] py-4 text-[#031B23] text-sm font-semibold shadow-[0_0_20px_rgba(25,216,208,0.3)] transition-all duration-300 hover:bg-[#7FF3EC] hover:shadow-[0_0_40px_rgba(25,216,208,0.6)] mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
//               >
//                 {sendOtpReg.isPending ? (
//                   <>
//                     <Loader2 size={18} className="animate-spin" />
//                     SENDING OTP...
//                   </>
//                 ) : (
//                   <>
//                     CREATE ACCOUNT{" "}
//                     <ArrowRight
//                       size={18}
//                       className="transition-transform group-hover:translate-x-1"
//                     />
//                   </>
//                 )}
//               </button>
//             </form>
//           </FormProvider>

//           {/* Footer */}
//           <div className="mt-8 flex flex-col items-center w-full">
//             <div className="flex items-center justify-center gap-3 w-full mb-4">
//               <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#19D8D0]/30" />
//               <span className="text-[10px] tracking-[0.3em] text-slate-500 uppercase">
//                 OR
//               </span>
//               <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#19D8D0]/30" />
//             </div>

//             <p className="text-sm text-slate-400 mb-6 text-center">
//               Already have an account?{" "}
//               <Link
//                 href="/login"
//                 className="font-medium text-[#19D8D0] hover:text-[#7FF3EC] transition-colors ml-1"
//               >
//                 Sign in
//               </Link>
//             </p>

//             <div className="w-full flex justify-center">
//               <p className="text-[10px] tracking-[0.2em] uppercase text-slate-500 flex items-center justify-center gap-2">
//                 <ShieldCheck className="w-3.5 h-3.5 text-[#19D8D0]" />
//                 Your data is encrypted & secure
//               </p>
//             </div>
//           </div>

//         </div>
//       </motion.div>

//       {/* ═══════════ OTP MODAL ═══════════ */}
//       <AnimatePresence>
//         {isOtpModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center bg-[#031B23]/80 backdrop-blur-md p-4"
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#031B23] shadow-[0_0_50px_-10px_rgba(25,216,208,0.4)]"
//             >
//               {/* Close Button */}
//               <button
//                 onClick={() => setIsOtpModalOpen(false)}
//                 className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
//               >
//                 <X size={20} />
//               </button>

//               <div className="p-8">
//                 <div className="mb-6 flex flex-col items-center text-center">
//                   <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#19D8D0] to-[#64BDB7] shadow-[0_0_20px_rgba(25,216,208,0.4)]">
//                     <ShieldCheck className="h-8 w-8 text-[#031B23]" />
//                   </div>
//                   <h3 className="font-display text-2xl font-bold tracking-wide text-white">
//                     Verify Your Email
//                   </h3>
//                   <p className="mt-2 text-sm text-slate-400">
//                     We&apos;ve sent a 6-digit code to <br />
//                     <span className="font-medium text-[#19D8D0]">{registeredEmail}</span>
//                   </p>
//                 </div>

//                 <form onSubmit={handleVerifyOtp}>
//                   <div className="mb-8 flex justify-center gap-2 sm:gap-3">
//                     {otp.map((digit, index) => (
//                       <input
//                         key={index}
//                         ref={(el) => {
//                           otpInputs.current[index] = el;
//                         }}
//                         type="text"
//                         inputMode="numeric"
//                         maxLength={1}
//                         value={digit}
//                         onChange={(e) => handleOtpChange(index, e.target.value)}
//                         onKeyDown={(e) => handleOtpKeyDown(index, e)}
//                         className="h-12 w-10 sm:h-14 sm:w-12 rounded-xl border border-white/10 bg-[#031B23]/80 text-center text-xl font-bold text-white outline-none transition-all focus:border-[#19D8D0] focus:ring-2 focus:ring-[#19D8D0]/30 sm:text-2xl"
//                         required
//                         disabled={isVerifying || registration.isPending}
//                       />
//                     ))}
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={otp.join("").length < 6 || isVerifying || registration.isPending}
//                     className="q-focus group flex w-full items-center justify-center gap-2 rounded-xl bg-[#19D8D0] py-4 text-[#031B23] text-sm font-semibold shadow-[0_0_20px_rgba(25,216,208,0.3)] transition-all duration-300 hover:bg-[#7FF3EC] hover:shadow-[0_0_40px_rgba(25,216,208,0.6)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#19D8D0]"
//                   >
//                     {isVerifying || registration.isPending ? (
//                       <>
//                         <Loader2 size={18} className="animate-spin" />
//                         {isVerifying ? "VERIFYING OTP..." : "CREATING ACCOUNT..."}
//                       </>
//                     ) : (
//                       <>
//                         VERIFY & CONTINUE
//                         <ArrowRight
//                           size={18}
//                           className="transition-transform group-hover:translate-x-1"
//                         />
//                       </>
//                     )}
//                   </button>
//                 </form>

//                 <div className="mt-6 text-center">
//                   <p className="text-xs text-slate-400">
//                     Didn&apos;t receive the code?{" "}
//                     <button
//                       type="button"
//                       onClick={() => {
//                       }}
//                       disabled={isVerifying || registration.isPending}
//                       className="font-medium text-[#19D8D0] hover:text-[#7FF3EC] transition-colors ml-1 disabled:opacity-50 disabled:hover:text-[#19D8D0]"
//                     >
//                       Resend
//                     </button>
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export default Register;



"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import {
  registrationSchema,
  type RegistrationFormValues,
} from "@/features/auth/schemas/auth.schema";
import {
  useRegistration,
  useValidateReferral,
  useSendOtpForRegistration
} from "@/features/auth/hooks/useRegistration";
import { cn } from "@/lib/utils";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Hash,
  Blocks,
  BrainCircuit,
  Network,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
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
  "w-full min-w-0 rounded-2xl bg-transparent py-3 pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-500 autofill:shadow-[inset_0_0_0_1000px_#0D131D] autofill:[-webkit-text-fill-color:#fff]";
const FOCUS_RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F18]";
const PRIMARY_BUTTON =
  "flex w-full items-center justify-center gap-2 rounded-full bg-[#E8F4F8] py-3.5 text-sm font-semibold text-[#060910] hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500";
const LABEL = "mb-2 block text-xs font-medium text-slate-300";
const ERROR_TEXT = "mt-1.5 text-xs text-red-400";
const SECTION_ICON =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300";
const SECTION_TITLE =
  "text-xs font-semibold uppercase tracking-[0.1em] text-cyan-300";

export function Register() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [referralName, setReferralName] = useState("");
  const [referralError, setReferralError] = useState("");

  // OTP Modal State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [pendingFormData, setPendingFormData] = useState<RegistrationFormValues | null>(null);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // API Hooks
  const registration = useRegistration();
  const validateReferral = useValidateReferral();
  const validateReferralMutation = validateReferral.mutateAsync;

  // Naya hook OTP send ke liye
  const sendOtpReg = useSendOtpForRegistration();

  // Form Setup
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      referralId: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      termsAccepted: undefined,
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Referral Validation Logic
  const handleReferralValidation = useCallback(
    async (referralId: string) => {
      setReferralError("");
      setReferralName("");
      try {
        const result = await validateReferralMutation(referralId);
        if (result.statusCode === 200) setReferralName(result.data.FullName);
        else setReferralError(result.message || "Referral ID not found");
      } catch {
        setReferralError("Invalid referral ID");
      }
    },
    [validateReferralMutation]
  );

  // URL Params Check for Referral
  useEffect(() => {
    if (!mounted || !searchParams) return;
    let ref = "";
    const possibleKeys = ["RefID", "Ref", "REF", "refid", "ref"];
    for (const key of possibleKeys) {
      const val = searchParams.get(key);
      if (val) {
        ref = val;
        break;
      }
    }
    if (ref.includes("~")) ref = ref.split("~")[0] || ref;
    if (ref) {
      form.setValue("referralId", ref);
      handleReferralValidation(ref);
    }
  }, [mounted, searchParams, form, handleReferralValidation]);

  // 1. FORM SUBMIT: Pehle OTP send karega
  const onSubmit = (values: RegistrationFormValues) => {
    setPendingFormData(values); // Data save kiya
    setRegisteredEmail(values.email);

    // OTP Send API Call
    sendOtpReg.mutate(
      { userid: values.email, password: values.password },
      {
        onSuccess: () => {
          // OTP send hone ke baad Modal open hoga
          setIsOtpModalOpen(true);
          setTimeout(() => otpInputs.current[0]?.focus(), 100);
        },
      }
    );
  };

  // OTP Input Handlers
  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  // 2. OTP VERIFY: OTP dalne ke baad Registration API call hogi
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6 || !pendingFormData) return;

    setIsVerifying(true);

    registration.mutate(
      {
        fName: pendingFormData.firstName,  // Small 'f'
        lName: pendingFormData.lastName,   // Small 'l'
        password: pendingFormData.password, // Small 'p'
        email: pendingFormData.email,
        introAuth: pendingFormData.referralId || undefined,
        OTP: otpValue, // Ab ye perfectly valid hai
      },
      {
        onSuccess: () => {
          setIsVerifying(false);
          setIsOtpModalOpen(false);
          resetFullForm();
        },
        onError: () => {
          setIsVerifying(false);
          resetOtpOnly();
        }
      }
    );
  };

  // Password Strength Logic
  const passwordValue = form.watch("password") || "";
  const passwordStrengthChecks = [
    passwordValue.length >= 8,
    /[a-z]/.test(passwordValue),
    /[A-Z]/.test(passwordValue),
    /\d/.test(passwordValue),
    /[@$!%*?&]/.test(passwordValue),
  ];
  const passwordStrength = passwordStrengthChecks.filter(Boolean).length;
  const passwordStrengthLabel =
    passwordStrength <= 2 ? "Weak" : passwordStrength <= 3 ? "Medium" : "Strong";
  const passwordStrengthColor =
    passwordStrength <= 2
      ? "bg-red-500"
      : passwordStrength <= 3
        ? "bg-amber-400"
        : "bg-emerald-500";


  const resetFullForm = () => {
    // 1. React Hook Form reset karega (default values par wapas)
    form.reset({
      referralId: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      termsAccepted: undefined,
    });

    // 2. OTP aur Modal ki state reset karega
    setOtp(["", "", "", "", "", ""]);
    setIsOtpModalOpen(false);
    setRegisteredEmail("");
    setPendingFormData(null);
    setReferralName("");
    setReferralError("");
    setShowPassword(false);
  };
  const resetOtpOnly = () => {
    // OTP array ko khali kar dega
    setOtp(["", "", "", "", "", ""]);

    // Pehle input box par focus wapas le aayega
    setTimeout(() => {
      otpInputs.current[0]?.focus();
    }, 100);
  };

  const { errors } = form.formState;

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center bg-[#060910] px-4 py-6 sm:px-8">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0" style={GLOW_STYLE} />
        <div className="absolute inset-0" style={GRID_STYLE} />
      </div>

      <div className="grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        {/* LEFT: branding */}
        <div className="hidden lg:block">
          <div className="mb-14 flex items-center gap-1 text-2xl font-bold tracking-wide text-white">
            <img src="/logos/quzo-logo-light.png" alt="" className="h-16 w-16" />
            Quzo
          </div>

          <h1 className="text-6xl font-semibold leading-[1.08] tracking-tight text-white xl:text-7xl">
            Join the <br />
            <span className="text-cyan-300">New Era.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
            Powering the future of wealth through AI and decentralised finance. Create
            your account to get started.
          </p>

          <ul className="mt-12 grid max-w-xl grid-cols-3 gap-3">
            {CAPABILITIES.map(({ icon: Icon, text, accent }) => (
              <li key={text} className="rounded-2xl border border-white/10 bg-[#0A0F18] p-4">
                <Icon size={22} className={accent} />
                <p className="mt-4 text-[13px] leading-5 text-slate-300">{text}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT: form */}
        <div className="mx-auto w-full max-w-[580px] rounded-[28px] border border-white/10 bg-[#0A0F18] p-6 shadow-2xl shadow-black/50 sm:px-8 sm:py-8">
          {/* Header */}
          <Link
            href="/"
            className={cn("mb-6 block rounded-lg hover:opacity-80", FOCUS_RING)}
          >
            <div className="mb-3 flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-300">
              <span className="h-px w-6 bg-cyan-300" aria-hidden="true" />
              Join the New Era
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              CREATE <span className="text-cyan-300">ACCOUNT</span>
            </h2>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
              Powering the future of wealth
            </p>
          </Link>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              autoComplete="off"
            >
              {/* Section 1: Referral & Placement */}
              <section>
                <div className="mb-3 flex items-center gap-3">
                  <div className={SECTION_ICON}>
                    <Hash size={16} />
                  </div>
                  <div>
                    <h3 className={SECTION_TITLE}>Referral &amp; Placement</h3>
                    <p className="text-[11px] text-slate-400">Connect with your sponsor</p>
                  </div>
                </div>

                <label htmlFor="referralId" className={LABEL}>
                  Referral ID <span className="text-cyan-300">*</span>
                </label>
                <div className={cn(INPUT_WRAPPER, errors.referralId && INPUT_ERROR)}>
                  <input
                    {...form.register("referralId")}
                    id="referralId"
                    type="text"
                    maxLength={9}
                    placeholder="Enter Referral ID"
                    className={cn(INPUT_FIELD, "pl-5 pr-12")}
                    onBlur={(e) => {
                      form.trigger("referralId");
                      if (e.target.value) handleReferralValidation(e.target.value);
                    }}
                  />
                  {validateReferral.isPending && (
                    <Loader2 className="absolute right-4 text-cyan-300" size={18} />
                  )}
                  {referralName && !referralError && !validateReferral.isPending && (
                    <CheckCircle2 className="absolute right-4 text-emerald-400" size={18} />
                  )}
                  {referralError && (
                    <XCircle className="absolute right-4 text-red-400" size={18} />
                  )}
                </div>

                {/* Referral Messages */}
                {errors.referralId && (
                  <p className={ERROR_TEXT}>{errors.referralId.message}</p>
                )}
                {referralError && !errors.referralId && (
                  <p className={ERROR_TEXT}>{referralError}</p>
                )}
                {referralName && !referralError && (
                  <p className="mt-1.5 text-xs font-medium text-emerald-400">
                    {referralName}
                  </p>
                )}
              </section>

              {/* Section 2: Personal Information */}
              <section className="border-t border-white/10 pt-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className={SECTION_ICON}>
                    <User size={16} />
                  </div>
                  <h3 className={SECTION_TITLE}>Personal Information</h3>
                </div>

                <div className="grid gap-x-3 gap-y-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className={LABEL}>
                      First Name <span className="text-cyan-300">*</span>
                    </label>
                    <div className={cn(INPUT_WRAPPER, errors.firstName && INPUT_ERROR)}>
                      <User size={18} className="pointer-events-none absolute left-4" />
                      <input
                        {...form.register("firstName")}
                        id="firstName"
                        maxLength={100}
                        placeholder="John"
                        className={INPUT_FIELD}
                      />
                    </div>
                    {errors.firstName && (
                      <p className={ERROR_TEXT}>{errors.firstName.message}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className={LABEL}>
                      Last Name <span className="text-cyan-300">*</span>
                    </label>
                    <div className={cn(INPUT_WRAPPER, errors.lastName && INPUT_ERROR)}>
                      <User size={18} className="pointer-events-none absolute left-4" />
                      <input
                        {...form.register("lastName")}
                        id="lastName"
                        maxLength={100}
                        placeholder="Doe"
                        className={INPUT_FIELD}
                      />
                    </div>
                    {errors.lastName && (
                      <p className={ERROR_TEXT}>{errors.lastName.message}</p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label htmlFor="email" className={LABEL}>
                      Email Address <span className="text-cyan-300">*</span>
                    </label>
                    <div className={cn(INPUT_WRAPPER, errors.email && INPUT_ERROR)}>
                      <Mail size={18} className="pointer-events-none absolute left-4" />
                      <input
                        {...form.register("email")}
                        id="email"
                        maxLength={100}
                        placeholder="john@example.com"
                        className={INPUT_FIELD}
                      />
                    </div>
                    {errors.email && (
                      <p className={ERROR_TEXT}>{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className={LABEL}>
                      Password <span className="text-cyan-300">*</span>
                    </label>
                    <div className={cn(INPUT_WRAPPER, errors.password && INPUT_ERROR)}>
                      <Lock size={18} className="pointer-events-none absolute left-4" />
                      <input
                        {...form.register("password")}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className={cn(INPUT_FIELD, "pr-10 placeholder:text-[13px]")}
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

                    {/* Password Strength Meter */}
                    {passwordValue && (
                      <div className="mt-2" aria-live="polite">
                        <div className="mb-1.5 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Password strength</span>
                          <span
                            className={cn(
                              "font-semibold",
                              passwordStrength <= 2
                                ? "text-red-400"
                                : passwordStrength <= 3
                                  ? "text-amber-300"
                                  : "text-emerald-400"
                            )}
                          >
                            {passwordStrengthLabel}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {passwordStrengthChecks.map((_, index) => (
                            <span
                              key={index}
                              className={cn(
                                "h-1.5 flex-1 rounded-full bg-slate-700/70",
                                index < passwordStrength && passwordStrengthColor
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {errors.password && (
                      <p className={ERROR_TEXT}>{errors.password.message}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Terms */}
              <div className="rounded-2xl border border-white/10 bg-[#0D131D] px-4 py-3">
                <div className="flex items-start gap-3">
                  <input
                    {...form.register("termsAccepted")}
                    type="checkbox"
                    id="termsAccepted"
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-cyan-300 [color-scheme:dark]"
                  />
                  <label
                    htmlFor="termsAccepted"
                    className="cursor-pointer text-xs leading-relaxed text-slate-300 sm:text-sm"
                  >
                    I agree to the{" "}
                    <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">
                      Terms &amp; Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.termsAccepted && (
                  <p className="ml-7 mt-2 text-xs text-red-400">
                    {errors.termsAccepted.message}
                  </p>
                )}
              </div>

              {/* Submit Button (Pehle OTP send karega) */}
              <button
                type="submit"
                disabled={sendOtpReg.isPending}
                className={cn(PRIMARY_BUTTON, FOCUS_RING)}
              >
                {sendOtpReg.isPending ? (
                  "SENDING OTP..."
                ) : (
                  <>
                    CREATE ACCOUNT
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </FormProvider>

          {/* Footer */}
          <div className="mt-6 text-center">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500">OR</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className={cn("rounded font-medium text-cyan-300 hover:text-white", FOCUS_RING)}
              >
                Sign in
              </Link>
            </p>

            <p className="mt-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
              Your data is encrypted &amp; secure
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════ OTP MODAL ═══════════ */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="otp-title"
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0A0F18] shadow-2xl shadow-black/60"
          >
            <div className="h-1 bg-cyan-300" aria-hidden="true" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOtpModalOpen(false)}
              aria-label="Close"
              className={cn(
                "absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-white/5 hover:text-white",
                FOCUS_RING
              )}
            >
              <X size={20} />
            </button>

            <div className="p-6 sm:p-8">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10">
                  <ShieldCheck className="h-8 w-8 text-cyan-300" />
                </div>
                <h3 id="otp-title" className="text-2xl font-semibold tracking-wide text-white">
                  Verify Your Email
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  We&apos;ve sent a 6-digit code to <br />
                  <span className="break-all font-medium text-cyan-300">{registeredEmail}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp}>
                <div className="mb-8 flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpInputs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      aria-label={`Digit ${index + 1}`}
                      className="h-12 w-full min-w-0 max-w-12 rounded-xl border border-white/10 bg-[#0D131D] text-center text-xl font-bold text-white outline-none focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 disabled:opacity-50 sm:h-14 sm:text-2xl"
                      required
                      disabled={isVerifying || registration.isPending}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={otp.join("").length < 6 || isVerifying || registration.isPending}
                  className={cn(PRIMARY_BUTTON, FOCUS_RING)}
                >
                  {isVerifying || registration.isPending ? (
                    isVerifying ? "VERIFYING OTP..." : "CREATING ACCOUNT..."
                  ) : (
                    <>
                      VERIFY &amp; CONTINUE
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-slate-400">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    onClick={() => {
                    }}
                    disabled={isVerifying || registration.isPending}
                    className={cn(
                      "ml-1 rounded font-medium text-cyan-300 hover:text-white disabled:opacity-50",
                      FOCUS_RING
                    )}
                  >
                    Resend
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
