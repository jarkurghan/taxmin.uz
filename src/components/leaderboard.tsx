"use client";

import Image from "next/image";
import Link from "next/link";

import { usersAPI } from "@/lib/api";
import { getUserDisplayName, cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

import type { User } from "@/types";

interface UserRowProps {
    user: User;
    rank: number;
    isMe: boolean;
    profileBasePath: string;
}

function UserRow({ user: u, rank, isMe, profileBasePath }: UserRowProps) {
    return (
        <Link href={`${profileBasePath}/${u.id}`} className="block">
            <div
                className={cn(
                    "flex items-center gap-2.5 px-2 sm:px-3 py-2.5 border-b border-white/[0.06] transition-colors active:bg-white/[0.04]",
                    isMe && "bg-green-500/[0.04]",
                )}
            >
                <span className="w-4 sm:w-7 shrink-0 text-xs tabular-nums text-zinc-400">{rank}.</span>

                {u.photoUrl ? (
                    <Image src={u.photoUrl} alt="" width={24} height={24} className="rounded shrink-0 object-cover" />
                ) : (
                    <div className="w-6 h-6 rounded bg-white/10 text-white text-[10px] flex items-center justify-center font-bold shrink-0">
                        {u.firstName[0]}
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-semibold truncate leading-tight", isMe ? "text-green-400" : "text-zinc-100")}>{getUserDisplayName(u)}</p>
                </div>

                <span className={cn("w-10 shrink-0 text-right text-sm font-bold tabular-nums", isMe ? "text-green-400" : "text-zinc-100")}>
                    {u.totalPoints}
                </span>
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

interface LeaderboardProps {
    profileBasePath?: string;
}

export function Leaderboard({ profileBasePath = "/profile" }: LeaderboardProps) {
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

    return (
        <div className="space-y-5 animate-fade-in">
            <div className="ml-9 sm:ml-0 text-left sm:text-center">
                <h1 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-wider text-gradient-gold">Reyting</h1>
                <p className="text-xs text-zinc-600 mt-1 tracking-widest uppercase">Eng ko'p ball to'plagan taxminchilar</p>
            </div>

            {isLoading ? (
                <div className="rounded-lg overflow-hidden border border-white/[0.06]">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2.5 px-3 py-2.5 border-b border-white/[0.06] last:border-b-0">
                            <div className="w-7 h-3 rounded animate-pulse bg-white/[0.06]" />
                            <div className="w-6 h-6 rounded animate-pulse bg-white/[0.06]" />
                            <div className="flex-1 h-3 rounded animate-pulse bg-white/[0.06]" />
                            <div className="w-8 h-3 rounded animate-pulse bg-white/[0.06]" />
                        </div>
                    ))}
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-4xl mb-3">🏅</p>
                    <p className="text-zinc-500">Hali hech kim ball to'plamagan</p>
                </div>
            ) : (
                <div className="rounded-lg overflow-hidden border border-white/[0.06]">
                    <div className="flex items-center gap-2.5 px-2 sm:px-3 py-2 bg-white/[0.03] border-b border-white/[0.06]">
                        <span className="w-4 sm:w-7 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">#</span>
                        <span className="w-6 shrink-0" />
                        <span className="flex-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Taxminchi</span>
                        <span className="w-10 shrink-0 text-right text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Ball</span>
                    </div>

                    {users.map((u, i) => (
                        <UserRow key={u.id} user={u} rank={ranks[i]} isMe={me?.id === u.id} profileBasePath={profileBasePath} />
                    ))}
                </div>
            )}
        </div>
    );
}
