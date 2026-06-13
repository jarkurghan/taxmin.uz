"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useAuth((s) => s.hydrate);
  const isHydrated = useAuth((s) => s.isHydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
