"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usersAPI } from "@/lib/api";
import { getUserDisplayName, getRankMedal, cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import type { User } from "@/types";

export default function LeaderboardPage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    usersAPI.getLeaderboard(1)
      .then((res) => setUsers(res.data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div className="text-center py-2">
        <h1 className="text-xl font-bold text-gray-900">🏆 Reyting jadvali</h1>
        <p className="text-sm text-gray-500 mt-1">Eng ko'p ball to'plagan taxminchilar</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-16 animate-pulse" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <p className="text-3xl mb-2">🏅</p>
          <p>Hali hech kim ball to'plamagan</p>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((u, idx) => {
            const rank = idx + 1;
            const isMe = me?.id === u.id;

            return (
              <Link key={u.id} href={`/profile/${u.id}`}>
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all hover:shadow-sm",
                  isMe ? "bg-blue-50 border-blue-200" : "bg-white border-gray-100",
                  rank === 1 && "ring-2 ring-yellow-300"
                )}>
                  <span className={cn(
                    "text-lg font-bold w-8 text-center shrink-0",
                    rank === 1 ? "text-yellow-500" : rank === 2 ? "text-gray-400" : rank === 3 ? "text-amber-600" : "text-gray-400"
                  )}>
                    {getRankMedal(rank)}
                  </span>

                  {u.photoUrl ? (
                    <Image src={u.photoUrl} alt="" width={36} height={36} className="rounded-full shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-white text-sm flex items-center justify-center font-bold shrink-0">
                      {u.firstName[0]}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-semibold truncate", isMe && "text-blue-700")}>
                      {getUserDisplayName(u)} {isMe && "(sen)"}
                    </p>
                    {u.username && (
                      <p className="text-xs text-gray-400">@{u.username}</p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-gray-900">{u.totalPoints}</p>
                    <p className="text-xs text-gray-400">ball</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
