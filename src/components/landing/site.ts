// Configurable links. Leave a value empty ("") until the official resource is published;
// empty links show a "coming soon" notice instead of a broken link.

export type SiteConfig = {
  whitepaperUrl: string;
  securityDocsUrl: string;
};

export const SITE: SiteConfig = {
  whitepaperUrl: "/quzo-whitepaper.pdf",
  securityDocsUrl: "",
};

export type NavLink = {
  id: string;
  label: string;
};

export const NAV_LINKS: NavLink[] = [
  { id: "home", label: "Home" },
  { id: "vision", label: "Vision" },
  { id: "ecosystem", label: "Ecosystem" },
  { id: "technology", label: "Technology" },
  { id: "tokenomics", label: "Tokenomics" },
  { id: "roadmap", label: "Roadmap" },
  { id: "contact", label: "Contact Us" },
];