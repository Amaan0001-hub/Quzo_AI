// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { motion } from "framer-motion";
// import {
//   UserX,
//   FileText,
//   Gift,
//   CheckCircle,
//   Sparkles,
//   Cpu,
//   Shield,
//   Clock3,
// } from "lucide-react";
// import { RiRobotLine, RiEyeLine } from "react-icons/ri";
// import { sortOptions } from "@/lib/constants";
// import { getPageName } from "@/lib/utils";
// import LeaseModal from "@/app/components/LeaseModal";
// import { PageLoader } from "@/components/common/PageLoader";

// interface Agent {
//   id: number;
//   productId: string;
//   categoryId: string;
//   categoryName: string;
//   subCategoryId: string;
//   subCategoryName: string | null;
//   subCategoryTypeId: string;
//   subCategoryTypeName: string;
//   productName: string;
//   subName: string;
//   description: string;
//   rating: number;
//   AICredite: number;
//   createdDate: string;
//   updatedDate: string | null;
//   status: string;
//   active: boolean;
//   imageUrl: string | null;
//   Specification: string;
//   Commingsoon: number;
//   price?: number;
//   toatalmonth?: number;
//   totalReturn?: number;
//   weeklyReturn?: number;
//   task?: string;
//   unit?: string;
// }

// interface SortOption {
//   readonly value: string;
//   readonly label: string;
// }

// export default function InvestmentAmountPage() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const pageName = getPageName(pathname);

//   const [openDialog, setOpenDialog] = useState<boolean>(false);
//   const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [sortBy, setSortBy] = useState<string>("all");
//   const [showDropdown, setShowDropdown] = useState<boolean>(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const [productId, setProductId] = useState<string>("");
//   const [month, setMonth] = useState<string>("");
//   const [allProductData, setAllProductData] = useState<Agent[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("/api/investment-plans");
//         const data = await response.json();

//         if (data.statusCode === 200 && data.data) {
//           setAllProductData(data.data as Agent[]);
//         }
//       } catch (error) {
//         console.error("Failed to fetch products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setShowDropdown(false);
//       }
//     };

//     if (showDropdown) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showDropdown]);

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedAgent(null);
//   };

//   const getStatusColorClass = (status: string) => {
//     switch (status) {
//       case "Available":
//         return "bg-green-500 text-white border border-green-500";
//       case "Coming Soon":
//         return `
//         bg-white/95
//         text-orange-600
//         border border-orange-200
//         shadow-lg
//         dark:bg-zinc-900/95
//         dark:border-orange-500/30
//         dark:text-orange-300
//       `;
//       default:
//         return `
//         bg-red-50
//         text-red-600
//         border border-red-200
//         dark:bg-red-950/40
//         dark:border-red-800
//         dark:text-red-300
//       `;
//     }
//   };

//   const filteredAgents: Agent[] = (allProductData || [])
//     .filter((agent) =>
//       agent.productName?.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     .sort((a, b) => (a.price || 0) - (b.price || 0));

//   const sortedAgents = (): Agent[] => {
//     let agents = [...filteredAgents];
//     if (sortBy === "personalagents") {
//       agents = agents.filter(
//         (agent) => (agent.price ?? 0) >= 10 && (agent.price ?? 0) <= 490
//       );
//     } else if (sortBy === "businessagents") {
//       agents = agents.filter(
//         (agent) => (agent.price ?? 0) >= 500 && (agent.price ?? 0) <= 4950
//       );
//     } else if (sortBy === "industrialagents") {
//       agents = agents.filter(
//         (agent) => (agent.price ?? 0) >= 5000 && (agent.price ?? 0) <= 20000
//       );
//     }
//     return agents;
//   };

//   const handleLeaseClick = (e: React.MouseEvent, agent: Agent) => {
//     e.stopPropagation();
//     e.preventDefault();
//     setProductId(agent.productId);
//     setMonth((agent.toatalmonth || 0).toString());
//     if (agent.status === "Available") {
//       setSelectedAgent(agent);
//       setOpenDialog(true);
//     }
//   };

//   const handleCardClick = (agent: Agent) => {
//     router.push(`/agent-detail?id=${agent.productId}`);
//   };

//   return (
//     <>
//       <div className="p-4 mx-auto transition-colors duration-300 bg-gradient-to-b  sm:px-6 lg:px-8">
//         <div>
//           <div>
//             <h1 className="mb-2 text-3xl font-bold text-gray-900 transition-colors duration-300 dark:text-gray-100">
//               {pageName}
//             </h1>
//             <p className="text-gray-600 transition-colors duration-300 dark:text-gray-400">
//               Browse and acquire AI agents for your business needs
//             </p>
//           </div>

//           {/* Search and Filter Section */}
//           <div className="flex flex-col items-center justify-between gap-3 mt-4 mb-6 sm:flex-row sm:mt-0">
//             <div className="relative w-full sm:w-80">
//               <span className="absolute inset-y-0 flex items-center pointer-events-none left-4">
//                 <svg
//                   className="w-5 h-5 text-gray-400 dark:text-gray-500"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
//                   />
//                 </svg>
//               </span>
//               <input
//                 className="pl-12 pr-4 py-3 w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-[#6446d7] focus:ring-4 focus:ring-[#6446d7]/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-lg hover:shadow-xl transition-all duration-200 outline-none"
//                 placeholder="Search agents..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             <div className="relative w-full sm:w-auto sm:ml-2" ref={dropdownRef}>
//               <button
//                 className="w-full sm:w-[300px] px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-[#6446d7] focus:ring-4 focus:ring-[#6446d7]/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 shadow-lg hover:shadow-xl transition-all duration-200 outline-none flex items-center justify-between"
//                 onClick={() => setShowDropdown((prev) => !prev)}
//               >
//                 <span>
//                   {sortBy === "all"
//                     ? "All Agents"
//                     : sortOptions.find(
//                         (option) => option.value === sortBy
//                       )?.label}
//                 </span>
//                 <svg
//                   className="w-4 h-4 ml-2 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </button>

//               {showDropdown && (
//                 <div className="absolute z-20 mt-2 w-full sm:w-[300px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
//                   <div className="p-2 space-y-1">
//                     <label className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#397FF5]/10 cursor-pointer transition-all duration-150">
//                       <input
//                         type="radio"
//                         name="sortBy"
//                         value="all"
//                         checked={sortBy === "all"}
//                         onChange={(e) => {
//                           setSortBy(e.target.value);
//                           setShowDropdown(false);
//                         }}
//                         className="form-radio h-4 w-4 text-[#6446d7] accent-[#6446d7]"
//                       />
//                       <span className="text-gray-800 dark:text-gray-200 font-medium">
//                         All Agents
//                       </span>
//                     </label>

//                     {sortOptions.map((option: SortOption) => (
//                       <label
//                         key={option.value}
//                         className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#397FF5]/10 cursor-pointer transition-all duration-150"
//                       >
//                         <input
//                           type="radio"
//                           name="sortBy"
//                           value={option.value}
//                           checked={sortBy === option.value}
//                           onChange={(e) => {
//                             setSortBy(e.target.value);
//                             setShowDropdown(false);
//                           }}
//                           className="form-radio h-4 w-4 text-[#6446d7] accent-[#6446d7]"
//                         />
//                         <span className="text-gray-800 dark:text-gray-200 font-medium">
//                           {option.label}
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Cards Grid */}
//         {loading ? (
//           <PageLoader />
//         ) : (
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 md:gap-8">
//           {!loading && sortedAgents().length === 0 ? (
//             <div className="col-span-full flex items-center justify-center h-[60vh]">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95, y: 30 }}
//                 animate={{ opacity: 1, scale: 1, y: 0 }}
//                 transition={{ duration: 0.5, ease: "easeOut" }}
//                 className="flex flex-col items-center p-12 text-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 shadow-2xl rounded-3xl max-w-md"
//               >
//                 <div className="p-4 mb-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-700 rounded-full">
//                   <UserX className="w-16 h-16 text-gray-800 dark:text-gray-200" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
//                   No Agents Found
//                 </h2>
//                 <p className="mt-2 text-gray-800 dark:text-gray-200 text-xs font-bold">
//                   Try adjusting your filters or search criteria.
//                 </p>
//               </motion.div>
//             </div>
//           ) : (
//             sortedAgents().map((agent, index) => (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: index * 0.08 }}
//                 key={agent.productId}
//                 onClick={() => handleCardClick(agent)}
//                 className="cursor-pointer group"
//               >
//                 <div className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50">
//                   {/* Card Header with Image */}
//                   <div className="relative h-56 sm:h-64 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-700">
//                     {agent.imageUrl ? (
//                       <img
//                         src={agent.imageUrl}
//                         alt={agent.productName}
//                         className="object-cover object-top w-full h-full transition-transform duration-700 group-hover:scale-110"
//                       />
//                     ) : (
//                       <div className="flex items-center justify-center w-full h-full">
//                         <Cpu className="w-24 h-24 text-gray-400 dark:text-gray-600" />
//                       </div>
//                     )}

//                     {/* Gradient Overlay */}
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

//                     {/* Status Badge */}
//                     <div
//                       className={`absolute top-4 right-4 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold shadow-md backdrop-blur-sm ${getStatusColorClass(
//                         agent.status
//                       )}`}
//                     >
//                       {agent.status !== "Available" && (
//                         <Clock3 className="h-3.5 w-3.5" />
//                       )}
//                       {agent.status}
//                     </div>

//                     {/* Subscribe Badge */}
//                     <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-2 bg-[#397FF5] rounded-xl text-white text-sm font-medium shadow-lg">
//                       <Sparkles className="w-4 h-4" />
//                       Subscribe Agent
//                     </div>

//                     {/* Agent Info on Image */}
//                     <div className="absolute bottom-4 left-4 right-4">
//                       <div className="flex items-end justify-between">
//                         <div className="space-y-1">
//                           <h2 className="text-2xl font-bold text-white drop-shadow-lg line-clamp-1">
//                             {agent.productName}
//                           </h2>
//                           <p className="text-white/80 text-sm font-medium flex items-center gap-1.5">
//                             <span className="w-1.5 h-1.5 rounded-full bg-[#397FF5]"></span>
//                             {agent.categoryName}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Card Body */}
//                   <div className="p-6">
//                     {/* Sub Name with Icon */}
//                     <div className="flex items-center gap-2 mb-3">
//                       <Cpu className="w-4 h-4 text-gray-600 dark:text-gray-400" />
//                       <h3 className="text-black dark:text-white font-bold text-sm">
//                         Agent Capabilities
//                       </h3>
//                     </div>

//                     <p className="text-gray-800 dark:text-gray-200 text-xs">
//                       {agent.subName}
//                     </p>

//                     {/* Capabilities Section */}
//                     <div className="mb-5">
//                       <div className="grid grid-cols-2 gap-2">
//                         {agent.Specification && (
//                           <div className="col-span-2">
//                             <div
//                               className="text-xs text-gray-700 dark:text-gray-300"
//                               dangerouslySetInnerHTML={{
//                                 __html: agent.Specification,
//                               }}
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* License & Includes Grid */}
//                     <div className="grid grid-cols-1 gap-3 mb-5">
//                       {agent.status !== "Available" && (
//                         <div className="w-full rounded-xl border border-orange-200 bg-orange-50/80 px-3 py-2 dark:border-orange-900 dark:bg-orange-950/30">
//                           <div className="flex items-center gap-3">
//                             <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/40">
//                               <Shield className="h-4 w-4 text-orange-600 dark:text-orange-400" />
//                             </div>
//                             <div>
//                               <h3 className="text-sm font-serif font-medium text-orange-700 dark:text-orange-300">
//                                 Acquire License will open once this agent is
//                                 launched.
//                               </h3>
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       {/* License Details */}
//                       <div className="p-3 bg-gradient-to-br from-blue-50/60 to-blue-50/60 dark:from-blue-950/30 dark:to-blue-950/30 rounded-2xl border border-blue-200/50 dark:border-blue-800/30">
//                         <div className="flex items-center gap-1.5 mb-2">
//                           <FileText
//                             size={14}
//                             className="text-blue-600 dark:text-blue-400"
//                           />
//                           <h4 className="font-bold text-gray-800 dark:text-gray-200 text-[12px]">
//                             License Details
//                           </h4>
//                         </div>
//                         <div className="space-y-1.5 text-xs">
//                           <div className="flex justify-between flex-wrap">
//                             <span className="text-gray-600 dark:text-white text-xs">
//                               Category:
//                             </span>
//                             <span className="font text-gray-800 dark:text-gray-200 text-xs">
//                               {agent.categoryName}
//                             </span>
//                           </div>
//                           <div className="flex justify-between flex-wrap">
//                             <span className="text-gray-600 dark:text-gray-200 text-xs">
//                               License Type:
//                             </span>
//                             <span className="font text-gray-800 dark:text-gray-200 text-xs">
//                               Commercial
//                             </span>
//                           </div>
//                           <div className="flex justify-between flex-wrap">
//                             <span className="text-gray-600 dark:text-gray-200 text-xs">
//                               Status:
//                             </span>
//                             <span
//                               className={`font-bold ${
//                                 agent.status === "Available"
//                                   ? "text-green-600 dark:text-green-400"
//                                   : "text-red-600 dark:text-red-400"
//                               }`}
//                             >
//                               {agent.status}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* What You Receive */}
//                       <div className="p-3 bg-gradient-to-br from-blue-50/60 to-pink-50/60 dark:from-blue-950/30 dark:to-pink-950/30 rounded-2xl border border-blue-200/50 dark:border-blue-800/30">
//                         <div className="flex items-center gap-1.5 mb-2">
//                           <Gift
//                             size={14}
//                             className="text-blue-600 dark:text-blue-400"
//                           />
//                           <h4 className="font-bold text-gray-800 dark:text-gray-200 text-[12px]">
//                             What You Receive
//                           </h4>
//                         </div>
//                         <div className="space-y-1">
//                           {[
//                             "Agent License",
//                             "Marketplace Access",
//                             "Deployment Rights",
//                             "Compute Credit Eligibility",
//                             "Future Upgrades",
//                           ].map((item) => (
//                             <div
//                               key={item}
//                               className="flex items-center gap-1.5"
//                             >
//                               <CheckCircle
//                                 size={12}
//                                 className="text-blue-500 dark:text-blue-400 shrink-0"
//                               />
//                               <span className="text-gray-600 dark:text-white text-xs">
//                                 {item}
//                               </span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="grid grid-cols-2 gap-3">
//                       {agent.status === "Available" && (
//                         <>
//                           <button
//                             className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-md shadow-blue-500/25 hover:brightness-110 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap text-[12px]"
//                             onClick={(e) => handleLeaseClick(e, agent)}
//                           >
//                             <RiRobotLine className="mr-2" />
//                             Acquire License
//                           </button>
//                           <button
//                             className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap bg-black/5 backdrop-blur-sm border border-black/100 text-gray-900 hover:bg-black/10 hover:-translate-y-0.5 dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/20 transition-all duration-300 text-[12px]"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleCardClick(agent);
//                             }}
//                           >
//                             <RiEyeLine className="mr-2" />
//                             View Details
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))
//           )}
//         </div>
//         )}

//         {openDialog && selectedAgent && (
//           <LeaseModal
//             agent={selectedAgent}
//             onClose={handleCloseDialog}
//             productId={productId}
//             month={month}
//           />
//         )}
//       </div>
//     </>
//   );
// }


"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  UserX,
  FileText,
  Gift,
  CheckCircle,
  Sparkles,
  Cpu,
  Shield,
  Clock3,
} from "lucide-react";
import { RiRobotLine, RiEyeLine } from "react-icons/ri";
import { sortOptions } from "@/lib/constants";
import { getPageName } from "@/lib/utils";
import LeaseModal from "@/app/components/LeaseModal";
import { PageLoader } from "@/components/common/PageLoader";

interface Agent {
  id: number;
  productId: string;
  categoryId: string;
  categoryName: string;
  subCategoryId: string;
  subCategoryName: string | null;
  subCategoryTypeId: string;
  subCategoryTypeName: string;
  productName: string;
  subName: string;
  description: string;
  rating: number;
  AICredite: number;
  createdDate: string;
  updatedDate: string | null;
  status: string;
  active: boolean;
  imageUrl: string | null;
  Specification: string;
  Commingsoon: number;
  price?: number;
  toatalmonth?: number;
  totalReturn?: number;
  weeklyReturn?: number;
  task?: string;
  unit?: string;
}

interface SortOption {
  readonly value: string;
  readonly label: string;
}

export default function InvestmentAmountPage() {
  const pathname = usePathname();
  const router = useRouter();
  const pageName = getPageName(pathname);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("all");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [productId, setProductId] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [allProductData, setAllProductData] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/investment-plans");
        const data = await response.json();

        if (data.statusCode === 200 && data.data) {
          setAllProductData(data.data as Agent[]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAgent(null);
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-emerald-400/15 text-emerald-300 border border-emerald-400/40 shadow-[0_0_24px_-6px_rgba(52,211,153,0.7)]";
      case "Coming Soon":
        return "bg-[#050a18]/70 text-[#65e7ff] border border-[#65e7ff]/30";
      default:
        return "bg-red-500/15 text-red-300 border border-red-400/30";
    }
  };

  const filteredAgents: Agent[] = (allProductData || [])
    .filter((agent) =>
      agent.productName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (a.price || 0) - (b.price || 0));

  const sortedAgents = (): Agent[] => {
    let agents = [...filteredAgents];
    if (sortBy === "personalagents") {
      agents = agents.filter(
        (agent) => (agent.price ?? 0) >= 10 && (agent.price ?? 0) <= 490
      );
    } else if (sortBy === "businessagents") {
      agents = agents.filter(
        (agent) => (agent.price ?? 0) >= 500 && (agent.price ?? 0) <= 4950
      );
    } else if (sortBy === "industrialagents") {
      agents = agents.filter(
        (agent) => (agent.price ?? 0) >= 5000 && (agent.price ?? 0) <= 20000
      );
    }
    return agents;
  };

  const handleLeaseClick = (e: React.MouseEvent, agent: Agent) => {
    e.stopPropagation();
    e.preventDefault();
    setProductId(agent.productId);
    setMonth((agent.toatalmonth || 0).toString());
    if (agent.status === "Available") {
      setSelectedAgent(agent);
      setOpenDialog(true);
    }
  };

  const handleCardClick = (agent: Agent) => {
    // router.push(`/agent-detail?id=${agent.productId}`);
    router.push("#");
  };

  return (
    <>
      {/* Page canvas: navy base + grid + glow orbs, same mood as the home hero */}
      <div className="relative isolate mx-auto overflow-hidden p-4 text-slate-900 dark:text-white sm:px-6 lg:px-8">

        <div>
          <div className="pt-4">
            <h1 className="mb-3 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-600 bg-clip-text dark:from-white dark:via-white dark:to-[#65e7ff] text-xl font-medium tracking-tight text-transparent sm:text-5xl">
              Agent Access Program
            </h1>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-cyan-600 dark:bg-[#65e7ff]" />
              <p className="text-slate-500 dark:text-slate-400">
                Browse and acquire AI agents for your business needs
              </p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-10 mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="relative w-full sm:w-80">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                <svg
                  className="h-5 w-5 text-cyan-700/70 dark:text-[#65e7ff]/70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                  />
                </svg>
              </span>
              <input
                className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] py-3 pl-12 pr-4 text-slate-900 dark:text-slate-100 placeholder-slate-500 outline-none backdrop-blur-xl transition-all duration-200 hover:border-[#65e7ff]/30 focus:border-[#65e7ff]/70 focus:bg-white dark:focus:bg-white/[0.06] focus:ring-4 focus:ring-[#65e7ff]/15"
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative w-full sm:ml-2 sm:w-auto" ref={dropdownRef}>
              <button
                className="flex w-full items-center justify-between rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-5 py-3 text-slate-900 dark:text-slate-100 outline-none backdrop-blur-xl transition-all duration-200 hover:border-[#65e7ff]/30 focus:border-[#65e7ff]/70 focus:ring-4 focus:ring-[#65e7ff]/15 sm:w-[300px]"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <span>
                  {sortBy === "all"
                    ? "All Agents"
                    : sortOptions.find(
                        (option) => option.value === sortBy
                      )?.label}
                </span>
                <svg
                  className={`ml-2 h-4 w-4 text-cyan-700 dark:text-[#65e7ff] transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showDropdown && (
                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-900/10 backdrop-blur-xl dark:border-[#65e7ff]/20 dark:bg-[#0a1224]/95 dark:shadow-[0_20px_60px_-15px_rgba(101,231,255,0.3)] sm:w-[300px]">
                  <div className="space-y-1 p-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 hover:bg-[#65e7ff]/10">
                      <input
                        type="radio"
                        name="sortBy"
                        value="all"
                        checked={sortBy === "all"}
                        onChange={(e) => {
                          setSortBy(e.target.value);
                          setShowDropdown(false);
                        }}
                        className="form-radio h-4 w-4 accent-[#65e7ff]"
                      />
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        All Agents
                      </span>
                    </label>

                    {sortOptions.map((option: SortOption) => (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 hover:bg-[#65e7ff]/10"
                      >
                        <input
                          type="radio"
                          name="sortBy"
                          value={option.value}
                          checked={sortBy === option.value}
                          onChange={(e) => {
                            setSortBy(e.target.value);
                            setShowDropdown(false);
                          }}
                          className="form-radio h-4 w-4 accent-[#65e7ff]"
                        />
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <PageLoader />
        ) : (
          <div className="grid grid-cols-1 gap-6 pb-8 md:grid-cols-2 md:gap-8 xl:grid-cols-3 2xl:grid-cols-3">
            {!loading && sortedAgents().length === 0 ? (
              <div className="col-span-full flex h-[60vh] items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex max-w-md flex-col items-center rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xl shadow-slate-900/10 backdrop-blur-xl dark:border-[#65e7ff]/20 dark:bg-[#0a1224]/90 dark:shadow-[0_0_80px_-20px_rgba(101,231,255,0.4)]"
                >
                  <div className="mb-4 rounded-full border border-[#65e7ff]/30 bg-[#65e7ff]/10 p-4">
                    <UserX className="h-16 w-16 text-cyan-700 dark:text-[#65e7ff]" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    No Agents Found
                  </h2>
                  <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    Try adjusting your filters or search criteria.
                  </p>
                </motion.div>
              </div>
            ) : (
              sortedAgents().map((agent, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  key={agent.productId}
                  onClick={() => handleCardClick(agent)}
                  className="group cursor-pointer"
                >
                  {/* Gradient-border shell */}
                  <div className="relative h-full rounded-[28px] bg-gradient-to-b from-slate-300 via-slate-200 to-slate-200 p-px shadow-md shadow-slate-900/5 dark:from-white/15 dark:via-white/5 dark:to-white/5 dark:shadow-none transition-all duration-500 group-hover:-translate-y-2 group-hover:from-[#65e7ff]/80 group-hover:via-[#65e7ff]/20 group-hover:to-violet-500/40 group-hover:shadow-[0_30px_80px_-30px_rgba(101,231,255,0.55)]">
                    <div className="relative h-full overflow-hidden rounded-[27px] bg-white dark:bg-[#070d1c]">
                      {/* ===== Image / hero area ===== */}
                      <div className="relative h-60 overflow-hidden bg-gradient-to-br from-[#0d1a33] to-[#050a18] sm:h-64">
                        {agent.imageUrl ? (
                          <img
                            src={agent.imageUrl}
                            alt={agent.productName}
                            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Cpu className="h-24 w-24 text-[#65e7ff]/40" />
                          </div>
                        )}

                        {/* overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070d1c] via-[#070d1c]/40 to-transparent" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(101,231,255,0.18),transparent_65%)] opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

                        {/* HUD corner brackets */}
                        <span className="absolute left-2.5 top-2.5 h-4 w-4 rounded-tl-md border-l border-t border-[#65e7ff]/60" />
                        <span className="absolute right-2.5 top-2.5 h-4 w-4 rounded-tr-md border-r border-t border-[#65e7ff]/60" />
                        <span className="absolute bottom-2.5 left-2.5 h-4 w-4 rounded-bl-md border-b border-l border-[#65e7ff]/60" />
                        <span className="absolute bottom-2.5 right-2.5 h-4 w-4 rounded-br-md border-b border-r border-[#65e7ff]/60" />

                        {/* Subscribe Badge */}
                        <div className="absolute left-5 top-5 flex items-center gap-1.5 rounded-lg border border-[#65e7ff]/40 bg-[#050a18]/70 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#65e7ff] backdrop-blur-md">
                          <Sparkles className="h-3.5 w-3.5" />
                          Subscribe Agent
                        </div>

                        {/* Status Badge */}
                        <div
                          className={`absolute right-5 top-5 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md ${getStatusColorClass(
                            agent.status
                          )}`}
                        >
                          {agent.status !== "Available" ? (
                            <Clock3 className="h-3.5 w-3.5" />
                          ) : (
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
                          )}
                          {agent.status}
                        </div>

                        {/* Agent Info on Image */}
                        <div className="absolute bottom-6 left-6 right-6">
                          <h2 className="line-clamp-1 text-2xl font-bold tracking-tight text-white drop-shadow-lg">
                            {agent.productName}
                          </h2>
                          <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-200/80">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#65e7ff] shadow-[0_0_8px_rgba(101,231,255,0.9)]" />
                            {agent.categoryName}
                          </p>
                          <div className="mt-3 flex items-center gap-2">
                            <span className="h-px flex-1 bg-gradient-to-r from-[#65e7ff]/70 to-transparent" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[#65e7ff] shadow-[0_0_10px_rgba(101,231,255,1)]" />
                          </div>
                        </div>
                      </div>

                      {/* ===== Card Body ===== */}
                      <div className="p-6">
                        {/* Sub Name with Icon */}
                        <div className="mb-3 flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-cyan-700 dark:text-[#65e7ff]" />
                          <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-[#65e7ff]">
                            Agent Capabilities
                          </h3>
                          <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                        </div>

                        <p className="text-sm text-slate-700 dark:text-slate-200">
                          {agent.subName}
                        </p>

                        {/* Capabilities Section */}
                        <div className="mb-5">
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {agent.Specification && (
                              <div className="col-span-2">
                                <div
                                  className="text-xs leading-relaxed text-slate-500 dark:text-slate-400"
                                  dangerouslySetInnerHTML={{
                                    __html: agent.Specification,
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* License & Includes Grid */}
                        <div className="mb-6 grid grid-cols-1 gap-4">
                          {agent.status !== "Available" && (
                            <div className="w-full rounded-xl border border-[#65e7ff]/25 bg-[#65e7ff]/[0.06] px-3 py-2.5">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#65e7ff]/30 bg-[#65e7ff]/10">
                                  <Shield className="h-4 w-4 text-cyan-700 dark:text-[#65e7ff]" />
                                </div>
                                <h3 className="text-sm font-medium text-cyan-900 dark:text-cyan-100">
                                  Acquire License will open once this agent is
                                  launched.
                                </h3>
                              </div>
                            </div>
                          )}

                          {/* License Details */}
                          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] p-4">
                            <div className="mb-3 flex items-center gap-2">
                              <FileText size={14} className="text-cyan-700 dark:text-[#65e7ff]" />
                              <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-200">
                                License Details
                              </h4>
                            </div>
                            <div className="text-xs">
                              <div className="flex flex-wrap justify-between border-b border-dashed border-slate-200 dark:border-white/10 pb-2">
                                <span className="text-slate-500 dark:text-slate-400">
                                  Category:
                                </span>
                                <span className="text-slate-900 dark:text-slate-100">
                                  {agent.categoryName}
                                </span>
                              </div>
                              <div className="flex flex-wrap justify-between border-b border-dashed border-slate-200 dark:border-white/10 py-2">
                                <span className="text-slate-500 dark:text-slate-400">
                                  License Type:
                                </span>
                                <span className="text-slate-900 dark:text-slate-100">
                                  Commercial
                                </span>
                              </div>
                              <div className="flex flex-wrap justify-between pt-2">
                                <span className="text-slate-500 dark:text-slate-400">Status:</span>
                                <span
                                  className={`font-bold ${
                                    agent.status === "Available"
                                      ? "text-emerald-600 dark:text-emerald-400"
                                      : "text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {agent.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* What You Receive */}
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#0b1426]">
                            <div className="mb-3 flex items-center gap-2">
                              <Gift size={14} className="text-cyan-700 dark:text-[#65e7ff]" />
                              <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-200">
                                What You Receive
                              </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                              {[
                                "Agent License",
                                "Marketplace Access",
                                "Deployment Rights",
                                "Compute Credit Eligibility",
                                "Future Upgrades",
                              ].map((item) => (
                                <div
                                  key={item}
                                  className="flex items-center gap-1.5"
                                >
                                  <CheckCircle
                                    size={12}
                                    className="shrink-0 text-cyan-700 dark:text-[#65e7ff]"
                                  />
                                  <span className="text-xs text-slate-700 dark:text-slate-300">
                                    {item}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                          {agent.status === "Available" && (
                            <>
                              <button
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-slate-900 px-6 py-3 text-[12px] font-semibold text-white dark:bg-white dark:text-[#050a18] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_36px_-4px_rgba(101,231,255,0.8)]"
                                onClick={(e) => handleLeaseClick(e, agent)}
                              >
                                <RiRobotLine className="mr-2" />
                                Acquire License
                              </button>
                              <button
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-cyan-600/40 dark:border-[#65e7ff]/40 bg-slate-50 dark:bg-white/[0.03] px-6 py-3 text-[12px] font-semibold text-slate-900 dark:text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-600 hover:bg-cyan-50 dark:hover:border-[#65e7ff] dark:hover:bg-[#65e7ff]/10 cursor-not-allowed"
                                // onClick={(e) => {
                                //   e.stopPropagation();
                                //   handleCardClick(agent);
                                // }}
                              >
                                <RiEyeLine className="mr-2" />
                                View Details
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {openDialog && selectedAgent && (
          <LeaseModal
            agent={selectedAgent}
            onClose={handleCloseDialog}
            productId={productId}
            month={month}
          />
        )}
      </div>
    </>
  );
}
