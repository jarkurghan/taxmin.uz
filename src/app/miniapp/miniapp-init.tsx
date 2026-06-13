"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        initData: string;
        themeParams: Record<string, string>;
        BackButton: { show: () => void; hide: () => void; onClick: (fn: () => void) => void };
      };
    };
  }
}

export function MiniAppInit() {
  const { loginMiniApp, user } = useAuth();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    tg.expand();

    if (!user && tg.initData) {
      loginMiniApp(tg.initData).catch(console.error);
    }
  }, [loginMiniApp, user]);

  return null;
}
