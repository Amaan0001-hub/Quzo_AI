// import { Navbar } from "@/components/layout/Navbar";
// import { Footer } from "@/components/layout/Footer";
// import { ProtectedContent } from "@/components/layout/ProtectedContent";
// import { WelcomeBanner } from "@/components/common/WelcomeBanner";
// import { MobileSidebar } from "@/components/layout/MobileSidebar";

// export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="protected-app flex min-h-screen flex-col bg-background text-foreground">
//       <Navbar />
//       <div className="flex flex-1 items-stretch">
//         <MobileSidebar />
//         <div className="flex min-w-0 flex-1 flex-col">
//           <main className="flex-1 p-6">
//             <WelcomeBanner />
//             <ProtectedContent>{children}</ProtectedContent>
//           </main>
//           <Footer />
//         </div>
//       </div>
//     </div>
//   );
// }


import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProtectedContent } from "@/components/layout/ProtectedContent";
import { WelcomeBanner } from "@/components/common/WelcomeBanner";
import { MobileSidebar } from "@/components/layout/MobileSidebar";

/* Static background: colors CSS variables se aate hain, jo theme ke saath badalte hain */
const GLOW_STYLE = {
  backgroundImage: [
    "radial-gradient(ellipse 55% 60% at 75% 45%, var(--glow-cyan), transparent 70%)",
    "radial-gradient(ellipse 45% 55% at 45% 65%, var(--glow-violet), transparent 70%)",
  ].join(","),
};

const GRID_STYLE = {
  backgroundImage:
    "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
  backgroundSize: "72px 72px",
  maskImage: "radial-gradient(ellipse 75% 75% at 50% 45%, #000 30%, transparent 100%)",
  WebkitMaskImage: "radial-gradient(ellipse 75% 75% at 50% 45%, #000 30%, transparent 100%)",
};

const THEME_CLASSES = [
  // Light
  "bg-[#F4F8FB] [--grid-line:rgba(15,23,42,0.07)] [--glow-cyan:rgba(6,182,212,0.14)] [--glow-violet:rgba(139,92,246,0.10)]",
  // Dark (login / register jaisa)
  "dark:bg-[#060910] dark:[--grid-line:rgba(148,163,184,0.06)] dark:[--glow-cyan:rgba(103,232,249,0.09)] dark:[--glow-violet:rgba(139,92,246,0.08)]",
].join(" ");

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`protected-app relative isolate flex min-h-screen flex-col text-foreground ${THEME_CLASSES}`}
    >
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0" style={GLOW_STYLE} />
        <div className="absolute inset-0" style={GRID_STYLE} />
      </div>

      <Navbar />
      <div className="flex flex-1 items-stretch">
        <MobileSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 p-6">
            <WelcomeBanner />
            <ProtectedContent>{children}</ProtectedContent>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
