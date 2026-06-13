"use client";

import { useState } from "react";
import { MatchCard } from "@/components/match-card";
import { useMatches } from "@/hooks/use-matches";
import { cn } from "@/lib/utils";

type Filter = "all" | "scheduled" | "live" | "finished";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "Barchasi", value: "all" },
  { label: "🔴 Jonli", value: "live" },
  { label: "Kelayotgan", value: "scheduled" },
  { label: "Tugagan", value: "finished" },
];

export default function HomePage() {
  const [filter, setFilter] = useState<Filter>("all");
  const { matches, isLoading, error } = useMatches(filter === "all" ? undefined : filter);

  // Group by stage
  const grouped = matches.reduce<Record<string, typeof matches>>((acc, m) => {
    const key = m.stage;
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-gray-900">⚽ Taxminlar Ligasi</h1>
        <p className="text-gray-500 text-sm mt-1">FIFA Jahon chempionati 2026 · USA/CAN/MEX</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              filter === f.value
                ? "bg-primary-800 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 h-32 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : matches.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <p className="text-4xl mb-3">🏟️</p>
          <p>Hozircha o'yin yo'q</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([stage, stageMatches]) => (
            <div key={stage} className="space-y-3">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stage}</h2>
              {stageMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
