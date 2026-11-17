import { ArrowUp, LineChart, Gem, Bell, User, Share2, RefreshCcw } from "lucide-react";

const cardData = [
  {
    title: "DIRECT PARTNER REWARDS",
    value: "$0.00",
    variant: "green" as const,
    icon: <ArrowUp size={20} strokeWidth={2.5} />,
  },
  {
    title: "AI STRATEGY REWARDS",
    value: "$0.75",
    variant: "blue" as const,
    icon: <LineChart size={20} strokeWidth={2.5} />,
  },
  {
    title: "BOOSTER INCOME",
    value: "$0.00",
    variant: "purple" as const,
    icon: <Gem size={20} strokeWidth={2.5} />,
  },
  {
    title: "DAO INCOME",
    value: "$0.00",
    variant: "yellow" as const,
    icon: <Bell size={20} strokeWidth={2.5} />,
  },
  {
    title: "NETWORK REWARDS",
    value: "$0.00",
    variant: "purple" as const,
    icon: <User size={20} strokeWidth={2.5} />,
  },
  {
    title: "ACHIEVEMENT REWARDS",
    value: "$0.00",
    variant: "blue" as const,
    icon: <Share2 size={20} strokeWidth={2.5} />,
  },
  {
    title: "SALARY INCOME",
    value: "$0.00",
    variant: "green" as const,
    icon: <RefreshCcw size={20} strokeWidth={2.5} />,
  },
];

// Helper for dynamic color classes exactly matching the image
const getVariantStyles = (variant: string) => {
  switch (variant) {
    case "green":
      return {
        borderTop: "border-t-emerald-500",
        iconBg: "bg-emerald-600",
        iconText: "text-white",
        btnBg: "bg-emerald-50",
        btnText: "text-emerald-600",
        line: "bg-emerald-500",
      };
    case "blue":
      return {
        borderTop: "border-t-blue-500",
        iconBg: "bg-blue-600",
        iconText: "text-white",
        btnBg: "bg-blue-50",
        btnText: "text-blue-600",
        line: "bg-blue-500",
      };
    case "purple":
      return {
        borderTop: "border-t-purple-500",
        iconBg: "bg-purple-600",
        iconText: "text-white",
        btnBg: "bg-purple-50",
        btnText: "text-purple-600",
        line: "bg-purple-500",
      };
    case "yellow":
      return {
        borderTop: "border-t-amber-500",
        iconBg: "bg-amber-600",
        iconText: "text-white",
        btnBg: "bg-amber-50",
        btnText: "text-amber-600",
        line: "bg-amber-500",
      };
    default:
      return {
        borderTop: "border-t-gray-500",
        iconBg: "bg-gray-600",
        iconText: "text-white",
        btnBg: "bg-gray-100",
        btnText: "text-gray-600",
        line: "bg-gray-500",
      };
  }
};

export function WithdrawalOverview() {
  return (
    <section className="mb-8">
      {/* Grid Layout - 4 columns on large screens */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cardData.map((item, index) => {
          const styles = getVariantStyles(item.variant);

          return (
            <div
              key={index}
              className={`
                relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 
                dark:border-gray-800 dark:bg-gray-900
                ${styles.borderTop} border-t-[3px]
              `}
            >
              {/* Top Row: Icon & Button */}
              <div className="mb-6 flex items-start justify-between">
                {/* Icon Box (No shadow, no glow) */}
                <div
                  className={`
                    flex h-10 w-10 items-center justify-center rounded-xl
                    ${styles.iconBg} ${styles.iconText}
                  `}
                >
                  {item.icon}
                </div>

              </div>

              {/* Title & Value */}
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  {item.title}
                </p>
                <h3 className="text-[28px] leading-none font-bold text-gray-900 dark:text-white">
                  {item.value}
                </h3>
              </div>

              {/* Bottom Accent Line - angled like in the image */}
              <div className="mt-5 flex w-full">
                 <div 
                   className={`h-[3px] w-10 rounded-full opacity-90 ${styles.line}`} 
                   style={{ transform: 'rotate(-4deg)' }}
                 />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}