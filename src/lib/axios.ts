// import axios from "axios";

// export const httpClient = axios.create({
//   baseURL: "/api",
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// httpClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (axios.isAxiosError(error) && error.response?.status === 401) {
//       if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
//         const { useAuthStore } = require("@/store/auth.store");
//         useAuthStore.getState().clearUser();
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   },
// );

// lib/httpClient.ts — NO CHANGE
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

export const httpClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        // Only redirect if on protected routes, not on landing page or other public pages
        const publicRoutes = ["/", "/landing", "/privacy", "/terms", "/auth/callback", "/register", "/login", "/forgot-password", "/reset-password"];
        const isPublicRoute = publicRoutes.some(route => window.location.pathname === route || window.location.pathname.startsWith(route + "/"));

        if (!isPublicRoute) {
          useAuthStore.getState().clearUser();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);
