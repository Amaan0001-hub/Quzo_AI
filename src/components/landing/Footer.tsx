import Image from "next/image";
import Link from "next/link";


/* ============================================================
   Inline Logo Component
   ============================================================ */
function Logo() {
  return (
    <span className="inline-flex items-center gap-2 sm:gap-[11px]">
      <Link href="/" className="flex items-center group">
        <Image
          src="/Home-Logo.png"
          className="h-auto w-auto"
          alt="Logo"
          width={50}
          height={20}
        />
      </Link>
      <span className="text-[13px] sm:text-[15px] font-bold tracking-[0.12em] text-white">
        QUZO<span className="font-medium text-[#65E7FF]">AI</span>
      </span>
    </span>
  );
}

/* ============================================================
   Inline LINKS
   ============================================================ */
const SITE = "https://QUZOai.vercel.app";
const LINKS = {
  contact: `${SITE}/#`,
  terms: `${SITE}/#`,
  privacy: `${SITE}/#`,
};

/* ============================================================
   Footer Data
   ============================================================ */
const PRODUCT: [string, string, string][] = [
  ["Platform", "#workspace", "platform"],
  ["AI Agents", "#agents", "agents"],
  ["Network", "#workforce", "network"],
  ["How It Works", "#how-it-works", "how-it-works"],
];

const LEGAL: [string, string, string][] = [
  ["Contact", LINKS.contact, "contact"],
  ["Terms & Conditions", LINKS.terms, "terms"],
  ["Privacy Policy", LINKS.privacy, "privacy"],
];

/* ============================================================
   Main Component: Footer
   ============================================================ */
export default function Footer() {
  return (
    <footer className="overflow-hidden border-t border-white/[0.08] bg-[#0a0e16]">
      <div className="w-[min(1240px,calc(100%-64px))] mx-auto grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-[70px] pt-[55px] pb-12">
        
        {/* Brand & Status */}
        <div>
          <a
            href="#top"
            data-testid="footer-brand-logo"
            aria-label="QUZO AI home"
            className="inline-block"
          >
            <Logo />
          </a>
          <p className="max-w-[390px] my-6 text-[#9aa8bc] text-[12px] leading-[1.7]">
            One unified ecosystem for specialized AI agents, intelligent
            workflows, and your next breakthrough.
          </p>
          <span className="flex items-center gap-2 text-[#6b7889] font-mono text-[8px] tracking-[0.13em]">
            <i className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_10px_#10b981]" />
            PUBLIC PRODUCT PREVIEW
          </span>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col items-start gap-3.5">
            <strong className="mb-[7px] text-[#6b7889] font-mono text-[8px] tracking-[0.15em]">EXPLORE</strong>
            {PRODUCT.map(([label, href, id]) => (
              <a 
                key={id} 
                href={href} 
                className="text-[#9aa8bc] text-[11px] hover:text-[#65e7ff] transition-colors duration-200" 
                data-testid={`footer-link-${id}`}
              >
                {label}
              </a>
            ))}
          </div>
          <div className="flex flex-col items-start gap-3.5">
            <strong className="mb-[7px] text-[#6b7889] font-mono text-[8px] tracking-[0.15em]">COMPANY</strong>
            {LEGAL.map(([label, href, id]) => (
              <a
                key={id}
                href={href}
                className="text-[#9aa8bc] text-[11px] hover:text-[#65e7ff] transition-colors duration-200"
                title={
                  href.endsWith("#")
                    ? "Integration placeholder — configure in config.js"
                    : undefined
                }
                data-testid={`footer-link-${id}`}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div 
        className="w-[min(1370px,calc(100%-40px))] mx-auto -mb-[2.5vw] text-center text-[#f5f7ff] font-bold text-[clamp(4.4rem,13.3vw,12rem)] leading-[0.8] tracking-[-0.075em] whitespace-nowrap opacity-[0.07]" 
        aria-hidden="true"
      >
        QUZO <span className="text-[#65e7ff]">AI</span>
      </div>

      {/* Bottom Bar */}
      <div className="w-[min(1240px,calc(100%-64px))] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 py-[22px] border-t border-white/[0.08] text-[#6b7889] font-mono text-[7px] tracking-[0.1em] leading-[1.4]">
        <span>© 2026 QUZO AI. All rights reserved.</span>
        <span>DESIGNED FOR INTELLIGENT WORK</span>
      </div>
    </footer>
  );
}
