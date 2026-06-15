"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";

type TelegramWebApp = {
  ready?: () => void;
  expand?: () => void;
  initData?: string;
};

// Telegram rasmiy WebView'ida window.Telegram bir necha ms kechroq paydo bo'ladi.
// 5 soniya ichida 200ms oraliqda kutamiz.
function waitForTelegram(timeoutMs = 5000): Promise<TelegramWebApp> {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs;

    const check = () => {
      const tg = (
        window as unknown as { Telegram?: { WebApp?: TelegramWebApp } }
      )?.Telegram?.WebApp;

      if (tg) {
        resolve(tg);
        return;
      }
      if (Date.now() >= deadline) {
        reject(new Error("Telegram WebApp SDK topilmadi. Mini appni Telegram bot orqali oching."));
        return;
      }
      setTimeout(check, 200);
    };

    check();
  });
}

export function MiniAppAuthProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useAuth((s) => s.hydrate);
  const loginMiniApp = useAuth((s) => s.loginMiniApp);
  const isHydrated = useAuth((s) => s.isHydrated);
  const user = useAuth((s) => s.user);

  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const runAuth = useCallback(async () => {
    setAuthError(null);
    setIsAuthenticating(true);

    try {
      // 1. Mavjud tokenni tekshir (tezkor yo'l)
      await hydrate();
      if (useAuth.getState().user) return;

      // 2. Telegram SDK ni kut (rasmiy Telegram WebView kechroq inject qilishi mumkin)
      const tg = await waitForTelegram(5000);
      tg.ready?.();
      tg.expand?.();

      // 3. initData mavjudligini tekshir
      const initData = tg.initData ?? "";
      if (!initData) {
        setAuthError(
          "Telegram ma'lumotlari bo'sh. Ehtimol, mini app to'g'ri konfiguratsiya qilinmagan."
        );
        return;
      }

      // 4. Server orqali login
      await loginMiniApp(initData);
    } catch (err) {
      setAuthError(
        err instanceof Error
          ? err.message
          : "Noma'lum xato yuz berdi. Qayta urinib ko'ring."
      );
    } finally {
      setIsAuthenticating(false);
    }
  }, [hydrate, loginMiniApp]);

  useEffect(() => {
    runAuth();
  }, [runAuth]);

  /* ── Xato ekrani ─────────────────────────────────────────────────────────── */
  if (authError) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "#07080d" }}
      >
        <div className="text-center max-w-xs mx-auto space-y-4">
          <p className="text-5xl">⚠️</p>
          <p className="text-base font-semibold text-zinc-300">Kirish muvaffaqiyatsiz</p>
          <p className="text-xs text-zinc-600 leading-relaxed">{authError}</p>
          <button
            onClick={runAuth}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-80 active:scale-95"
            style={{ background: "linear-gradient(135deg, #22c55e, #15803d)" }}
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  /* ── Yuklash ekrani ───────────────────────────────────────────────────────── */
  if (!isHydrated || isAuthenticating || !user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#07080d" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: "rgba(34,197,94,0.2)", borderTopColor: "#22c55e" }}
          />
          <p className="text-[10px] text-zinc-700 tracking-[0.3em] uppercase">Yuklanmoqda</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
