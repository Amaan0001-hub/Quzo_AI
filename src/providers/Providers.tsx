"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";


function AuthProvider({ children }: { children: ReactNode }) {
  const { data: userResponse, isSuccess } = useCurrentUser();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (isSuccess && userResponse?.data) {
      setUser(userResponse.data);
    } else if (isSuccess && !userResponse?.data) {
      setUser(null);
    }
  }, [userResponse, isSuccess, setUser]);

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" storageKey="fyntix-theme">
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
