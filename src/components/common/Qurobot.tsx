import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";

// ---------- TYPES ----------
interface KBEntry {
  id: string;
  keys: string[];
  a: string;
}

interface QuickButton {
  label: string;
  q: string;
}

interface Message {
  role: "bot" | "user";
  text: string;
}

// ---------- KNOWLEDGE BASE FROM QUZO PITCH DECK (quzo-v1.pdf) ----------
// Each entry: keys = phrases/words that trigger it (English + Hinglish), a = answer.
// Longer matching phrase = higher priority, so specific questions win over generic ones.
const KB: KBEntry[] = [
  // ---------- GREETING ----------
  {
    id: "greeting",
    keys: ["hi", "hello", "hey", "namaste", "hii"],
    a: "Namaste! Main QUZO ke baare me aapki madad kar sakta hoon — AI trading, strategy plans, referral income, ranks, salary, DAO, withdrawal aur tokens.",
  },

  // ---------- ABOUT QUZO ----------
  {
    id: "about",
    keys: ["what is quzo", "about quzo", "quzo kya hai", "kya hai quzo", "tell me about quzo", "quzo", "introduction"],
    a: "QUZO is an AI-powered, EVM-compatible blockchain ecosystem that connects digital assets, Forex markets and intelligent trading.\n\nTagline: Intelligence Meets Decentralised Finance.",
  },
  {
    id: "vision",
    keys: ["vision", "objective", "objectives", "goal", "goals", "purpose", "mission"],
    a: "QUZO's vision is to build a more intelligent financial ecosystem. Objectives:\n1. Make advanced trading intelligence more accessible\n2. Connect crypto and Forex market infrastructure\n3. Enable transparent blockchain-based financial applications\n4. Give users greater control over digital assets\n5. Build for developers and financial application partners",
  },
  {
    id: "ecosystem",
    keys: ["ecosystem", "components", "six components", "products", "modules", "what does quzo offer", "what does quzo do"],
    a: "QUZO is one ecosystem with six components:\n1. QUZO Chain — EVM-compatible blockchain for smart contracts and dApps\n2. QUZO AI — market analysis, insights and configurable strategies\n3. QUZO Trade — interface for supported crypto and Forex integrations\n4. QUZO DeFi — planned swaps, liquidity and decentralised apps\n5. QUZO Wallet — digital-asset management and ecosystem access\n6. QUZO Liquidity — planned liquidity coordination for supported apps",
  },
  {
    id: "problem",
    keys: ["problem", "fragmented", "challenge", "issue in market", "why needed"],
    a: "QUZO addresses 5 problems:\n1. Fragmented market access — crypto and Forex run on separate platforms\n2. Complex trading decisions — too much information to interpret\n3. Limited intelligent automation — few configurable AI tools\n4. Disconnected infrastructure — wallets, trading, liquidity and dApps work independently\n5. Trust & transparency — users need visibility into permissions, execution, risks and asset movements",
  },
  {
    id: "why",
    keys: ["why quzo", "why choose", "why join", "advantage", "advantages", "different", "benefit", "benefits"],
    a: "Six reasons to choose QUZO:\n1. EVM compatibility — familiar smart-contract tooling\n2. AI-driven intelligence — analysis and authorised automation\n3. Multi-market vision — connects crypto apps with Forex infrastructure\n4. Connected ecosystem — blockchain, AI, wallet, trading and DeFi together\n5. Fixed maximum supply of QUZO tokens\n6. Long-term, phased development roadmap",
  },
  {
    id: "audience",
    keys: ["who is it for", "who can join", "audience", "target users", "designed for", "who can use"],
    a: "QUZO is designed for: retail traders, crypto users, Forex participants, developers (EVM smart contracts), liquidity providers (eligible programmes) and strategic partners (market data, trading infrastructure, wallets, fintech services).",
  },

  // ---------- TECHNOLOGY ----------
  {
    id: "chain",
    keys: ["chain", "blockchain", "evm", "smart contract", "smart contracts", "dapp", "dapps", "ethereum"],
    a: "QUZO Chain is planned as an EVM-compatible blockchain, so developers can build and deploy smart contracts using familiar Ethereum-compatible tools.\n\nCapabilities: smart-contract execution, dApp support, digital-asset and token infrastructure, compatible wallet/developer tooling, smart-contract-based ecosystem services and transparent on-chain records.",
  },
  {
    id: "ai",
    keys: ["quzo ai", "ai trading", "ai", "artificial intelligence", "autonomous", "safeguard", "safeguards", "trading bot", "bot", "bots", "how does ai work"],
    a: "QUZO AI is the intelligence layer: it analyses market data, indicators, trends and volatility, generates insights, helps configure strategies, recommends risk parameters and monitors portfolios.\n\nTwo modes:\n• AI-Assisted Trading — AI generates insights and suggestions, the user reviews and decides.\n• Authorised Autonomous Trading — the user authorises an agent with explicit permissions and risk limits; authorisation is revocable.\n\nSafeguards: capital allocation, maximum-loss parameters, exposure & leverage limits, restricted execution, revocable authorisation, activity monitoring.",
  },
  {
    id: "trade",
    keys: ["quzo trade", "forex", "crypto trading", "broker", "brokers", "trading interface", "markets"],
    a: "QUZO Trade is an interface for supported crypto and Forex integrations. QUZO aims to connect crypto applications with Forex infrastructure, including exploring authorised Forex brokers during the testing & integrations phase.",
  },
  {
    id: "wallet",
    keys: ["wallet", "quzo wallet"],
    a: "QUZO Wallet is for digital-asset management and ecosystem access. Secure key management is one of QUZO's security priorities. Tokens from withdrawal-linked allocation are credited to your QUZO wallet.",
  },
  {
    id: "defi",
    keys: ["defi", "quzo defi", "swap", "swaps", "staking", "lending"],
    a: "QUZO DeFi covers planned swaps, liquidity and decentralised financial applications. Eligible DeFi services (e.g. staking, lending, yield) may also generate ecosystem fees.",
  },
  {
    id: "liquidity",
    keys: ["liquidity", "quzo liquidity", "liquidity provider", "liquidity providers"],
    a: "QUZO Liquidity is planned liquidity coordination for supported applications. Liquidity providers can join eligible liquidity programmes, subject to design and requirements.",
  },
  {
    id: "security",
    keys: ["security", "secure", "audit", "audits", "oracle", "architecture", "risk management", "is it safe"],
    a: "QUZO's proposed security priorities:\n• Independent smart-contract audits\n• Secure key management\n• Restricted, revocable AI permissions\n• Monitoring and incident response\n• Data-source validation\n• Transparent risk disclosures\n\nArchitecture has 6 layers: Application, Integration, Risk Management, Data & Oracle, AI Intelligence (off-chain) and Blockchain (on-chain).\n\nNote: this is a proposed architecture; audit status must be evidenced before any production-security claim.",
  },

  // ---------- TOKEN ----------
  {
    id: "utility",
    keys: ["utility", "token utility", "use of quzo", "use case", "use cases", "governance", "quzo token use"],
    a: "QUZO utility is designed around real ecosystem activity, not price-appreciation promises:\n1. Network activity — transaction fees and smart-contract activity\n2. AI services — supported AI services and agent operations\n3. Trading applications — may support QUZO payments\n4. DeFi applications — approved DeFi mechanisms\n5. Developer ecosystem — grants and incentives for builders\n6. Governance — eligible holders may join selected governance processes",
  },
  {
    id: "supply",
    keys: ["supply", "max supply", "maximum supply", "total supply", "tokenomics", "total token", "kitne token"],
    a: "QUZO has a fixed maximum supply of 8,000,000 QUZO (per the tokenomics slide). Total allocation: 100%.",
  },
  {
    id: "allocation",
    keys: ["allocation", "token distribution", "distribution of token", "allocate", "tokens split", "token allocation"],
    a: "Token allocation (8,000,000 QUZO total):\n• Ecosystem Growth & Rewards — 25% (2,000,000)\n• Liquidity & Market Development — 15% (1,200,000)\n• Treasury & Operations — 15% (1,200,000)\n• Core Team & Contributors — 12% (960,000)\n• Strategic Investors — 10% (800,000)\n• Foundation & Development — 10% (800,000)\n• Marketing & Partnerships — 8% (640,000)\n• Advisors — 5% (400,000)",
  },
  {
    id: "convert",
    keys: ["convert", "conversion", "pre-ico", "pre ico", "ico", "allocation price", "$1 per quzo", "price of quzo", "quzo price", "token from withdrawal", "quzo tokens"],
    a: "Withdrawal-linked token allocation: 10% of each withdrawal is deducted, and an equivalent value is used to credit QUZO tokens to your QUZO wallet.\n\nExample: $100 withdrawal → $10 deducted → at $1 per QUZO → 10 QUZO credited, and $90 remains.\n\nPre-ICO special allocation price: $1 per QUZO, exclusive for QUZO AI users.",
  },

  // ---------- BUSINESS & ROADMAP ----------
  {
    id: "revenue",
    keys: ["revenue", "business model", "how does quzo earn", "revenue channels", "company income"],
    a: "QUZO's potential revenue channels:\n1. Network services — fees from blockchain activity\n2. AI services — subscriptions and usage-based fees\n3. Trading integrations — revenue-share/integration fees from authorised partners\n4. DeFi applications — fees from eligible services (staking, lending, yield)\n5. Developer ecosystem — infrastructure, deployment and enterprise services\n6. Strategic partnerships — arrangements with wallets, exchanges, data providers and brokers",
  },
  {
    id: "roadmap",
    keys: ["roadmap", "phases", "phase", "timeline", "launch", "mainnet", "testnet", "future plan"],
    a: "QUZO's 5 proposed phases:\n1. Foundation — finalise brand/architecture, token design, AI requirements, security & compliance\n2. Development — EVM infrastructure, wallet & interfaces, AI prototypes, data/oracle integrations, internal testing\n3. Testing & Integrations — controlled testnet, contract testing, crypto data sources, authorised Forex brokers, security audits\n4. Ecosystem Launch — mainnet readiness, supported wallet & apps, eligible token utility, adoption programmes\n5. Global Expansion — more trading integrations, developer growth, DeFi apps, fintech partnerships, governance\n\nThese are proposed phases, not completed milestones.",
  },

  // ---------- AI STRATEGY SUBSCRIPTIONS ----------
  {
    id: "plans",
    keys: ["strategy subscription", "strategy subscriptions", "subscription", "package", "packages", "plan", "plans", "investment plan", "investment plans", "invest", "investment", "cross-dex", "cross dex", "arb", "mev", "sandwich", "minimum investment", "maximum investment", "income cap", "yield rate", "yield", "return", "returns"],
    a: "Two proposed AI Strategy Subscription packages:\n\n1) Cross-DEX Arb\n• Min investment: $50\n• Max investment: $999\n• Proposed yield: up to 12–16%\n• Income cap: 2.25×\n\n2) MEV Sandwich\n• Min investment: $1,000\n• Max investment: no upper limit specified\n• Proposed yield: up to 14–20%\n• Income cap: 3×\n\nThese are proposed terms; daily rewards are not guaranteed.",
  },
  {
    id: "usdt",
    keys: ["usdt", "paid in", "payout currency", "which currency", "payment currency"],
    a: "All AI Strategy Subscription Yield Income is paid exclusively in USDT.",
  },

  // ---------- INCOME PLAN ----------
  {
    id: "direct",
    keys: ["direct referral", "direct income", "referral", "referrals", "refer", "commission", "8%", "three levels", "3 levels"],
    a: "Direct Referral income is a total commission of 8%, distributed across three levels:\n• Level 1 (You): 5%\n• Level 2 (Upline): 2%\n• Level 3 (Next Upline): 1%\n• Total: 8%",
  },
  {
    id: "level",
    keys: ["level income", "20 levels", "levels", "level plan", "all levels", "unlock all levels", "unlock levels", "level"],
    a: "Level Income runs across 20 levels, total commission 30% of total business:\n• Level 1: 10%\n• Level 2: 5%\n• Level 3: 3%\n• Level 4: 2%\n• Levels 5–6: 1.5% each\n• Levels 7–10: 1% each\n• Levels 11–20: 0.3% each\n\nTo unlock all levels you need both:\n1. Minimum self-investment of $50 or above\n2. Direct referrals up to Level 5 — 1 direct for L1, 2 for L2, 3 for L3, 4 for L4, 5 for L5",
  },
  {
    id: "booster",
    keys: ["booster", "daily booster", "self reward booster", "reward booster", "boost"],
    a: "Daily Booster Program — earn an extra daily boost on your returns by achieving direct referrals within the time limit:\n• 3 directs within 24 hours → +0.3% daily booster\n• 5 directs within 48 hours → +0.5% daily booster\n\nEligibility: the total investment of your direct referrals (within 24 hours) must be equal to or greater than your own (self) investment.",
  },
  {
    id: "rank",
    keys: ["rank", "ranks", "rank reward", "rank rewards", "community ranks", "nova", "pioneer", "trader rank", "navigator", "elite", "strategist", "architect", "vanguard", "sovereign", "global apex", "apex"],
    a: "Rank rewards are linked to total business across your entire downline:\n• Nova — $5,000 business → $100\n• Pioneer — $15,000 → $250\n• Trader — $30,000 → $500\n• Navigator — $50,000 → $1,000\n• Elite — $75,000 → $2,000\n• Strategist — $110,000 → $3,000\n• Architect — $170,000 → $5,000\n• Vanguard — $250,000 → $7,500\n• Sovereign — $350,000 → $10,000\n• Global Apex — $500,000 → $15,000",
  },
  {
    id: "salary",
    keys: ["salary", "salary reward", "salary rewards", "monthly salary", "36 months", "36 month"],
    a: "Salary Rewards (paid over 36 months, 1% of rank business):\n• Nova ($5,000) — $50\n• Pioneer ($15,000) — $150\n• Trader ($30,000) — $300\n• Navigator ($50,000) — $500\n• Elite ($75,000) — $750\n• Strategist ($110,000) — $1,100\n• Architect ($170,000) — $1,700\n• Vanguard ($250,000) — $2,500\n• Sovereign ($350,000) — $3,500\n• Global Apex ($500,000) — $5,000\n\nExample: 1% on $5,000 = $50 total, paid over 36 months (≈ $1.39/month).\nEligibility: a minimum of 5% fresh business must be generated in the next month to remain eligible.",
  },
  {
    id: "dao",
    keys: ["dao", "dao partner", "dao partners", "shared reward pool", "reward pool"],
    a: "DAO Partner model:\n• Maximum DAO partners: 280\n• Qualification: $3,000 direct business within 15 days\n• Shared reward pool: 5% of the company's total deposits\n• Distribution: equal shares among all qualified DAO Partners\n• Payout: every Friday after weekly closing\n\nThis is a proposed reward structure.",
  },

  // ---------- TERMS & WITHDRAWAL ----------
  {
    id: "terms",
    keys: ["terms", "terms and conditions", "terms & conditions", "rules", "deposit charge", "deposit fee", "minimum withdrawal", "min withdrawal", "maximum withdrawal", "max withdrawal", "withdrawal limit", "processing time", "withdrawal time", "how long", "kitna time"],
    a: "Proposed Terms & Conditions:\n• Deposit charge: none\n• Withdrawal deduction: 0% (a 10% swap charge is aligned to QUZO coin allocation)\n• Minimum withdrawal: $5\n• Maximum withdrawal: no upper limit specified\n• Withdrawal processing target: within 12 hours\n\nFinal processing conditions and deduction mechanics remain subject to confirmation.",
  },
  {
    id: "withdrawal",
    keys: ["withdrawal", "withdraw", "withdrawal fee", "withdrawal charge", "withdrawal charges", "fee", "fees", "charge", "charges", "deduction", "swap charge", "swap charges", "10%"],
    a: "Withdrawal: there is no deposit charge and the withdrawal deduction is 0%. However, a 10% swap charge applies on withdrawals and is converted into QUZO tokens credited to your QUZO wallet (e.g. $100 withdrawal → $90 remaining + 10 QUZO at $1/QUZO).\n\nMinimum withdrawal is $5, no upper limit is specified, and the processing target is within 12 hours. Final mechanics remain subject to confirmation.",
  },

  // ---------- RISK / TRUST ----------
  {
    id: "risk",
    keys: ["guaranteed", "guarantee", "risk", "risks", "is quzo legit", "legit", "safe investment", "scam", "genuine"],
    a: "Per the pitch deck, all terms are proposed and daily rewards are not guaranteed. QUZO says utility should come from real application usage, not promises of price appreciation, and that security controls and audit status must be evidenced before any production-security claim. Please review the final terms carefully before investing.",
  },
];

// ---------- QUICK BUTTONS ----------
const QUICK: QuickButton[] = [
  { label: "What is QUZO?", q: "what is quzo" },
  { label: "AI trading?", q: "how does ai trading work" },
  { label: "Strategy plans?", q: "strategy subscription plans" },
  { label: "Direct referral?", q: "direct referral income" },
  { label: "Level income?", q: "level income" },
  { label: "Ranks?", q: "rank rewards" },
  { label: "Salary?", q: "salary rewards" },
  { label: "DAO Partner?", q: "dao partner" },
  { label: "Withdrawal?", q: "withdrawal fee" },
  { label: "Token supply?", q: "max supply" },
];

const FALLBACK =
  "Mujhe iska jawab QUZO deck me nahi mila. Aap ye pooch sakte hain:\n• What is QUZO?\n• AI trading\n• Strategy subscription plans\n• Direct referral / Level income\n• Daily Booster\n• Ranks & Salary\n• DAO Partner\n• Withdrawal & Terms\n• Token supply & allocation\n• Roadmap";

// ---------- ANSWER FINDER ----------
const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// phrase must start at a word boundary (so "withdraw" matches "withdrawal")
function hasPhrase(q: string, phrase: string): boolean {
  return new RegExp(`(^|[^a-z0-9])${escapeRe(phrase)}`, "i").test(q);
}

function findAnswer(input: string): string {
  const q = input.toLowerCase().trim();
  if (!q) return FALLBACK;

  let best: KBEntry | null = null;
  let bestScore = 0;

  for (const entry of KB) {
    let score = 0;
    for (const k of entry.keys) {
      if (hasPhrase(q, k)) {
        // longer, more specific phrases score higher; exact match gets a bonus
        score += k.length + (q === k ? 50 : 0);
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  // "hi" etc. should only win when the message is basically just a greeting
  if (best && best.id === "greeting" && q.split(/\s+/).length > 3) {
    best = null;
  }

  return best ? best.a : FALLBACK;
}

// ---------- THEME COLORS ----------
const C = {
  bgBase: "#0b1a24",
  bg1: "#0f1f2a",
  bg2: "#132430",
  bg3: "#172a36",
  bg4: "#1b303d",
  bgCard: "rgba(11, 26, 36, 0.85)",
  bgCard2: "rgba(11, 26, 36, 0.65)",
  bgHover: "rgba(34, 232, 212, 0.06)",
  border: "rgba(140, 180, 200, 0.14)",
  border2: "rgba(34, 232, 212, 0.28)",
  border3: "rgba(203, 164, 99, 0.28)",
  text1: "#eef3f8",
  text2: "#8ea0b5",
  text3: "#5c6c80",
  text4: "#3d4d60",
  shadow: "rgba(0, 0, 0, 0.6)",
  glowC: "rgba(34, 232, 212, 0.12)",
  glowP: "rgba(203, 164, 99, 0.1)",
  glass: "rgba(255, 255, 255, 0.025)",
  glass2: "rgba(255, 255, 255, 0.06)",
  sidebarBg: "rgba(11, 26, 36, 0.97)",
  inputBg: "rgba(255, 255, 255, 0.04)",
  primary: "#22E8D4",
  primaryLight: "rgba(34, 232, 212, 0.12)",
  primaryBorder: "rgba(34, 232, 212, 0.28)",
  secondary: "#CBA463",
  secondaryLight: "rgba(203, 164, 99, 0.12)",
  secondaryBorder: "rgba(203, 164, 99, 0.28)",
  userBg: "#22E8D4",
  userText: "#0b1a24",
  botBg: "rgba(255, 255, 255, 0.06)",
  botBorder: "rgba(140, 180, 200, 0.14)",
  statusBg: "rgba(34, 232, 212, 0.12)",
  statusText: "#22E8D4",
  statusBorder: "rgba(34, 232, 212, 0.28)",
  quickBtnBg: "rgba(203, 164, 99, 0.12)",
  quickBtnBorder: "rgba(203, 164, 99, 0.28)",
  quickBtnText: "#CBA463",
  quickBtnHoverBg: "rgba(34, 232, 212, 0.12)",
  quickBtnHoverBorder: "rgba(34, 232, 212, 0.28)",
  quickBtnHoverText: "#22E8D4",
  inputBorder: "rgba(140, 180, 200, 0.2)",
  sendBtnBg: "#22E8D4",
  sendBtnText: "#0b1a24",
  containerBg: "#0b1a24",
  containerBorder: "rgba(140, 180, 200, 0.14)",
  msgsBg: "#0f1f2a",
  headerBg: "rgba(11, 26, 36, 0.97)",
  typingBg: "rgba(255, 255, 255, 0.06)",
  typingBorder: "rgba(140, 180, 200, 0.14)",
  dotBg: "#5c6c80",
};

type ThemeColors = typeof C;

const LIGHT_C: ThemeColors = {
  ...C,
  bgBase: "#f7fbfc",
  shadow: "rgba(18, 38, 58, 0.12)",
  text1: "#12263a",
  text2: "#647785",
  text3: "#8a9ba7",
  primary: "#0e9c98",
  secondary: "#07dbc7",
  primaryLight: "rgba(24, 199, 194, 0.12)",
  primaryBorder: "rgba(24, 199, 194, 0.38)",
  statusBg: "rgba(24, 199, 194, 0.1)",
  statusText: "#0e716e",
  statusBorder: "rgba(14, 156, 152, 0.38)",
  botBg: "#ffffff",
  botBorder: "#ddebec",
  userBg: "#18c7c2",
  userText: "#12263a",
  typingBg: "#ffffff",
  typingBorder: "#ddebec",
  quickBtnBg: "rgba(184, 134, 42, 0.1)",
  quickBtnBorder: "rgba(184, 134, 42, 0.38)",
  quickBtnText: "#8a6212",
  quickBtnHoverBg: "rgba(24, 199, 194, 0.1)",
  quickBtnHoverBorder: "rgba(14, 156, 152, 0.38)",
  quickBtnHoverText: "#0e716e",
  inputBorder: "#ddebec",
  inputBg: "#ffffff",
  sendBtnBg: "#18c7c2",
  sendBtnText: "#12263a",
  containerBg: "#f7fbfc",
  containerBorder: "#ddebec",
  msgsBg: "#eef6f7",
  headerBg: "#ffffff",
  dotBg: "#8a9ba7",
};

// ---------- MAIN COMPONENT ----------
export default function Qurobot() {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "system";
  const colors: ThemeColors = isDark ? C : LIGHT_C;
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Namaste! Ask me anything about QUZO — AI trading, strategy plans, referral & level income, ranks, salary, DAO partner, withdrawal or tokens!" },
  ]);
  const [input, setInput] = useState<string>("");
  const [typing, setTyping] = useState<boolean>(false);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const ask = (q: string): void => {
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { role: "bot", text: findAnswer(q) }]);
    }, 600);
  };

  const send = (): void => {
    const q = input.trim();
    if (!q) return;
    setInput("");
    ask(q);
  };

  return (
    <div className="quzo-chatbot-card" style={{
      display: "flex",
      flexDirection: "column",
      height: "520px",
      borderRadius: 16,
      border: `1px solid ${colors.containerBorder}`,
      overflow: "hidden",
      background: colors.containerBg,
      fontFamily: "inherit",
      boxShadow: `0 4px 24px ${colors.shadow}`,
    }}>
      {/* Header */}
      <div style={{
        flexShrink: 0,
        padding: "10px 14px",
        background: colors.headerBg,
        borderBottom: `1px solid ${colors.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: colors.text1, lineHeight: 1.2 }}>🧠 AI Assistant</div>
            <div style={{ fontSize: 10, color: colors.text2 }}>QUZO Support</div>
          </div>
        </div>
        <div style={{
          fontSize: 10,
          color: colors.statusText,
          background: colors.statusBg,
          padding: "3px 10px",
          borderRadius: 6,
          border: `1px solid ${colors.statusBorder}`,
          fontWeight: 700,
        }}>ONLINE</div>
      </div>

      {/* Messages */}
      <div ref={msgsRef} style={{
        flex: 1,
        overflowY: "auto",
        padding: "12px 12px 8px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        background: colors.msgsBg,
        minHeight: 0,
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            flexDirection: msg.role === "user" ? "row-reverse" : "row",
            alignItems: "flex-start",
            gap: 6,
          }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              flexShrink: 0,
              background: msg.role === "bot" ? colors.primary : colors.secondary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 8,
              fontWeight: 700,
              color: colors.bgBase,
            }}>
              {msg.role === "bot" ? "QZ" : "U"}
            </div>
            <div style={{
              maxWidth: "76%",
              padding: "8px 11px",
              borderRadius: 10,
              fontSize: 11,
              lineHeight: 1.6,
              whiteSpace: "pre-line",
              background: msg.role === "bot" ? colors.botBg : colors.userBg,
              color: msg.role === "bot" ? colors.text1 : colors.userText,
              border: msg.role === "bot" ? `1px solid ${colors.botBorder}` : "none",
              borderTopLeftRadius: msg.role === "bot" ? 3 : 10,
              borderTopRightRadius: msg.role === "user" ? 3 : 10,
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {typing && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              flexShrink: 0,
              background: colors.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 8,
              fontWeight: 700,
              color: colors.bgBase,
            }}>QZ</div>
            <div style={{
              padding: "9px 13px",
              borderRadius: 10,
              borderTopLeftRadius: 3,
              background: colors.typingBg,
              border: `1px solid ${colors.typingBorder}`,
              display: "flex",
              gap: 4,
              alignItems: "center",
            }}>
              {[0, 1, 2].map((d) => (
                <span key={d} style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: colors.dotBg,
                  display: "inline-block",
                  animation: `qzBlink 1.2s ${d * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Buttons */}
      <div style={{
        flexShrink: 0,
        padding: "7px 10px",
        background: colors.headerBg,
        borderTop: `1px solid ${colors.border}`,
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
      }}>
        {QUICK.map((q) => (
          <button
            key={q.q}
            onClick={() => ask(q.q)}
            style={{
              background: colors.quickBtnBg,
              border: `1px solid ${colors.quickBtnBorder}`,
              padding: "3px 9px",
              borderRadius: 6,
              fontSize: 10,
              cursor: "pointer",
              color: colors.quickBtnText,
              fontWeight: 600,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.quickBtnHoverBg;
              e.currentTarget.style.borderColor = colors.quickBtnHoverBorder;
              e.currentTarget.style.color = colors.quickBtnHoverText;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.quickBtnBg;
              e.currentTarget.style.borderColor = colors.quickBtnBorder;
              e.currentTarget.style.color = colors.quickBtnText;
            }}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        flexShrink: 0,
        padding: "8px 10px",
        background: colors.headerBg,
        borderTop: `1px solid ${colors.border}`,
        display: "flex",
        gap: 6,
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about QUZO..."
          style={{
            flex: 1,
            fontSize: 11,
            padding: "6px 11px",
            borderRadius: 8,
            border: `1px solid ${colors.inputBorder}`,
            background: colors.inputBg,
            color: colors.text1,
            outline: "none",
          }}
        />
        <button
          onClick={send}
          style={{
            padding: "6px 14px",
            background: colors.sendBtnBg,
            color: colors.sendBtnText,
            border: "none",
            borderRadius: 8,
            fontSize: 11,
            cursor: "pointer",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          Send
        </button>
      </div>

      <style>{`
        .quzo-chatbot-card,
        .quzo-chatbot-card * {
          transition: background 0.35s ease, color 0.35s ease,
            border-color 0.35s ease, box-shadow 0.35s ease;
        }
        @keyframes qzBlink {
          0%, 80%, 100% { opacity: 0.25; }
          40% { opacity: 1; }
        }
        .quzo-chatbot-card ::-webkit-scrollbar {
          width: 4px;
        }
        .quzo-chatbot-card ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .quzo-chatbot-card ::-webkit-scrollbar-thumb {
          background: rgba(140, 180, 200, 0.2);
          border-radius: 2px;
        }
        .quzo-chatbot-card ::-webkit-scrollbar-thumb:hover {
          background: rgba(140, 180, 200, 0.3);
        }
        .quzo-chatbot-card input::placeholder {
          color: ${colors.text3};
        }
      `}</style>
    </div>
  );
}
