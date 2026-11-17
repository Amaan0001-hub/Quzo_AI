// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import * as Icons from "lucide-react";
// import { useMenu } from "@/spr-admin/features/menu/hooks/useMenu";
// import { useSidebarStore } from "@/spr-admin/store/sidebar.store";
// import { cn } from "@/spr-admin/lib/utils";
// import { useState } from "react";
// import { ChevronDown, ChevronRight } from "lucide-react";
// import type { MenuItem } from "@/spr-admin/services/menu.service";
// import Image from "next/image";
// import { Spinner } from "@/spr-admin/components/ui/Spinner";

// export function Sidebar() {
//   const pathname = usePathname();
//   const isCollapsed = useSidebarStore((state) => state.isCollapsed);
//   const { data: menuItems, isLoading, error } = useMenu();
//   const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

//   // Fallback to empty array while loading or on error
//   // Ensure menuItems is an array before using it
//   const navItems = Array.isArray(menuItems) ? menuItems : [];

//   // Filter out items without href to prevent Link errors
//   const validNavItems = navItems.filter((item) => item.href && typeof item.href === "string");

//   const toggleExpanded = (itemId: string | undefined) => {
//     if (!itemId) return;
//     setExpandedItems((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(itemId)) {
//         newSet.delete(itemId);
//       } else {
//         newSet.add(itemId);
//       }
//       return newSet;
//     });
//   };

//   const renderMenuItem = (item: MenuItem, level: number = 0) => {
//     const itemId = item.id || item.href;
//     const Icon = item.icon ? (Icons[item.icon as keyof typeof Icons] as Icons.LucideIcon) : null;
//     const isActive = pathname.startsWith(item.href);
//     const hasChildren = item.children && item.children.length > 0;
//     const isExpanded = itemId ? expandedItems.has(itemId) : false;

//     return (
//       <div key={item.id || item.href || `menu-item-${level}`}>
//         {hasChildren ? (
//           <div
//             className={cn(
//               "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
//               isActive
//                 ? "admin-nav-item admin-nav-item-active bg-gradient-to-r from-sidebar-active to-[#25c6e8] text-sidebar-active-foreground shadow-lg shadow-blue-500/20"
//                 : "admin-nav-item text-sidebar-foreground",
//             )}
//             style={{ paddingLeft: `${level * 12 + 12}px` }}
//             onClick={() => toggleExpanded(itemId)}
//           >
//             {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden />}
//             {!isCollapsed && (
//               <>
//                 <span className="flex-1">{item.label}</span>
//                 {hasChildren &&
//                   (isExpanded ? (
//                     <ChevronDown className="h-4 w-4" />
//                   ) : (
//                     <ChevronRight className="h-4 w-4" />
//                   ))}
//               </>
//             )}
//           </div>
//         ) : (
//           <Link
//             href={item.href}
//             className={cn(
//               "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
//               isActive
//                 ? "admin-nav-item admin-nav-item-active bg-gradient-to-r from-sidebar-active to-[#25c6e8] text-sidebar-active-foreground shadow-lg shadow-blue-500/20"
//                 : "admin-nav-item text-sidebar-foreground",
//             )}
//             style={{ paddingLeft: `${level * 12 + 12}px` }}
//           >
//             {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden />}
//             {!isCollapsed && <span>{item.label}</span>}
//           </Link>
//         )}

//         {hasChildren && isExpanded && !isCollapsed && item.children && (
//           <div className="flex flex-col">
//             {item.children.map((child: MenuItem) => renderMenuItem(child, level + 1))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <aside
//       className={cn(
//         // "hidden shrink-0 border-r border-sidebar-border bg-gradient-to-b from-sidebar-bg to-[#0f111a] lg:block",
//         "hidden shrink-0 border-r border-sidebar-border bg-gradient-to-b from-sidebar-bg to-[#0f111a] lg:flex flex-col h-screen",
//         isCollapsed ? "w-16" : "w-68",
//       )}
//     >
//       {/* --- YAHAN SE LOGO SECTION START HAI --- */}
//       {/* <div
//         className={cn(
//           "flex items-center border-b border-sidebar-border/50 px-5 py-6",
//           isCollapsed ? "justify-center px-0" : "",
//         )}
//       >
//         <div className="flex items-center justify-center">
//           <Image
//             src="/logos/fyntix-logo-dark.png"
//             alt="Quzo"
//             width={160}
//             height={64}
//             className={cn(
//               "admin-sidebar-logo-dark shrink-0 object-contain transition-all duration-200",
//               isCollapsed ? "h-10 w-10" : "h-auto w-36 sm:w-40",
//             )}
//             priority
//           />
//           <Image
//             src="/logos/fyntix-logo-light.png"
//             alt="Quzo"
//             width={160}
//             height={64}
//             className={cn(
//               "admin-sidebar-logo-light hidden shrink-0 object-contain transition-all duration-200",
//               isCollapsed ? "h-10 w-10" : "h-auto w-36 sm:w-40",
//             )}
//             priority
//           />
//         </div>
//       </div> */}

//       <div
//         className={cn(
//           "flex items-center border-b border-sidebar-border/50 transition-all duration-300 shrink-0",
//           isCollapsed ? "justify-center px-0 py-4" : "px-5 py-4"
//         )}
//       >
//         <div className="flex items-center gap-3 overflow-hidden">

//           {/* 1. ICON IMAGE */}
//           <div className="shrink-0">
//             {/* Light Theme Icon */}
//             <Image
//               src="/logos/fyntix-logo-dark.png" // <-- Yahan sirf Icon (Q) ki image file dalein
//               alt="Quzo Icon"
//               width={40}
//               height={40}
//               className="block dark:hidden h-9 w-9 object-contain"
//               priority
//             />
//             {/* Dark Theme Icon */}
//             <Image
//               src="/logos/fyntix-logo-dark.png" // <-- Dark theme ke liye sirf Icon ki image dalein
//               alt="Quzo Icon"
//               width={40}
//               height={40}
//               className="hidden dark:block h-9 w-9 object-contain"
//               priority
//             />
//           </div>

//           {/* 2. TEXT (QUZO) */}
//           <span
//             className={cn(
//               "font-bold text-xl tracking-wider uppercase transition-all duration-300 whitespace-nowrap",
//               // Light/Dark theme ke hisaab se text color (Apne theme ke hisaab se adjust karein)
//               "text-slate-900 dark:text-white",
//               // Collapse hone par text gayab ho jayega smoothly
//               isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"
//             )}
//           >
//             Quzo
//           </span>

//         </div>
//       </div>
//       {/* --- LOGO SECTION END --- */}

//       <nav className="flex flex-col gap-1 whitespace-nowrap p-3 flex-1 overflow-y-auto overflow-x-hidden">
//         {isLoading ? (
//           <div
//             className={cn(
//               "flex items-center gap-2 px-3 py-2 text-sm text-sidebar-muted-foreground",
//               isCollapsed && "justify-center px-0",
//             )}
//             role="status"
//             aria-label="Loading menu"
//           >
//             <Spinner className="h-4 w-4 text-sidebar-muted-foreground" />
//             {!isCollapsed && <span>Loading menu...</span>}
//           </div>
//         ) : error ? (
//           <div className="px-3 py-2 text-sm text-destructive">Failed to load menu</div>
//         ) : (
//           validNavItems.map((item) => renderMenuItem(item))
//         )}
//       </nav>
//     </aside>
//   );
// }




"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { useMenu } from "@/spr-admin/features/menu/hooks/useMenu";
import { useSidebarStore } from "@/spr-admin/store/sidebar.store";
import { cn } from "@/spr-admin/lib/utils";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import type { MenuItem } from "@/spr-admin/services/menu.service";
import Image from "next/image";
import { Spinner } from "@/spr-admin/components/ui/Spinner";

export function Sidebar() {
  const pathname = usePathname();
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const isMobileOpen = useSidebarStore((state) => state.isMobileOpen);
  const setMobileOpen = useSidebarStore((state) => state.setMobileOpen);

  const { data: menuItems, isLoading, error } = useMenu();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isMobileOpen) {
      setMobileOpen(false);
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const navItems = Array.isArray(menuItems) ? menuItems : [];
  const validNavItems = navItems.filter((item) => item.href && typeof item.href === "string");

  const toggleExpanded = (itemId: string | undefined) => {
    if (!itemId) return;
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const itemId = item.id || item.href;
    const Icon = item.icon ? (Icons[item.icon as keyof typeof Icons] as Icons.LucideIcon) : null;
    const isActive = pathname.startsWith(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = itemId ? expandedItems.has(itemId) : false;

    const showText = !isCollapsed || isMobileOpen;

    return (
      <div key={item.id || item.href || `menu-item-${level}`}>
        {hasChildren ? (
          <div
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "admin-nav-item admin-nav-item-active bg-gradient-to-r from-sidebar-active to-[#25c6e8] text-sidebar-active-foreground shadow-lg shadow-blue-500/20"
                : "admin-nav-item text-sidebar-foreground",
            )}
            style={{ paddingLeft: `${level * 12 + 12}px` }}
            onClick={() => toggleExpanded(itemId)}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden />}
            {showText && (
              <>
                <span className="flex-1 truncate">{item.label}</span>
                {hasChildren &&
                  (isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  ))}
              </>
            )}
          </div>
        ) : (
          <Link
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "admin-nav-item admin-nav-item-active bg-gradient-to-r from-sidebar-active to-[#25c6e8] text-sidebar-active-foreground shadow-lg shadow-blue-500/20"
                : "admin-nav-item text-sidebar-foreground",
            )}
            style={{ paddingLeft: `${level * 12 + 12}px` }}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden />}
            {showText && <span className="truncate">{item.label}</span>}
          </Link>
        )}

        {hasChildren && isExpanded && showText && item.children && (
          <div className="flex flex-col">
            {item.children.map((child: MenuItem) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          // 1. Main Fix: h-screen, flex-col, aur overflow-hidden lagaya
          "flex flex-col h-screen shrink-0 border-r border-sidebar-border bg-gradient-to-b from-sidebar-bg to-[#0f111a] z-50 fixed inset-y-0 left-0 lg:static lg:z-auto transition-transform duration-300 overflow-hidden",
          isCollapsed ? "w-16" : "w-68",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* LOGO SECTION: Fixed height, shrink-0 taaki scroll me na ghume */}
        <div
          className={cn(
            "flex items-center border-b border-sidebar-border/50 transition-all duration-300 shrink-0",
            isCollapsed && !isMobileOpen ? "justify-center px-0 py-4" : "px-5 py-4 justify-between"
          )}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="shrink-0">
              <Image
                src="/logos/fyntix-logo-dark.png"
                alt="Quzo Icon"
                width={40}
                height={40}
                className="block dark:hidden h-9 w-9 object-contain"
                priority
              />
              <Image
                src="/logos/fyntix-logo-dark.png"
                alt="Quzo Icon"
                width={40}
                height={40}
                className="hidden dark:block h-9 w-9 object-contain"
                priority
              />
            </div>

            <span
              className={cn(
                "font-bold text-xl tracking-wider uppercase transition-all duration-300 whitespace-nowrap",
                "text-slate-900 dark:text-white",
                (isCollapsed && !isMobileOpen) ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"
              )}
            >
              Quzo
            </span>
          </div>

          <button
            className="lg:hidden p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            onClick={() => setMobileOpen(false)}
            aria-label="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* NAV SECTION: 2. Main Fix: min-h-0 aur overflow-y-auto add kiya. 
            `whitespace-nowrap` yahan se hata diya hai.
            `flex-1` isko bachi hui jagah dene ka kaam karega. */}
        <nav className="flex flex-col gap-1 p-3 flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          {isLoading ? (
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm text-sidebar-muted-foreground",
                isCollapsed && !isMobileOpen && "justify-center px-0",
              )}
              role="status"
              aria-label="Loading menu"
            >
              <Spinner className="h-4 w-4 text-sidebar-muted-foreground" />
              {(!isCollapsed || isMobileOpen) && <span>Loading menu...</span>}
            </div>
          ) : error ? (
            <div className="px-3 py-2 text-sm text-destructive">Failed to load menu</div>
          ) : (
            validNavItems.map((item) => renderMenuItem(item))
          )}
        </nav>
      </aside>
    </>
  );
}