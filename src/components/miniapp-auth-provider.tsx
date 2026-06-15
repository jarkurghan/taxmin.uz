"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";

type TelegramWebApp = {
  ready?: () => void;
  expand?: () => void;
  initData?: string;
};

function getTelegramWebApp(): TelegramWebApp | null {
  return (
    (window as unknown as { Telegram?: { WebApp?: TelegramWebApp } })
      ?.Telegram?.WebApp ?? null
  );
}

function getMiniAppLink() {
  const bot = process.env.NEXT_PUBLIC_BOT_USERNAME ?? "taxminrobot";
  const app = process.env.NEXT_PUBLIC_BOT_APP_SHORT ?? "taxmin";
  return `https://t.me/${bot}/${app}`;
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
      // 1. Mavjud tokenni tekshir
      await hydrate();
      if (useAuth.getState().user) return;

      // 2. Telegram SDK ni tekshir (500ms kutib qayta tekshiramiz)
      let tg = getTelegramWebApp();
      if (!tg) {
        await new Promise((r) => setTimeout(r, 500));
        tg = getTelegramWebApp();
      }

      if (!tg) {
        setAuthError("no_sdk");
        return;
      }

      // 3. SDK ni tayyor holga keltir
      tg.ready?.();
      tg.expand?.();

      // 4. initData tekshir
      const initData = tg.initData ?? "";
      if (!initData) {
        setAuthError("Telegram ma'lumotlari bo'sh. Mini appni qayta oching.");
        return;
      }

      // 5. Server orqali login
      await loginMiniApp(initData);
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : "Xato yuz berdi. Qayta urinib ko'ring."
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
    // SDK topilmagan holat — foydalanuvchi to'g'ri link orqali ochmagan
    if (authError === "no_sdk") {
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center px-6 gap-6"
          style={{ background: "#07080d" }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: "linear-gradient(135deg, #22c55e, #15803d)" }}
          >
            ⚽
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-display font-bold text-white uppercase tracking-wider">
              Taxminlar Ligasi
            </p>
            <p className="text-xs text-zinc-600">
              Mini appni ochish uchun quyidagi tugmani bosing
            </p>
          </div>
          <a
            href={getMiniAppLink()}
            className="block w-full max-w-xs px-6 py-3.5 rounded-2xl text-sm font-semibold text-white text-center"
            style={{ background: "linear-gradient(135deg, #22c55e, #15803d)" }}
          >
            Telegram orqali ochish
          </a>
        </div>
      );
    }

    // Boshqa xatolar (server xatosi, initData bo'sh, va h.k.)
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
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
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
