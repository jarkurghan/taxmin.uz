"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export function MiniAppAuthProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useAuth((s) => s.hydrate);
  const loginMiniApp = useAuth((s) => s.loginMiniApp);
  const isHydrated = useAuth((s) => s.isHydrated);
  const user = useAuth((s) => s.user);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Avval mavjud tokenni tekshir
      await hydrate();

      // Hydration'dan keyin user mavjud bo'lsa, boshqa hech narsa kerak emas
      if (useAuth.getState().user) return;

      // Telegram WebApp initData orqali login
      const initData = (window as unknown as { Telegram?: { WebApp?: { initData?: string } } })
        ?.Telegram?.WebApp?.initData;

      if (!initData) {
        setAuthError(true);
        return;
      }

      try {
        await loginMiniApp(initData);
      } catch {
        setAuthError(true);
      }
    };

    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <p className="text-sm text-zinc-400">Tizimga kirish muvaffaqiyatsiz tugadi.</p>
          <p className="text-xs text-zinc-600 mt-2">Iltimos, mini appni qayta oching.</p>
        </div>
      </div>
    );
  }

  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "rgba(34,197,94,0.6)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return <>{children}</>;
}
