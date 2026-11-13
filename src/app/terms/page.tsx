import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Terms & Conditions | Quzo",
  description:
    "Read Quzo's Terms & Conditions for using our AI-powered Web3 and DeFi ecosystem.",
};

export default function TermsPage() {
  const sections = [
    {
      number: "01",
      title: "Acceptance of Terms",
      content: (
        <p>
          By accessing or using the Quzo platform, you agree to be bound by
          these Terms & Conditions. If you do not agree with any part of these
          terms, you must not use our services.
        </p>
      ),
    },
    {
      number: "02",
      title: "Platform Services Only",
      content: (
        <>
          <p className="mb-4">
            Quzo provides an AI-powered Web3 and DeFi infrastructure{" "}
            <strong className="font-semibold text-white">
              for informational and trading purposes only
            </strong>
            . Nothing on this website constitutes:
          </p>
          <ul className="ml-2 list-inside list-disc space-y-2 text-slate-400">
            <li>Financial, investment, or trading advice</li>
            <li>A promise or guarantee of returns or profits</li>
            <li>A solicitation to buy or sell any digital asset</li>
            <li>Personalized financial planning</li>
          </ul>
        </>
      ),
    },
    {
      number: "03",
      title: "Risk Disclosure",
      content: (
        <p>
          Trading digital assets and interacting with decentralized finance (DeFi) protocols involve substantial risk of loss. You should carefully consider your investment objectives, level of experience, and risk appetite. Never trade with capital you cannot afford to lose. Quzo does not guarantee the safety of third-party smart contracts.
        </p>
      ),
    },
    {
      number: "04",
      title: "User Responsibilities",
      content: (
        <ul className="ml-2 list-inside list-disc space-y-2 text-slate-400">
          <li>Provide accurate registration and KYC information</li>
          <li>Maintain the strict confidentiality of your wallet credentials</li>
          <li>Use the platform in compliance with local and international laws</li>
          <li>Not engage in market manipulation or exploit platform vulnerabilities</li>
        </ul>
      ),
    },
    {
      number: "05",
      title: "Intellectual Property",
      content: (
        <p>
          All content, AI algorithms, trading bots, design elements, and infrastructure code on the Quzo platform are the intellectual property of Quzo and are protected by copyright laws. Unauthorized use or distribution is strictly prohibited.
        </p>
      ),
    },
    {
      number: "06",
      title: "Limitation of Liability",
      content: (
        <p>
          Quzo shall not be held liable for any direct, indirect, incidental, or consequential damages arising from your use of our services, smart contract failures, network congestion, or any trading decisions you make.
        </p>
      ),
    },
    {
      number: "07",
      title: "Modifications to Terms",
      content: (
        <p>
          We reserve the right to modify these Terms & Conditions at any time.
          Continued use of the platform after changes constitutes your
          acceptance of the revised terms.
        </p>
      ),
    },
    {
      number: "08",
      title: "Contact Information",
      content: (
        <p>
          For any questions regarding these Terms, please contact us at{" "}
          <a
            href="mailto:support@quzo.com"
            className="text-[#19D8D0] underline transition-colors hover:text-[#7FF3EC]"
          >
            support@quzo.com
          </a>
          .
        </p>
      ),
    },
  ];

  return (
    <>
      {/* <PublicNavbar /> - Header Removed */}
      <main className="relative isolate overflow-hidden bg-[#031B23] px-4 pb-20 pt-24 text-white sm:px-6 sm:pb-24 sm:pt-28 lg:px-16">
        
        {/* Glow Effects in Quzo Colors */}
        <div className="pointer-events-none absolute -right-36 -top-32 z-0 h-96 w-96 rounded-full bg-[#19D8D0]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 z-0 h-[28rem] w-[28rem] rounded-full bg-[#64BDB7]/10 blur-3xl" />
        
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="mb-16">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#19D8D0]">
              Legal
            </p>
            <h1 className="mb-6 font-serif text-4xl leading-tight md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#19D8D0] to-[#64BDB7]">
              Terms & Conditions
            </h1>
            <p className="text-sm text-slate-400">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="relative mb-12 overflow-hidden rounded-2xl border border-white/10 bg-[#031B23]/70 p-6 shadow-sm backdrop-blur-md md:p-8">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#19D8D0] to-transparent" />
            <p className="text-sm leading-relaxed text-slate-300 md:text-base">
              Welcome to Quzo. These Terms & Conditions govern your use of our
              AI-powered Web3 ecosystem, decentralized finance (DeFi) tools, intelligent trading solutions, and related services.
            </p>
          </div>

          <div className="space-y-6">
            {sections.map((section) => (
              <section
                key={section.number}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#031B23]/70 p-6 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-[#19D8D0]/50 hover:shadow-[0_0_20px_rgba(25,216,208,0.15)] md:p-8"
              >
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#19D8D0] to-transparent opacity-50" />
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#19D8D0]">
                  Section {section.number}
                </p>
                <h2 className="mb-4 font-serif text-2xl text-white md:text-3xl">
                  {section.title}
                </h2>
                <div className="text-sm leading-relaxed text-slate-300 md:text-base">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 border-t border-white/10 pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#19D8D0] transition-colors hover:text-[#7FF3EC]"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}