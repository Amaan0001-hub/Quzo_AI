import { BarChart3, Briefcase, Clapperboard, Code2, Headphones, Landmark, Megaphone, Palette, PenLine, Search, Users, Zap, type LucideIcon } from "lucide-react";

export type Block =
  | { type: "heading"; text: string }
  | { type: "text"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; lang: string; code: string }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "bars"; title: string; unit?: string; data: [string, number][] }
  | { type: "chat"; messages: [("customer" | "agent"), string][] }
  | { type: "scenes"; scenes: [string, string, string][] } // time, visual, voice-over
  | { type: "palette"; colors: [string, string][] };

export type Task = { prompt: string; result: Block[] };

export type Agent = {
  id: string;
  name: string;
  code: string;
  tagline: string;
  Icon: LucideIcon;
  color: string;
  steps: string[];
  tasks: Task[];
};

const h = (text: string): Block => ({ type: "heading", text });
const p = (text: string): Block => ({ type: "text", text });
const ul = (...items: string[]): Block => ({ type: "list", items });
const table = (head: string[], ...rows: string[][]): Block => ({ type: "table", head, rows });
const bars = (title: string, data: [string, number][], unit = ""): Block => ({ type: "bars", title, data, unit });

export const AGENTS: Agent[] = [
  {
    id: "coding", name: "Coding AI", code: "COMPILER", tagline: "Builds APIs, pages and components", Icon: Code2, color: "#3b82f6",
    steps: ["Reading the requirement", "Planning the architecture", "Writing the code", "Checking edge cases", "Preparing notes"],
    tasks: [
      { prompt: "Build a REST API endpoint to register a user with validation", result: [
        h("Registration endpoint (Next.js route handler)"),
        { type: "code", lang: "ts", code: `// app/api/register/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  const { name, email } = parsed.data;
  // TODO: hash the password and save the user
  return NextResponse.json({ name, email }, { status: 201 });
}` },
        ul("Rejects invalid input with field-level errors", "Never returns the password", "Next: add password hashing, a unique email check and rate limiting"),
      ] },
      { prompt: "Create a responsive pricing card component with Tailwind", result: [
        h("PricingCard component"),
        { type: "code", lang: "tsx", code: `type Props = { plan: string; price: string; features: string[] };

export function PricingCard({ plan, price, features }: Props) {
  return (
    <div className="w-full max-w-sm rounded-3xl border p-8 shadow-xl">
      <h3 className="text-lg font-semibold">{plan}</h3>
      <p className="mt-2 text-4xl font-bold">{price}</p>
      <ul className="mt-6 space-y-2">
        {features.map((f) => <li key={f}>✓ {f}</li>)}
      </ul>
      <button className="mt-8 w-full rounded-xl bg-blue-600 py-3 text-white">
        Choose plan
      </button>
    </div>
  );
}` },
        p("Place several cards in a grid with grid gap-6 md:grid-cols-3 for a full pricing section."),
      ] },
    ],
  },
  {
    id: "video", name: "Video Creation AI", code: "MOTION", tagline: "Scripts and storyboards for video", Icon: Clapperboard, color: "#f43f5e",
    steps: ["Understanding the audience", "Drafting the hook", "Building the storyboard", "Writing voice-over", "Timing the scenes"],
    tasks: [
      { prompt: "Storyboard a 30-second launch video for an AI marketplace", result: [
        h("30-second launch storyboard"),
        { type: "scenes", scenes: [
          ["0–5s", "City at dawn, data lines lighting up", "Work is changing."],
          ["5–12s", "A founder opens the marketplace on a laptop", "Meet a workforce that is ready when you are."],
          ["12–22s", "Agents handle support, design and reports on screen", "Support, creative and insight, in one place."],
          ["22–30s", "Logo and call to action", "Explore Quzo AI Marketplace today."],
        ] },
        ul("Format: 16:9, with a 9:16 crop for reels", "Music: modern, rising, no vocals"),
      ] },
      { prompt: "Plan a short reel showing a robot café", result: [
        h("15-second reel: Robot Café"),
        { type: "scenes", scenes: [
          ["0–3s", "Close-up of a robotic arm lifting a cup", "Your barista never blinks."],
          ["3–10s", "Latte art poured in one smooth motion", "Every cup, made the same way."],
          ["10–15s", "Customer smiles, logo appears", "Visit the café of the future."],
        ] },
        p("Caption idea: Coffee, engineered. #robotics #automation"),
      ] },
    ],
  },
  {
    id: "content", name: "Content Writing AI", code: "QUILL", tagline: "Blogs, emails and page copy", Icon: PenLine, color: "#8b5cf6",
    steps: ["Studying the topic", "Choosing the tone", "Outlining", "Writing the draft", "Polishing"],
    tasks: [
      { prompt: "Write a blog introduction on AI agents for small businesses", result: [
        h("Small Team, Bigger Reach: AI Agents at Work"),
        p("Running a small business often means one person answering enquiries, chasing invoices and planning next week’s posts. AI agents can take on parts of that routine, so your team spends more time with customers."),
        p("The best place to start is not the most ambitious task. It is the one you repeat every day and can easily check."),
        ul("Draft replies to common questions", "Summarise meetings into actions", "Prepare a first version of marketing copy"),
      ] },
      { prompt: "Write a welcome email for a new customer", result: [
        h("Subject: Welcome aboard, here is your first step"),
        p("Hi [Name],"),
        p("Thank you for joining us. Your account is ready. To get value quickly, pick one task you would like help with and try an agent on it today."),
        p("If anything is unclear, reply to this email and our team will help."),
        p("Warm regards,\n[Your name]"),
      ] },
    ],
  },
  {
    id: "support", name: "Customer Support AI", code: "NEXUS", tagline: "Answers customers with care", Icon: Headphones, color: "#06b6d4",
    steps: ["Reading the message", "Detecting intent", "Checking the policy", "Composing the reply", "Reviewing tone"],
    tasks: [
      { prompt: "Reply to a customer whose order is delayed", result: [
        { type: "chat", messages: [
          ["customer", "My order was due yesterday and it still has not arrived."],
          ["agent", "I am sorry for the wait. Could you share your order number so I can check where it is?"],
          ["customer", "It is #SAMPLE-1042."],
          ["agent", "Thank you. In this sample, the parcel is with the courier and due tomorrow. I will send you the tracking link and follow up if it slips."],
        ] },
        ul("Intent: delivery delay", "Suggested follow-up: check tracking in 24 hours"),
      ] },
      { prompt: "Handle a request for a refund", result: [
        { type: "chat", messages: [
          ["customer", "I would like a refund for my last purchase."],
          ["agent", "I can help with that. May I have the order number and the reason, so I can check what applies?"],
          ["customer", "The plan does not fit what I need."],
          ["agent", "Understood. I will pass this to our billing team with your reason. They will confirm eligibility by email."],
        ] },
        ul("Intent: refund request", "Escalated to a human for approval"),
      ] },
    ],
  },
  {
    id: "marketing", name: "Marketing AI", code: "VECTOR", tagline: "Campaign plans and ad copy", Icon: Megaphone, color: "#f97316",
    steps: ["Defining the audience", "Selecting channels", "Writing messages", "Planning the calendar", "Setting measures"],
    tasks: [
      { prompt: "Plan a two-week campaign for a new product", result: [
        h("Two-week launch plan"),
        table(["Days", "Channel", "Action", "Measure"], ["1–3", "Email", "Teaser to existing list", "Open rate"], ["4–7", "Social", "Short demo videos", "Watch time"], ["8–10", "Search", "Intent keyword ads", "Cost per lead"], ["11–14", "Webinar", "Live walkthrough", "Sign-ups"]),
        bars("Suggested budget split (illustrative)", [["Search", 40], ["Social", 30], ["Webinar", 20], ["Email", 10]], "%"),
      ] },
      { prompt: "Write three ad headlines for an AI service", result: [
        h("Headline options"),
        ul("Your busywork has a new owner", "Answer customers while you focus on growth", "Put an AI agent on your team"),
        p("Test all three with the same audience and budget, then keep the one with the better qualified-lead rate."),
      ] },
    ],
  },
  {
    id: "design", name: "Creative Design AI", code: "PRISM", tagline: "Brand and interface direction", Icon: Palette, color: "#d946ef",
    steps: ["Reading the brief", "Exploring directions", "Selecting colors", "Pairing typography", "Composing guidance"],
    tasks: [
      { prompt: "Create a visual direction for a tech startup brand", result: [
        h("Direction: Midnight Signal"),
        { type: "palette", colors: [["Obsidian", "#070a14"], ["Electric", "#2563eb"], ["Cyan", "#22d3ee"], ["Violet", "#7c3aed"], ["Cloud", "#f4f6fc"]] },
        ul("Headlines: a geometric sans, bold and tight", "Body: a clean humanist sans", "Motif: thin connected nodes and soft glow", "Voice: confident, plain, never hype"),
      ] },
      { prompt: "Suggest a layout for a fitness tracking app home screen", result: [
        h("Home screen layout"),
        table(["Zone", "Content", "Why"], ["Top", "Today’s ring progress", "Answers the first question"], ["Middle", "Start workout button", "Main action, thumb reach"], ["Lower", "Weekly trend", "Shows momentum"], ["Bottom", "Tab bar", "Predictable movement"]),
        { type: "palette", colors: [["Ink", "#0f172a"], ["Lime", "#a3e635"], ["Teal", "#14b8a6"], ["White", "#ffffff"]] },
      ] },
    ],
  },
  {
    id: "finance", name: "Finance AI", code: "LEDGER", tagline: "Budgets and cash flow views", Icon: Landmark, color: "#10b981",
    steps: ["Collecting figures", "Categorising entries", "Calculating totals", "Spotting variances", "Summarising"],
    tasks: [
      { prompt: "Summarise a sample monthly budget", result: [
        h("Monthly budget (sample figures)"),
        table(["Category", "Budget", "Actual", "Difference"], ["Salaries", "$12,000", "$12,000", "$0"], ["Marketing", "$3,000", "$3,450", "+$450"], ["Software", "$900", "$820", "−$80"], ["Office", "$1,100", "$1,060", "−$40"]),
        p("Total spend is $17,330 against a $17,000 budget, $330 over. Marketing is the main driver."),
      ] },
      { prompt: "Show a sample cash flow view for a quarter", result: [
        h("Quarter cash flow (sample figures)"),
        bars("Net cash flow by month", [["Month 1", 4200], ["Month 2", 3100], ["Month 3", 5600]], " USD"),
        p("Net for the quarter is $12,900. Month 2 is the lowest; review payment timing there."),
        p("This is an illustration, not financial advice."),
      ] },
    ],
  },
  {
    id: "research", name: "Research AI", code: "ORACLE", tagline: "Structures questions and findings", Icon: Search, color: "#6366f1",
    steps: ["Framing the question", "Listing sources to check", "Comparing viewpoints", "Organising findings", "Noting gaps"],
    tasks: [
      { prompt: "Outline research on adopting delivery drones", result: [
        h("Research plan: delivery drones"),
        table(["Question", "Where to look", "Risk if skipped"], ["Is it permitted?", "Aviation regulator rules", "Project cannot launch"], ["Does it pay off?", "Route and cost data", "Losses at scale"], ["Is it safe?", "Incident reports", "Liability"], ["Will people accept it?", "Local surveys", "Complaints"]),
        p("This is a plan. No sources have been searched in this demo."),
      ] },
      { prompt: "Compare buying and leasing a commercial robot", result: [
        h("Buy or lease"),
        table(["Factor", "Buy", "Lease"], ["Upfront cost", "High", "Low"], ["Flexibility", "Low", "High"], ["Maintenance", "Your team", "Often included"], ["Long-term cost", "Can be lower", "Can be higher"]),
        p("Leasing suits trials and changing demand. Buying suits stable, heavy use. Confirm terms with real quotes."),
      ] },
    ],
  },
  {
    id: "sales", name: "Sales AI", code: "PULSE", tagline: "Outreach and pipeline focus", Icon: Briefcase, color: "#eab308",
    steps: ["Profiling the lead", "Scoring fit", "Choosing the angle", "Drafting outreach", "Planning follow-up"],
    tasks: [
      { prompt: "Draft a follow-up message after a product demo", result: [
        h("Follow-up message"),
        p("Hi [Name], thank you for your time today. You mentioned that slow replies to enquiries are costing your team. I have attached a short outline of how a support agent could handle the first response."),
        p("Would Thursday suit you for a 20-minute review?"),
        ul("Send within 24 hours", "Second touch after 3 days", "Close the loop after 10 days"),
      ] },
      { prompt: "Prioritise a sample sales pipeline", result: [
        h("Pipeline priority (sample leads)"),
        table(["Lead", "Stage", "Fit", "Next action"], ["Company A", "Proposal", "High", "Call today"], ["Company B", "Demo done", "High", "Send pricing"], ["Company C", "Contacted", "Medium", "Share case notes"], ["Company D", "New", "Low", "Nurture"]),
        bars("Leads by stage", [["New", 18], ["Contacted", 11], ["Demo", 6], ["Proposal", 3]]),
      ] },
    ],
  },
  {
    id: "hr", name: "HR AI", code: "TALENT", tagline: "Hiring and onboarding support", Icon: Users, color: "#ec4899",
    steps: ["Reading the role", "Listing skills", "Structuring the document", "Checking inclusive wording", "Finalising"],
    tasks: [
      { prompt: "Write a job description for a frontend developer", result: [
        h("Frontend Developer"),
        p("Build clear, fast interfaces for our customers, working with design and backend teammates."),
        ul("React and Next.js experience", "Good HTML, CSS and accessibility habits", "Comfortable with APIs", "Communicates clearly"),
        p("We welcome applicants from all backgrounds."),
      ] },
      { prompt: "Create a first-week onboarding plan", result: [
        h("First week"),
        table(["Day", "Focus", "Outcome"], ["1", "Accounts and welcome", "Ready to work"], ["2", "Product walkthrough", "Understands customers"], ["3", "Pair with a teammate", "First small task"], ["4", "Process and tools", "Knows how to ship"], ["5", "Review and questions", "Goals for month one"]),
      ] },
    ],
  },
  {
    id: "bi", name: "Business Intelligence AI", code: "INSIGHT", tagline: "Turns data into decisions", Icon: BarChart3, color: "#0ea5e9",
    steps: ["Loading sample data", "Cleaning records", "Calculating indicators", "Finding patterns", "Recommending actions"],
    tasks: [
      { prompt: "Analyse sample quarterly sales by region", result: [
        h("Sales by region (sample data)"),
        bars("Quarterly sales", [["North", 42], ["South", 31], ["East", 27], ["West", 20]], "k USD"),
        ul("North leads with 35% of the $120k total", "West is lowest at about 17%", "Check whether West has fewer leads or lower conversion"),
      ] },
      { prompt: "Build a KPI summary for a subscription business", result: [
        h("KPI summary (sample data)"),
        table(["Indicator", "This month", "Last month"], ["New customers", "120", "104"], ["Churn rate", "3.1%", "3.8%"], ["Average revenue", "$48", "$46"], ["Support tickets", "310", "355"]),
        p("Growth and retention both improved. Confirm the drop in tickets reflects fewer problems, not a channel outage."),
      ] },
    ],
  },
  {
    id: "productivity", name: "Productivity AI", code: "FLOW", tagline: "Plans your day and meetings", Icon: Zap, color: "#14b8a6",
    steps: ["Gathering tasks", "Ranking priorities", "Estimating time", "Building the schedule", "Adding buffers"],
    tasks: [
      { prompt: "Plan a focused workday", result: [
        h("Today’s plan"),
        table(["Time", "Block"], ["09:00", "Most important task"], ["11:00", "Replies and approvals"], ["12:00", "Break"], ["13:00", "Team meeting"], ["14:00", "Project work"], ["16:30", "Review and plan tomorrow"]),
      ] },
      { prompt: "Turn meeting notes into action items", result: [
        h("Action items (sample meeting)"),
        table(["Action", "Owner", "Due"], ["Update pricing page", "Design", "Friday"], ["Fix signup bug", "Engineering", "Wednesday"], ["Email early users", "Marketing", "Monday"]),
        p("Open question: who approves the final pricing?"),
      ] },
    ],
  },
];

