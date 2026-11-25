


"use client";

import {
  ArrowLeftRight,
  Boxes,
  CalendarClock,
  Check,
  CircleDollarSign,
  Coins,
  Copy,
  Cpu,
  Droplets,
  ExternalLink,
  Gift,
  Globe,
  Lock,
  Network,
  Pickaxe,
  Settings2,
  ShieldCheck,
  Sprout,
  Users,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";

import { useEffect, useState } from "react";


import Nav from "@/components/landing/Nav";
import {Hero} from "@/components/landing/Hero";
import Footer from "@/components/landing/Footer";
import EditorialRibbon from "./EditorialRibbon";
import AgentMarketplace from "./AgentMarketplace";
import WorkflowSection from "./WorkflowSection";
import WorkforceExplorer from "./WorkforceExplorer";
import WorkspacePreview from "./WorkspacePreview";
import ValueCalculator from "./ValueCalculator";
import FinalCtaSection from "./FinalCtaSection";



export default function FyntixLanding() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contractCopyStatus, setContractCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  useEffect(() => {
    setMounted(true);
  }, []);



  if (!mounted) {
    return null;
  }

  return (
    <div className="quzo-home">          
    {/* <main className="bg-ink overflow-clip text-foreground"> */}
    <main className="overflow-clip">
       <Nav/>
      <Hero/>
      <EditorialRibbon/>
      <AgentMarketplace/>
      <WorkflowSection/>
      <WorkforceExplorer/>
      <WorkspacePreview/>
      <ValueCalculator/>
      <FinalCtaSection/>
       <Footer/>

    </main>
    </div>
  );
}