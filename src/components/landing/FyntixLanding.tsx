


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
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import Nav from "@/components/landing/Nav";
import {Hero} from "@/components/landing/Hero";
import {Marquee} from "@/components/landing/Marquee";
import {Vision} from "@/components/landing/Vision";
import {Ecosystem} from "@/components/landing/Ecosystem";
import {Technology} from "@/components/landing/Technology";
import {Tokenomics} from "@/components/landing/Tokenomics";
import {Roadmap} from "@/components/landing/Roadmap";
import {Partner} from "@/components/landing/Partner";
import {Footer} from "@/components/landing/Footer";



export default function FyntixLanding() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contractCopyStatus, setContractCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const contractAddress = "0xA9650709005e8ad1798e42c539D3F1576E3b9850";

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
      <Marquee/>
      <Vision/>
      <Ecosystem/>
      <Technology/>
      <Tokenomics/>
      <Roadmap/>
      <Partner/>
      <Footer/>

    </main>
    </div>
  );
}