"use client";

import { useState } from "react";
import { MatchCard } from "@/components/match-card";
import { useMatches } from "@/hooks/use-matches";
import { cn } from "@/lib/utils";

type Filter = "scheduled" | "live" | "finished";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "Kelayotgan", value: "scheduled" },
  { label: "🔴 Jonli", value: "live" },
  { label: "Tugagan", value: "finished" },
];

export default function MiniAppPage() {
  const [filter, setFilter] = useState<Filter>("scheduled");
  const { matches, isLoading } = useMatches(filter);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-gray-900 text-center">⚽ FIFA 2026 Taxminlar</h1>

      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "flex-1 py-2 rounded-xl text-xs font-semibold transition-all",
              filter === f.value ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          <p className="text-3xl mb-2">🏟️</p>
          <p className="text-sm">Hozircha o'yin yo'q</p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((m) => <MatchCard key={m.id} match={m} />)}
        </div>
      )}
    </div>
  );
}
