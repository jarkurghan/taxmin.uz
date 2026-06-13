"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { getUserDisplayName } from "@/lib/utils";
import Image from "next/image";

export function Header() {
  const { user } = useAuth();

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: "rgba(5, 6, 10, 0.92)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
      }}
    >
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #22c55e, #15803d)",
              boxShadow: "0 0 16px rgba(34, 197, 94, 0.3)",
            }}
          >
            ⚽
          </div>
          <div className="leading-none">
            <div className="font-display font-bold text-white text-sm tracking-wider uppercase">
              Taxminlar Ligasi
            </div>
            <div className="text-[10px] text-green-400 tracking-[0.25em] uppercase mt-0.5">FIFA 2026</div>
          </div>
        </Link>

        {/* User avatar (or nothing — nav is in bottom bar) */}
        {user ? (
          <Link href="/profile">
            <div
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {user.photoUrl ? (
                <Image
                  src={user.photoUrl}
                  alt={user.firstName}
                  width={26}
                  height={26}
                  className="rounded-full"
                />
              ) : (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #22c55e, #15803d)" }}
                >
                  {user.firstName[0]}
                </div>
              )}
              <span className="text-xs font-medium text-zinc-400 hidden sm:block">
                {getUserDisplayName(user)}
              </span>
            </div>
          </Link>
        ) : (
          <Link
            href="/auth/telegram/callback"
            className="text-xs font-semibold text-white px-3 py-1.5 rounded-xl transition-all hover:opacity-80"
            style={{
              background: "linear-gradient(135deg, #22c55e, #15803d)",
              boxShadow: "0 0 12px rgba(34, 197, 94, 0.2)",
            }}
          >
            Kirish
          </Link>
        )}
      </div>
    </header>
  );
}
