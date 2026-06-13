"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { getUserDisplayName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">⚽</span>
          <div>
            <span className="font-bold text-gray-900 text-sm leading-none">Taxminlar Ligasi</span>
            <span className="block text-[10px] text-gray-400 leading-none">FIFA 2026</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          <Link href="/leaderboard">
            <Button variant="ghost" size="sm">🏆 Reyting</Button>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
                  {user.photoUrl ? (
                    <Image
                      src={user.photoUrl}
                      alt={user.firstName}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary-800 text-white text-xs flex items-center justify-center font-bold">
                      {user.firstName[0]}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {getUserDisplayName(user)}
                  </span>
                </div>
              </Link>
            </div>
          ) : (
            <Link href="/auth/telegram/callback">
              <Button size="sm">Kirish</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
