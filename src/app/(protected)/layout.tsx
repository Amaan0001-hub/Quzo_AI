import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProtectedContent } from "@/components/layout/ProtectedContent";
import { WelcomeBanner } from "@/components/common/WelcomeBanner";
import { MobileSidebar } from "@/components/layout/MobileSidebar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
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
