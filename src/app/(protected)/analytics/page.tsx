// "use client";
// import React, { useEffect, useState, useRef, useMemo } from "react";
// import { RiMoneyDollarCircleLine, RiFlashlightFill, RiCpuFill, RiDatabase2Fill, RiRobot2Fill, RiPieChartFill, RiPieChart2Fill, RiPulseLine, RiCodeSSlashLine, RiTerminalLine, RiBrainLine, RiChatCheckLine, RiFileTextLine, RiSearchEyeLine, RiSeoLine, RiMailLine, RiVoiceprintLine, RiRobotLine, RiAiGenerate, RiSparklingLine, RiLightbulbLine, RiCpuLine, RiServerLine, RiCloudLine, RiGlobalLine, RiSettings3Line, RiToolsLine, RiPlayCircleLine, RiCheckboxCircleLine, RiLoader4Line } from 'react-icons/ri'
// import { countryCoordinates } from "@/app/components/countryCoordinates";
// import WorldMap from "@/app/components/WorldMap";
// import dayjs from "dayjs"
// import customParseFormat from "dayjs/plugin/customParseFormat";
// import minMax from 'dayjs/plugin/minMax';
// import {
//   MdVpnKey,
//   MdMemory,
//   MdRocketLaunch,
//   MdPublic,
//   MdBusinessCenter,
//   MdAttachMoney,
//   MdPercent,
//   MdStars
// } from 'react-icons/md';

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from "chart.js";
// import { Line, Pie } from "react-chartjs-2";
// import { RiRobot2Line, RiUserUnfollowLine } from 'react-icons/ri';



// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// dayjs.extend(customParseFormat);
// dayjs.extend(minMax);

// const REVENUE_PER_UNIT = 2;

// const CITY_OPTIONS = [
//   "New York",
//   "London",
//   "Tokyo",
//   "Paris",
//   "Los Angeles",
//   "Shanghai",
//   "Hong Kong",
//   "Sydney",
//   "India",
// ];

// const TIME_ZONE_MAP = {
//   "New York": "America/New_York",
//   "London": "Europe/London",
//   "Tokyo": "Asia/Tokyo",
//   "Paris": "Europe/Paris",
//   "Los Angeles": "America/Los_Angeles",
//   "Shanghai": "Asia/Shanghai",
//   "Hong Kong": "Asia/Hong_Kong",
//   "Sydney": "Australia/Sydney",
//   "India": "Asia/Kolkata",
// };

// // TypeScript Interfaces
// interface AnalyticsDataItem {
//   Agent: string;
//   AgentStatus: string;
//   Country: string;
//   ComputeUnitsUsed: number;
//   EnergyConsumption: number;
//   MemoryUsage: number;
//   TasksCompleted: number;
//   DailyROI: string;
//   Uptime: string;
//   Efficiency: string;
//   CreatedDate: string;
//   YieldIncome: number;
//   CreditsPurchased: number;
//   PeakHourFlag: string;
//   ProfitContribution: number;
//   LeaseAmount: number;
//   LeaseDate?: string;
//   PurchaseDate?: string;
//   TotalInvestment?: number;
//   AvgROI: number;
//   WorkingTotalEarning: number;
//   WorkingTotalLimit: number;
//   WorkingPendingLimit: number;
//   TotalYieldEarning: number;
//   TotalYieldLimit: number;
//   PendingYieldLimit: number;
//   WeeklyYiled: number;
//   MonthlyRevenue: number;
//   LifetimeRevenue: number;
//   DirectBonus: number;
//   CommunityBuildingBonus: number;
//   ComputeRevenueShare: number;
//   RewardBonus: number;
//   RankBonus: number;
//   LeaderShipBonus: number;
//   LevelIncome: number;
//   ActiveAgent: number;
//   IdleAgent: number;
//   GPUUsage: number;
//   CPUUsage: number;
//   PeakGPUUsage?: number;
//   PeakCPUUsage?: number;
//   RuntimeHours?: number;
//   UptimeHours?: number;
//   TodayYieldIncome: number;
//   TodayCreditsDeployed: number;
//   UnitsUsed: number;
//   CheckContractStatus: number;
//   ContractRechargeID: string;
//   AIActiveFeed?: string;
//   PlatformFee?: number;
//   YourShare?: number;
//   NextDistribution?: string;
//   activeagent?: number;
//   location?: string;
//   lastLocationUpdate?: number;
// }

// interface AnalyticsAPIResponseItem {
//   Agent?: string;
//   AgentStatus?: string;
//   Country?: string;
//   ComputeUnitsUsed?: number;
//   EnergyConsumption?: number;
//   MemoryUsage?: number;
//   TasksCompleted?: number;
//   AvgROI?: number;
//   RuntimeHours?: number;
//   UptimeHours?: number;
//   Efficiency?: number;
//   CreatedDate?: string;
//   YieldIncome?: number;
//   CreditsPurchased?: number;
//   PeakHourFlag?: string;
//   ProfitContribution?: number;
//   LeaseAmount?: number;
//   LeaseDate?: string;
//   PurchaseDate?: string;
//   TotalInvestment?: number;
//   WorkingTotalEarning?: number;
//   WorkingTotalLimit?: number;
//   WorkingPendingLimit?: number;
//   TotalYieldEarning?: number;
//   TotalYieldLimit?: number;
//   PendingYieldLimit?: number;
//   WeeklyYiled?: number;
//   MonthlyRevenue?: number;
//   LifetimeRevenue?: number;
//   DirectBonus?: number;
//   CommunityBuildingBonus?: number;
//   ComputeRevenueShare?: number;
//   RewardBonus?: number;
//   RankBonus?: number;
//   LeaderShipBonus?: number;
//   LevelIncome?: number;
//   ActiveAgent?: number;
//   IdleAgent?: number;
//   GPUUsage?: number;
//   CPUUsage?: number;
//   PeakGPUUsage?: number;
//   PeakCPUUsage?: number;
//   TodayYieldIncome?: number;
//   TodayCreditsDeployed?: number;
//   UnitsUsed?: number;
//   CheckContractStatus?: number;
//   ContractRechargeID?: string;
//   AIActiveFeed?: string;
//   PlatformFee?: number;
//   YourShare?: number;
//   NextDistribution?: string;
//   activeagent?: number;
//   location?: string;
//   lastLocationUpdate?: number;
// }

// interface AnalyticsDataResponse {
//   data: AnalyticsDataItem[];
// }

// interface ProductConfig {
//   price: number;
//   unitPerHour: number;
//   unitValue: number;
//   color: string;
// }

// interface AgentData {
//   energy: number;
//   time: string;
//   interaction: number;
//   location: string;
//   cpu: number;
//   memory: number;
// }

// interface StatCard {
//   label: string;
//   value: string;
//   cls: string;
// }

// interface RevenueStats {
//   totalRevenueShare: number;
//   thisWeek: number;
//   thisMonth: number;
//   TotalYieldLimit: number;
// }

// interface BonusData {
//   labels: string[];
//   values: number[];
//   colors: string[];
// }

// interface ScatterData {
//   datasets: {
//     label: string;
//     data: { x: number; y: number }[];
//     backgroundColor: string;
//     pointRadius: number;
//   }[];
// }

// interface MemoryStats {
//   highestUsageAgent: { agent: string; peak: number } | null;
//   mostEfficientAgent: { agent: string; avgEfficiency: number } | null;
//   totalUsage: number;
//   chartLabels: string[];
//   currentData: number[];
//   peakData: number[];
//   averageData: number[];
// }

// interface RevenueChartData {
//   revenue: number[];
//   share: number[];
//   labels: string[];
//   yieldIncomeByAgent: { agent: string; yieldIncome: number }[][];
// }

// interface GroupedDataItem {
//   Country: string;
//   AgentStatus: string;
//   agents: AnalyticsDataItem[];
//   lat: number;
//   lng: number;
// }

// interface Totals {
//   values: number[];
//   total: number;
// }

// interface FeedItem {
//   agentIcon: string;
//   activityTitle: string;
//   status: string;
// }

// interface ParsedFeedItem {
//   agentIcon?: string;
//   activityTitle?: string;
//   status?: string;
// }

// interface ProductItem {
//   name: string;
//   value: number;
//   timestamp?: number;
// }

// interface StatEntry {
//   timestamp: number;
//   value: number;
// }

// function getRandomInt(min: number, max: number): number {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function getRandomAgentData(currentLocation: string): AgentData {
//   const interaction = getRandomInt(0, 20);
//   return {
//     energy: getRandomInt(5, 20),
//     time: new Date().toLocaleTimeString(),
//     interaction,
//     location: currentLocation,
//     cpu: interaction > 0 ? getRandomInt(5, 95) : 0,
//     memory: getRandomInt(100, 2048),
//   };
// }

// interface AgentPerformanceCardProps {
//   agent: string;
//   status: string;
//   location: string;
//   units: string;
//   energy: string;
//   memory: string;
//   profit: string;
//   roi: string;
//   uptime: string;
//   efficiency: string;
//   CreatedDate: string;
//   YieldIncome: number;
//   CreditsPurchased: number;
//   apiResponse: AnalyticsDataItem[];
//   tasks?: number;
//   peakHours?: string;
//   memoryTrend?: number[];
// }

// const AgentPerformanceCard: React.FC<AgentPerformanceCardProps> = ({ 
//   agent, 
//   status, 
//   location, 
//   units, 
//   energy, 
//   memory, 
//   profit, 
//   roi, 
//   uptime, 
//   efficiency, 
//   CreatedDate, 
//   YieldIncome, 
//   CreditsPurchased,
//   apiResponse 
// }) => {
//   const [showDetails, setShowDetails] = useState(false);

//   const generateChartData = (apiResponse: AnalyticsDataItem[], agent: string, createdDate: string) => {
//     if (!Array.isArray(apiResponse) || apiResponse.length === 0) {
//       return { labels: [], data: [] };
//     }

//     const agentData = apiResponse.filter(item => item.Agent === agent);
//     if (agentData.length === 0) return { labels: [], data: [] };

//     const startDate = dayjs(createdDate);

//     const dataMap: Record<string, number> = {};
//     agentData.forEach(item => {
//       const date = dayjs(item.CreatedDate).format("DD/MM");
//       const value = parseFloat(String(item.MemoryUsage).replace(/[^0-9.]/g, "")) || 0;
//       dataMap[date] = value;
//     });

//     const labels: string[] = [];
//     const data: number[] = [];
//     for (let i = 0; i < 7; i++) {
//       const date = startDate.add(i, "day").format("DD/MM");
//       labels.push(date);
//       data.push(dataMap[date] || 0);
//     }

//     return { labels, data };
//   };

//   const chartData = useMemo(() => {
//     const { labels, data } = generateChartData(apiResponse, agent, CreatedDate);

//     return {
//       labels,
//       datasets: [
//         {
//           label: "Memory Usage (GB)",
//           data,
//           borderColor: "#3B82F6",
//           backgroundColor: "rgba(59, 130, 246, 0.2)",
//           borderWidth: 2,
//           pointRadius: 4,
//           pointBackgroundColor: "#3B82F6",
//           pointBorderColor: "#FFFFFF",
//           pointHoverRadius: 6,
//           fill: true,
//           tension: 0.4,
//         },
//       ],
//     };
//   }, [apiResponse, agent, CreatedDate]);

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         mode: "index" as const,
//         intersect: false,
//         backgroundColor: "#1F2937",
//         titleColor: "#FFFFFF",
//         bodyColor: "#FFFFFF",
//         titleFont: { size: 14 },
//         bodyFont: { size: 12 },
//       },
//     },
//     scales: {
//       x: {
//         grid: { display: false },
//         ticks: {
//           color: "#6B7280",
//           font: { size: 12 },
//         },
//       },
//       y: {
//         min: 0,
//         max: 3.0,
//         ticks: {
//           stepSize: 1.0,
//           color: "#6B7280",
//           font: { size: 12 },
//           callback: (value: string | number) => Number(value).toFixed(1),
//         },
//         grid: {
//           color: "rgba(107, 114, 128, 0.1)",
//         },
//       },
//     },
//   };

//   return (
//     <div className="overflow-hidden transition-shadow border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md">
//       <div
//         className="transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
//         onClick={() => setShowDetails(!showDetails)}
//       >
//         <div className="flex flex-col items-start justify-between p-3 sm:flex-row sm:items-center">
//           <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6">
//             <div>
//               <div className="flex flex-col items-start mb-1 space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
//                 <h3 className="text-base font-bold text-gray-900 dark:text-white sm:text-lg">{agent}</h3>
//                 <div className="flex items-center justify-between w-[100] sm:w-auto">
//                   <p className="p-1 text-sm bg-gray-200 rounded-md dark:bg-gray-700 sm:text-base dark:text-gray-300">{location}</p>
//                   <span
//                     className={`inline-flex items-center px-3 py-1 text-xs sm:text-sm font-medium rounded-full sm:hidden phone-margin-left
//                     ${status === "Active"
//                         ? "text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900/40"
//                         : status === "Needs Upgrade"
//                           ? "text-yellow-800 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/40"
//                           : "text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-700"
//                       }`}
//                   >
//                     {status}
//                   </span>
//                 </div>
//               </div>
//               <span
//                 className={`inline-flex items-center px-3 py-1 text-xs sm:text-sm font-medium rounded-full hidden sm:inline-flex
//                 ${status === "Active"
//                     ? "text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900/40"
//                     : status === "Needs Upgrade"
//                       ? "text-yellow-800 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/40"
//                       : "text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-700"
//                   }`}
//               >
//                 {status}
//               </span>
//             </div>
//           </div>
//           <div className="flex flex-wrap items-start w-full gap-4 mt-3 sm:flex-row sm:items-center sm:mt-0">
//             <div className="text-center w-[47%]">
//               <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Units Used/Day</p>
//               <p className="text-sm font-bold text-gray-900 dark:text-white sm:text-base">{units}</p>
//             </div>
//             <div className="text-center w-[47%]">
//               <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Energy Consumed</p>
//               <p className="text-sm font-bold text-gray-900 dark:text-white sm:text-base">{energy}</p>
//             </div>
//             <div className="text-center w-[47%]">
//               <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Memory Usage</p>
//               <p className="text-sm font-bold text-gray-900 dark:text-white sm:text-base">{memory}</p>
//             </div>
//             <div className="text-center w-[47%]">
//               <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Task Completed</p>
//               <p className="mt-1 text-sm font-bold text-green-600 dark:text-green-400 sm:text-base">{profit || "247"}</p>
//             </div>

//             <div className="text-center w-[47%]">
//               <p className="ml-2 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Working Date</p>
//               <p className="ml-1 text-sm font-bold text-blue-600 dark:text-blue-400 sm:text-base">{CreatedDate ? CreatedDate.split("T")[0]?.split("-").reverse().join("-") : "N/A"}</p>
//             </div>
//             <div className="text-center w-[47%]">
//               <p className="ml-2 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Yield Income</p>
//               <p className="ml-1 text-sm font-bold text-blue-600 dark:text-blue-400 sm:text-base">${YieldIncome}</p>
//             </div>
//             <div className="flex items-center justify-center w-[47%]">
//               <i className="text-lg text-gray-400 dark:text-gray-500 sm:text-xl ri-arrow-down-s-line" aria-hidden="true"></i>
//             </div>
//           </div>
//         </div>
//         {showDetails && (
//           <div className="px-3 py-4 bg-gray-100 dark:bg-gray-800/50 sm:py-8">
//             <div className="flex flex-col gap-6">
//               <div>
//                 <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">Detailed Metrics</h4>
//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
//                   <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
//                     <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Tasks Completed</p>
//                     <p className="mt-1 text-base font-bold text-gray-900 dark:text-white sm:text-lg">{profit || "247"}</p>
//                   </div>
//                   <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
//                     <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Efficiency</p>
//                     <p className="mt-1 text-xl font-bold text-blue-600 dark:text-blue-400 sm:text-lg">
//                       {efficiency ? `${parseFloat(efficiency).toFixed(2)}%` : "0.00%"}
//                     </p>
//                   </div>

//                   <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
//                     <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Deploy Credit</p>
//                     <p className="mt-1 text-base font-bold text-gray-900 dark:text-white sm:text-lg">{CreditsPurchased || "247"}</p>
//                   </div>
                  
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800">
//                 <h4 className="p-4 mb-4 text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">7-Day Memory Usage Trend</h4>
//                 <div className="p-4">
//                   <div className="h-32 sm:h-48 lg:h-64">
//                     <Line data={chartData} options={options} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const MyAgentPage: React.FC = () => {
//   const [product, setProduct] = useState<ProductItem[]>([]);
//   const mapRef = useRef<HTMLDivElement>(null);

//   const revenueRef = useRef<HTMLCanvasElement>(null);
//   const [agents, setAgents] = useState<AnalyticsDataItem[]>([]);
//   const [fullApiResponse, setFullApiResponse] = useState<AnalyticsDataItem[] | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [analyticsData, setAnalyticsData] = useState<AnalyticsDataResponse | null>(null);

//   const CheckContractStatus = analyticsData?.data?.[0]?.CheckContractStatus;
//   const gpuUsage = useMemo(() => {
//     if (!analyticsData?.data || analyticsData.data.length === 0) return 0;
//     const total = analyticsData.data.reduce((sum, item) => sum + (item.GPUUsage || 0), 0);
//     return (total / analyticsData.data.length).toFixed(2);
//   }, [analyticsData]);
//   const cpuUsage = useMemo(() => {
//     if (!analyticsData?.data || analyticsData.data.length === 0) return 0;
//     const total = analyticsData.data.reduce((sum, item) => sum + (item.CPUUsage || 0), 0);
//     return (total / analyticsData.data.length).toFixed(2);
//   }, [analyticsData]);

//   const ContractRechargeID = analyticsData?.data?.[0]?.ContractRechargeID;


//   const statsHistory = useRef<StatEntry[][]>([]);
//   const cityStats = useRef<StatEntry[]>([]);
//   const hourStats = useRef<StatEntry[]>([]);

//   const feedData = useMemo<FeedItem[]>(() => {
//     if (!analyticsData?.data || analyticsData.data.length === 0) return [];

//     const allFeeds: FeedItem[] = [];

//     analyticsData.data.forEach(item => {
//       const aiActiveFeed = item.AIActiveFeed;
//       if (!aiActiveFeed) return;

//       try {
//         const parsedFeed = JSON.parse(aiActiveFeed);
//         if (Array.isArray(parsedFeed)) {
//           parsedFeed.forEach((feedItem: ParsedFeedItem) => {
//             allFeeds.push({
//               agentIcon: feedItem.agentIcon || 'Activity',
//               activityTitle: feedItem.activityTitle || 'Unknown activity',
//               status: feedItem.status || 'Unknown'
//             });
//           });
//         }
//       } catch (e) {
//         console.error('Failed to parse AIActiveFeed:', e);
//       }
//     });

//     return allFeeds;
//   }, [analyticsData]);

//   const getIconComponent = (iconName: string) => {
//     const iconMap: Record<string, React.ElementType> = {
//       'Activity': RiSparklingLine,
//       'Code2': RiTerminalLine,
//       'Code': RiTerminalLine,
//       'Terminal': RiTerminalLine,
//       'Brain': RiBrainLine,
//       'Chat': RiChatCheckLine,
//       'File': RiFileTextLine,
//       'Search': RiSearchEyeLine,
//       'SEO': RiSeoLine,
//       'Mail': RiMailLine,
//       'Voice': RiVoiceprintLine,
//       'Bot': RiRobotLine,
//       'Robot': RiRobotLine,
//       'Agent': RiRobotLine,
//       'AI': RiAiGenerate,
//       'Sparkle': RiSparklingLine,
//       'Idea': RiLightbulbLine,
//       'CPU': RiCpuLine,
//       'Server': RiServerLine,
//       'Cloud': RiCloudLine,
//       'Global': RiGlobalLine,
//       'Settings': RiSettings3Line,
//       'Tools': RiToolsLine,
//     };
//     const IconComponent = iconMap[iconName] || RiRobotLine;
//     return <IconComponent className="text-[#00D4FF]" />;
//   };

//   const getStatusIcon = (status: string) => {
//     if (status === 'Running') {
//       return <RiLoader4Line className="inline-block w-3 h-3 mr-1 text-green-400 animate-spin" />;
//     } else if (status === 'Completed') {
//       return <RiCheckboxCircleLine className="inline-block w-3 h-3 mr-1 text-blue-400" />;
//     } else {
//       return <RiPlayCircleLine className="inline-block w-3 h-3 mr-1 text-gray-400" />;
//     }
//   };

//   const [feedIdx, setFeedIdx] = useState(0);
//   const [feedFade, setFeedFade] = useState(true);

//   useEffect(() => {
//     if (feedData.length === 0) return;
//     const iv = setInterval(() => {
//       setFeedFade(false);
//       setTimeout(() => { setFeedIdx(p => (p + 1) % feedData.length); setFeedFade(true); }, 300);
//     }, 3000);
//     return () => clearInterval(iv);
//   }, [feedData.length]);

//   const visibleFeed: FeedItem[] = feedData.length === 0 ? [] : Array.from({ length: Math.min(5, feedData.length) }, (_, i) => feedData[(feedIdx + i) % feedData.length]).filter((item): item is FeedItem => item !== undefined);

//   const { totalProfitContribution, totalLeaseAmount } = useMemo(() => {
//     if (!analyticsData?.data) return { totalProfitContribution: 0, totalLeaseAmount: 0 };

//     const totalProfitContribution = analyticsData.data
//       .reduce((sum, item) => sum + (item?.ProfitContribution || 0), 0)
//       .toFixed(2);

//     const totalLeaseAmount = analyticsData.data.reduce(
//       (sum, item) => sum + (item?.LeaseAmount || 0),
//       0).toFixed(2);

//     return { totalProfitContribution, totalLeaseAmount };
//   }, [analyticsData]);

//   const revenueStats = useMemo<RevenueStats>(() => {
//     if (!analyticsData?.data || analyticsData.data.length === 0) {
//       return {
//         totalRevenueShare: 0,
//         thisWeek: 0,
//         thisMonth: 0,
//         TotalYieldLimit: 0
//       };
//     }

//     const totalRevenueShare = analyticsData.data.reduce((sum, item) => sum + (item.LifetimeRevenue || 0), 0);
//     const thisWeek = analyticsData.data.reduce((sum, item) => sum + (item.WeeklyYiled || 0), 0);
//     const thisMonth = analyticsData.data.reduce((sum, item) => sum + (item.MonthlyRevenue || 0), 0);
//     const TotalYieldLimit = analyticsData.data.reduce((sum, item) => sum + (item.TotalYieldLimit || 0), 0);

//     return {
//       totalRevenueShare,
//       thisWeek,
//       thisMonth,
//       TotalYieldLimit
//     };
//   }, [analyticsData]);

//   const pieData = useMemo(() => {
//     if (!analyticsData?.data || analyticsData.data.length === 0) {
//       const values = [0, 0, 0];
//       const total = 0;
//       return {
//         labels: ["Total Performance Earning", "Performance Limit", "Pending Limit"],
//         datasets: [
//           {
//             data: values,
//             backgroundColor: ["#3B82F6", "#10B981", "#8B5CF6"],
//             hoverOffset: 20,
//           },
//         ],
//         total,
//       };
//     }

//     const totalPerformanceEarning = analyticsData.data.reduce((sum, item) => sum + (item.WorkingTotalEarning || 0), 0);
//     const performanceLimit = analyticsData.data.reduce((sum, item) => sum + (item.WorkingTotalLimit || 0), 0);
//     const pendingLimit = analyticsData.data.reduce((sum, item) => sum + (item.WorkingPendingLimit || 0), 0);

//     const values = [totalPerformanceEarning, performanceLimit, pendingLimit];
//     const total = values.reduce((sum, val) => sum + val, 0);

//     return {
//       labels: ["Total Performance Earning", "Performance Limit", "Pending Limit"],
//       datasets: [
//         {
//           data: values,
//           backgroundColor: ["#3B82F6", "#10B981", "#8B5CF6"],
//           hoverOffset: 20,
//         },
//       ],
//       total,
//     };
//   }, [analyticsData]);

//   const bonusData = useMemo<BonusData>(() => {
//     if (!analyticsData?.data || analyticsData.data.length === 0) {
//       return {
//         labels: ["Direct Bonus", "Community Building Bonus", "Compute Revenue Share", "Reward Bonus", "Rank Bonus", "Leadership Bonus", "Level Income"],
//         values: [0, 0, 0, 0, 0, 0, 0],
//         colors: ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#6366F1", "#EF4444"],
//       };
//     }

//     const directBonus = analyticsData.data.reduce((sum, item) => sum + (item.DirectBonus || 0), 0);
//     const communityBuildingBonus = analyticsData.data.reduce((sum, item) => sum + (item.CommunityBuildingBonus || 0), 0);
//     const computeRevenueShare = analyticsData.data.reduce((sum, item) => sum + (item.ComputeRevenueShare || 0), 0);
//     const rewardBonus = analyticsData.data.reduce((sum, item) => sum + (item.RewardBonus || 0), 0);
//     const rankBonus = analyticsData.data.reduce((sum, item) => sum + (item.RankBonus || 0), 0);
//     const leadershipBonus = analyticsData.data.reduce((sum, item) => sum + (item.LeaderShipBonus || 0), 0);
//     const levelIncome = analyticsData.data.reduce((sum, item) => sum + (item.LevelIncome || 0), 0);

//     return {
//       labels: ["Direct Bonus", "Community Building Bonus", "Compute Revenue Share", "Reward Bonus", "Rank Bonus", "Leadership Bonus", "Level Income"],
//       values: [directBonus, communityBuildingBonus, computeRevenueShare, rewardBonus, rankBonus, leadershipBonus, levelIncome],
//       colors: ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#6366F1", "#EF4444"],
//     };
//   }, [analyticsData]);

//   useMemo(() => {
//     if (!analyticsData?.data || analyticsData.data.length === 0) {
//       return {
//         labels: [],
//         weeklyProfit: [],
//         dailyYield: [],
//         metrics: {
//           cumulativeProfit: 0,
//           todayProfit: 0,
//           profitChange: 0,
//           averageROI: 0,
//           roiChange: 0,
//           bestPerformer: { name: 'N/A', roi: 0 },
//           leaseProfit: 0,
//           leaseProfitToday: 0,
//           dailyROI: 0,
//           roiWeeklyChange: 0,
//           activeInvestors: 0,
//           newInvestors: 0,
//           profitDistribution: {
//             agentOwners: { value: 0, percent: 0 },
//             leasers: { value: 0, percent: 0 },
//             platform: { value: 0, percent: 0 }
//           }
//         }
//       };
//     }

//     // Use PurchaseDate instead of LeaseDate
//     const validLeases = analyticsData.data
//       .filter(item => item.TotalInvestment && item.PurchaseDate)
//       .map(item => {
//         const leaseDate = dayjs(item.PurchaseDate, ["DD/MM/YYYY", "YYYY-MM-DD"], true);
//         return {
//           date: leaseDate,
//           amount: parseFloat(String(item.TotalInvestment)),
//           agent: item.Agent || "Unknown",
//           avgROI: parseFloat(String(item.AvgROI)) || 0,
//           profitContribution: parseFloat(String(item.WorkingTotalEarning)) || 0,
//           isValid: leaseDate.isValid()
//         };
//       })
//       .filter(lease => lease.isValid);

//     if (!validLeases || validLeases.length === 0) {
//       return { labels: [], weeklyProfit: [], dailyYield: [], metrics: {} };
//     }

//     let earliestDate = validLeases[0]!.date.startOf("day");
//     let latestDate = validLeases[0]!.date.endOf("day");
//     validLeases.forEach(lease => {
//       if (lease.date.isBefore(earliestDate)) earliestDate = lease.date.startOf("day");
//       if (lease.date.isAfter(latestDate)) latestDate = lease.date.endOf("day");
//     });

//     const totalDays = latestDate.diff(earliestDate, "day") + 1;

//     const dailyProfitArr = Array(totalDays).fill(0);
//     const dailyYieldArr = Array(totalDays).fill(0);

//     validLeases.forEach(lease => {
//       const dayIndex = lease.date.startOf("day").diff(earliestDate, "day");
//       if (dayIndex >= 0 && dayIndex < totalDays) {
//         dailyProfitArr[dayIndex] += lease.amount;
//         dailyYieldArr[dayIndex] += lease.profitContribution;
//       }
//     });

//     const dayLabels: string[] = [];
//     for (let i = 0; i < totalDays; i++) {
//       dayLabels.push(earliestDate.add(i, "day").format("ddd"));
//     }

//     let runningTotal = 0;
//     const cumulativeProfitArr = dailyProfitArr.map(amount => {
//       runningTotal += amount;
//       return runningTotal;
//     });

//     const sliceStart = totalDays > 7 ? totalDays - 7 : 0;

//     const lastDayIndex = totalDays - 1;
//     const prevDayIndex = totalDays - 2;

//     const cumulativeProfitValue = cumulativeProfitArr[lastDayIndex] || 0;
//     const todayProfitValue = dailyProfitArr[lastDayIndex] || 0;
//     const yesterdayProfitValue = dailyProfitArr[prevDayIndex] || 0;
//     const profitChange = todayProfitValue - yesterdayProfitValue;

//     const totalLeaseAmount = validLeases.reduce((sum, l) => sum + l.amount, 0);
//     const weightedROI = validLeases.reduce((sum, l) => sum + (l.avgROI * l.amount), 0);
//     const averageROI = totalLeaseAmount > 0 ? (weightedROI / totalLeaseAmount).toFixed(2) : 0;

//     const bestPerformer = analyticsData.data.reduce((best, current) => {
//       const currentROI = current.AvgROI || 0;
//       return currentROI > best.roi ? { name: current.Agent || 'Unknown', roi: currentROI } : best;
//     }, { name: 'N/A', roi: 0 });

//     const agentOwnersProfit = analyticsData.data
//       .filter(a => a.AgentStatus === 'Active')
//       .reduce((sum, a) => sum + (a.WorkingTotalEarning || 0), 0);

//     const leasersProfit = analyticsData.data
//       .filter(a => a.AgentStatus !== 'Active')
//       .reduce((sum, a) => sum + (a.WorkingTotalEarning || 0), 0);

//     const totalProfitContribution = agentOwnersProfit + leasersProfit;
//     const platformProfit = cumulativeProfitValue - totalProfitContribution;

//     const profitDistribution = {
//       agentOwners: {
//         value: agentOwnersProfit,
//         percent: cumulativeProfitValue > 0 ? ((agentOwnersProfit / cumulativeProfitValue) * 100).toFixed(0) : 0
//       },
//       leasers: {
//         value: leasersProfit,
//         percent: cumulativeProfitValue > 0 ? ((leasersProfit / cumulativeProfitValue) * 100).toFixed(0) : 0
//       },
//       platform: {
//         value: platformProfit > 0 ? platformProfit : 0,
//         percent: cumulativeProfitValue > 0 ? ((platformProfit / cumulativeProfitValue) * 100).toFixed(0) : 0
//       }
//     };

//     const metrics = {
//       cumulativeProfit: cumulativeProfitValue,
//       todayProfit: todayProfitValue,
//       profitChange,
//       averageROI,
//       roiChange: 0,
//       bestPerformer,
//       leaseProfit: cumulativeProfitValue,
//       leaseProfitToday: todayProfitValue,
//       dailyROI: averageROI,
//       roiWeeklyChange: 0,
//       activeInvestors: analyticsData.data.length,
//       newInvestors: 0,
//       profitDistribution
//     };

//     return {
//       labels: dayLabels.slice(sliceStart),
//       weeklyProfit: cumulativeProfitArr.slice(sliceStart),
//       dailyYield: dailyYieldArr.slice(sliceStart),
//       metrics
//     };
//   }, [analyticsData]);

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   const groupedData = useMemo<GroupedDataItem[]>(() => {
//     if (!analyticsData?.data || analyticsData.data.length === 0) {
//       return [];
//     }

//     // Group by country
//     const countryMap = new Map<string, AnalyticsDataItem[]>();

//     analyticsData.data.forEach(item => {
//       if (item.Country) {
//         if (!countryMap.has(item.Country)) {
//           countryMap.set(item.Country, []);
//         }
//         countryMap.get(item.Country)!.push(item);
//       }
//     });

//     // Convert to grouped data with coordinates
//     const result: GroupedDataItem[] = [];
//     countryMap.forEach((agents, country) => {
//       const coords = countryCoordinates[country] || { lat: 0, lng: 0 };
//       result.push({
//         Country: country,
//         AgentStatus: agents[0]?.AgentStatus || "Active",
//         agents,
//         lat: coords.lat,
//         lng: coords.lng,
//       });
//     });

//     return result;
//   }, [analyticsData]);

//   const totalLocations = groupedData.length;
//   const totalAgents = groupedData.reduce((sum, c) => sum + c.agents.length, 0);

//   const Agent = useMemo(() => {
//     // Return agents from local state
//     return agents;
//   }, [agents]);

//   const totals = useMemo<Totals>(() => {
//     if (!analyticsData?.data || analyticsData.data.length === 0) {
//       const values = [0, 0, 0].map(v => Number(v.toFixed(2)));
//       const total = 0;
//       return { values, total };
//     }

//     const totalPerformanceEarning = analyticsData.data.reduce((sum, item) => sum + (item.WorkingTotalEarning || 0), 0);
//     const performanceLimit = analyticsData.data.reduce((sum, item) => sum + (item.WorkingTotalLimit || 0), 0);
//     const pendingLimit = analyticsData.data.reduce((sum, item) => sum + (item.WorkingPendingLimit || 0), 0);

//     const values = [totalPerformanceEarning, performanceLimit, pendingLimit].map(v => Number(v.toFixed(2)));
//     const total = values.reduce((s, v) => s + v, 0);

//     return { values, total };
//   }, [analyticsData]);

//   const allLabels = ["Total Performance Earning", "Performance Limit", "Pending Limit"];
//   const allColors = ["#F59E0B", "#8B5CF6", "#6366F1"];

//   const pieData2 = useMemo(() => {
//     if (!analyticsData?.data || analyticsData.data.length === 0) {
//       const values = [0, 0, 0];
//       return {
//         labels: allLabels,
//         datasets: [
//           {
//             data: values,
//             backgroundColor: allColors,
//             hoverOffset: 20,
//           },
//         ],
//         total: 0,
//       };
//     }

//     const totalPerformanceEarning = analyticsData.data.reduce((sum, item) => sum + (item.WorkingTotalEarning || 0), 0);
//     const performanceLimit = analyticsData.data.reduce((sum, item) => sum + (item.WorkingTotalLimit || 0), 0);
//     const pendingLimit = analyticsData.data.reduce((sum, item) => sum + (item.WorkingPendingLimit || 0), 0);

//     const values = [totalPerformanceEarning, performanceLimit, pendingLimit];
//     return {
//       labels: allLabels,
//       datasets: [
//         {
//           data: values,
//           backgroundColor: allColors,
//           hoverOffset: 20,
//         },
//       ],
//       total: values.reduce((s, v) => s + v, 0),
//     };
//   }, [allLabels, allColors, analyticsData]);

//   const scatterData = useMemo<ScatterData>(
//     () => {
//       if (!analyticsData?.data || analyticsData.data.length === 0) {
//         return {
//           datasets: [
//             {
//               label: "CPU vs Yield",
//               data: [],
//               backgroundColor: "#8B5CF6",
//               pointRadius: 6,
//             },
//           ],
//         };
//       }

//       const data = analyticsData.data.map(item => ({
//         x: item.CPUUsage || 0,
//         y: item.WorkingTotalEarning || 0,
//       }));

//       return {
//         datasets: [
//           {
//             label: "CPU vs Yield",
//             data,
//             backgroundColor: "#8B5CF6",
//             pointRadius: 6,
//           },
//         ],
//       };
//     },
//     [analyticsData]
//   );

//   const memoryStats = useMemo<MemoryStats>(() => {
//     if (!analyticsData?.data || analyticsData.data.length === 0) {
//       return {
//         highestUsageAgent: null,
//         mostEfficientAgent: null,
//         totalUsage: 0,
//         chartLabels: [],
//         currentData: [],
//         peakData: [],
//         averageData: [],
//       };
//     }

//     const agents = analyticsData.data.map(item => ({
//       agent: item.Agent || "Unknown",
//       current: item.MemoryUsage || 0,
//       peak: Math.max(item.PeakGPUUsage || 0, item.PeakCPUUsage || 0),
//       average: item.MemoryUsage || 0,
//       avgEfficiency: typeof item.Efficiency === 'number' ? item.Efficiency : parseFloat(String(item.Efficiency)) || 0,
//     }));

//     const highestUsageAgent = agents.reduce((prev, curr) => (curr.peak > prev.peak ? curr : prev), { peak: 0, agent: 'N/A' });
//     const mostEfficientAgent = agents.reduce((prev, curr) => (curr.avgEfficiency > prev.avgEfficiency ? curr : prev), { avgEfficiency: 0, agent: 'N/A' });
//     const totalUsage = agents.reduce((sum, a) => sum + a.current, 0);

//     const chartLabels = agents.map(a => a.agent);
//     const currentData = agents.map(a => a.current);
//     const peakData = agents.map(a => a.peak);
//     const averageData = agents.map(a => a.average);

//     return {
//       highestUsageAgent,
//       mostEfficientAgent,
//       totalUsage,
//       chartLabels,
//       currentData,
//       peakData,
//       averageData,
//     };
//   }, [analyticsData]);

//   const revenueChartData = useMemo<RevenueChartData>(() => {
//     if (!analyticsData?.data || analyticsData.data.length === 0) {
//       const revenue = [0, 0, 0, 0, 0, 0, 0];
//       const share = revenue.map(v => v * 0.9);
//       const labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
//       const yieldIncomeByAgent = revenue.map(() => []);

//       return { revenue, share, labels, yieldIncomeByAgent };
//     }

//     // Generate 30 days of revenue data based on actual monthly revenue
//     const totalMonthlyRevenue = analyticsData.data.reduce((sum, item) => sum + (item.MonthlyRevenue || 0), 0);
//     const dailyAverage = totalMonthlyRevenue / 30;

//     const revenue = Array.from({ length: 30 }, () => Math.max(0, dailyAverage + (Math.random() - 0.5) * dailyAverage * 0.2));
//     const share = revenue.map(v => v * 0.9);

//     const labels = Array.from({ length: 30 }, (_, i) => {
//       const date = new Date();
//       date.setDate(date.getDate() - (29 - i));
//       return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     });

//     const uniqueAgents = Array.from(new Set(analyticsData.data.map(item => item.Agent)));
//     const agentCount = uniqueAgents.length || 1;
//     const yieldIncomeByAgent = revenue.map(() =>
//       uniqueAgents.map(agent => ({
//         agent,
//         yieldIncome: dailyAverage / agentCount * (0.8 + Math.random() * 0.4),
//       }))
//     );

//     return { revenue, share, labels, yieldIncomeByAgent };
//   }, [analyticsData]);

//   useEffect(() => {
//     const canvas = revenueRef.current;
//     if (!canvas) return;
//     const container = canvas.parentElement;

//     const draw = () => {
//       canvas.width = (container?.offsetWidth ?? 800);
//       canvas.height = 100;

//       const ctx = canvas.getContext("2d");
//       if (!ctx) return;
      
//       const w = canvas.width, h = canvas.height;

//       const rev = revenueChartData.revenue.length > 0 ? revenueChartData.revenue : [28, 35, 22, 40, 38, 45, 52, 48, 55, 60, 58, 62, 70, 65, 72, 80, 75, 82, 90, 85, 92, 88, 95, 102, 98, 105, 112, 108, 115, 124];
//       const share = revenueChartData.share.length > 0 ? revenueChartData.share : rev.map(v => v * 0.9);
//       const yieldIncomeByAgent = revenueChartData.yieldIncomeByAgent.length > 0 ? revenueChartData.yieldIncomeByAgent : rev.map(() => []);
//       const labels = revenueChartData.labels.length > 0 ? revenueChartData.labels : ["Jul 26", "Jul 27", "Jul 28", "Jul 29", "Jul 30"];
//       const max = Math.max(...rev) * 1.1 || 150;

//       const pad = { l: 10, r: 10, t: 8, b: 20 };
//       const iW = w - pad.l - pad.r, iH = h - pad.t - pad.b;
//       const pts = (arr: number[]) => {
//         if (arr.length === 0) return [];
//         const divisor = arr.length > 1 ? arr.length - 1 : 1;
//         return arr.map((v, i) => [pad.l + i * (iW / divisor), pad.t + iH - ((v ?? 0) / max) * iH]);
//       };

//       const drawLine = (p: number[][], color: string, filled: boolean) => {
//         if (p.length === 0) return;
//         if (filled) {
//           ctx.beginPath();
//           const firstPoint = p[0];
//           if (firstPoint) {
//             ctx.moveTo(firstPoint[0] ?? 0, pad.t + iH);
//           }
//           p.forEach(pt => ctx.lineTo(pt[0] ?? 0, pt[1] ?? 0));
//           const lastPoint = p[p.length - 1];
//           if (lastPoint) {
//             ctx.lineTo(lastPoint[0] ?? 0, pad.t + iH);
//           }
//           ctx.closePath();
//           ctx.fillStyle = "rgba(0,212,255,0.08)";
//           ctx.fill();
//         }
//         ctx.beginPath();
//         p.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt[0] ?? 0, pt[1] ?? 0) : ctx.lineTo(pt[0] ?? 0, pt[1] ?? 0)));
//         ctx.strokeStyle = color;
//         ctx.lineWidth = 2;
//         ctx.lineJoin = "round";
//         ctx.stroke();
//       };

//       drawLine(pts(rev), "#00D4FF", true);
//       drawLine(pts(share), "#F5A623", false);

//       const labelStep = Math.ceil(labels.length / 7);
//       labels.forEach((label, i) => {
//         if (i % labelStep === 0) {
//           ctx.fillStyle = "#8A93B2";
//           ctx.font = "10px Inter";
//           ctx.textAlign = "center";
//           const labelDivisor = labels.length > 1 ? labels.length - 1 : 1;
//           ctx.fillText(label, pad.l + i * (iW / labelDivisor), h - 4);
//         }
//       });

//       return { rev, share, yieldIncomeByAgent, labels, pad, iW, iH, max };
//     };

//     let chartData: ReturnType<typeof draw> | undefined = draw();
//     if (!chartData) {
//       chartData = {
//         rev: [0],
//         share: [0],
//         yieldIncomeByAgent: [[]],
//         labels: [''],
//         pad: { l: 10, r: 10, t: 8, b: 20 },
//         iW: 0,
//         iH: 0,
//         max: 0
//       };
//     }

//     const handleMouseMove = (e: MouseEvent) => {
//       const canvas = revenueRef.current;
//       if (!canvas) return;

//       const rect = canvas.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;

//       if (!chartData) return;
//       const { rev, share, yieldIncomeByAgent, labels, pad, iW, iH, max } = chartData;

//       const divisor = rev.length > 1 ? rev.length - 1 : 1;
//       const pointSpacing = iW / divisor;
//       const index = Math.round((x - pad.l) / pointSpacing);

//       if (index >= 0 && index < rev.length) {
//         const pointX = pad.l + index * pointSpacing;
//         const distance = Math.abs(x - pointX);

//         if (distance < pointSpacing / 2) {
//           draw();
//           const ctx = canvas.getContext("2d");
//           if (!ctx) return;

//           const revValue = rev[index] ?? 0;
//           const shareValue = share[index] ?? 0;
//           const revY = pad.t + iH - (revValue / max) * iH;
//           const shareY = pad.t + iH - (shareValue / max) * iH;
          
//           ctx.beginPath();
//           ctx.arc(pointX, revY, 5, 0, Math.PI * 2);
//           ctx.fillStyle = "#00D4FF";
//           ctx.fill();
//           ctx.strokeStyle = "#FFFFFF";
//           ctx.lineWidth = 2;
//           ctx.stroke();
          
//           ctx.beginPath();
//           ctx.arc(pointX, shareY, 5, 0, Math.PI * 2);
//           ctx.fillStyle = "#F5A623";
//           ctx.fill();
//           ctx.strokeStyle = "#FFFFFF";
//           ctx.lineWidth = 2;
//           ctx.stroke();

//           const agentYields = yieldIncomeByAgent[index] || [];
//           const tooltipText = agentYields.flatMap(a => [`Agent: ${a.agent}`, `YieldIncome: ${a.yieldIncome.toFixed(2)}`]);
          
//           const tooltipWidth = 160;
//           const tooltipHeight = 20 + (agentYields.length * 32);
//           const tooltipPadding = 8;
//           const tooltipX = pointX - tooltipWidth / 2;
//           const tooltipY = Math.min(revY, shareY) - tooltipHeight - 10;
          
//           const clampedTooltipX = Math.max(5, Math.min(canvas.width - tooltipWidth - 5, tooltipX));
//           const clampedTooltipY = Math.max(5, tooltipY);
          
//           ctx.fillStyle = "rgba(31, 41, 55, 0.95)";
//           ctx.beginPath();
//           ctx.roundRect(clampedTooltipX, clampedTooltipY, tooltipWidth, tooltipHeight, 6);
//           ctx.fill();
          
//           ctx.fillStyle = "#FFFFFF";
//           ctx.font = "11px Inter";
//           ctx.textAlign = "left";
//           tooltipText.forEach((text, i) => {
//             ctx.fillText(text, clampedTooltipX + tooltipPadding, clampedTooltipY + tooltipPadding + 12 + i * 16);
//           });
//         }
//       }
//     };

//     const handleMouseLeave = () => {
//       draw();
//     };

//     canvas.addEventListener("mousemove", handleMouseMove);
//     canvas.addEventListener("mouseleave", handleMouseLeave);
    
//     const handleResize = () => {
//       chartData = draw();
//     };
//     window.addEventListener("resize", handleResize);
    
//     return () => {
//       window.removeEventListener("resize", handleResize);
//       canvas.removeEventListener("mousemove", handleMouseMove);
//       canvas.removeEventListener("mouseleave", handleMouseLeave);
//     };
//   }, [loading, revenueChartData]);

//   const statCards = useMemo<StatCard[]>(() => {
//     if (!analyticsData?.data || analyticsData.data.length === 0) {
//       return [
//         { label: "Platform Fee", value: "10%", cls: "text-[#FF4B4B]" },
//         { label: "Your Revenue Share", value: "90%", cls: "text-[#00C896]" },
//         { label: "Next Distribution", value: "N/A", cls: "text-[#F5A623]" }
//       ];
//     }

//     const firstItem = analyticsData.data[0];
//     const platformFee = firstItem?.PlatformFee ?? 10;
//     const yourShare = firstItem?.YourShare ?? 90;
//     const nextDistribution = firstItem?.NextDistribution;

//     let formattedDate = "N/A";
//     if (nextDistribution) {
//       try {
//         const date = new Date(nextDistribution);
//         formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
//       } catch (e) {
//         formattedDate = nextDistribution;
//       }
//     }

//     return [
//       { label: "Platform Fee", value: `${platformFee}%`, cls: "text-[#FF4B4B]" },
//       { label: "Your Revenue Share", value: `${yourShare}%`, cls: "text-[#00C896]" },
//       { label: "Next Distribution", value: formattedDate, cls: "text-[#F5A623]" }
//     ];
//   }, [analyticsData]);

//   useEffect(() => {
//     // Fetch real data from API
//     const fetchAnalyticsData = async () => {
//       try {
//         const response = await fetch('/api/analytics', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch analytics data');
//         }

//         const apiResponse = await response.json();

//         if (apiResponse.statusCode === 200 && apiResponse.data) {
//           // Transform API data to match the interface
//           const transformedData: AnalyticsDataItem[] = apiResponse.data.map((item: AnalyticsAPIResponseItem) => ({
//             Agent: item.Agent?.trim() || "Unknown",
//             AgentStatus: item.AgentStatus || "Unknown",
//             Country: item.Country?.trim() || "Unknown",
//             ComputeUnitsUsed: item.ComputeUnitsUsed || 0,
//             EnergyConsumption: item.EnergyConsumption || 0,
//             MemoryUsage: item.MemoryUsage || 0,
//             TasksCompleted: item.TasksCompleted || 0,
//             DailyROI: item.AvgROI?.toString() || "0",
//             Uptime: (item.RuntimeHours && item.RuntimeHours > 0 && item.UptimeHours) ? ((item.UptimeHours / item.RuntimeHours) * 100).toFixed(2) : "0",
//             Efficiency: item.Efficiency?.toString() || "0",
//             CreatedDate: item.CreatedDate || "",
//             YieldIncome: item.YieldIncome || 0,
//             CreditsPurchased: item.CreditsPurchased || 0,
//             PeakHourFlag: item.PeakHourFlag || "No",
//             ProfitContribution: item.WorkingTotalEarning || 0,
//             LeaseAmount: item.TotalInvestment || 0,
//             AvgROI: item.AvgROI || 0,
//             WorkingTotalEarning: item.WorkingTotalEarning || 0,
//             WorkingTotalLimit: item.WorkingTotalLimit || 0,
//             WorkingPendingLimit: item.WorkingPendingLimit || 0,
//             TotalYieldEarning: item.TotalYieldEarning || 0,
//             TotalYieldLimit: item.TotalYieldLimit || 0,
//             PendingYieldLimit: item.PendingYieldLimit || 0,
//             WeeklyYiled: item.WeeklyYiled || 0,
//             MonthlyRevenue: item.MonthlyRevenue || 0,
//             LifetimeRevenue: item.LifetimeRevenue || 0,
//             DirectBonus: item.DirectBonus || 0,
//             CommunityBuildingBonus: item.CommunityBuildingBonus || 0,
//             ComputeRevenueShare: item.ComputeRevenueShare || 0,
//             RewardBonus: item.RewardBonus || 0,
//             RankBonus: item.RankBonus || 0,
//             LeaderShipBonus: item.LeaderShipBonus || 0,
//             LevelIncome: item.LevelIncome || 0,
//             ActiveAgent: item.ActiveAgent || 0,
//             IdleAgent: item.IdleAgent || 0,
//             GPUUsage: item.GPUUsage || 0,
//             CPUUsage: item.CPUUsage || 0,
//             PeakGPUUsage: item.PeakGPUUsage || 0,
//             PeakCPUUsage: item.PeakCPUUsage || 0,
//             RuntimeHours: item.RuntimeHours || 0,
//             UptimeHours: item.UptimeHours || 0,
//             TodayYieldIncome: item.TodayYieldIncome || 0,
//             TodayCreditsDeployed: item.TodayCreditsDeployed || 0,
//             UnitsUsed: item.ComputeUnitsUsed || 0,
//             CheckContractStatus: item.CheckContractStatus || 0,
//             ContractRechargeID: item.ContractRechargeID || "",
//             PlatformFee: item.PlatformFee || 10,
//             YourShare: item.YourShare || 90,
//             NextDistribution: item.NextDistribution || "",
//             activeagent: item.ActiveAgent || 0,
//             AIActiveFeed: item.AIActiveFeed,
//           }));

//           setAnalyticsData({ data: transformedData });
//           setAgents(transformedData);
//           setFullApiResponse(transformedData);
//           setLoading(false);
//         } else {
//           throw new Error('Invalid API response');
//         }
//       } catch (error) {
//         console.error('Error fetching analytics data:', error);
//         setError('Failed to load analytics data');
//         setLoading(false);
//       }
//     };

//     fetchAnalyticsData();
//   }, []);

//   // Removed real-time simulation interval since we're using real API data
//   // The data will be fetched from the API and updated when the component mounts

//   const getProductConfig = useMemo(
//     () => (productName: string): ProductConfig => ({
//       price: 500,
//       unitPerHour: 200,
//       unitValue: 2,
//       color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
//     }),
//     []
//   );

//   const firstDataItem: AnalyticsDataItem = analyticsData?.data?.[0] || ({
//     Agent: "",
//     AgentStatus: "",
//     Country: "",
//     ComputeUnitsUsed: 0,
//     EnergyConsumption: 0,
//     MemoryUsage: 0,
//     TasksCompleted: 0,
//     DailyROI: "0",
//     Uptime: "0",
//     Efficiency: "0",
//     CreatedDate: "",
//     YieldIncome: 0,
//     CreditsPurchased: 0,
//     PeakHourFlag: "",
//     ProfitContribution: 0,
//     LeaseAmount: 0,
//     AvgROI: 0,
//     WorkingTotalEarning: 0,
//     WorkingTotalLimit: 0,
//     WorkingPendingLimit: 0,
//     TotalYieldEarning: 0,
//     TotalYieldLimit: 0,
//     PendingYieldLimit: 0,
//     WeeklyYiled: 0,
//     MonthlyRevenue: 0,
//     LifetimeRevenue: 0,
//     DirectBonus: 0,
//     CommunityBuildingBonus: 0,
//     ComputeRevenueShare: 0,
//     RewardBonus: 0,
//     RankBonus: 0,
//     LeaderShipBonus: 0,
//     LevelIncome: 0,
//     ActiveAgent: 0,
//     IdleAgent: 0,
//     GPUUsage: 0,
//     CPUUsage: 0,
//     TodayYieldIncome: 0,
//     TodayCreditsDeployed: 0,
//     UnitsUsed: 0,
//     CheckContractStatus: 0,
//     ContractRechargeID: "",
//   } as AnalyticsDataItem);

//   const cards = useMemo(() => [
//     {
//       label: 'Active Agents',
//       value: analyticsData?.data?.reduce((sum, item) => sum + (item.ActiveAgent || 0), 0) || 0,
//       icon: <RiRobot2Line className="text-xl sm:text-2xl" />,
//       gradient: 'from-green-500 to-emerald-500',
//     },
//     {
//       label: 'Idle Agent',
//       value: analyticsData?.data?.reduce((sum, item) => sum + (item.IdleAgent || 0), 0) || 0,
//       icon: <RiUserUnfollowLine className="text-xl sm:text-2xl" />,
//       gradient: 'from-blue-500 to-pink-500',
//     },
//   ], [analyticsData]);

//   const getCountryCode = (countryName: string): string => {
//     const countryCodes: Record<string, string> = {
//       'USA': 'US',
//       'United States': 'US',
//       'United States of America': 'US',
//       'Canada': 'CA',
//       'UK': 'GB',
//       'United Kingdom': 'GB',
//       'Great Britain': 'GB',
//       'Italy': 'IT',
//       'France': 'FR',
//       'Germany': 'DE',
//       'Spain': 'ES',
//       'Portugal': 'PT',
//       'Netherlands': 'NL',
//       'Holland': 'NL',
//       'Belgium': 'BE',
//       'Sweden': 'SE',
//       'Norway': 'NO',
//       'Denmark': 'DK',
//       'Finland': 'FI',
//       'Luxembourg': 'LU',
//       'Malta': 'MT',
//       'Hungary': 'HU',
//       'Bulgaria': 'BG',
//       'Ireland': 'IE',
//       'Switzerland': 'CH',
//       'Austria': 'AT',
//       'Poland': 'PL',
//       'Czech Republic': 'CZ',
//       'Slovakia': 'SK',
//       'Slovenia': 'SI',
//       'Croatia': 'HR',
//       'Romania': 'RO',
//       'Greece': 'GR',
//       'Cyprus': 'CY',
//       'Estonia': 'EE',
//       'Latvia': 'LV',
//       'Lithuania': 'LT',
//       'Iceland': 'IS',
//       'Ukraine': 'UA',
//       'Belarus': 'BY',
//       'Serbia': 'RS',
//       'Bosnia and Herzegovina': 'BA',
//       'Albania': 'AL',
//       'North Macedonia': 'MK',
//       'Montenegro': 'ME',
//       'India': 'IN',
//       'Japan': 'JP',
//       'China': 'CN',
//       'South Korea': 'KR',
//       'Korea': 'KR',
//       'North Korea': 'KP',
//       'Singapore': 'SG',
//       'Malaysia': 'MY',
//       'Thailand': 'TH',
//       'Vietnam': 'VN',
//       'Indonesia': 'ID',
//       'Philippines': 'PH',
//       'Pakistan': 'PK',
//       'Bangladesh': 'BD',
//       'Sri Lanka': 'LK',
//       'Nepal': 'NP',
//       'Bhutan': 'BT',
//       'Maldives': 'MV',
//       'Myanmar': 'MM',
//       'Burma': 'MM',
//       'Cambodia': 'KH',
//       'Laos': 'LA',
//       'Mongolia': 'MN',
//       'Taiwan': 'TW',
//       'Hong Kong': 'HK',
//       'Macau': 'MO',
//       'Brunei': 'BN',
//       'Timor-Leste': 'TL',
//       'East Timor': 'TL',
//       'Saudi Arabia': 'SA',
//       'United Arab Emirates': 'AE',
//       'UAE': 'AE',
//       'Qatar': 'QA',
//       'Kuwait': 'KW',
//       'Oman': 'OM',
//       'Bahrain': 'BH',
//       'Israel': 'IL',
//       'Jordan': 'JO',
//       'Lebanon': 'LB',
//       'Syria': 'SY',
//       'Iraq': 'IQ',
//       'Iran': 'IR',
//       'Turkey': 'TR',
//       'Yemen': 'YE',
//       'South Africa': 'ZA',
//       'Egypt': 'EG',
//       'Nigeria': 'NG',
//       'Kenya': 'KE',
//       'Ethiopia': 'ET',
//       'Ghana': 'GH',
//       'Morocco': 'MA',
//       'Algeria': 'DZ',
//       'Tunisia': 'TN',
//       'Uganda': 'UG',
//       'Tanzania': 'TZ',
//       'Rwanda': 'RW',
//       'Senegal': 'SN',
//       'Ivory Coast': 'CI',
//       "Côte d'Ivoire": 'CI',
//       'Cameroon': 'CM',
//       'Zambia': 'ZM',
//       'Zimbabwe': 'ZW',
//       'Botswana': 'BW',
//       'Namibia': 'NA',
//       'Mozambique': 'MZ',
//       'Madagascar': 'MG',
//       'Mauritius': 'MU',
//       'Seychelles': 'SC',
//       'Brazil': 'BR',
//       'Argentina': 'AR',
//       'Chile': 'CL',
//       'Colombia': 'CO',
//       'Peru': 'PE',
//       'Venezuela': 'VE',
//       'Uruguay': 'UY',
//       'Paraguay': 'PY',
//       'Bolivia': 'BO',
//       'Ecuador': 'EC',
//       'Guyana': 'GY',
//       'Suriname': 'SR',
//       'Australia': 'AU',
//       'New Zealand': 'NZ',
//       'Fiji': 'FJ',
//       'Papua New Guinea': 'PG',
//       'Samoa': 'WS',
//       'Tonga': 'TO',
//       'Vanuatu': 'VU',
//       'Solomon Islands': 'SB',
//       'Kiribati': 'KI',
//       'Micronesia': 'FM',
//       'Palau': 'PW',
//       'Marshall Islands': 'MH',
//       'Jamaica': 'JM',
//       'Bahamas': 'BS',
//       'Barbados': 'BB',
//       'Trinidad and Tobago': 'TT',
//       'Dominican Republic': 'DO',
//       'Haiti': 'HT',
//       'Cuba': 'CU',
//       'Puerto Rico': 'PR'
//     };

//     return countryCodes[countryName] || 'US';
//   };

//   const getFlagUrl = (countryName: string): string => {
//     const code = getCountryCode(countryName);
//     return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
//   };

//   if (loading) {
//     return <div className="p-4 text-center sm:p-8">Loading...</div>;
//   }

//   if (error) {
//     return <div className="p-4 text-center text-red-500 dark:text-red-400 sm:p-8">{error}</div>;
//   }

//   return (
//     <>
//       <div className="min-h-screen p-4 overflow-x-hidden transition-colors bg-white dark:bg-gray-900 sm:p-5 lg:p-5">
//         <div className="w-full mx-auto">

//           <div className="grid grid-cols-1 mx-4 lg:grid-cols-[1fr_360px] gap-6 items-start mb-8">
//             <div>
//               <div className="vv-mono inline-flex items-center gap-2 bg-[#0B1437] dark:bg-gray-800 text-[#00D4FF] text-[11px] font-medium px-[14px] py-[5px] rounded-full mb-[14px] tracking-[0.08em]">
//                 <span className="vv-blink inline-block w-[7px] h-[7px] bg-[#00C896] rounded-full" />
//                 QUZO AI MARKETPLACE
//               </div>
//               <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#0B1437] dark:text-white leading-tight tracking-[-0.5px]">
//                 AI Agent <span className="vv-gradient-text">Performance Analytics</span>
//               </h1>
//               <p className="text-sm text-[#4A5680] dark:text-gray-400 mt-[10px] max-w-[640px] leading-relaxed">
//                 Monitor your deployed AI Agent in real-time — track compute utilization, global workload distribution, task execution, infrastructure performance, and revenue generated through AI marketplace utilization.
//               </p>

//               <div className="flex flex-wrap items-start gap-4 sm:flex-row sm:items-center sm:gap-8 sm:mt-0">
//                 {cards.map((card, index) => (
//                   <div key={index} className="flex flex-col items-center justify-center gap-1 mt-4">
//                     <div
//                       className={`flex items-center justify-center w-12 h-12 sm:mb-2 text-white rounded-full sm:w-16 sm:h-16 bg-gradient-to-r ${card.gradient}`}
//                     >
//                       {card.icon}
//                     </div>
//                     <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">{card.label}</p>
//                     <p className="text-base font-bold text-gray-900 dark:text-white sm:text-2xl">{card.value}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* LIVE FEED */}
//             <div className="bg-[#0B1437] dark:bg-gray-800 rounded-[16px] p-4 px-5 overflow-hidden relative">
//               <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.08) 0%,transparent 60%)' }} />
//               <div className="flex items-center gap-2 mb-3">
//                 <div className="vv-blink-fast w-2 h-2 bg-[#00C896] rounded-full" />
//                 <h3 className="text-[12px] font-semibold text-[#00D4FF] tracking-[0.06em] uppercase">Live AI Activity Feed</h3>
//               </div>
//               <div className="flex flex-col gap-0">
//                 {visibleFeed.map((item, i) => (
//                   <div key={i} className="vv-mono text-[11px] text-white/80 dark:text-gray-300 py-[7px] border-b border-white/[0.06] last:border-0 leading-relaxed transition-opacity duration-300"
//                     style={{ opacity: i === 0 ? (feedFade ? 1 : 0) : 1 }}>
//                     <span className="inline-flex items-center">{getIconComponent(item.agentIcon)}</span>
//                     <span className="ml-2">{item.activityTitle}</span>
//                     <span className="ml-2 inline-flex items-center">
//                       {getStatusIcon(item.status)}
//                       <span className={item.status === 'Running' ? 'text-green-400' : item.status === 'Completed' ? 'text-blue-400' : 'text-gray-400'}>
//                         {item.status}
//                       </span>
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Metric Cards */}
//           <div className="flex flex-col justify-between gap-4 sm:flex-row">
//             <div className="p-6 text-green-900 dark:text-green-300 transition-all duration-300 shadow-lg cursor-pointer bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl hover:shadow-xl hover:scale-105 w-[100%]">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center justify-center w-12 h-12 bg-green-200 dark:bg-green-800/50 rounded-xl">
//                   <RiMoneyDollarCircleLine className="text-2xl text-green-700 dark:text-green-400" />
//                 </div>
//               </div>
//               <div className="mb-2">
//                 <h3 className="text-sm font-medium text-green-700 dark:text-green-400 whitespace-nowrap">Yield Income</h3>
//                 <div className="mt-1 text-2xl font-bold text-green-900 dark:text-green-300">${analyticsData?.data?.reduce((sum, item) => sum + (item.TodayYieldIncome || 0), 0).toFixed(2) || "0.00"}</div>
//               </div>
//             </div>

//             <div className="p-6 text-orange-900 dark:text-orange-300 transition-all duration-300 shadow-lg cursor-pointer w-[100%] bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl hover:shadow-xl hover:scale-105">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center justify-center w-12 h-12 bg-orange-200 dark:bg-orange-800/50 rounded-xl">
//                   <RiFlashlightFill className="text-2xl text-orange-700 dark:text-orange-400" />
//                 </div>
//               </div>
//               <div className="mb-2">
//                 <h3 className="text-sm font-medium text-orange-700 dark:text-orange-400 whitespace-nowrap">Daily GPU Usage</h3>
//                 <div className="mt-1 text-2xl font-bold text-orange-900 dark:text-orange-300">{gpuUsage}%</div>
//               </div>
//             </div>

//             <div className="p-6 text-blue-900 dark:text-blue-300 transition-all duration-300 shadow-lg cursor-pointer w-[100%] bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl hover:shadow-xl hover:scale-105">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center justify-center w-12 h-12 bg-blue-200 dark:bg-blue-800/50 rounded-xl">
//                   <RiCpuFill className="text-2xl text-blue-700 dark:text-blue-400" />
//                 </div>
//               </div>
//               <div className="mb-2">
//                 <h3 className="text-sm font-medium text-blue-700 dark:text-blue-400 whitespace-nowrap">Daily CPU Usage</h3>
//                 <div className="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-300">{cpuUsage}%</div>
//               </div>
//             </div>

//             <div className="p-6 text-pink-900 dark:text-pink-300 transition-all duration-300 shadow-lg cursor-pointer w-[100%] bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-2xl hover:shadow-xl hover:scale-105">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center justify-center w-12 h-12 bg-pink-200 dark:bg-pink-800/50 rounded-xl">
//                   <RiDatabase2Fill className="text-2xl text-pink-700 dark:text-pink-400" />
//                 </div>
//               </div>
//               <div className="mb-2">
//                 <h3 className="text-sm font-medium text-pink-700 dark:text-pink-400 whitespace-nowrap">Daily Memory Consumption</h3>
//                 <div className="mt-1 text-2xl font-bold text-pink-900 dark:text-pink-300">{analyticsData?.data?.reduce((sum, item) => sum + (item.MemoryUsage || 0), 0).toFixed(2) || "0.00"} GB</div>
//               </div>
//             </div>

//             <div className="p-6 text-teal-900 dark:text-teal-300 transition-all duration-300 shadow-lg cursor-pointer w-[100%] bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-2xl hover:shadow-xl hover:scale-105">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center justify-center w-12 h-12 bg-teal-200 dark:bg-teal-800/50 rounded-xl">
//                   <RiPieChartFill className="text-2xl text-teal-700 dark:text-teal-400" />
//                 </div>
//               </div>
//               <div className="mb-2">
//                 <h3 className="text-sm font-medium text-teal-700 dark:text-teal-400 whitespace-nowrap">Task Completed</h3>
//                 <div className="mt-1 text-2xl font-bold text-teal-900 dark:text-teal-300">{analyticsData?.data?.reduce((sum, item) => sum + (item.TasksCompleted || 0), 0).toLocaleString() || "0"}</div>
//               </div>
//             </div>

//             <div className="p-6 text-violet-900 dark:text-violet-300 transition-all duration-300 shadow-lg cursor-pointer w-[100%] bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-2xl hover:shadow-xl hover:scale-105">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center justify-center w-12 h-12 bg-violet-200 dark:bg-violet-800/50 rounded-xl">
//                   <RiRobot2Fill className="text-2xl text-violet-700 dark:text-violet-400" />
//                 </div>
//               </div>
//               <div className="mb-2">
//                 <h3 className="text-sm font-medium text-violet-700 dark:text-violet-400 whitespace-nowrap">Deployed Credits</h3>
//                 <div className="mt-1 text-2xl font-bold text-violet-900 dark:text-violet-300">${analyticsData?.data?.reduce((sum, item) => sum + (item.TodayCreditsDeployed || 0), 0).toFixed(2) || "0.00"}</div>
//               </div>
//             </div>
//           </div>

//           {/* Agent Performance Metrics */}
//           <div className="grid grid-cols-1 gap-6 mt-6 xl:grid-cols-4">
//             <div className="space-y-6 xl:col-span-2">
//               <div className="p-4 bg-white border border-gray-100 shadow-lg dark:bg-gray-800 dark:border-gray-700 sm:p-6 lg:p-8 rounded-2xl">
//                 <div className="flex flex-col items-start justify-between mb-8 sm:flex-row sm:items-center">
//                   <h2 className="text-sm font-bold text-gray-900 dark:text-white sm:text-2xl">Agent Performance Metrics</h2>
//                   <div className="flex flex-wrap gap-4 mt-4 text-xs sm:flex-row sm:gap-6 sm:text-sm sm:mt-0">
//                     <div className="flex items-center space-x-2">
//                       <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                       <span className="dark:text-gray-300">Active</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//                       <span className="dark:text-gray-300">Needs Upgrade</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
//                       <span className="dark:text-gray-300">Idle</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="space-y-4 max-h-[960px] overflow-y-auto pr-2">
//                   {agents.map((agent, idx) => (
//                     <AgentPerformanceCard
//                       key={idx}
//                       agent={agent.Agent}
//                       status={agent.AgentStatus}
//                       location={`${agent.Country}`}
//                       units={`${agent.ComputeUnitsUsed} kWh`}
//                       energy={`${agent.EnergyConsumption} kWh`}
//                       memory={`${agent.MemoryUsage} GB`}
//                       profit={`${agent.TasksCompleted}`}
//                       roi={`${agent.DailyROI}%`}
//                       tasks={agent.TasksCompleted}
//                       uptime={`${agent.Uptime}%`}
//                       efficiency={`${agent.Efficiency}%`}
//                       CreatedDate={`${agent.CreatedDate}`}
//                       YieldIncome={agent.YieldIncome}
//                       CreditsPurchased={agent.CreditsPurchased}
//                       peakHours={agent.PeakHourFlag === "Yes" ? "Peak Hours Active" : "No Peak Hours"}
//                       memoryTrend={[]}
//                       apiResponse={fullApiResponse || []}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <div className="space-y-6 xl:col-span-2">
//               <div className="p-4 bg-white border border-gray-100 shadow-lg dark:bg-gray-800 dark:border-gray-700 sm:p-6 rounded-2xl">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-base font-bold text-gray-900 dark:text-white sm:text-lg">License Income Distribution</h3>
//                   <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg dark:bg-blue-900/30">
//                     <RiPieChart2Fill className="text-blue-600 dark:text-blue-400" />
//                   </div>
//                 </div>
//                 <div className="h-60 mb-6 sm:h-60 w-full min-h-[240px] flex items-center justify-center">
//                   <Pie
//                     data={pieData}
//                     options={{
//                       responsive: true,
//                       maintainAspectRatio: false,
//                       plugins: {
//                         legend: {
//                           position: "top" as const,
//                           labels: { color: document.documentElement.classList.contains('dark') ? '#fff' : '#000' }
//                         },
//                         title: {
//                           display: true,
//                           text: "Income Distribution",
//                           color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
//                         },
//                       },
//                     }}
//                     style={{ width: "100%", height: "100%" }}
//                   />
//                 </div>
//                 <div className="space-y-3">
//                   {bonusData.labels.map((label, idx) => (
//                     <div key={idx} className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-4 h-4 rounded-full" style={{ backgroundColor: bonusData.colors[idx] }}></div>
//                         <span className="text-sm font-medium text-gray-700 dark:text-gray-300 sm:text-base">{label}</span>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-sm font-bold text-gray-900 dark:text-white sm:text-base">${Number(bonusData.values[idx] || 0).toFixed(2)}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="pt-4 mt-6 border-t border-gray-100 dark:border-gray-700">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 sm:text-base">Total Performance Earning:</span>
//                     <span className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">${analyticsData?.data?.reduce((sum, item) => sum + (item.WorkingTotalEarning || 0), 0).toFixed(2) || "0.00"}</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 sm:text-base">Performance Limit:</span>
//                     <span className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">${analyticsData?.data?.reduce((sum, item) => sum + (item.WorkingTotalLimit || 0), 0).toFixed(2) || "0.00"}</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 sm:text-base">Pending Limit:</span>
//                     <span className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">${analyticsData?.data?.reduce((sum, item) => sum + (item.WorkingPendingLimit || 0), 0).toFixed(2) || "0.00"}</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="p-4 bg-white border border-gray-100 shadow-lg dark:bg-gray-800 dark:border-gray-700 sm:p-6 rounded-2xl">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-base font-bold text-gray-900 dark:text-white sm:text-lg">Deployments Earnings Progress Tracker</h3>
//                   <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg dark:bg-blue-900/30">
//                     <RiPieChart2Fill className="text-yellow-600 dark:text-yellow-400" />
//                   </div>
//                 </div>
//                 <div className="h-40 mb-6 sm:h-48">
//                   <Pie
//                     data={pieData2}
//                     options={{
//                       responsive: true,
//                       maintainAspectRatio: false,
//                       plugins: {
//                         legend: {
//                           position: "top" as const,
//                           labels: { color: document.documentElement.classList.contains('dark') ? '#fff' : '#000' }
//                         },
//                         title: {
//                           display: true,
//                           text: "Earnings Progress Distribution",
//                           color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
//                         },
//                       },
//                     }}
//                     style={{ width: "100%", height: "100%" }}
//                   />
//                 </div>
//                 <div className="space-y-3">
//                   {allLabels.map((label, idx) => (
//                     <div key={idx} className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         <div
//                           className="w-4 h-4 rounded-full"
//                           style={{ backgroundColor: allColors[idx] }}
//                         ></div>
//                         <span className="text-sm font-medium text-gray-700 dark:text-gray-300 sm:text-base">
//                           {label}
//                         </span>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-sm font-bold text-gray-900 dark:text-white sm:text-base">
//                           ${totals.values[idx]?.toFixed(2)}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="p-4 mt-6 bg-white border border-gray-100 shadow-lg dark:bg-gray-800 dark:border-gray-700 sm:p-6 lg:p-8 rounded-2xl">
//             <div className="flex flex-col items-start justify-between mb-8 sm:flex-row sm:items-center">
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Global Agent Deployment</h2>
//                 <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:text-base">AI Agents deployed across developed countries</p>
//               </div>
//               <div className="flex flex-wrap gap-4 mt-4 sm:flex-row sm:gap-6 sm:mt-0">
//                 <div className="text-center">
//                   <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Total Locations</p>
//                   <p className="text-lg font-bold text-blue-600 dark:text-blue-400 sm:text-2xl">{totalLocations}</p>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Active Agents</p>
//                   <p className="text-lg font-bold text-green-600 dark:text-green-400 sm:text-2xl">{analyticsData?.data?.reduce((sum, item) => sum + (item.ActiveAgent || 0), 0) || 0}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
//               <div className="lg:col-span-2">
//                 <div className="relative w-full h-[500px] sm:h-[500px] rounded-xl overflow-hidden shadow-lg">
//                   <WorldMap analyticsData={analyticsData || { data: [] }} />
//                 </div>
//                 <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs sm:flex-row sm:gap-6 sm:text-sm">
//                   <div className="flex items-center space-x-2">
//                     <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//                     <span className="text-gray-700 dark:text-gray-300">Active Deployment</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//                     <span className="text-gray-700 dark:text-gray-300">Maintenance Mode</span>
//                   </div>
//                 </div>
//               </div>

//               <div className={`space-y-2 overflow-y-auto h-[500px]`}>
//                 {groupedData.map((location, idx) => (
//                   <div
//                     key={idx}
//                     className="p-4 transition-all border border-gray-200 cursor-pointer dark:border-gray-700 rounded-xl hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600"
//                   >
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center space-x-3">
//                         <img
//                           src={getFlagUrl(location.Country)}
//                           alt={`${location.Country} flag`}
//                           className="object-cover w-8 h-8 border border-gray-200 rounded-full dark:border-gray-700"
//                         />
//                         <div>
//                           <h4 className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
//                             {location.Country}
//                           </h4>
//                         </div>
//                       </div>
//                       <span
//                         className={`px-2 py-1 text-xs sm:text-sm font-medium rounded-full ${location.AgentStatus === "Active"
//                           ? "text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900/40"
//                           : "text-yellow-800 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/40"
//                           }`}
//                       >
//                         {location.AgentStatus}
//                       </span>
//                     </div>

//                     <div className="grid grid-cols-3 gap-2 mb-3 text-center">
//                       <div>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">Agents</p>
//                         <p className="text-base font-bold text-gray-900 dark:text-white sm:text-lg">
//                           {location.agents.length}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">Task Completed</p>
//                         <p className="text-base font-bold text-green-600 dark:text-green-400 sm:text-lg">
//                           {location.agents.reduce((sum, a) => sum + (a.TasksCompleted || 0), 0).toLocaleString()}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">Energy</p>
//                         <p className="text-base font-bold text-orange-600 dark:text-orange-400 sm:text-lg">
//                           {location.agents.reduce((sum, a) => sum + (a.EnergyConsumption || 0), 0).toFixed(2)} kWh
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>


//           {/* ═══════════════════════════════════════════
//             MONTHLY REVENUE
//           ═══════════════════════════════════════════ */}
//           <div className="pt-8 mb-8">
//             <div className="flex items-center gap-3 mb-[18px]">
//               <h2 className="text-[18px] font-bold text-[#0B1437] dark:text-white">Yield Revenue Analytics</h2>
//               <div className="text-[10px] font-semibold uppercase tracking-[0.07em] px-[10px] py-[3px] rounded-full" style={{ background: 'rgba(245,166,35,0.12)', color: '#F5A623' }}>Your Profit Share</div>
//             </div>
//             <div className="vv-card bg-white/[0.92] dark:bg-gray-800/90 rounded-[16px] border border-[#0B1437]/[0.08] dark:border-gray-700 backdrop-blur-[12px] p-6">
//               <div className="grid grid-cols-2 gap-4 mb-5 lg:grid-cols-4">
//                 {[
//                   { label: "Total Revenue Share", val: `$${revenueStats.totalRevenueShare.toFixed(2)}`, cls: 'text-[#F5A623]', size: 'text-[35px]'},
//                   { label: 'This Week', val: `$${revenueStats.thisWeek.toFixed(2)}`, cls: 'text-[#0B1437] dark:text-white', size: 'text-[35px]' },
//                   { label: 'This Month', val: `$${revenueStats.thisMonth.toFixed(2)}`, cls: 'text-[#0B1437] dark:text-white', size: 'text-[35px]'},
//                   { label: 'Lifetime Reward', val: `$${revenueStats.TotalYieldLimit.toFixed(2)}`, cls: 'text-[#0B1437] dark:text-white', sub: 'Total earned since deploy', size: 'text-[35px]' },
//                 ].map((r, i) => (
//                   <div key={i} className="p-5 bg-white dark:bg-gray-800/50 rounded-xl border border-[#0B1437]/[0.08] dark:border-gray-700">
//                     <div className="text-[11px] uppercase tracking-[0.06em] text-[#8A93B2] dark:text-gray-500 font-semibold mb-2">{r.label}</div>
//                     <div className={`${r.size || 'text-[24px]'} font-extrabold ${r.cls}`}>{r.val}</div>
//                     <div className="text-[11px] text-[#4A5680] dark:text-gray-400 mt-[6px]">{r.sub}</div>
//                   </div>
//                 ))}
//               </div>
//               <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-[#0B1437]/[0.08] dark:border-gray-700 p-4">
//                 <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
//                   <div className="text-[13px] font-semibold text-[#4A5680] dark:text-gray-300">
//                     Revenue Distribution
//                   </div>
//                   <div className="flex gap-4 text-[11px] text-[#8A93B2] dark:text-gray-500">
//                     <span className="flex items-center gap-[5px]">
//                       <span className="inline-block w-[10px] h-[10px] rounded-full bg-[#00D4FF]" />
//                       Revenue
//                     </span>
//                     <span className="flex items-center gap-[5px]">
//                       <span className="inline-block w-[10px] h-[10px] rounded-full bg-[#F5A623]" />
//                       Your Share (90%)
//                     </span>
//                   </div>
//                 </div>

//                 <canvas
//                   ref={revenueRef}
//                   style={{ width: "100%", height: "100px", display: "block" }}
//                 />

//                 <div
//                   className="mt-4 p-[14px] rounded-[10px] border flex flex-wrap gap-6 sm:gap-8 items-center"
//                   style={{
//                     background:
//                       "linear-gradient(90deg, rgba(0, 200, 150, 0.06), rgba(0, 212, 255, 0.06))",
//                     borderColor: "rgba(0, 200, 150, 0.15)",
//                   }}
//                 >
//                   {statCards.map((s, i) => (
//                     <div key={i}>
//                       <div className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[#8A93B2] dark:text-gray-500 mb-2">
//                         {s.label}
//                       </div>
//                       <div className={`text-[18px] font-extrabold ${s.cls}`}>{s.value}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="bg-[#0B1437] dark:bg-gray-800 rounded-[16px] mt-6 p-6 sm:p-10">
//               <h2 className="text-center text-white text-[18px] sm:text-[20px] font-bold mb-9">
//                 How Your AI Agent Generates <span className="vv-gradient-text">Profit Share Income</span>
//               </h2>
//               <div className="flex flex-wrap items-center justify-center gap-0 overflow-x-auto sm:flex-nowrap">
//                 {[
//                   { icon: <MdVpnKey />, label: 'Acquire License' },
//                   { icon: <MdMemory />, label: 'Allocate Compute Credits' },
//                   { icon: <MdRocketLaunch />, label: 'Deploy AI Agent' },
//                   { icon: <MdPublic />, label: 'Global AI Processing' },
//                   { icon: <MdBusinessCenter />, label: 'Business Utilization' },
//                   { icon: <MdAttachMoney />, label: 'Revenue Generated' },
//                   { icon: <MdPercent />, label: 'Platform Fee 10%' },
//                   { icon: <MdStars />, label: 'Your Revenue Share 90%' },
//                 ].map((step, i, arr) => (
//                   <div key={i} className="flex items-center">
//                     <div className="flex flex-col items-center gap-2 min-w-[90px] sm:min-w-[110px]">
//                       <div className="w-14 h-14 rounded-full flex items-center justify-center text-[22px] border-2 border-[#00D4FF]/30 bg-[#00D4FF]/[0.08] text-[#00D4FF]">
//                         {step.icon}
//                       </div>
//                       <div className="text-[11px] font-semibold text-white/75 text-center">{step.label}</div>
//                     </div>
//                     {i < arr.length - 1 && <div className="text-[#00D4FF] text-[20px] mx-1 opacity-60 flex-shrink-0">→</div>}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default MyAgentPage;






"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { RiMoneyDollarCircleLine, RiFlashlightFill, RiCpuFill, RiDatabase2Fill, RiRobot2Fill, RiPieChartFill, RiPieChart2Fill, RiPulseLine, RiCodeSSlashLine, RiTerminalLine, RiBrainLine, RiChatCheckLine, RiFileTextLine, RiSearchEyeLine, RiSeoLine, RiMailLine, RiVoiceprintLine, RiRobotLine, RiAiGenerate, RiSparklingLine, RiLightbulbLine, RiCpuLine, RiServerLine, RiCloudLine, RiGlobalLine, RiSettings3Line, RiToolsLine, RiPlayCircleLine, RiCheckboxCircleLine, RiLoader4Line } from 'react-icons/ri'
import { countryCoordinates } from "@/app/components/countryCoordinates";
import WorldMap from "@/app/components/WorldMap";
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat";
import minMax from 'dayjs/plugin/minMax';
import {
  MdVpnKey,
  MdMemory,
  MdRocketLaunch,
  MdPublic,
  MdBusinessCenter,
  MdAttachMoney,
  MdPercent,
  MdStars
} from 'react-icons/md';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import { RiRobot2Line, RiUserUnfollowLine } from 'react-icons/ri';



ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

dayjs.extend(customParseFormat);
dayjs.extend(minMax);

const REVENUE_PER_UNIT = 2;

const CITY_OPTIONS = [
  "New York",
  "London",
  "Tokyo",
  "Paris",
  "Los Angeles",
  "Shanghai",
  "Hong Kong",
  "Sydney",
  "India",
];

const TIME_ZONE_MAP = {
  "New York": "America/New_York",
  "London": "Europe/London",
  "Tokyo": "Asia/Tokyo",
  "Paris": "Europe/Paris",
  "Los Angeles": "America/Los_Angeles",
  "Shanghai": "Asia/Shanghai",
  "Hong Kong": "Asia/Hong_Kong",
  "Sydney": "Australia/Sydney",
  "India": "Asia/Kolkata",
};

// TypeScript Interfaces
interface AnalyticsDataItem {
  Agent: string;
  AgentStatus: string;
  Country: string;
  ComputeUnitsUsed: number;
  EnergyConsumption: number;
  MemoryUsage: number;
  TasksCompleted: number;
  DailyROI: string;
  Uptime: string;
  Efficiency: string;
  CreatedDate: string;
  YieldIncome: number;
  CreditsPurchased: number;
  PeakHourFlag: string;
  ProfitContribution: number;
  LeaseAmount: number;
  LeaseDate?: string;
  PurchaseDate?: string;
  TotalInvestment?: number;
  AvgROI: number;
  WorkingTotalEarning: number;
  WorkingTotalLimit: number;
  WorkingPendingLimit: number;
  TotalYieldEarning: number;
  TotalYieldLimit: number;
  PendingYieldLimit: number;
  WeeklyYiled: number;
  MonthlyRevenue: number;
  LifetimeRevenue: number;
  DirectBonus: number;
  CommunityBuildingBonus: number;
  ComputeRevenueShare: number;
  RewardBonus: number;
  RankBonus: number;
  LeaderShipBonus: number;
  LevelIncome: number;
  ActiveAgent: number;
  IdleAgent: number;
  GPUUsage: number;
  CPUUsage: number;
  PeakGPUUsage?: number;
  PeakCPUUsage?: number;
  RuntimeHours?: number;
  UptimeHours?: number;
  TodayYieldIncome: number;
  TodayCreditsDeployed: number;
  UnitsUsed: number;
  CheckContractStatus: number;
  ContractRechargeID: string;
  AIActiveFeed?: string;
  PlatformFee?: number;
  YourShare?: number;
  NextDistribution?: string;
  activeagent?: number;
  location?: string;
  lastLocationUpdate?: number;
}

interface AnalyticsAPIResponseItem {
  Agent?: string;
  AgentStatus?: string;
  Country?: string;
  ComputeUnitsUsed?: number;
  EnergyConsumption?: number;
  MemoryUsage?: number;
  TasksCompleted?: number;
  AvgROI?: number;
  RuntimeHours?: number;
  UptimeHours?: number;
  Efficiency?: number;
  CreatedDate?: string;
  YieldIncome?: number;
  CreditsPurchased?: number;
  PeakHourFlag?: string;
  ProfitContribution?: number;
  LeaseAmount?: number;
  LeaseDate?: string;
  PurchaseDate?: string;
  TotalInvestment?: number;
  WorkingTotalEarning?: number;
  WorkingTotalLimit?: number;
  WorkingPendingLimit?: number;
  TotalYieldEarning?: number;
  TotalYieldLimit?: number;
  PendingYieldLimit?: number;
  WeeklyYiled?: number;
  MonthlyRevenue?: number;
  LifetimeRevenue?: number;
  DirectBonus?: number;
  CommunityBuildingBonus?: number;
  ComputeRevenueShare?: number;
  RewardBonus?: number;
  RankBonus?: number;
  LeaderShipBonus?: number;
  LevelIncome?: number;
  ActiveAgent?: number;
  IdleAgent?: number;
  GPUUsage?: number;
  CPUUsage?: number;
  PeakGPUUsage?: number;
  PeakCPUUsage?: number;
  TodayYieldIncome?: number;
  TodayCreditsDeployed?: number;
  UnitsUsed?: number;
  CheckContractStatus?: number;
  ContractRechargeID?: string;
  AIActiveFeed?: string;
  PlatformFee?: number;
  YourShare?: number;
  NextDistribution?: string;
  activeagent?: number;
  location?: string;
  lastLocationUpdate?: number;
}

interface AnalyticsDataResponse {
  data: AnalyticsDataItem[];
}

interface ProductConfig {
  price: number;
  unitPerHour: number;
  unitValue: number;
  color: string;
}

interface AgentData {
  energy: number;
  time: string;
  interaction: number;
  location: string;
  cpu: number;
  memory: number;
}

interface StatCard {
  label: string;
  value: string;
  cls: string;
}

interface RevenueStats {
  totalRevenueShare: number;
  thisWeek: number;
  thisMonth: number;
  TotalYieldLimit: number;
}

interface BonusData {
  labels: string[];
  values: number[];
  colors: string[];
}

interface ScatterData {
  datasets: {
    label: string;
    data: { x: number; y: number }[];
    backgroundColor: string;
    pointRadius: number;
  }[];
}

interface MemoryStats {
  highestUsageAgent: { agent: string; peak: number } | null;
  mostEfficientAgent: { agent: string; avgEfficiency: number } | null;
  totalUsage: number;
  chartLabels: string[];
  currentData: number[];
  peakData: number[];
  averageData: number[];
}

interface RevenueChartData {
  revenue: number[];
  share: number[];
  labels: string[];
  yieldIncomeByAgent: { agent: string; yieldIncome: number }[][];
}

interface GroupedDataItem {
  Country: string;
  AgentStatus: string;
  agents: AnalyticsDataItem[];
  lat: number;
  lng: number;
}

interface Totals {
  values: number[];
  total: number;
}

interface FeedItem {
  agentIcon: string;
  activityTitle: string;
  status: string;
}

interface ParsedFeedItem {
  agentIcon?: string;
  activityTitle?: string;
  status?: string;
}

interface ProductItem {
  name: string;
  value: number;
  timestamp?: number;
}

interface StatEntry {
  timestamp: number;
  value: number;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomAgentData(currentLocation: string): AgentData {
  const interaction = getRandomInt(0, 20);
  return {
    energy: getRandomInt(5, 20),
    time: new Date().toLocaleTimeString(),
    interaction,
    location: currentLocation,
    cpu: interaction > 0 ? getRandomInt(5, 95) : 0,
    memory: getRandomInt(100, 2048),
  };
}

interface AgentPerformanceCardProps {
  agent: string;
  status: string;
  location: string;
  units: string;
  energy: string;
  memory: string;
  profit: string;
  roi: string;
  uptime: string;
  efficiency: string;
  CreatedDate: string;
  YieldIncome: number;
  CreditsPurchased: number;
  apiResponse: AnalyticsDataItem[];
  tasks?: number;
  peakHours?: string;
  memoryTrend?: number[];
}

// ============================================================
// 🆕 NO DATA STATE COMPONENT
// ============================================================
interface NoDataStateProps {
  message: string;
  statusCode: number | null;
}

const NoDataState: React.FC<NoDataStateProps> = ({ message, statusCode }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const iv = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 500);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden  p-4 sm:p-6 lg:p-8">
      {/* Decorative background */}
      {/* <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/10" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/5 blur-3xl" />
      </div> */}

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center py-16 text-center sm:py-24">
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-ping rounded-full bg-blue-400/30" />
          <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-400/20 blur-xl" />
          <div className="relative grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-blue-500/40 sm:h-28 sm:w-28">
            <RiRobot2Fill className="h-12 w-12 text-white sm:h-14 sm:w-14" />
          </div>
          <div className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full bg-amber-400 shadow-lg">
            <span className="text-sm font-bold text-white">!</span>
          </div>
        </div>

        {/* Badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200/50 bg-blue-500/10 px-4 py-1.5 dark:border-blue-800/50">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
          </span>
          <span className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400">
            {statusCode === 404 ? "NO DEPLOYMENTS FOUND" : "NO DATA AVAILABLE"}
          </span>
        </div>

        {/* Title */}
        <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
          Your AI Agent Dashboard is{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Waiting to Launch
          </span>
        </h1>

        {/* Message from API */}
        <p className="mb-2 max-w-xl text-sm text-gray-600 dark:text-gray-400 sm:text-base">
          {message || "No data found for this user."}
        </p>

        <p className="mb-8 max-w-lg text-xs text-gray-500 dark:text-gray-500 sm:text-sm">
          Deploy your first AI agent to start earning yield income, track compute utilization,
          and monitor real-time performance analytics{dots}
        </p>

        {/* Steps / Features */}
        <div className="mb-10 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { icon: <RiRobot2Line />, title: "Deploy Agent", desc: "Activate from marketplace" },
            { icon: <RiFlashlightFill />, title: "Track Compute", desc: "Real-time GPU/CPU usage" },
            { icon: <RiMoneyDollarCircleLine />, title: "Earn Yield", desc: "Passive income stream" },
          ].map((step, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-gray-200 bg-white/70 p-4 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-blue-600"
            >
              <div className="mb-2 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{step.title}</p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={() => (window.location.href = "/deploy-agent")}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
          >
            <MdRocketLaunch className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            Deploy Your First Agent
          </button>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white/70 px-6 py-3 text-sm font-semibold text-gray-700 backdrop-blur-sm transition-all hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-200 dark:hover:border-blue-600 dark:hover:bg-gray-700/50"
          >
            <RiLoader4Line className="h-4 w-4" />
            Refresh Data
          </button>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-[11px] text-gray-400 dark:text-gray-600">
          Need help? Visit the{" "}
          <a href="/marketplace" className="font-medium text-blue-500 hover:underline">
            AI Marketplace
          </a>{" "}
          to explore agents.
        </p>
      </div>
    </div>
  );
};

const AgentPerformanceCard: React.FC<AgentPerformanceCardProps> = ({ 
  agent, 
  status, 
  location, 
  units, 
  energy, 
  memory, 
  profit, 
  roi, 
  uptime, 
  efficiency, 
  CreatedDate, 
  YieldIncome, 
  CreditsPurchased,
  apiResponse 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const generateChartData = (apiResponse: AnalyticsDataItem[], agent: string, createdDate: string) => {
    if (!Array.isArray(apiResponse) || apiResponse.length === 0) {
      return { labels: [], data: [] };
    }

    const agentData = apiResponse.filter(item => item.Agent === agent);
    if (agentData.length === 0) return { labels: [], data: [] };

    const startDate = dayjs(createdDate);

    const dataMap: Record<string, number> = {};
    agentData.forEach(item => {
      const date = dayjs(item.CreatedDate).format("DD/MM");
      const value = parseFloat(String(item.MemoryUsage).replace(/[^0-9.]/g, "")) || 0;
      dataMap[date] = value;
    });

    const labels: string[] = [];
    const data: number[] = [];
    for (let i = 0; i < 7; i++) {
      const date = startDate.add(i, "day").format("DD/MM");
      labels.push(date);
      data.push(dataMap[date] || 0);
    }

    return { labels, data };
  };

  const chartData = useMemo(() => {
    const { labels, data } = generateChartData(apiResponse, agent, CreatedDate);

    return {
      labels,
      datasets: [
        {
          label: "Memory Usage (GB)",
          data,
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: "#3B82F6",
          pointBorderColor: "#FFFFFF",
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [apiResponse, agent, CreatedDate]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "#1F2937",
        titleColor: "#FFFFFF",
        bodyColor: "#FFFFFF",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#6B7280",
          font: { size: 12 },
        },
      },
      y: {
        min: 0,
        max: 3.0,
        ticks: {
          stepSize: 1.0,
          color: "#6B7280",
          font: { size: 12 },
          callback: (value: string | number) => Number(value).toFixed(1),
        },
        grid: {
          color: "rgba(107, 114, 128, 0.1)",
        },
      },
    },
  };

  return (
    <div className="overflow-hidden transition-shadow border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md">
      <div
        className="transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex flex-col items-start justify-between p-3 sm:flex-row sm:items-center">
          <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6">
            <div>
              <div className="flex flex-col items-start mb-1 space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                <h3 className="text-base font-bold text-gray-900 dark:text-white sm:text-lg">{agent}</h3>
                <div className="flex items-center justify-between w-[100] sm:w-auto">
                  <p className="p-1 text-sm bg-gray-200 rounded-md dark:bg-gray-700 sm:text-base dark:text-gray-300">{location}</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 text-xs sm:text-sm font-medium rounded-full sm:hidden phone-margin-left
                    ${status === "Active"
                        ? "text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900/40"
                        : status === "Needs Upgrade"
                          ? "text-yellow-800 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/40"
                          : "text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-700"
                      }`}
                  >
                    {status}
                  </span>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 text-xs sm:text-sm font-medium rounded-full hidden sm:inline-flex
                ${status === "Active"
                    ? "text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900/40"
                    : status === "Needs Upgrade"
                      ? "text-yellow-800 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/40"
                      : "text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-700"
                  }`}
              >
                {status}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-start w-full gap-4 mt-3 sm:flex-row sm:items-center sm:mt-0">
            <div className="text-center w-[47%]">
              <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Units Used/Day</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white sm:text-base">{units}</p>
            </div>
            <div className="text-center w-[47%]">
              <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Energy Consumed</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white sm:text-base">{energy}</p>
            </div>
            <div className="text-center w-[47%]">
              <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Memory Usage</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white sm:text-base">{memory}</p>
            </div>
            <div className="text-center w-[47%]">
              <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Task Completed</p>
              <p className="mt-1 text-sm font-bold text-green-600 dark:text-green-400 sm:text-base">{profit || "247"}</p>
            </div>

            <div className="text-center w-[47%]">
              <p className="ml-2 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Working Date</p>
              <p className="ml-1 text-sm font-bold text-blue-600 dark:text-blue-400 sm:text-base">{CreatedDate ? CreatedDate.split("T")[0]?.split("-").reverse().join("-") : "N/A"}</p>
            </div>
            <div className="text-center w-[47%]">
              <p className="ml-2 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Yield Income</p>
              <p className="ml-1 text-sm font-bold text-blue-600 dark:text-blue-400 sm:text-base">${YieldIncome}</p>
            </div>
            <div className="flex items-center justify-center w-[47%]">
              <i className="text-lg text-gray-400 dark:text-gray-500 sm:text-xl ri-arrow-down-s-line" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        {showDetails && (
          <div className="px-3 py-4 bg-gray-100 dark:bg-gray-800/50 sm:py-8">
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">Detailed Metrics</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                  <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Tasks Completed</p>
                    <p className="mt-1 text-base font-bold text-gray-900 dark:text-white sm:text-lg">{profit || "247"}</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Efficiency</p>
                    <p className="mt-1 text-xl font-bold text-blue-600 dark:text-blue-400 sm:text-lg">
                      {efficiency ? `${parseFloat(efficiency).toFixed(2)}%` : "0.00%"}
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Deploy Credit</p>
                    <p className="mt-1 text-base font-bold text-gray-900 dark:text-white sm:text-lg">{CreditsPurchased || "247"}</p>
                  </div>
                  
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800">
                <h4 className="p-4 mb-4 text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">7-Day Memory Usage Trend</h4>
                <div className="p-4">
                  <div className="h-32 sm:h-48 lg:h-64">
                    <Line data={chartData} options={options} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MyAgentPage: React.FC = () => {
  const [product, setProduct] = useState<ProductItem[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);

  const revenueRef = useRef<HTMLCanvasElement>(null);
  const [agents, setAgents] = useState<AnalyticsDataItem[]>([]);
  const [fullApiResponse, setFullApiResponse] = useState<AnalyticsDataItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDataResponse | null>(null);
  // 🆕 No data state
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);
  const [apiStatusCode, setApiStatusCode] = useState<number | null>(null);

  const CheckContractStatus = analyticsData?.data?.[0]?.CheckContractStatus;
  const gpuUsage = useMemo(() => {
    if (!analyticsData?.data || analyticsData.data.length === 0) return 0;
    const total = analyticsData.data.reduce((sum, item) => sum + (item.GPUUsage || 0), 0);
    return (total / analyticsData.data.length).toFixed(2);
  }, [analyticsData]);
  const cpuUsage = useMemo(() => {
    if (!analyticsData?.data || analyticsData.data.length === 0) return 0;
    const total = analyticsData.data.reduce((sum, item) => sum + (item.CPUUsage || 0), 0);
    return (total / analyticsData.data.length).toFixed(2);
  }, [analyticsData]);

  const ContractRechargeID = analyticsData?.data?.[0]?.ContractRechargeID;


  const statsHistory = useRef<StatEntry[][]>([]);
  const cityStats = useRef<StatEntry[]>([]);
  const hourStats = useRef<StatEntry[]>([]);

  const feedData = useMemo<FeedItem[]>(() => {
    if (!analyticsData?.data || analyticsData.data.length === 0) return [];

    const allFeeds: FeedItem[] = [];

    analyticsData.data.forEach(item => {
      const aiActiveFeed = item.AIActiveFeed;
      if (!aiActiveFeed) return;

      try {
        const parsedFeed = JSON.parse(aiActiveFeed);
        if (Array.isArray(parsedFeed)) {
          parsedFeed.forEach((feedItem: ParsedFeedItem) => {
            allFeeds.push({
              agentIcon: feedItem.agentIcon || 'Activity',
              activityTitle: feedItem.activityTitle || 'Unknown activity',
              status: feedItem.status || 'Unknown'
            });
          });
        }
      } catch (e) {
        console.error('Failed to parse AIActiveFeed:', e);
      }
    });

    return allFeeds;
  }, [analyticsData]);

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ElementType> = {
      'Activity': RiSparklingLine,
      'Code2': RiTerminalLine,
      'Code': RiTerminalLine,
      'Terminal': RiTerminalLine,
      'Brain': RiBrainLine,
      'Chat': RiChatCheckLine,
      'File': RiFileTextLine,
      'Search': RiSearchEyeLine,
      'SEO': RiSeoLine,
      'Mail': RiMailLine,
      'Voice': RiVoiceprintLine,
      'Bot': RiRobotLine,
      'Robot': RiRobotLine,
      'Agent': RiRobotLine,
      'AI': RiAiGenerate,
      'Sparkle': RiSparklingLine,
      'Idea': RiLightbulbLine,
      'CPU': RiCpuLine,
      'Server': RiServerLine,
      'Cloud': RiCloudLine,
      'Global': RiGlobalLine,
      'Settings': RiSettings3Line,
      'Tools': RiToolsLine,
    };
    const IconComponent = iconMap[iconName] || RiRobotLine;
    return <IconComponent className="text-[#00D4FF]" />;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Running') {
      return <RiLoader4Line className="inline-block w-3 h-3 mr-1 text-green-400 animate-spin" />;
    } else if (status === 'Completed') {
      return <RiCheckboxCircleLine className="inline-block w-3 h-3 mr-1 text-blue-400" />;
    } else {
      return <RiPlayCircleLine className="inline-block w-3 h-3 mr-1 text-gray-400" />;
    }
  };

  const [feedIdx, setFeedIdx] = useState(0);
  const [feedFade, setFeedFade] = useState(true);

  useEffect(() => {
    if (feedData.length === 0) return;
    const iv = setInterval(() => {
      setFeedFade(false);
      setTimeout(() => { setFeedIdx(p => (p + 1) % feedData.length); setFeedFade(true); }, 300);
    }, 3000);
    return () => clearInterval(iv);
  }, [feedData.length]);

  const visibleFeed: FeedItem[] = feedData.length === 0 ? [] : Array.from({ length: Math.min(5, feedData.length) }, (_, i) => feedData[(feedIdx + i) % feedData.length]).filter((item): item is FeedItem => item !== undefined);

  const { totalProfitContribution, totalLeaseAmount } = useMemo(() => {
    if (!analyticsData?.data) return { totalProfitContribution: 0, totalLeaseAmount: 0 };

    const totalProfitContribution = analyticsData.data
      .reduce((sum, item) => sum + (item?.ProfitContribution || 0), 0)
      .toFixed(2);

    const totalLeaseAmount = analyticsData.data.reduce(
      (sum, item) => sum + (item?.LeaseAmount || 0),
      0).toFixed(2);

    return { totalProfitContribution, totalLeaseAmount };
  }, [analyticsData]);

  const revenueStats = useMemo<RevenueStats>(() => {
    if (!analyticsData?.data || analyticsData.data.length === 0) {
      return {
        totalRevenueShare: 0,
        thisWeek: 0,
        thisMonth: 0,
        TotalYieldLimit: 0
      };
    }

    const totalRevenueShare = analyticsData.data.reduce((sum, item) => sum + (item.LifetimeRevenue || 0), 0);
    const thisWeek = analyticsData.data.reduce((sum, item) => sum + (item.WeeklyYiled || 0), 0);
    const thisMonth = analyticsData.data.reduce((sum, item) => sum + (item.MonthlyRevenue || 0), 0);
    const TotalYieldLimit = analyticsData.data.reduce((sum, item) => sum + (item.TotalYieldLimit || 0), 0);

    return {
      totalRevenueShare,
      thisWeek,
      thisMonth,
      TotalYieldLimit
    };
  }, [analyticsData]);

  const pieData = useMemo(() => {
    if (!analyticsData?.data || analyticsData.data.length === 0) {
      const values = [0, 0, 0];
      const total = 0;
      return {
        labels: ["Total Performance Earning", "Performance Limit", "Pending Limit"],
        datasets: [
          {
            data: values,
            backgroundColor: ["#3B82F6", "#10B981", "#8B5CF6"],
            hoverOffset: 20,
          },
        ],
        total,
      };
    }

    const totalPerformanceEarning = analyticsData.data.reduce((sum, item) => sum + (item.WorkingTotalEarning || 0), 0);
    const performanceLimit = analyticsData.data.reduce((sum, item) => sum + (item.WorkingTotalLimit || 0), 0);
    const pendingLimit = analyticsData.data.reduce((sum, item) => sum + (item.WorkingPendingLimit || 0), 0);

    const values = [totalPerformanceEarning, performanceLimit, pendingLimit];
    const total = values.reduce((sum, val) => sum + val, 0);

    return {
      labels: ["Total Performance Earning", "Performance Limit", "Pending Limit"],
      datasets: [
        {
          data: values,
          backgroundColor: ["#3B82F6", "#10B981", "#8B5CF6"],
          hoverOffset: 20,
        },
      ],
      total,
    };
  }, [analyticsData]);

  const bonusData = useMemo<BonusData>(() => {
    if (!analyticsData?.data || analyticsData.data.length === 0) {
      return {
        labels: ["Direct Bonus", "Community Building Bonus", "Compute Revenue Share", "Reward Bonus", "Rank Bonus", "Leadership Bonus", "Level Income"],
        values: [0, 0, 0, 0, 0, 0, 0],
        colors: ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#6366F1", "#EF4444"],
      };
    }

    const directBonus = analyticsData.data.reduce((sum, item) => sum + (item.DirectBonus || 0), 0);
    const communityBuildingBonus = analyticsData.data.reduce((sum, item) => sum + (item.CommunityBuildingBonus || 0), 0);
    const computeRevenueShare = analyticsData.data.reduce((sum, item) => sum + (item.ComputeRevenueShare || 0), 0);
    const rewardBonus = analyticsData.data.reduce((sum, item) => sum + (item.RewardBonus || 0), 0);
    const rankBonus = analyticsData.data.reduce((sum, item) => sum + (item.RankBonus || 0), 0);
    const leadershipBonus = analyticsData.data.reduce((sum, item) => sum + (item.LeaderShipBonus || 0), 0);
    const levelIncome = analyticsData.data.reduce((sum, item) => sum + (item.LevelIncome || 0), 0);

    return {
      labels: ["Direct Bonus", "Community Building Bonus", "Compute Revenue Share", "Reward Bonus", "Rank Bonus", "Leadership Bonus", "Level Income"],
      values: [directBonus, communityBuildingBonus, computeRevenueShare, rewardBonus, rankBonus, leadershipBonus, levelIncome],
      colors: ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#6366F1", "#EF4444"],
    };
  }, [analyticsData]);

  useMemo(() => {
    if (!analyticsData?.data || analyticsData.data.length === 0) {
      return {
        labels: [],
        weeklyProfit: [],
        dailyYield: [],
        metrics: {
          cumulativeProfit: 0,
          todayProfit: 0,
          profitChange: 0,
          averageROI: 0,
          roiChange: 0,
          bestPerformer: { name: 'N/A', roi: 0 },
          leaseProfit: 0,
          leaseProfitToday: 0,
          dailyROI: 0,
          roiWeeklyChange: 0,
          activeInvestors: 0,
          newInvestors: 0,
          profitDistribution: {
            agentOwners: { value: 0, percent: 0 },
            leasers: { value: 0, percent: 0 },
            platform: { value: 0, percent: 0 }
          }
        }
      };
    }

    // Use PurchaseDate instead of LeaseDate
    const validLeases = analyticsData.data
      .filter(item => item.TotalInvestment && item.PurchaseDate)
      .map(item => {
        const leaseDate = dayjs(item.PurchaseDate, ["DD/MM/YYYY", "YYYY-MM-DD"], true);
        return {
          date: leaseDate,
          amount: parseFloat(String(item.TotalInvestment)),
          agent: item.Agent || "Unknown",
          avgROI: parseFloat(String(item.AvgROI)) || 0,
          profitContribution: parseFloat(String(item.WorkingTotalEarning)) || 0,
          isValid: leaseDate.isValid()
        };
      })
      .filter(lease => lease.isValid);

    if (!validLeases || validLeases.length === 0) {
      return { labels: [], weeklyProfit: [], dailyYield: [], metrics: {} };
    }

    let earliestDate = validLeases[0]!.date.startOf("day");
    let latestDate = validLeases[0]!.date.endOf("day");
    validLeases.forEach(lease => {
      if (lease.date.isBefore(earliestDate)) earliestDate = lease.date.startOf("day");
      if (lease.date.isAfter(latestDate)) latestDate = lease.date.endOf("day");
    });

    const totalDays = latestDate.diff(earliestDate, "day") + 1;

    const dailyProfitArr = Array(totalDays).fill(0);
    const dailyYieldArr = Array(totalDays).fill(0);

    validLeases.forEach(lease => {
      const dayIndex = lease.date.startOf("day").diff(earliestDate, "day");
      if (dayIndex >= 0 && dayIndex < totalDays) {
        dailyProfitArr[dayIndex] += lease.amount;
        dailyYieldArr[dayIndex] += lease.profitContribution;
      }
    });

    const dayLabels: string[] = [];
    for (let i = 0; i < totalDays; i++) {
      dayLabels.push(earliestDate.add(i, "day").format("ddd"));
    }

    let runningTotal = 0;
    const cumulativeProfitArr = dailyProfitArr.map(amount => {
      runningTotal += amount;
      return runningTotal;
    });

    const sliceStart = totalDays > 7 ? totalDays - 7 : 0;

    const lastDayIndex = totalDays - 1;
    const prevDayIndex = totalDays - 2;

    const cumulativeProfitValue = cumulativeProfitArr[lastDayIndex] || 0;
    const todayProfitValue = dailyProfitArr[lastDayIndex] || 0;
    const yesterdayProfitValue = dailyProfitArr[prevDayIndex] || 0;
    const profitChange = todayProfitValue - yesterdayProfitValue;

    const totalLeaseAmount = validLeases.reduce((sum, l) => sum + l.amount, 0);
    const weightedROI = validLeases.reduce((sum, l) => sum + (l.avgROI * l.amount), 0);
    const averageROI = totalLeaseAmount > 0 ? (weightedROI / totalLeaseAmount).toFixed(2) : 0;

    const bestPerformer = analyticsData.data.reduce((best, current) => {
      const currentROI = current.AvgROI || 0;
      return currentROI > best.roi ? { name: current.Agent || 'Unknown', roi: currentROI } : best;
    }, { name: 'N/A', roi: 0 });

    const agentOwnersProfit = analyticsData.data
      .filter(a => a.AgentStatus === 'Active')
      .reduce((sum, a) => sum + (a.WorkingTotalEarning || 0), 0);

    const leasersProfit = analyticsData.data
      .filter(a => a.AgentStatus !== 'Active')
      .reduce((sum, a) => sum + (a.WorkingTotalEarning || 0), 0);

    const totalProfitContribution = agentOwnersProfit + leasersProfit;
    const platformProfit = cumulativeProfitValue - totalProfitContribution;

    const profitDistribution = {
      agentOwners: {
        value: agentOwnersProfit,
        percent: cumulativeProfitValue > 0 ? ((agentOwnersProfit / cumulativeProfitValue) * 100).toFixed(0) : 0
      },
      leasers: {
        value: leasersProfit,
        percent: cumulativeProfitValue > 0 ? ((leasersProfit / cumulativeProfitValue) * 100).toFixed(0) : 0
      },
      platform: {
        value: platformProfit > 0 ? platformProfit : 0,
        percent: cumulativeProfitValue > 0 ? ((platformProfit / cumulativeProfitValue) * 100).toFixed(0) : 0
      }
    };

    const metrics = {
      cumulativeProfit: cumulativeProfitValue,
      todayProfit: todayProfitValue,
      profitChange,
      averageROI,
      roiChange: 0,
      bestPerformer,
      leaseProfit: cumulativeProfitValue,
      leaseProfitToday: todayProfitValue,
      dailyROI: averageROI,
      roiWeeklyChange: 0,
      activeInvestors: analyticsData.data.length,
      newInvestors: 0,
      profitDistribution
    };

    return {
      labels: dayLabels.slice(sliceStart),
      weeklyProfit: cumulativeProfitArr.slice(sliceStart),
      dailyYield: dailyYieldArr.slice(sliceStart),
      metrics
    };
  }, [analyticsData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const groupedData = useMemo<GroupedDataItem[]>(() => {
    if (!analyticsData?.data || analyticsData.data.length === 0) {
      return [];
    }

    // Group by country
    const countryMap = new Map<string, AnalyticsDataItem[]>();

    analyticsData.data.forEach(item => {
      if (item.Country) {
        if (!countryMap.has(item.Country)) {
          countryMap.set(item.Country, []);
        }
        countryMap.get(item.Country)!.push(item);
      }
    });

    // Convert to grouped data with coordinates
    const result: GroupedDataItem[] = [];
    countryMap.forEach((agents, country) => {
      const coords = countryCoordinates[country] || { lat: 0, lng: 0 };
      result.push({
        Country: country,
        AgentStatus: agents[0]?.AgentStatus || "Active",
        agents,
        lat: coords.lat,
        lng: coords.lng,
      });
    });

    return result;
  }, [analyticsData]);

  const totalLocations = groupedData.length;
  const totalAgents = groupedData.reduce((sum, c) => sum + c.agents.length, 0);

  const Agent = useMemo(() => {
    // Return agents from local state
    return agents;
  }, [agents]);

  const totals = useMemo<Totals>(() => {
    if (!analyticsData?.data || analyticsData.data.length === 0) {
      const values = [0, 0, 0].map(v => Number(v.toFixed(2)));
      const total = 0;
      return { values, total };
    }

    const totalPerformanceEarning = analyticsData.data.reduce((sum, item) => sum + (item.WorkingTotalEarning || 0), 0);
    const performanceLimit = analyticsData.data.reduce((sum, item) => sum + (item.WorkingTotalLimit || 0), 0);
    const pendingLimit = analyticsData.data.reduce((sum, item) => sum + (item.WorkingPendingLimit || 0), 0);

    const values = [totalPerformanceEarning, performanceLimit, pendingLimit].map(v => Number(v.toFixed(2)));
    const total = values.reduce((s, v) => s + v, 0);

    return { values, total };
  }, [analyticsData]);

  const allLabels = ["Total Performance Earning", "Performance Limit", "Pending Limit"];
  const allColors = ["#F59E0B", "#8B5CF6", "#6366F1"];

  const pieData2 = useMemo(() => {
    if (!analyticsData?.data || analyticsData.data.length === 0) {
      const values = [0, 0, 0];
      return {
        labels: allLabels,
        datasets: [
          {
            data: values,
            backgroundColor: allColors,
            hoverOffset: 20,
          },
        ],
        total: 0,
      };
    }

    const totalPerformanceEarning = analyticsData.data.reduce((sum, item) => sum + (item.WorkingTotalEarning || 0), 0);
    const performanceLimit = analyticsData.data.reduce((sum, item) => sum + (item.WorkingTotalLimit || 0), 0);
    const pendingLimit = analyticsData.data.reduce((sum, item) => sum + (item.WorkingPendingLimit || 0), 0);

    const values = [totalPerformanceEarning, performanceLimit, pendingLimit];
    return {
      labels: allLabels,
      datasets: [
        {
          data: values,
          backgroundColor: allColors,
          hoverOffset: 20,
        },
      ],
      total: values.reduce((s, v) => s + v, 0),
    };
  }, [allLabels, allColors, analyticsData]);

  const scatterData = useMemo<ScatterData>(
    () => {
      if (!analyticsData?.data || analyticsData.data.length === 0) {
        return {
          datasets: [
            {
              label: "CPU vs Yield",
              data: [],
              backgroundColor: "#8B5CF6",
              pointRadius: 6,
            },
          ],
        };
      }

      const data = analyticsData.data.map(item => ({
        x: item.CPUUsage || 0,
        y: item.WorkingTotalEarning || 0,
      }));

      return {
        datasets: [
          {
            label: "CPU vs Yield",
            data,
            backgroundColor: "#8B5CF6",
            pointRadius: 6,
          },
        ],
      };
    },
    [analyticsData]
  );

  const memoryStats = useMemo<MemoryStats>(() => {
    if (!analyticsData?.data || analyticsData.data.length === 0) {
      return {
        highestUsageAgent: null,
        mostEfficientAgent: null,
        totalUsage: 0,
        chartLabels: [],
        currentData: [],
        peakData: [],
        averageData: [],
      };
    }

    const agents = analyticsData.data.map(item => ({
      agent: item.Agent || "Unknown",
      current: item.MemoryUsage || 0,
      peak: Math.max(item.PeakGPUUsage || 0, item.PeakCPUUsage || 0),
      average: item.MemoryUsage || 0,
      avgEfficiency: typeof item.Efficiency === 'number' ? item.Efficiency : parseFloat(String(item.Efficiency)) || 0,
    }));

    const highestUsageAgent = agents.reduce((prev, curr) => (curr.peak > prev.peak ? curr : prev), { peak: 0, agent: 'N/A' });
    const mostEfficientAgent = agents.reduce((prev, curr) => (curr.avgEfficiency > prev.avgEfficiency ? curr : prev), { avgEfficiency: 0, agent: 'N/A' });
    const totalUsage = agents.reduce((sum, a) => sum + a.current, 0);

    const chartLabels = agents.map(a => a.agent);
    const currentData = agents.map(a => a.current);
    const peakData = agents.map(a => a.peak);
    const averageData = agents.map(a => a.average);

    return {
      highestUsageAgent,
      mostEfficientAgent,
      totalUsage,
      chartLabels,
      currentData,
      peakData,
      averageData,
    };
  }, [analyticsData]);

  const revenueChartData = useMemo<RevenueChartData>(() => {
    if (!analyticsData?.data || analyticsData.data.length === 0) {
      const revenue = [0, 0, 0, 0, 0, 0, 0];
      const share = revenue.map(v => v * 0.9);
      const labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
      const yieldIncomeByAgent = revenue.map(() => []);

      return { revenue, share, labels, yieldIncomeByAgent };
    }

    // Generate 30 days of revenue data based on actual monthly revenue
    const totalMonthlyRevenue = analyticsData.data.reduce((sum, item) => sum + (item.MonthlyRevenue || 0), 0);
    const dailyAverage = totalMonthlyRevenue / 30;

    const revenue = Array.from({ length: 30 }, () => Math.max(0, dailyAverage + (Math.random() - 0.5) * dailyAverage * 0.2));
    const share = revenue.map(v => v * 0.9);

    const labels = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const uniqueAgents = Array.from(new Set(analyticsData.data.map(item => item.Agent)));
    const agentCount = uniqueAgents.length || 1;
    const yieldIncomeByAgent = revenue.map(() =>
      uniqueAgents.map(agent => ({
        agent,
        yieldIncome: dailyAverage / agentCount * (0.8 + Math.random() * 0.4),
      }))
    );

    return { revenue, share, labels, yieldIncomeByAgent };
  }, [analyticsData]);

  useEffect(() => {
    const canvas = revenueRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;

    const draw = () => {
      canvas.width = (container?.offsetWidth ?? 800);
      canvas.height = 100;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      const w = canvas.width, h = canvas.height;

      const rev = revenueChartData.revenue.length > 0 ? revenueChartData.revenue : [28, 35, 22, 40, 38, 45, 52, 48, 55, 60, 58, 62, 70, 65, 72, 80, 75, 82, 90, 85, 92, 88, 95, 102, 98, 105, 112, 108, 115, 124];
      const share = revenueChartData.share.length > 0 ? revenueChartData.share : rev.map(v => v * 0.9);
      const yieldIncomeByAgent = revenueChartData.yieldIncomeByAgent.length > 0 ? revenueChartData.yieldIncomeByAgent : rev.map(() => []);
      const labels = revenueChartData.labels.length > 0 ? revenueChartData.labels : ["Jul 26", "Jul 27", "Jul 28", "Jul 29", "Jul 30"];
      const max = Math.max(...rev) * 1.1 || 150;

      const pad = { l: 10, r: 10, t: 8, b: 20 };
      const iW = w - pad.l - pad.r, iH = h - pad.t - pad.b;
      const pts = (arr: number[]) => {
        if (arr.length === 0) return [];
        const divisor = arr.length > 1 ? arr.length - 1 : 1;
        return arr.map((v, i) => [pad.l + i * (iW / divisor), pad.t + iH - ((v ?? 0) / max) * iH]);
      };

      const drawLine = (p: number[][], color: string, filled: boolean) => {
        if (p.length === 0) return;
        if (filled) {
          ctx.beginPath();
          const firstPoint = p[0];
          if (firstPoint) {
            ctx.moveTo(firstPoint[0] ?? 0, pad.t + iH);
          }
          p.forEach(pt => ctx.lineTo(pt[0] ?? 0, pt[1] ?? 0));
          const lastPoint = p[p.length - 1];
          if (lastPoint) {
            ctx.lineTo(lastPoint[0] ?? 0, pad.t + iH);
          }
          ctx.closePath();
          ctx.fillStyle = "rgba(0,212,255,0.08)";
          ctx.fill();
        }
        ctx.beginPath();
        p.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt[0] ?? 0, pt[1] ?? 0) : ctx.lineTo(pt[0] ?? 0, pt[1] ?? 0)));
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.stroke();
      };

      drawLine(pts(rev), "#00D4FF", true);
      drawLine(pts(share), "#F5A623", false);

      const labelStep = Math.ceil(labels.length / 7);
      labels.forEach((label, i) => {
        if (i % labelStep === 0) {
          ctx.fillStyle = "#8A93B2";
          ctx.font = "10px Inter";
          ctx.textAlign = "center";
          const labelDivisor = labels.length > 1 ? labels.length - 1 : 1;
          ctx.fillText(label, pad.l + i * (iW / labelDivisor), h - 4);
        }
      });

      return { rev, share, yieldIncomeByAgent, labels, pad, iW, iH, max };
    };

    let chartData: ReturnType<typeof draw> | undefined = draw();
    if (!chartData) {
      chartData = {
        rev: [0],
        share: [0],
        yieldIncomeByAgent: [[]],
        labels: [''],
        pad: { l: 10, r: 10, t: 8, b: 20 },
        iW: 0,
        iH: 0,
        max: 0
      };
    }

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = revenueRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (!chartData) return;
      const { rev, share, yieldIncomeByAgent, labels, pad, iW, iH, max } = chartData;

      const divisor = rev.length > 1 ? rev.length - 1 : 1;
      const pointSpacing = iW / divisor;
      const index = Math.round((x - pad.l) / pointSpacing);

      if (index >= 0 && index < rev.length) {
        const pointX = pad.l + index * pointSpacing;
        const distance = Math.abs(x - pointX);

        if (distance < pointSpacing / 2) {
          draw();
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          const revValue = rev[index] ?? 0;
          const shareValue = share[index] ?? 0;
          const revY = pad.t + iH - (revValue / max) * iH;
          const shareY = pad.t + iH - (shareValue / max) * iH;
          
          ctx.beginPath();
          ctx.arc(pointX, revY, 5, 0, Math.PI * 2);
          ctx.fillStyle = "#00D4FF";
          ctx.fill();
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 2;
          ctx.stroke();
          
          ctx.beginPath();
          ctx.arc(pointX, shareY, 5, 0, Math.PI * 2);
          ctx.fillStyle = "#F5A623";
          ctx.fill();
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 2;
          ctx.stroke();

          const agentYields = yieldIncomeByAgent[index] || [];
          const tooltipText = agentYields.flatMap(a => [`Agent: ${a.agent}`, `YieldIncome: ${a.yieldIncome.toFixed(2)}`]);
          
          const tooltipWidth = 160;
          const tooltipHeight = 20 + (agentYields.length * 32);
          const tooltipPadding = 8;
          const tooltipX = pointX - tooltipWidth / 2;
          const tooltipY = Math.min(revY, shareY) - tooltipHeight - 10;
          
          const clampedTooltipX = Math.max(5, Math.min(canvas.width - tooltipWidth - 5, tooltipX));
          const clampedTooltipY = Math.max(5, tooltipY);
          
          ctx.fillStyle = "rgba(31, 41, 55, 0.95)";
          ctx.beginPath();
          ctx.roundRect(clampedTooltipX, clampedTooltipY, tooltipWidth, tooltipHeight, 6);
          ctx.fill();
          
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "11px Inter";
          ctx.textAlign = "left";
          tooltipText.forEach((text, i) => {
            ctx.fillText(text, clampedTooltipX + tooltipPadding, clampedTooltipY + tooltipPadding + 12 + i * 16);
          });
        }
      }
    };

    const handleMouseLeave = () => {
      draw();
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    
    const handleResize = () => {
      chartData = draw();
    };
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [loading, revenueChartData]);

  const statCards = useMemo<StatCard[]>(() => {
    if (!analyticsData?.data || analyticsData.data.length === 0) {
      return [
        { label: "Platform Fee", value: "10%", cls: "text-[#FF4B4B]" },
        { label: "Your Revenue Share", value: "90%", cls: "text-[#00C896]" },
        { label: "Next Distribution", value: "N/A", cls: "text-[#F5A623]" }
      ];
    }

    const firstItem = analyticsData.data[0];
    const platformFee = firstItem?.PlatformFee ?? 10;
    const yourShare = firstItem?.YourShare ?? 90;
    const nextDistribution = firstItem?.NextDistribution;

    let formattedDate = "N/A";
    if (nextDistribution) {
      try {
        const date = new Date(nextDistribution);
        formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      } catch (e) {
        formattedDate = nextDistribution;
      }
    }

    return [
      { label: "Platform Fee", value: `${platformFee}%`, cls: "text-[#FF4B4B]" },
      { label: "Your Revenue Share", value: `${yourShare}%`, cls: "text-[#00C896]" },
      { label: "Next Distribution", value: formattedDate, cls: "text-[#F5A623]" }
    ];
  }, [analyticsData]);

  useEffect(() => {
    // Fetch real data from API
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const apiResponse = await response.json();

        // 🆕 Handle 404 / no data case
        if (apiResponse.statusCode === 200 && apiResponse.data && apiResponse.data.length > 0) {
          // Transform API data to match the interface
          const transformedData: AnalyticsDataItem[] = apiResponse.data.map((item: AnalyticsAPIResponseItem) => ({
            Agent: item.Agent?.trim() || "Unknown",
            AgentStatus: item.AgentStatus || "Unknown",
            Country: item.Country?.trim() || "Unknown",
            ComputeUnitsUsed: item.ComputeUnitsUsed || 0,
            EnergyConsumption: item.EnergyConsumption || 0,
            MemoryUsage: item.MemoryUsage || 0,
            TasksCompleted: item.TasksCompleted || 0,
            DailyROI: item.AvgROI?.toString() || "0",
            Uptime: (item.RuntimeHours && item.RuntimeHours > 0 && item.UptimeHours) ? ((item.UptimeHours / item.RuntimeHours) * 100).toFixed(2) : "0",
            Efficiency: item.Efficiency?.toString() || "0",
            CreatedDate: item.CreatedDate || "",
            YieldIncome: item.YieldIncome || 0,
            CreditsPurchased: item.CreditsPurchased || 0,
            PeakHourFlag: item.PeakHourFlag || "No",
            ProfitContribution: item.WorkingTotalEarning || 0,
            LeaseAmount: item.TotalInvestment || 0,
            AvgROI: item.AvgROI || 0,
            WorkingTotalEarning: item.WorkingTotalEarning || 0,
            WorkingTotalLimit: item.WorkingTotalLimit || 0,
            WorkingPendingLimit: item.WorkingPendingLimit || 0,
            TotalYieldEarning: item.TotalYieldEarning || 0,
            TotalYieldLimit: item.TotalYieldLimit || 0,
            PendingYieldLimit: item.PendingYieldLimit || 0,
            WeeklyYiled: item.WeeklyYiled || 0,
            MonthlyRevenue: item.MonthlyRevenue || 0,
            LifetimeRevenue: item.LifetimeRevenue || 0,
            DirectBonus: item.DirectBonus || 0,
            CommunityBuildingBonus: item.CommunityBuildingBonus || 0,
            ComputeRevenueShare: item.ComputeRevenueShare || 0,
            RewardBonus: item.RewardBonus || 0,
            RankBonus: item.RankBonus || 0,
            LeaderShipBonus: item.LeaderShipBonus || 0,
            LevelIncome: item.LevelIncome || 0,
            ActiveAgent: item.ActiveAgent || 0,
            IdleAgent: item.IdleAgent || 0,
            GPUUsage: item.GPUUsage || 0,
            CPUUsage: item.CPUUsage || 0,
            PeakGPUUsage: item.PeakGPUUsage || 0,
            PeakCPUUsage: item.PeakCPUUsage || 0,
            RuntimeHours: item.RuntimeHours || 0,
            UptimeHours: item.UptimeHours || 0,
            TodayYieldIncome: item.TodayYieldIncome || 0,
            TodayCreditsDeployed: item.TodayCreditsDeployed || 0,
            UnitsUsed: item.ComputeUnitsUsed || 0,
            CheckContractStatus: item.CheckContractStatus || 0,
            ContractRechargeID: item.ContractRechargeID || "",
            PlatformFee: item.PlatformFee || 10,
            YourShare: item.YourShare || 90,
            NextDistribution: item.NextDistribution || "",
            activeagent: item.ActiveAgent || 0,
            AIActiveFeed: item.AIActiveFeed,
          }));

          setAnalyticsData({ data: transformedData });
          setAgents(transformedData);
          setFullApiResponse(transformedData);
          setNoDataMessage(null);        // 🆕
          setApiStatusCode(200);         // 🆕
          setLoading(false);
        } else if (apiResponse.statusCode === 404 || !apiResponse.data || apiResponse.data.length === 0) {
          // 🆕 No data case
          setNoDataMessage(apiResponse.message || "No data found for this user.");
          setApiStatusCode(apiResponse.statusCode || 404);
          setAnalyticsData({ data: [] });
          setAgents([]);
          setFullApiResponse([]);
          setLoading(false);
        } else {
          throw new Error(apiResponse.message || 'Invalid API response');
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load analytics data');  // 🆕
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Removed real-time simulation interval since we're using real API data
  // The data will be fetched from the API and updated when the component mounts

  const getProductConfig = useMemo(
    () => (productName: string): ProductConfig => ({
      price: 500,
      unitPerHour: 200,
      unitValue: 2,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    }),
    []
  );

  const firstDataItem: AnalyticsDataItem = analyticsData?.data?.[0] || ({
    Agent: "",
    AgentStatus: "",
    Country: "",
    ComputeUnitsUsed: 0,
    EnergyConsumption: 0,
    MemoryUsage: 0,
    TasksCompleted: 0,
    DailyROI: "0",
    Uptime: "0",
    Efficiency: "0",
    CreatedDate: "",
    YieldIncome: 0,
    CreditsPurchased: 0,
    PeakHourFlag: "",
    ProfitContribution: 0,
    LeaseAmount: 0,
    AvgROI: 0,
    WorkingTotalEarning: 0,
    WorkingTotalLimit: 0,
    WorkingPendingLimit: 0,
    TotalYieldEarning: 0,
    TotalYieldLimit: 0,
    PendingYieldLimit: 0,
    WeeklyYiled: 0,
    MonthlyRevenue: 0,
    LifetimeRevenue: 0,
    DirectBonus: 0,
    CommunityBuildingBonus: 0,
    ComputeRevenueShare: 0,
    RewardBonus: 0,
    RankBonus: 0,
    LeaderShipBonus: 0,
    LevelIncome: 0,
    ActiveAgent: 0,
    IdleAgent: 0,
    GPUUsage: 0,
    CPUUsage: 0,
    TodayYieldIncome: 0,
    TodayCreditsDeployed: 0,
    UnitsUsed: 0,
    CheckContractStatus: 0,
    ContractRechargeID: "",
  } as AnalyticsDataItem);

  const cards = useMemo(() => [
    {
      label: 'Active Agents',
      value: analyticsData?.data?.reduce((sum, item) => sum + (item.ActiveAgent || 0), 0) || 0,
      icon: <RiRobot2Line className="text-xl sm:text-2xl" />,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Idle Agent',
      value: analyticsData?.data?.reduce((sum, item) => sum + (item.IdleAgent || 0), 0) || 0,
      icon: <RiUserUnfollowLine className="text-xl sm:text-2xl" />,
      gradient: 'from-blue-500 to-pink-500',
    },
  ], [analyticsData]);

  const getCountryCode = (countryName: string): string => {
    const countryCodes: Record<string, string> = {
      'USA': 'US',
      'United States': 'US',
      'United States of America': 'US',
      'Canada': 'CA',
      'UK': 'GB',
      'United Kingdom': 'GB',
      'Great Britain': 'GB',
      'Italy': 'IT',
      'France': 'FR',
      'Germany': 'DE',
      'Spain': 'ES',
      'Portugal': 'PT',
      'Netherlands': 'NL',
      'Holland': 'NL',
      'Belgium': 'BE',
      'Sweden': 'SE',
      'Norway': 'NO',
      'Denmark': 'DK',
      'Finland': 'FI',
      'Luxembourg': 'LU',
      'Malta': 'MT',
      'Hungary': 'HU',
      'Bulgaria': 'BG',
      'Ireland': 'IE',
      'Switzerland': 'CH',
      'Austria': 'AT',
      'Poland': 'PL',
      'Czech Republic': 'CZ',
      'Slovakia': 'SK',
      'Slovenia': 'SI',
      'Croatia': 'HR',
      'Romania': 'RO',
      'Greece': 'GR',
      'Cyprus': 'CY',
      'Estonia': 'EE',
      'Latvia': 'LV',
      'Lithuania': 'LT',
      'Iceland': 'IS',
      'Ukraine': 'UA',
      'Belarus': 'BY',
      'Serbia': 'RS',
      'Bosnia and Herzegovina': 'BA',
      'Albania': 'AL',
      'North Macedonia': 'MK',
      'Montenegro': 'ME',
      'India': 'IN',
      'Japan': 'JP',
      'China': 'CN',
      'South Korea': 'KR',
      'Korea': 'KR',
      'North Korea': 'KP',
      'Singapore': 'SG',
      'Malaysia': 'MY',
      'Thailand': 'TH',
      'Vietnam': 'VN',
      'Indonesia': 'ID',
      'Philippines': 'PH',
      'Pakistan': 'PK',
      'Bangladesh': 'BD',
      'Sri Lanka': 'LK',
      'Nepal': 'NP',
      'Bhutan': 'BT',
      'Maldives': 'MV',
      'Myanmar': 'MM',
      'Burma': 'MM',
      'Cambodia': 'KH',
      'Laos': 'LA',
      'Mongolia': 'MN',
      'Taiwan': 'TW',
      'Hong Kong': 'HK',
      'Macau': 'MO',
      'Brunei': 'BN',
      'Timor-Leste': 'TL',
      'East Timor': 'TL',
      'Saudi Arabia': 'SA',
      'United Arab Emirates': 'AE',
      'UAE': 'AE',
      'Qatar': 'QA',
      'Kuwait': 'KW',
      'Oman': 'OM',
      'Bahrain': 'BH',
      'Israel': 'IL',
      'Jordan': 'JO',
      'Lebanon': 'LB',
      'Syria': 'SY',
      'Iraq': 'IQ',
      'Iran': 'IR',
      'Turkey': 'TR',
      'Yemen': 'YE',
      'South Africa': 'ZA',
      'Egypt': 'EG',
      'Nigeria': 'NG',
      'Kenya': 'KE',
      'Ethiopia': 'ET',
      'Ghana': 'GH',
      'Morocco': 'MA',
      'Algeria': 'DZ',
      'Tunisia': 'TN',
      'Uganda': 'UG',
      'Tanzania': 'TZ',
      'Rwanda': 'RW',
      'Senegal': 'SN',
      'Ivory Coast': 'CI',
      "Côte d'Ivoire": 'CI',
      'Cameroon': 'CM',
      'Zambia': 'ZM',
      'Zimbabwe': 'ZW',
      'Botswana': 'BW',
      'Namibia': 'NA',
      'Mozambique': 'MZ',
      'Madagascar': 'MG',
      'Mauritius': 'MU',
      'Seychelles': 'SC',
      'Brazil': 'BR',
      'Argentina': 'AR',
      'Chile': 'CL',
      'Colombia': 'CO',
      'Peru': 'PE',
      'Venezuela': 'VE',
      'Uruguay': 'UY',
      'Paraguay': 'PY',
      'Bolivia': 'BO',
      'Ecuador': 'EC',
      'Guyana': 'GY',
      'Suriname': 'SR',
      'Australia': 'AU',
      'New Zealand': 'NZ',
      'Fiji': 'FJ',
      'Papua New Guinea': 'PG',
      'Samoa': 'WS',
      'Tonga': 'TO',
      'Vanuatu': 'VU',
      'Solomon Islands': 'SB',
      'Kiribati': 'KI',
      'Micronesia': 'FM',
      'Palau': 'PW',
      'Marshall Islands': 'MH',
      'Jamaica': 'JM',
      'Bahamas': 'BS',
      'Barbados': 'BB',
      'Trinidad and Tobago': 'TT',
      'Dominican Republic': 'DO',
      'Haiti': 'HT',
      'Cuba': 'CU',
      'Puerto Rico': 'PR'
    };

    return countryCodes[countryName] || 'US';
  };

  const getFlagUrl = (countryName: string): string => {
    const code = getCountryCode(countryName);
    return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
  };

  if (loading) {
    return <div className="p-4 text-center sm:p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500 dark:text-red-400 sm:p-8">{error}</div>;
  }

  // 🆕 No data UI
  if (noDataMessage) {
    return <NoDataState message={noDataMessage} statusCode={apiStatusCode} />;
  }

  return (
    <>
      <div className="min-h-screen p-4 overflow-x-hidden transition-colors bg-white dark:bg-gray-900 sm:p-5 lg:p-5">
        <div className="w-full mx-auto">

          <div className="grid grid-cols-1 mx-4 lg:grid-cols-[1fr_360px] gap-6 items-start mb-8">
            <div>
              <div className="vv-mono inline-flex items-center gap-2 bg-[#0B1437] dark:bg-gray-800 text-[#00D4FF] text-[11px] font-medium px-[14px] py-[5px] rounded-full mb-[14px] tracking-[0.08em]">
                <span className="vv-blink inline-block w-[7px] h-[7px] bg-[#00C896] rounded-full" />
                QUZO AI MARKETPLACE
              </div>
              <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#0B1437] dark:text-white leading-tight tracking-[-0.5px]">
                AI Agent <span className="vv-gradient-text">Performance Analytics</span>
              </h1>
              <p className="text-sm text-[#4A5680] dark:text-gray-400 mt-[10px] max-w-[640px] leading-relaxed">
                Monitor your deployed AI Agent in real-time — track compute utilization, global workload distribution, task execution, infrastructure performance, and revenue generated through AI marketplace utilization.
              </p>

              <div className="flex flex-wrap items-start gap-4 sm:flex-row sm:items-center sm:gap-8 sm:mt-0">
                {cards.map((card, index) => (
                  <div key={index} className="flex flex-col items-center justify-center gap-1 mt-4">
                    <div
                      className={`flex items-center justify-center w-12 h-12 sm:mb-2 text-white rounded-full sm:w-16 sm:h-16 bg-gradient-to-r ${card.gradient}`}
                    >
                      {card.icon}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">{card.label}</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white sm:text-2xl">{card.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* LIVE FEED */}
            <div className="bg-[#0B1437] dark:bg-gray-800 rounded-[16px] p-4 px-5 overflow-hidden relative">
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.08) 0%,transparent 60%)' }} />
              <div className="flex items-center gap-2 mb-3">
                <div className="vv-blink-fast w-2 h-2 bg-[#00C896] rounded-full" />
                <h3 className="text-[12px] font-semibold text-[#00D4FF] tracking-[0.06em] uppercase">Live AI Activity Feed</h3>
              </div>
              <div className="flex flex-col gap-0">
                {visibleFeed.map((item, i) => (
                  <div key={i} className="vv-mono text-[11px] text-white/80 dark:text-gray-300 py-[7px] border-b border-white/[0.06] last:border-0 leading-relaxed transition-opacity duration-300"
                    style={{ opacity: i === 0 ? (feedFade ? 1 : 0) : 1 }}>
                    <span className="inline-flex items-center">{getIconComponent(item.agentIcon)}</span>
                    <span className="ml-2">{item.activityTitle}</span>
                    <span className="ml-2 inline-flex items-center">
                      {getStatusIcon(item.status)}
                      <span className={item.status === 'Running' ? 'text-green-400' : item.status === 'Completed' ? 'text-blue-400' : 'text-gray-400'}>
                        {item.status}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div className="p-6 text-green-900 dark:text-green-300 transition-all duration-300 shadow-lg cursor-pointer bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl hover:shadow-xl hover:scale-105 w-[100%]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-200 dark:bg-green-800/50 rounded-xl">
                  <RiMoneyDollarCircleLine className="text-2xl text-green-700 dark:text-green-400" />
                </div>
              </div>
              <div className="mb-2">
                <h3 className="text-sm font-medium text-green-700 dark:text-green-400 whitespace-nowrap">Yield Income</h3>
                <div className="mt-1 text-2xl font-bold text-green-900 dark:text-green-300">${analyticsData?.data?.reduce((sum, item) => sum + (item.TodayYieldIncome || 0), 0).toFixed(2) || "0.00"}</div>
              </div>
            </div>

            <div className="p-6 text-orange-900 dark:text-orange-300 transition-all duration-300 shadow-lg cursor-pointer w-[100%] bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-200 dark:bg-orange-800/50 rounded-xl">
                  <RiFlashlightFill className="text-2xl text-orange-700 dark:text-orange-400" />
                </div>
              </div>
              <div className="mb-2">
                <h3 className="text-sm font-medium text-orange-700 dark:text-orange-400 whitespace-nowrap">Daily GPU Usage</h3>
                <div className="mt-1 text-2xl font-bold text-orange-900 dark:text-orange-300">{gpuUsage}%</div>
              </div>
            </div>

            <div className="p-6 text-blue-900 dark:text-blue-300 transition-all duration-300 shadow-lg cursor-pointer w-[100%] bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-200 dark:bg-blue-800/50 rounded-xl">
                  <RiCpuFill className="text-2xl text-blue-700 dark:text-blue-400" />
                </div>
              </div>
              <div className="mb-2">
                <h3 className="text-sm font-medium text-blue-700 dark:text-blue-400 whitespace-nowrap">Daily CPU Usage</h3>
                <div className="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-300">{cpuUsage}%</div>
              </div>
            </div>

            <div className="p-6 text-pink-900 dark:text-pink-300 transition-all duration-300 shadow-lg cursor-pointer w-[100%] bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-2xl hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-pink-200 dark:bg-pink-800/50 rounded-xl">
                  <RiDatabase2Fill className="text-2xl text-pink-700 dark:text-pink-400" />
                </div>
              </div>
              <div className="mb-2">
                <h3 className="text-sm font-medium text-pink-700 dark:text-pink-400 whitespace-nowrap">Daily Memory Consumption</h3>
                <div className="mt-1 text-2xl font-bold text-pink-900 dark:text-pink-300">{analyticsData?.data?.reduce((sum, item) => sum + (item.MemoryUsage || 0), 0).toFixed(2) || "0.00"} GB</div>
              </div>
            </div>

            <div className="p-6 text-teal-900 dark:text-teal-300 transition-all duration-300 shadow-lg cursor-pointer w-[100%] bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-2xl hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-teal-200 dark:bg-teal-800/50 rounded-xl">
                  <RiPieChartFill className="text-2xl text-teal-700 dark:text-teal-400" />
                </div>
              </div>
              <div className="mb-2">
                <h3 className="text-sm font-medium text-teal-700 dark:text-teal-400 whitespace-nowrap">Task Completed</h3>
                <div className="mt-1 text-2xl font-bold text-teal-900 dark:text-teal-300">{analyticsData?.data?.reduce((sum, item) => sum + (item.TasksCompleted || 0), 0).toLocaleString() || "0"}</div>
              </div>
            </div>

            <div className="p-6 text-violet-900 dark:text-violet-300 transition-all duration-300 shadow-lg cursor-pointer w-[100%] bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-2xl hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-violet-200 dark:bg-violet-800/50 rounded-xl">
                  <RiRobot2Fill className="text-2xl text-violet-700 dark:text-violet-400" />
                </div>
              </div>
              <div className="mb-2">
                <h3 className="text-sm font-medium text-violet-700 dark:text-violet-400 whitespace-nowrap">Deployed Credits</h3>
                <div className="mt-1 text-2xl font-bold text-violet-900 dark:text-violet-300">${analyticsData?.data?.reduce((sum, item) => sum + (item.TodayCreditsDeployed || 0), 0).toFixed(2) || "0.00"}</div>
              </div>
            </div>
          </div>

          {/* Agent Performance Metrics */}
          <div className="grid grid-cols-1 gap-6 mt-6 xl:grid-cols-4">
            <div className="space-y-6 xl:col-span-2">
              <div className="p-4 bg-white border border-gray-100 shadow-lg dark:bg-gray-800 dark:border-gray-700 sm:p-6 lg:p-8 rounded-2xl">
                <div className="flex flex-col items-start justify-between mb-8 sm:flex-row sm:items-center">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white sm:text-2xl">Agent Performance Metrics</h2>
                  <div className="flex flex-wrap gap-4 mt-4 text-xs sm:flex-row sm:gap-6 sm:text-sm sm:mt-0">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="dark:text-gray-300">Active</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="dark:text-gray-300">Needs Upgrade</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="dark:text-gray-300">Idle</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 max-h-[960px] overflow-y-auto pr-2">
                  {agents.map((agent, idx) => (
                    <AgentPerformanceCard
                      key={idx}
                      agent={agent.Agent}
                      status={agent.AgentStatus}
                      location={`${agent.Country}`}
                      units={`${agent.ComputeUnitsUsed} kWh`}
                      energy={`${agent.EnergyConsumption} kWh`}
                      memory={`${agent.MemoryUsage} GB`}
                      profit={`${agent.TasksCompleted}`}
                      roi={`${agent.DailyROI}%`}
                      tasks={agent.TasksCompleted}
                      uptime={`${agent.Uptime}%`}
                      efficiency={`${agent.Efficiency}%`}
                      CreatedDate={`${agent.CreatedDate}`}
                      YieldIncome={agent.YieldIncome}
                      CreditsPurchased={agent.CreditsPurchased}
                      peakHours={agent.PeakHourFlag === "Yes" ? "Peak Hours Active" : "No Peak Hours"}
                      memoryTrend={[]}
                      apiResponse={fullApiResponse || []}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6 xl:col-span-2">
              <div className="p-4 bg-white border border-gray-100 shadow-lg dark:bg-gray-800 dark:border-gray-700 sm:p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white sm:text-lg">License Income Distribution</h3>
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                    <RiPieChart2Fill className="text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="h-60 mb-6 sm:h-60 w-full min-h-[240px] flex items-center justify-center">
                  <Pie
                    data={pieData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top" as const,
                          labels: { color: document.documentElement.classList.contains('dark') ? '#fff' : '#000' }
                        },
                        title: {
                          display: true,
                          text: "Income Distribution",
                          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
                        },
                      },
                    }}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <div className="space-y-3">
                  {bonusData.labels.map((label, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: bonusData.colors[idx] }}></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 sm:text-base">{label}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 dark:text-white sm:text-base">${Number(bonusData.values[idx] || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 mt-6 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 sm:text-base">Total Performance Earning:</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">${analyticsData?.data?.reduce((sum, item) => sum + (item.WorkingTotalEarning || 0), 0).toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 sm:text-base">Performance Limit:</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">${analyticsData?.data?.reduce((sum, item) => sum + (item.WorkingTotalLimit || 0), 0).toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 sm:text-base">Pending Limit:</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">${analyticsData?.data?.reduce((sum, item) => sum + (item.WorkingPendingLimit || 0), 0).toFixed(2) || "0.00"}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white border border-gray-100 shadow-lg dark:bg-gray-800 dark:border-gray-700 sm:p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white sm:text-lg">Deployments Earnings Progress Tracker</h3>
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                    <RiPieChart2Fill className="text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
                <div className="h-40 mb-6 sm:h-48">
                  <Pie
                    data={pieData2}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top" as const,
                          labels: { color: document.documentElement.classList.contains('dark') ? '#fff' : '#000' }
                        },
                        title: {
                          display: true,
                          text: "Earnings Progress Distribution",
                          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
                        },
                      },
                    }}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <div className="space-y-3">
                  {allLabels.map((label, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: allColors[idx] }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 sm:text-base">
                          {label}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 dark:text-white sm:text-base">
                          ${totals.values[idx]?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 mt-6 bg-white border border-gray-100 shadow-lg dark:bg-gray-800 dark:border-gray-700 sm:p-6 lg:p-8 rounded-2xl">
            <div className="flex flex-col items-start justify-between mb-8 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Global Agent Deployment</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:text-base">AI Agents deployed across developed countries</p>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 sm:flex-row sm:gap-6 sm:mt-0">
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Total Locations</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400 sm:text-2xl">{totalLocations}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Active Agents</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400 sm:text-2xl">{analyticsData?.data?.reduce((sum, item) => sum + (item.ActiveAgent || 0), 0) || 0}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="relative w-full h-[500px] sm:h-[500px] rounded-xl overflow-hidden shadow-lg">
                  <WorldMap analyticsData={analyticsData || { data: [] }} />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs sm:flex-row sm:gap-6 sm:text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-700 dark:text-gray-300">Active Deployment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">Maintenance Mode</span>
                  </div>
                </div>
              </div>

              <div className={`space-y-2 overflow-y-auto h-[500px]`}>
                {groupedData.map((location, idx) => (
                  <div
                    key={idx}
                    className="p-4 transition-all border border-gray-200 cursor-pointer dark:border-gray-700 rounded-xl hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={getFlagUrl(location.Country)}
                          alt={`${location.Country} flag`}
                          className="object-cover w-8 h-8 border border-gray-200 rounded-full dark:border-gray-700"
                        />
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                            {location.Country}
                          </h4>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs sm:text-sm font-medium rounded-full ${location.AgentStatus === "Active"
                          ? "text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900/40"
                          : "text-yellow-800 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/40"
                          }`}
                      >
                        {location.AgentStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Agents</p>
                        <p className="text-base font-bold text-gray-900 dark:text-white sm:text-lg">
                          {location.agents.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Task Completed</p>
                        <p className="text-base font-bold text-green-600 dark:text-green-400 sm:text-lg">
                          {location.agents.reduce((sum, a) => sum + (a.TasksCompleted || 0), 0).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Energy</p>
                        <p className="text-base font-bold text-orange-600 dark:text-orange-400 sm:text-lg">
                          {location.agents.reduce((sum, a) => sum + (a.EnergyConsumption || 0), 0).toFixed(2)} kWh
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* ═══════════════════════════════════════════
            MONTHLY REVENUE
          ═══════════════════════════════════════════ */}
          <div className="pt-8 mb-8">
            <div className="flex items-center gap-3 mb-[18px]">
              <h2 className="text-[18px] font-bold text-[#0B1437] dark:text-white">Yield Revenue Analytics</h2>
              <div className="text-[10px] font-semibold uppercase tracking-[0.07em] px-[10px] py-[3px] rounded-full" style={{ background: 'rgba(245,166,35,0.12)', color: '#F5A623' }}>Your Profit Share</div>
            </div>
            <div className="vv-card bg-white/[0.92] dark:bg-gray-800/90 rounded-[16px] border border-[#0B1437]/[0.08] dark:border-gray-700 backdrop-blur-[12px] p-6">
              <div className="grid grid-cols-2 gap-4 mb-5 lg:grid-cols-4">
                {[
                  { label: "Total Revenue Share", val: `$${revenueStats.totalRevenueShare.toFixed(2)}`, cls: 'text-[#F5A623]', size: 'text-[35px]'},
                  { label: 'This Week', val: `$${revenueStats.thisWeek.toFixed(2)}`, cls: 'text-[#0B1437] dark:text-white', size: 'text-[35px]' },
                  { label: 'This Month', val: `$${revenueStats.thisMonth.toFixed(2)}`, cls: 'text-[#0B1437] dark:text-white', size: 'text-[35px]'},
                  { label: 'Lifetime Reward', val: `$${revenueStats.TotalYieldLimit.toFixed(2)}`, cls: 'text-[#0B1437] dark:text-white', sub: 'Total earned since deploy', size: 'text-[35px]' },
                ].map((r, i) => (
                  <div key={i} className="p-5 bg-white dark:bg-gray-800/50 rounded-xl border border-[#0B1437]/[0.08] dark:border-gray-700">
                    <div className="text-[11px] uppercase tracking-[0.06em] text-[#8A93B2] dark:text-gray-500 font-semibold mb-2">{r.label}</div>
                    <div className={`${r.size || 'text-[24px]'} font-extrabold ${r.cls}`}>{r.val}</div>
                    <div className="text-[11px] text-[#4A5680] dark:text-gray-400 mt-[6px]">{r.sub}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-[#0B1437]/[0.08] dark:border-gray-700 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="text-[13px] font-semibold text-[#4A5680] dark:text-gray-300">
                    Revenue Distribution
                  </div>
                  <div className="flex gap-4 text-[11px] text-[#8A93B2] dark:text-gray-500">
                    <span className="flex items-center gap-[5px]">
                      <span className="inline-block w-[10px] h-[10px] rounded-full bg-[#00D4FF]" />
                      Revenue
                    </span>
                    <span className="flex items-center gap-[5px]">
                      <span className="inline-block w-[10px] h-[10px] rounded-full bg-[#F5A623]" />
                      Your Share (90%)
                    </span>
                  </div>
                </div>

                <canvas
                  ref={revenueRef}
                  style={{ width: "100%", height: "100px", display: "block" }}
                />

                <div
                  className="mt-4 p-[14px] rounded-[10px] border flex flex-wrap gap-6 sm:gap-8 items-center"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(0, 200, 150, 0.06), rgba(0, 212, 255, 0.06))",
                    borderColor: "rgba(0, 200, 150, 0.15)",
                  }}
                >
                  {statCards.map((s, i) => (
                    <div key={i}>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[#8A93B2] dark:text-gray-500 mb-2">
                        {s.label}
                      </div>
                      <div className={`text-[18px] font-extrabold ${s.cls}`}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#0B1437] dark:bg-gray-800 rounded-[16px] mt-6 p-6 sm:p-10">
              <h2 className="text-center text-white text-[18px] sm:text-[20px] font-bold mb-9">
                How Your AI Agent Generates <span className="vv-gradient-text">Profit Share Income</span>
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-0 overflow-x-auto sm:flex-nowrap">
                {[
                  { icon: <MdVpnKey />, label: 'Acquire License' },
                  { icon: <MdMemory />, label: 'Allocate Compute Credits' },
                  { icon: <MdRocketLaunch />, label: 'Deploy AI Agent' },
                  { icon: <MdPublic />, label: 'Global AI Processing' },
                  { icon: <MdBusinessCenter />, label: 'Business Utilization' },
                  { icon: <MdAttachMoney />, label: 'Revenue Generated' },
                  { icon: <MdPercent />, label: 'Platform Fee 10%' },
                  { icon: <MdStars />, label: 'Your Revenue Share 90%' },
                ].map((step, i, arr) => (
                  <div key={i} className="flex items-center">
                    <div className="flex flex-col items-center gap-2 min-w-[90px] sm:min-w-[110px]">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-[22px] border-2 border-[#00D4FF]/30 bg-[#00D4FF]/[0.08] text-[#00D4FF]">
                        {step.icon}
                      </div>
                      <div className="text-[11px] font-semibold text-white/75 text-center">{step.label}</div>
                    </div>
                    {i < arr.length - 1 && <div className="text-[#00D4FF] text-[20px] mx-1 opacity-60 flex-shrink-0">→</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAgentPage;