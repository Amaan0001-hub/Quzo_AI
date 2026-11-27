import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy | Quzo",
  description:
    "Learn how Quzo collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  const sections = [
    {
      number: "01",
      title: "Information We Collect",
      content: (
        <>
          <p className="mb-4">
            We collect information you provide directly to us, including:
          </p>
          <ul className="ml-2 list-inside list-disc space-y-2 text-slate-400">
            <li>Name, email address, and phone number</li>
            <li>Account credentials and profile information</li>
            <li>Wallet addresses and transaction data (for DeFi interactions)</li>
            <li>Communication history with our support team</li>
            <li>Device and usage data (IP address, browser type)</li>
          </ul>
        </>
      ),
    },
    {
      number: "02",
      title: "How We Use Your Information",
      content: (
        <ul className="ml-2 list-inside list-disc space-y-2 text-slate-400">
          <li>To provide and maintain our AI-powered Web3 services</li>
          <li>To process account registrations and secure authentication</li>
          <li>To communicate platform updates, security alerts, and important notices</li>
          <li>To improve our algorithms, platform, and user experience</li>
          <li>To comply with legal and regulatory obligations (KYC/AML)</li>
        </ul>
      ),
    },
    {
      number: "03",
      title: "Information Sharing",
      content: (
        <p>
          We do not sell, trade, or rent your personal information to third
          parties. We may share data with trusted service providers (such as cloud infrastructure or blockchain analytics) who assist us in operating our platform, subject to strict confidentiality agreements.
        </p>
      ),
    },
    {
      number: "04",
      title: "Data Security",
      content: (
        <p>
          We implement industry-standard security measures including encryption, secure servers, and strict access controls to protect your personal information from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet or blockchain is 100% secure.
        </p>
      ),
    },
    {
      number: "05",
      title: "Cookies & Tracking",
      content: (
        <p>
          We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can disable cookies through your browser settings, though some features of the platform may not function properly.
        </p>
      ),
    },
    {
      number: "06",
      title: "Your Rights",
      content: (
        <ul className="ml-2 list-inside list-disc space-y-2 text-slate-400">
          <li>Access, update, or delete your personal information</li>
          <li>Opt-out of marketing communications</li>
          <li>Request a copy of your data</li>
          <li>Object to data processing in certain circumstances</li>
        </ul>
      ),
    },
    {
      number: "07",
      title: "Third-Party Links",
      content: (
        <p>
          Our platform may contain links to third-party websites or DeFi protocols. We are not responsible for the privacy practices or smart contract security of these external sites and encourage you to review their policies.
        </p>
      ),
    },
    {
      number: "08",
      title: "Contact Us",
      content: (
        <p>
          For privacy-related questions, contact us at{" "}
          <a
            href="mailto:support@quzo.com"
            className="text-[#7FF3EC] underline transition-colors hover:text-[#4FD1E0]"
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
      <main className="relative isolate min-h-screen overflow-hidden bg-[#05060A] px-4 pb-20 pt-32 text-white sm:px-6 sm:pb-24 sm:pt-36 lg:px-16">
        
        {/* Glow Effects matching the Home Page */}
        <div className="pointer-events-none absolute -right-36 -top-32 z-0 h-96 w-96 rounded-full bg-[#19D8D0]/5 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 z-0 h-[28rem] w-[28rem] rounded-full bg-[#19D8D0]/5 blur-[120px]" />
        
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="mb-16">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#4FD1E0]">
              Legal
            </p>
            <h1 className="mb-6 font-serif text-4xl leading-tight md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#4FD1E0] to-[#19D8D0]">
              Privacy Policy
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

          <div className="relative mb-12 overflow-hidden rounded-2xl border border-white/10 bg-[#0A0D14]/80 p-6 shadow-sm backdrop-blur-md md:p-8">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#4FD1E0] to-transparent opacity-50" />
            <p className="text-sm leading-relaxed text-slate-300 md:text-base">
              At Quzo, your privacy is important to us. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our AI-powered Web3 and DeFi platform.
            </p>
          </div>

          <div className="space-y-6">
            {sections.map((section) => (
              <section
                key={section.number}
                className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#0A0D14]/60 p-6 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-[#4FD1E0]/30 hover:shadow-[0_0_20px_rgba(79,209,224,0.1)] md:p-8"
              >
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#4FD1E0] to-transparent opacity-30" />
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#4FD1E0]">
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
              className="inline-flex items-center gap-2 text-sm font-medium text-[#4FD1E0] transition-colors hover:text-[#7FF3EC]"
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