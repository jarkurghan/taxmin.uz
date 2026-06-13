"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usersAPI } from "@/lib/api";
import { getUserDisplayName, getRankMedal, cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import type { User } from "@/types";

const RANK_CONFIG = {
  1: {
    bg: "linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(7,8,13,0.8) 100%)",
    border: "rgba(251,191,36,0.2)",
    glow: "0 0 30px rgba(251,191,36,0.1)",
    avatarBg: "linear-gradient(135deg, #fbbf24, #d97706)",
    scoreColor: "text-gradient-gold",
  },
  2: {
    bg: "linear-gradient(135deg, rgba(148,163,184,0.08) 0%, rgba(7,8,13,0.8) 100%)",
    border: "rgba(148,163,184,0.15)",
    glow: "none",
    avatarBg: "linear-gradient(135deg, #94a3b8, #64748b)",
    scoreColor: "text-slate-300",
  },
  3: {
    bg: "linear-gradient(135deg, rgba(180,83,9,0.12) 0%, rgba(7,8,13,0.8) 100%)",
    border: "rgba(180,83,9,0.2)",
    glow: "none",
    avatarBg: "linear-gradient(135deg, #f97316, #9a3412)",
    scoreColor: "text-orange-400",
  },
};

interface UserRowProps {
  user: User;
  rank: number;
  isMe: boolean;
  featured?: boolean;
}

function UserRow({ user: u, rank, isMe, featured = false }: UserRowProps) {
  const cfg = RANK_CONFIG[rank as 1 | 2 | 3];

  if (featured && cfg) {
    return (
      <Link href={`/profile/${u.id}`}>
        <div
          className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] mb-1"
          style={{
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            boxShadow: cfg.glow,
          }}
        >
          <span className="text-2xl w-8 text-center shrink-0">{getRankMedal(rank)}</span>

          {u.photoUrl ? (
            <Image
              src={u.photoUrl}
              alt=""
              width={44}
              height={44}
              className="rounded-full shrink-0"
              style={{ border: `1px solid ${cfg.border}` }}
            />
          ) : (
            <div
              className="w-11 h-11 rounded-full text-white text-base flex items-center justify-center font-bold shrink-0"
              style={{ background: cfg.avatarBg }}
            >
              {u.firstName[0]}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className={cn("font-semibold truncate text-sm", isMe ? "text-green-400" : "text-zinc-100")}>
              {getUserDisplayName(u)}
              {isMe && <span className="text-zinc-500 font-normal ml-1">(sen)</span>}
            </p>
            {u.username && <p className="text-xs text-zinc-600 mt-0.5">@{u.username}</p>}
          </div>

          <div className="text-right shrink-0">
            <p className={cn("text-2xl font-display font-bold", cfg.scoreColor)}>{u.totalPoints}</p>
            <p className="text-[10px] text-zinc-600 uppercase tracking-wide">ball</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/profile/${u.id}`}>
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:scale-[1.005]"
        style={{
          background: isMe ? "rgba(34,197,94,0.05)" : "rgba(255,255,255,0.03)",
          border: isMe ? "1px solid rgba(34,197,94,0.15)" : "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span className="text-xs font-mono text-zinc-700 w-6 text-right shrink-0">{rank}.</span>

        {u.photoUrl ? (
          <Image src={u.photoUrl} alt="" width={30} height={30} className="rounded-full shrink-0" />
        ) : (
          <div
            className="w-[30px] h-[30px] rounded-full text-white text-xs flex items-center justify-center font-bold shrink-0"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            {u.firstName[0]}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium truncate", isMe ? "text-green-400" : "text-zinc-300")}>
            {getUserDisplayName(u)}
            {isMe && <span className="text-zinc-600 font-normal ml-1">(sen)</span>}
          </p>
          {u.username && <p className="text-[10px] text-zinc-700">@{u.username}</p>}
        </div>

        <div className="text-right shrink-0">
          <p className="text-sm font-display font-bold text-zinc-200">{u.totalPoints}</p>
          <p className="text-[9px] text-zinc-700 uppercase tracking-wide">ball</p>
        </div>
      </div>
    </Link>
  );
}

function getRanks(users: User[]): number[] {
  const ranks: number[] = [];
  for (let i = 0; i < users.length; i++) {
    if (i === 0) {
      ranks.push(1);
    } else if (users[i].totalPoints === users[i - 1].totalPoints) {
      ranks.push(ranks[i - 1]);
    } else {
      ranks.push(i + 1);
    }
  }
  return ranks;
}

export default function LeaderboardPage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    usersAPI
      .getLeaderboard()
      .then((res) => setUsers(res.data))
      .finally(() => setIsLoading(false));
  }, []);

  const ranks = getRanks(users);
  const featured = users.filter((_, i) => ranks[i] <= 3);
  const rest = users.filter((_, i) => ranks[i] > 3);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Title */}
      <div className="text-center pt-2">
        <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-gradient-gold">
          Reyting
        </h1>
        <p className="text-xs text-zinc-600 mt-1 tracking-widest uppercase">
          Eng ko'p ball to'plagan taxminchilar
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl h-16 animate-pulse"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🏅</p>
          <p className="text-zinc-500">Hali hech kim ball to'plamagan</p>
        </div>
      ) : (
        <>
          {/* Top 3 — featured */}
          {featured.length > 0 && (
            <div className="space-y-2.5">
              {featured.map((u, i) => (
                <UserRow
                  key={u.id}
                  user={u}
                  rank={ranks[i]}
                  isMe={me?.id === u.id}
                  featured
                />
              ))}
            </div>
          )}

          {/* Divider */}
          {rest.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-[0.25em]">
                Qolganlar
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
          )}

          {/* Rest */}
          <div className="space-y-1.5">
            {rest.map((u) => {
              const idx = users.indexOf(u);
              return <UserRow key={u.id} user={u} rank={ranks[idx]} isMe={me?.id === u.id} />;
            })}
          </div>
        </>
      )}
    </div>
  );
}
