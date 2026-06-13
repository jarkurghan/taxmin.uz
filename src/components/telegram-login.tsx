"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

interface TelegramLoginProps {
  redirectTo?: string;
}

declare global {
  interface Window {
    onTelegramAuth: (user: object) => void;
  }
}

export function TelegramLoginButton({ redirectTo = "/" }: TelegramLoginProps) {
  const { loginWidget } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME!;

  useEffect(() => {
    window.onTelegramAuth = async (user: object) => {
      try {
        await loginWidget(user);
        router.push(redirectTo);
      } catch (err) {
        console.error("Login xatosi:", err);
      }
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.async = true;

    containerRef.current?.appendChild(script);

    return () => {
      containerRef.current?.removeChild(script);
    };
  }, [botUsername, loginWidget, redirectTo, router]);

  return <div ref={containerRef} className="flex justify-center" />;
}
