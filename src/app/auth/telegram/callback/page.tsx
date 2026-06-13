"use client";

import { useAuth } from "@/hooks/use-auth";
import { TelegramLoginButton } from "@/components/telegram-login";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TelegramCallbackPage() {
  const { user, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && user) {
      router.replace("/");
    }
  }, [isHydrated, user, router]);

  if (!isHydrated) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-sm w-full text-center">
        <div className="text-5xl mb-4">⚽</div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">Taxminlar Ligasi</h1>
        <p className="text-sm text-gray-500 mb-8">FIFA 2026 o'yinlarini taxmin qiling!</p>

        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Telegram orqali kiring</p>
          <TelegramLoginButton redirectTo="/" />
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Kirish orqali siz Telegram ma'lumotlaringizni taxmin.uz bilan ulashishga rozilik bildirasiz
        </p>
      </div>
    </div>
  );
}
