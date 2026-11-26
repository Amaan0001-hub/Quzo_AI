import type { NavItem } from "@/types/common";

export const primaryNav: NavItem[] = [
  {
    label: "Dashboard",
    href: "/home",
    icon: "home",
  },
  // {
  //   label: "Dashboard",
  //   href: "/dashboard",
  // },

  {
    label: "AI Agents",
    href: "/",
    isDropdown: true,
    dropdownItems: [
      { label: "By Agent License", href: "/investment-amount" },
      { label: "Deploy Agents", href: "/deploy-agents" },
      // { label: "Booster", href: "/booster" },
      { label: "License Purchase History", href: "/order-history" },
      { label: "Agent Deployment Report", href: "/deploy-report" },
    ],
  },

  {
    label: "My Assets",
    href: "/fund-director",
  },

  {
    label: "Analytics",
    href: "/analytics",
  },
  {
    label: "Business Network",
    href: "/affiliate",

    isDropdown: true,
    dropdownItems: [
      { label: "Business Overview", href: "/ai-business-hub" },
      { label: "My Partners", href: "/direct-partners" },
      { label: "Network Structure", href: "/network-tree" },
      // { label: "Level Partners Tree", href: "/intelligent-partner-view" },
      { label: "Extended Network", href: "/downline" },
      // { label: "Downline Tree", href: "/binary-tree" },
    ],
  },
  {
    label: "Reports",
    href: "/reports",

    isDropdown: true,
    dropdownItems: [
      { label: "Income Report", href: "/income-reports" },
      { label: "Wallet Manager", href: "/reports" },
      { label: "Rank", href: "/rank" },
    ],
  },
  {
    label: "Tools",
    href: "/ai-engine",
    isDropdown: true,
    dropdownItems: [
      // { label: "AI Engine", href: "/ai-engine" },
      // { label: "AI Assistant", href: "/ai-assistant" },
      { label: "AI Tools", href: "/ai-tools" },
    ],
  },
];
